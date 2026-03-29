<?php
/**
 * Categorías (términos) de productos (server-side) desde el API.
 *
 * GET /api/wp-product-categories.php
 *
 * - Intenta detectar la taxonomía correcta vía /taxonomies (types incluye "product")
 * - Luego lista términos vía /{rest_base}?per_page=100
 *
 * Env:
 * - WP_PRODUCTS_ENDPOINT="http://.../wp-json/wp/v2/product/"
 * - WP_API_BASE="http(s)://.../wp-json/wp/v2" (alternativa: base única)
 * - WP_PRODUCTS_ALLOWED_HOSTS="localhost,127.0.0.1,miwp.com" (whitelist anti-SSRF)
 * - WP_PRODUCTS_TIMEOUT=5
 * - WP_PRODUCTS_MAX_BYTES=2000000
 * - WP_PRODUCTS_CACHE_TTL=60
 * - WP_API_CORS_ORIGINS="https://miweb.com,http://localhost:3000"
 */
declare(strict_types=1);

require_once __DIR__ . '/wp_env_defaults.php';

ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\';');

function respond(int $statusCode, array $payload): void {
  http_response_code($statusCode);
  try {
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
  } catch (Throwable $e) {
    echo '{"ok":false,"error":{"message":"Error serializando JSON."},"categories":[]}';
  }
  exit;
}

function parse_csv_env(?string $v): array {
  $v = trim((string)($v ?? ''));
  if ($v === '') return [];
  $parts = array_map('trim', explode(',', $v));
  return array_values(array_filter($parts, fn($x) => $x !== ''));
}

function cors_allow_if_configured(): void {
  $allow = parse_csv_env(getenv('WP_API_CORS_ORIGINS') ?: '');
  if (!$allow) return;
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin && in_array($origin, $allow, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
  }
  header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
  header('Access-Control-Allow-Headers: Accept, Content-Type');
}

function validate_products_endpoint(string $endpoint): array {
  $endpoint = trim($endpoint);
  $parts = parse_url($endpoint);
  if (!$parts || !isset($parts['scheme'], $parts['host'])) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (URL mal formada).'];
  }
  $scheme = strtolower((string)$parts['scheme']);
  if (!in_array($scheme, ['http', 'https'], true)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (scheme no permitido).'];
  }
  if (isset($parts['user']) || isset($parts['pass'])) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (credenciales en URL no permitidas).'];
  }
  $host = strtolower((string)$parts['host']);
  $allowedHosts = parse_csv_env(getenv('WP_PRODUCTS_ALLOWED_HOSTS') ?: '');
  if (!$allowedHosts) $allowedHosts = ['localhost', '127.0.0.1', '::1'];
  $allowedLower = array_map('strtolower', $allowedHosts);
  if (!in_array($host, $allowedLower, true)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Host no permitido para WP_PRODUCTS_ENDPOINT.'];
  }
  $path = (string)($parts['path'] ?? '/');
  if (!preg_match('#/wp-json/wp/v2/product/?$#', $path)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (path debe terminar en /wp-json/wp/v2/product/).'];
  }
  $port = isset($parts['port']) ? (int)$parts['port'] : null;
  $normalized = $scheme . '://' . $parts['host'] . ($port ? ':' . $port : '') . rtrim($path, '/') . '/';
  return ['ok' => true, 'endpoint' => $normalized, 'error' => null];
}

function cache_paths(string $key): array {
  $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
  $safe = 'sj_wp_prod_cats_' . sha1($key);
  return [
    'data' => $dir . DIRECTORY_SEPARATOR . $safe . '.json',
    'meta' => $dir . DIRECTORY_SEPARATOR . $safe . '.meta.json',
  ];
}

function cache_read(string $key, int $ttlSeconds): ?array {
  if ($ttlSeconds <= 0) return null;
  $p = cache_paths($key);
  if (!is_file($p['data']) || !is_file($p['meta'])) return null;
  $metaRaw = @file_get_contents($p['meta']);
  $dataRaw = @file_get_contents($p['data']);
  if ($metaRaw === false || $dataRaw === false) return null;
  $meta = json_decode($metaRaw, true);
  if (!is_array($meta) || !isset($meta['ts'], $meta['etag'])) return null;
  if ((time() - (int)$meta['ts']) > $ttlSeconds) return null;
  return ['body' => $dataRaw, 'etag' => (string)$meta['etag']];
}

