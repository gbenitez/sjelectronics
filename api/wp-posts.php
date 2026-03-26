<?php
/**
 * Lista de posts (server-side) desde el API.
 *
 * GET /api/wp-posts.php?per_page=3
 *
 * Endpoint por defecto: `/wp-json/wp/v2/posts/` en el servidor configurado.
 *
 * Env:
 * - WP_POSTS_ENDPOINT="http://.../wp-json/wp/v2/posts/"
 * - WP_API_BASE="http(s)://.../wp-json/wp/v2" (alternativa: base única)
 * - WP_PRODUCTS_ALLOWED_HOSTS="localhost,127.0.0.1,miwp.com" (whitelist anti-SSRF)
 * - WP_PRODUCTS_TIMEOUT=5
 * - WP_PRODUCTS_MAX_BYTES=2000000
 * - WP_PRODUCTS_CACHE_TTL=30
 * - WP_API_CORS_ORIGINS="https://miweb.com,http://localhost:3000"
 */

declare(strict_types=1);

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
    echo '{"ok":false,"error":{"message":"Error serializando JSON."},"posts":[]}';
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

function validate_endpoint(string $endpoint): array {
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
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Host no permitido para WP_POSTS_ENDPOINT.'];
  }
  $path = (string)($parts['path'] ?? '/');
  if (!preg_match('#/wp-json/wp/v2/posts/?$#', $path)) {
    return ['ok' => false, 'endpoint' => $endpoint, 'error' => 'Endpoint inválido (path debe terminar en /wp-json/wp/v2/posts/).'];
  }
  $port = isset($parts['port']) ? (int)$parts['port'] : null;
  $normalized = $scheme . '://' . $parts['host'] . ($port ? ':' . $port : '') . rtrim($path, '/') . '/';
  return ['ok' => true, 'endpoint' => $normalized, 'error' => null];
}

function cache_paths(string $url): array {
  $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
  $key = 'sj_wp_posts_' . sha1($url);
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

function http_get(string $url, int $timeoutSeconds = 5, int $maxBytes = 2000000): array {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    $buf = '';
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => $timeoutSeconds,
      CURLOPT_TIMEOUT => $timeoutSeconds,
      CURLOPT_MAXREDIRS => 3,
      CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
      CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
      CURLOPT_HTTPHEADER => ['Accept: application/json'],
      CURLOPT_USERAGENT => 'sj-posts-proxy/1.0',
      CURLOPT_WRITEFUNCTION => function ($ch, string $chunk) use (&$buf, $maxBytes) {
        $buf .= $chunk;
        if (strlen($buf) > $maxBytes) return 0;
        return strlen($chunk);
      },
    ]);
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
  respond(405, ['ok' => false, 'error' => ['message' => 'Método no permitido.'], 'posts' => []]);
}

$perPage = (int)($_GET['per_page'] ?? 3);
$perPage = max(1, min(20, $perPage));

$endpoint = getenv('WP_POSTS_ENDPOINT') ?: '';
if ($endpoint === '') {
  $apiBase = trim((string)(getenv('WP_API_BASE') ?: ''));
  $endpoint = $apiBase !== ''
    ? (rtrim($apiBase, '/') . '/posts/')
    : 'http://localhost/wordpress/wp-json/wp/v2/posts/';
}
$validated = validate_endpoint($endpoint);
if (!$validated['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_posts_for_list($perPage);
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'posts' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_posts', 'reason' => 'endpoint_config'],
    ]);
  }
  respond(500, ['ok' => false, 'error' => ['message' => 'Configuración inválida del endpoint.', 'detail' => $validated['error']], 'posts' => []]);
}
$endpoint = $validated['endpoint'];

$timeout = max(1, min(30, (int) (getenv('WP_PRODUCTS_TIMEOUT') ?: 5)));
$maxBytes = max(250000, min(10000000, (int) (getenv('WP_PRODUCTS_MAX_BYTES') ?: 2000000)));
$ttl = max(0, min(3600, (int) (getenv('WP_PRODUCTS_CACHE_TTL') ?: 30)));

$url = rtrim($endpoint, '/') . '/?' . http_build_query([
  '_embed' => '1',
  'per_page' => (string)$perPage,
  'orderby' => 'date',
  'order' => 'desc',
]);

$cached = cache_read($url, $ttl);
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

$res = http_get($url, $timeout, $maxBytes);
if (!$res['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_posts_for_list($perPage);
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'posts' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_posts', 'reason' => 'upstream_unavailable', 'detail' => $res['error']],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'No se pudo obtener respuesta del API.', 'detail' => $res['error'], 'status' => $res['status']], 'posts' => []]);
}

try { $data = json_decode($res['body'], true, 512, JSON_THROW_ON_ERROR); } catch (Throwable $e) { $data = null; }
if (!is_array($data)) {
  require_once __DIR__ . '/fallback_lib.php';
  $fb = sj_fallback_posts_for_list($perPage);
  if ($fb !== []) {
    respond(200, [
      'ok' => true,
      'posts' => $fb,
      'meta' => ['count' => count($fb), 'fallback' => true, 'source' => 'local_posts', 'reason' => 'invalid_json'],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'Respuesta inválida: JSON no decodificable.'], 'posts' => []]);
}

$posts = [];
foreach ($data as $item) {
  if (!is_array($item)) continue;
  $id = $item['id'] ?? null;
  $slug = isset($item['slug']) && is_string($item['slug']) ? $item['slug'] : null;
  $titleHtml = $item['title']['rendered'] ?? '';
  $excerptHtml = $item['excerpt']['rendered'] ?? '';
  $title = normalize_text(is_string($titleHtml) ? $titleHtml : '') ?: ('Post #' . (string)$id);
  $excerpt = normalize_text(is_string($excerptHtml) ? $excerptHtml : '') ?: null;
  $date = isset($item['date']) && is_string($item['date']) ? $item['date'] : null;
  $link = isset($item['link']) && is_string($item['link']) ? $item['link'] : null;

  $image = null;
  if (isset($item['_embedded']['wp:featuredmedia'][0]['source_url'])) {
    $image = $item['_embedded']['wp:featuredmedia'][0]['source_url'];
  }

  $posts[] = [
    'id' => $id,
    'slug' => $slug,
    'title' => $title,
    'excerpt' => $excerpt,
    'date' => $date,
    'image' => $image,
    'link' => null,
  ];
}

$payload = [
  'ok' => true,
  'posts' => $posts,
  'meta' => [
    'count' => count($posts),
  ],
];

$body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$etag = '"' . sha1($body ?: '') . '"';
header('ETag: ' . $etag);
header('Cache-Control: private, max-age=' . $ttl);
if (is_string($body)) {
  cache_write($url, $body, $etag);
  if (!$isHead) echo $body;
  exit;
}

respond(200, $payload);

