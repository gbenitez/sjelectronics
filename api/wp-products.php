<?php
/**
 * Proxy/Fetcher server-side para productos.
 *
 * - Fetch a WP REST API con cURL (fallback a file_get_contents)
 * - Maneja errores (timeout, HTTP != 200, JSON inválido)
 * - Decodifica JSON y normaliza un payload simple para el frontend
 * - Endurecido para producción (anti-SSRF, cache, headers, CORS opcional)
 *
 * Endpoint por defecto: `/wp-json/wp/v2/product/` en el servidor configurado.
 *
 * Puedes sobreescribir con variable de entorno:
 *   WP_PRODUCTS_ENDPOINT="http://..." (incluye /wp-json/.../product/)
 * O definir una sola base:
 *   WP_API_BASE="http(s)://.../wp-json/wp/v2"
 *   WP_API_DEFAULT_BASE="..." (solo si no hay WP_API_BASE ni endpoint específico)
 *
 * Variables opcionales:
 * - WP_PRODUCTS_ALLOWED_HOSTS="localhost,127.0.0.1,miwp.com" (whitelist anti-SSRF)
 * - WP_PRODUCTS_TIMEOUT=5 (segundos)
 * - WP_PRODUCTS_MAX_BYTES=8000000 (límite de bytes; subilo si el catálogo es muy grande)
 * - WP_PRODUCTS_PER_PAGE=50 (1–100; menos ítems = JSON más chico con _embed)
 * - WP_PRODUCTS_CACHE_TTL=30 (segundos; 0 desactiva cache)
 * - WP_API_CORS_ORIGINS="https://miweb.com,http://localhost:3000" (CORS allowlist)
 */

declare(strict_types=1);

require_once __DIR__ . '/wp_env_defaults.php';

// No exponer warnings/notices en respuestas JSON.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Headers base
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\';');

function respond(int $statusCode, array $payload): void {
  http_response_code($statusCode);
  try {
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
  } catch (Throwable $e) {
    // Fallback ultra defensivo: JSON mínimo.
    echo '{"ok":false,"error":{"message":"Error serializando JSON."},"products":[]}';
  }
  exit;
}

function normalize_text(?string $html): string {
  $html = $html ?? '';
  $text = strip_tags($html);
  $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
  $text = preg_replace('/\s+/u', ' ', $text);
  return trim($text ?? '');
}

function build_url(string $base): string {
  $base = rtrim($base, '/');
  // _embed infla mucho el JSON; per_page alto + catálogo grande supera WP_PRODUCTS_MAX_BYTES.
  $perPage = (int) (getenv('WP_PRODUCTS_PER_PAGE') ?: 50);
  $perPage = max(1, min(100, $perPage));
  $qs = http_build_query([
    '_embed' => '1',
    'per_page' => (string)$perPage,
  ]);
  return $base . '/?' . $qs;
}

function parse_csv_env(?string $v): array {
  $v = trim((string)($v ?? ''));
  if ($v === '') return [];
  $parts = array_map('trim', explode(',', $v));
  return array_values(array_filter($parts, fn($x) => $x !== ''));
}