function cache_write(string $key, string $body, string $etag): void {
  $p = cache_paths($key);
  @file_put_contents($p['data'], $body, LOCK_EX);
  @file_put_contents($p['meta'], json_encode(['ts' => time(), 'etag' => $etag]), LOCK_EX);
}

function http_get(string $url, int $timeoutSeconds = 5, int $maxBytes = 2000000): array {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    $buf = '';
    curl_setopt_array($ch, array_replace([
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => $timeoutSeconds,
      CURLOPT_TIMEOUT => $timeoutSeconds,
      CURLOPT_MAXREDIRS => 3,
      CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
      CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
      CURLOPT_HTTPHEADER => ['Accept: application/json'],
      CURLOPT_USERAGENT => 'sj-product-categories-proxy/1.0',
      CURLOPT_WRITEFUNCTION => function ($ch, string $chunk) use (&$buf, $maxBytes) {
        $buf .= $chunk;
        if (strlen($buf) > $maxBytes) return 0;
        return strlen($chunk);
      },
    ], sj_curl_insecure_tls_opts()));
    $okExec = curl_exec($ch);
    $curlErr = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlCode = (int) curl_errno($ch);
    curl_close($ch);
    if ($okExec === false || $curlCode !== 0) {
      $msg = $curlErr ?: 'cURL error';
      if ($curlCode === CURLE_WRITE_ERROR) $msg = 'Respuesta demasiado grande (limitada por servidor).';
      return ['ok' => false, 'status' => $status ?: 0, 'body' => '', 'error' => $msg];
    }
    return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'body' => (string)$buf, 'error' => null];
  }

  $ctx = stream_context_create([
    'http' => [
      'method' => 'GET',
      'header' => "Accept: application/json\r\n",
      'timeout' => $timeoutSeconds,
    ],
  ]);
  $body = @file_get_contents($url, false, $ctx);
  if ($body === false) {
    $e = error_get_last();
    return ['ok' => false, 'status' => 0, 'body' => '', 'error' => $e['message'] ?? 'file_get_contents error'];
  }
  if (strlen($body) > $maxBytes) {
    return ['ok' => false, 'status' => 0, 'body' => '', 'error' => 'Respuesta demasiado grande (limitada por servidor).'];
  }
  $status = 200;
  if (isset($http_response_header) && is_array($http_response_header)) {
    foreach ($http_response_header as $h) {
      if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
        $status = (int)$m[1];
        break;
      }
    }
  }
  return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'body' => (string)$body, 'error' => null];
}

cors_allow_if_configured();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }
$isHead = ($method === 'HEAD');
if ($method !== 'GET' && !$isHead) {
  respond(405, ['ok' => false, 'error' => ['message' => 'Método no permitido.'], 'categories' => []]);
}

$endpoint = sj_resolve_products_endpoint();
$validated = validate_products_endpoint($endpoint);
if (!$validated['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'endpoint_config'],
    ]);
  }
  respond(500, ['ok' => false, 'error' => ['message' => 'Configuración inválida del endpoint.', 'detail' => $validated['error']], 'categories' => []]);
}
$endpoint = $validated['endpoint'];

$apiRoot = preg_replace('#/wp-json/wp/v2/product/?$#', '/wp-json/wp/v2', $endpoint);
if (!is_string($apiRoot) || $apiRoot === '') {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'api_root'],
    ]);
  }
  respond(500, ['ok' => false, 'error' => ['message' => 'No se pudo resolver el apiRoot.'], 'categories' => []]);
}

$timeout = max(1, min(30, (int) (getenv('WP_PRODUCTS_TIMEOUT') ?: 5)));
$maxBytes = max(250000, min(10000000, (int) (getenv('WP_PRODUCTS_MAX_BYTES') ?: 2000000)));
$ttl = max(0, min(3600, (int) (getenv('WP_PRODUCTS_CACHE_TTL') ?: 60)));

$taxUrl = rtrim($apiRoot, '/') . '/taxonomies';
sj_api_debug_headers($endpoint, $taxUrl);

$cacheKey = 'apiRoot:' . $apiRoot;
$cached = cache_read($cacheKey, $ttl);
if ($cached) {
  header('ETag: ' . $cached['etag']);
  header('Cache-Control: private, max-age=' . $ttl);
  header('X-Cache: HIT');
  $inm = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
  if ($inm && trim($inm) === $cached['etag']) { http_response_code(304); exit; }
  if (!$isHead) echo $cached['body'];
  exit;
}
header('X-Cache: MISS');

$taxRes = http_get($taxUrl, $timeout, $maxBytes);
sj_api_debug_headers($endpoint, $taxUrl, $taxRes);
if (!$taxRes['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'taxonomies_http', 'detail' => $taxRes['error']],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'No se pudo obtener taxonomías.', 'detail' => $taxRes['error'], 'status' => $taxRes['status']], 'categories' => []]);
}
try { $tax = json_decode($taxRes['body'], true, 512, JSON_THROW_ON_ERROR); } catch (Throwable $e) { $tax = null; }
if (!is_array($tax)) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'taxonomies_json'],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'Taxonomías inválidas (JSON no decodificable).'], 'categories' => []]);
}

$picked = null;
if (isset($tax['product_cat']) && is_array($tax['product_cat'])) $picked = $tax['product_cat'];
if (!$picked) {
  foreach ($tax as $t) {
    if (!is_array($t)) continue;
    $types = $t['types'] ?? null;
    $rest = $t['rest_base'] ?? null;
    if (is_array($types) && in_array('product', $types, true) && is_string($rest) && $rest !== '') {
      $picked = $t;
      break;
    }
  }
}
$restBase = is_array($picked) && isset($picked['rest_base']) && is_string($picked['rest_base']) && $picked['rest_base'] !== ''
  ? $picked['rest_base']
  : 'product_cat';

$termsUrl = rtrim($apiRoot, '/') . '/' . rawurlencode($restBase) . '?' . http_build_query([
  'per_page' => '100',
  'orderby' => 'count',
  'order' => 'desc',
]);
$termsRes = http_get($termsUrl, $timeout, $maxBytes);
sj_api_debug_headers($endpoint, $termsUrl, $termsRes);
if (!$termsRes['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'terms_http', 'detail' => $termsRes['error']],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'No se pudo obtener categorías.', 'detail' => $termsRes['error'], 'status' => $termsRes['status']], 'categories' => []]);
}
try { $terms = json_decode($termsRes['body'], true, 512, JSON_THROW_ON_ERROR); } catch (Throwable $e) { $terms = null; }
if (!is_array($terms)) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_categories_for_api();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'categories' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_catalog', 'reason' => 'terms_json'],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'Categorías inválidas (JSON no decodificable).'], 'categories' => []]);
}

$out = [];
foreach ($terms as $t) {
  if (!is_array($t)) continue;
  $id = $t['id'] ?? null;
  $slug = isset($t['slug']) && is_string($t['slug']) ? $t['slug'] : null;
  $name = isset($t['name']) && is_string($t['name']) ? $t['name'] : null;
  $count = isset($t['count']) ? (int)$t['count'] : null;
  if (!$slug || !$name) continue;
  $out[] = ['id' => $id, 'slug' => $slug, 'name' => $name, 'count' => $count];
}

$meta = [
  'restBase' => $restBase,
  'count' => count($out),
];
$meta = sj_api_debug_merge_meta($meta, $endpoint, $termsUrl, $termsRes);
if (sj_api_debug_request() && isset($meta['debugUpstream'])) {
  $meta['debugUpstream']['taxonomiesUrl'] = $taxUrl;
  $meta['debugUpstream']['taxonomiesHttpStatus'] = (int)$taxRes['status'];
}

$payload = [
  'ok' => true,
  'categories' => $out,
  'meta' => $meta,
];

$body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$etag = '"' . sha1($body ?: '') . '"';
header('ETag: ' . $etag);
header('Cache-Control: private, max-age=' . $ttl);
if (is_string($body)) {
  cache_write($cacheKey, $body, $etag);
  if (!$isHead) echo $body;
  exit;
}

respond(200, $payload);