function cors_allow_if_configured(): void {
  // CORS opcional: si no se configura, no se agrega header.
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

function validate_endpoint(string $endpoint): array {
  // Devuelve [ok(bool), endpoint(string), error(string|null)]
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
  if (!$allowedHosts) {
    $allowedHosts = ['localhost', '127.0.0.1', '::1'];
  }

  $allowedLower = array_map('strtolower', $allowedHosts);
  if (!in_array($host, $allowedLower, true)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Host no permitido para WP_PRODUCTS_ENDPOINT.'];
  }

  $path = (string)($parts['path'] ?? '/');
  // Asegura que apunte a la colección de productos.
  if (!preg_match('#/wp-json/wp/v2/product/?$#', $path)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (path debe terminar en /wp-json/wp/v2/product/).'];
  }

  // Normalizar: quitar query/fragment si existieran.
  $port = isset($parts['port']) ? (int)$parts['port'] : null;
  $normalized = $scheme . '://' . $parts['host'] . ($port ? ':' . $port : '') . rtrim($path, '/') . '/';

  return ['ok' => true, 'endpoint' => $normalized, 'error' => null];
}

function cache_paths(string $url): array {
  $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
  $key = 'sj_wp_products_' . sha1($url);
  return [
    'data' => $dir . DIRECTORY_SEPARATOR . $key . '.json',
    'meta' => $dir . DIRECTORY_SEPARATOR . $key . '.meta.json',
  ];
}

function cache_read(string $url, int $ttlSeconds): ?array {
  if ($ttlSeconds <= 0) return null;
  $p = cache_paths($url);
  if (!is_file($p['data']) || !is_file($p['meta'])) return null;
  $metaRaw = @file_get_contents($p['meta']);
  $dataRaw = @file_get_contents($p['data']);
  if ($metaRaw === false || $dataRaw === false) return null;
  $meta = json_decode($metaRaw, true);
  if (!is_array($meta) || !isset($meta['ts'], $meta['etag'])) return null;
  if ((time() - (int)$meta['ts']) > $ttlSeconds) return null;
  return ['body' => $dataRaw, 'etag' => (string)$meta['etag']];
}

function cache_write(string $url, string $body, string $etag): void {
  $p = cache_paths($url);
  @file_put_contents($p['data'], $body, LOCK_EX);
  @file_put_contents($p['meta'], json_encode(['ts' => time(), 'etag' => $etag]), LOCK_EX);
}

function http_get(string $url, int $timeoutSeconds = 4, int $maxBytes = 2000000): array {
  // Devuelve: [ok(bool), status(int), body(string), error(string|null)]
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
      CURLOPT_HTTPHEADER => [
        'Accept: application/json',
      ],
      CURLOPT_USERAGENT => 'sj-products-proxy/1.0',
      // Limitar tamaño para evitar respuestas enormes.
      CURLOPT_WRITEFUNCTION => function ($ch, string $chunk) use (&$buf, $maxBytes) {
        $buf .= $chunk;
        if (strlen($buf) > $maxBytes) return 0; // aborta
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
      if ($curlCode === CURLE_WRITE_ERROR) {
        $msg = 'Respuesta demasiado grande (limitada por servidor).';
      }
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

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
cors_allow_if_configured();
if ($method === 'OPTIONS') {
  http_response_code(204);
  exit;
}
$isHead = ($method === 'HEAD');
if ($method !== 'GET' && !$isHead) {
  respond(405, [
    'ok' => false,
    'error' => ['message' => 'Método no permitido.'],
    'products' => [],
  ]);
}

$endpoint = sj_resolve_products_endpoint();

$validated = validate_endpoint($endpoint);
if (!$validated['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_products_for_list();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'products' => $fb,
      'meta' => [
        'count' => count($fb),
        'fallback' => true,
        'source' => 'local_catalog',
        'reason' => 'endpoint_config',
      ],
    ]);
  }
  respond(500, [
    'ok' => false,
    'error' => [
      'message' => 'Configuración inválida del endpoint.',
      'detail' => $validated['error'],
    ],
    'products' => [],
  ]);
}

$endpoint = $validated['endpoint'];
$url = build_url($endpoint);
sj_api_debug_headers($endpoint, $url);

$timeout = (int) (getenv('WP_PRODUCTS_TIMEOUT') ?: 5);
$timeout = max(1, min(30, $timeout));
$maxBytes = (int) (getenv('WP_PRODUCTS_MAX_BYTES') ?: 8000000);
$maxBytes = max(250000, min(15728640, $maxBytes));
$ttl = (int) (getenv('WP_PRODUCTS_CACHE_TTL') ?: 30);
$ttl = max(0, min(3600, $ttl));

// Cache + ETag
$cached = cache_read($url, $ttl);
if ($cached) {
  header('ETag: ' . $cached['etag']);
  header('Cache-Control: private, max-age=' . $ttl);
  header('X-Cache: HIT');
  $inm = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
  if ($inm && trim($inm) === $cached['etag']) {
    http_response_code(304);
    exit;
  }
  if (!$isHead) {
    // Ya es JSON de este mismo endpoint, devolvemos tal cual.
    echo $cached['body'];
  }
  exit;
}

header('X-Cache: MISS');
$res = http_get($url, $timeout, $maxBytes);
sj_api_debug_headers($endpoint, $url, $res);

if (!$res['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_products_for_list();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'products' => $fb,
      'meta' => [
        'count' => count($fb),
        'fallback' => true,
        'source' => 'local_catalog',
        'reason' => 'upstream_unavailable',
        'detail' => $res['error'],
      ],
    ]);
  }
  respond(502, [
    'ok' => false,
    'error' => [
      'message' => 'No se pudo obtener respuesta del API.',
      'detail' => $res['error'],
      'status' => $res['status'],
    ],
    'products' => [],
  ]);
}

// Responde JSON; validamos decode.
try {
  $data = json_decode($res['body'], true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
  $data = null;
}
if (!is_array($data)) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_products_for_list();
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'products' => $fb,
      'meta' => [
        'count' => count($fb),
        'fallback' => true,
        'source' => 'local_catalog',
        'reason' => 'invalid_json',
      ],
    ]);
  }
  respond(502, [
    'ok' => false,
    'error' => [
      'message' => 'Respuesta inválida: JSON no decodificable.',
      'detail' => 'JSON inválido',
      'status' => $res['status'],
      'url' => $url,
    ],
    'products' => [],
  ]);
}

$products = [];
foreach ($data as $item) {
  if (!is_array($item)) continue;

  $id = $item['id'] ?? null;
  $slug = isset($item['slug']) && is_string($item['slug']) ? $item['slug'] : null;
  $titleHtml = $item['title']['rendered'] ?? ($item['name'] ?? '');
  $name = normalize_text(is_string($titleHtml) ? $titleHtml : '');

  $image = null;
  if (isset($item['_embedded']['wp:featuredmedia'][0]['source_url'])) {
    $image = $item['_embedded']['wp:featuredmedia'][0]['source_url'];
  } elseif (isset($item['featured_media_url'])) {
    $image = $item['featured_media_url'];
  }

  // Intento de categoría: primer término con slug (si WP expone taxonomías).
  $category = null;
  if (isset($item['_embedded']['wp:term']) && is_array($item['_embedded']['wp:term'])) {
    foreach ($item['_embedded']['wp:term'] as $group) {
      if (!is_array($group)) continue;
      foreach ($group as $term) {
        if (is_array($term) && isset($term['slug']) && is_string($term['slug'])) {
          $category = $term['slug'];
          break 2;
        }
      }
    }
  }

  $products[] = [
    'id' => $id,
    'slug' => $slug,
    'name' => $name ?: ('Producto #' . (string)$id),
    'category' => $category, // puede ser null; el frontend mostrará "—"
    'image' => $image,       // URL absoluta o null
  ];
}

$payload = [
  'ok' => true,
  'products' => $products,
  'meta' => sj_api_debug_merge_meta(
    ['count' => count($products)],
    $endpoint,
    $url,
    $res
  ),
];

// Cachear payload final (ya normalizado).
$body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$etag = '"' . sha1($body ?: '') . '"';
header('ETag: ' . $etag);
header('Cache-Control: private, max-age=' . $ttl);
if (is_string($body)) {
  cache_write($url, $body, $etag);
  if (!$isHead) {
    echo $body;
  }
  exit;
}

respond(200, $payload);

