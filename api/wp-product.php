<?php
/**
 * Producto individual (server-side) desde el API.
 *
 * GET /api/wp-product.php?id=44
 *
 * - Fetch a: /wp-json/wp/v2/product/{id}?_embed=1
 * - Hardening: anti-SSRF, límites, cache+ETag, headers.
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
    echo '{"ok":false,"error":{"message":"Error serializando JSON."}}';
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
  if ($allow) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $allow, true)) {
      header('Access-Control-Allow-Origin: ' . $origin);
      header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, Content-Type');
  }
}

function normalize_text(?string $html): string {
  $html = $html ?? '';
  $text = strip_tags($html);
  $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
  $text = preg_replace('/\s+/u', ' ', $text);
  return trim($text ?? '');
}

function is_assoc_array(array $arr): bool {
  $i = 0;
  foreach ($arr as $k => $_) {
    if ($k !== $i) return true;
    $i++;
  }
  return false;
}

function labelize_key(string $key): string {
  $key = trim($key);
  if ($key === '') return 'Atributo';
  $key = preg_replace('/[_-]+/', ' ', $key);
  $key = preg_replace('/\s+/u', ' ', (string)$key);
  $key = trim((string)$key);
  return $key !== '' ? mb_convert_case($key, MB_CASE_TITLE, 'UTF-8') : 'Atributo';
}

function normalize_attr_value($v, int $maxLen = 220): ?string {
  if ($v === null) return null;
  if (is_bool($v)) return $v ? 'Sí' : 'No';
  if (is_int($v) || is_float($v)) return (string)$v;
  if (is_string($v)) {
    $s = normalize_text($v);
    if ($s === '') return null;
    if (mb_strlen($s, 'UTF-8') > $maxLen) $s = mb_substr($s, 0, $maxLen, 'UTF-8') . '…';
    return $s;
  }
  if (is_array($v)) {
    // listas: join; objetos: intenta join valores escalares
    $vals = [];
    if (is_assoc_array($v)) {
      foreach ($v as $vv) {
        $nv = normalize_attr_value($vv, $maxLen);
        if ($nv) $vals[] = $nv;
      }
    } else {
      foreach ($v as $vv) {
        $nv = normalize_attr_value($vv, $maxLen);
        if ($nv) $vals[] = $nv;
      }
    }
    $out = implode(', ', array_values(array_unique($vals)));
    $out = trim($out);
    if ($out === '') return null;
    if (mb_strlen($out, 'UTF-8') > $maxLen) $out = mb_substr($out, 0, $maxLen, 'UTF-8') . '…';
    return $out;
  }
  return null;
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

function cache_paths(string $url): array {
  $dir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
  $key = 'sj_wp_product_' . sha1($url);
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
      CURLOPT_USERAGENT => 'sj-product-proxy/1.0',
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
if ($method === 'OPTIONS') {
  http_response_code(204);
  exit;
}
$isHead = ($method === 'HEAD');
if ($method !== 'GET' && !$isHead) {
  respond(405, ['ok' => false, 'error' => ['message' => 'Método no permitido.']]);
}

$debug = (($_GET['debug'] ?? '') === '1');

$idRaw = $_GET['id'] ?? '';
$id = (int) $idRaw;
$slugRaw = $_GET['slug'] ?? '';
$slug = is_string($slugRaw) ? trim($slugRaw) : '';
if ($id <= 0 && $slug === '') {
  respond(400, ['ok' => false, 'error' => ['message' => 'Falta parámetro id o slug válido.']]);
}
if ($slug !== '' && !preg_match('/^[a-z0-9-]{1,200}$/i', $slug)) {
  respond(400, ['ok' => false, 'error' => ['message' => 'Slug inválido.']]);
}

$endpoint = getenv('WP_PRODUCTS_ENDPOINT') ?: '';
if ($endpoint === '') {
  $apiBase = trim((string)(getenv('WP_API_BASE') ?: ''));
  $endpoint = $apiBase !== ''
    ? (rtrim($apiBase, '/') . '/product/')
    : 'http://localhost/wordpress/wp-json/wp/v2/product/';
}
$validated = validate_endpoint($endpoint);
if (!$validated['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $raw = sj_fallback_find_product($id, $slug);
  if ($raw) {
    respond(200, [
      'ok' => true,
      'product' => sj_fallback_product_to_payload($raw),
      'meta' => ['fallback' => true, 'source' => 'local_catalog', 'reason' => 'endpoint_config'],
    ]);
  }
  respond(500, ['ok' => false, 'error' => ['message' => 'Configuración inválida del endpoint.', 'detail' => $validated['error']]]);
}
$endpoint = $validated['endpoint'];

$timeout = max(1, min(30, (int) (getenv('WP_PRODUCTS_TIMEOUT') ?: 5)));
$maxBytes = max(250000, min(10000000, (int) (getenv('WP_PRODUCTS_MAX_BYTES') ?: 2000000)));
$ttl = max(0, min(3600, (int) (getenv('WP_PRODUCTS_CACHE_TTL') ?: 30)));
$effectiveTtl = $debug ? 0 : $ttl;

$url = $id > 0
  ? (rtrim($endpoint, '/') . '/' . $id . '/?_embed=1')
  : (rtrim($endpoint, '/') . '/?' . http_build_query(['slug' => $slug, '_embed' => '1']));

$cached = cache_read($url, $effectiveTtl);
if ($cached) {
  header('ETag: ' . $cached['etag']);
  header('Cache-Control: private, max-age=' . $effectiveTtl);
  header('X-Cache: HIT');
  $inm = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
  if ($inm && trim($inm) === $cached['etag']) {
    http_response_code(304);
    exit;
  }
  if (!$isHead) echo $cached['body'];
  exit;
}
header('X-Cache: MISS');

$res = http_get($url, $timeout, $maxBytes);
if (!$res['ok']) {
  require_once __DIR__ . '/fallback_lib.php';
  $raw = sj_fallback_find_product($id, $slug);
  if ($raw) {
    respond(200, [
      'ok' => true,
      'product' => sj_fallback_product_to_payload($raw),
      'meta' => ['fallback' => true, 'source' => 'local_catalog', 'reason' => 'upstream_unavailable', 'detail' => $res['error']],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'No se pudo obtener respuesta del API.', 'detail' => $res['error'], 'status' => $res['status']]]);
}

try {
  $decoded = json_decode($res['body'], true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
  $decoded = null;
}

// Si se buscó por slug, WP devuelve array.
$item = $decoded;
if ($id <= 0 && is_array($decoded)) {
  $item = $decoded[0] ?? null;
}

if (!is_array($item) || !isset($item['id'])) {
  require_once __DIR__ . '/fallback_lib.php';
  $raw = sj_fallback_find_product($id, $slug);
  if ($raw) {
    respond(200, [
      'ok' => true,
      'product' => sj_fallback_product_to_payload($raw),
      'meta' => ['fallback' => true, 'source' => 'local_catalog', 'reason' => 'not_found_or_invalid'],
    ]);
  }
  respond(502, ['ok' => false, 'error' => ['message' => 'Respuesta inválida: producto no encontrado o JSON inesperado.']]);
}

$itemId = (int)($item['id'] ?? $id);

$titleHtml = $item['title']['rendered'] ?? ($item['name'] ?? '');
$name = normalize_text(is_string($titleHtml) ? $titleHtml : '');

$image = null;
if (isset($item['_embedded']['wp:featuredmedia'][0]['source_url'])) {
  $image = $item['_embedded']['wp:featuredmedia'][0]['source_url'];
}

$category = null;
$categoryName = null;
if (isset($item['_embedded']['wp:term']) && is_array($item['_embedded']['wp:term'])) {
  foreach ($item['_embedded']['wp:term'] as $group) {
    if (!is_array($group)) continue;
    foreach ($group as $term) {
      if (is_array($term) && isset($term['slug']) && is_string($term['slug'])) {
        $category = $term['slug'];
        if (isset($term['name']) && is_string($term['name'])) $categoryName = $term['name'];
        break 2;
      }
    }
  }
}

$excerptHtml = $item['excerpt']['rendered'] ?? '';
$excerpt = normalize_text(is_string($excerptHtml) ? $excerptHtml : '');

$contentHtml = $item['content']['rendered'] ?? '';
$descriptionHtml = is_string($contentHtml) ? $contentHtml : null;

$attributes = [];
foreach (['acf', 'attributes', 'meta'] as $field) {
  if (!isset($item[$field]) || !is_array($item[$field])) continue;
  $src = $item[$field];
  // Solo procesar estructuras tipo "objeto" (clave=>valor).
  if (!is_assoc_array($src)) continue;
  foreach ($src as $k => $v) {
    $key = is_string($k) ? trim($k) : '';
    if ($key !== '' && str_starts_with($key, '_')) continue; // claves internas
    $val = normalize_attr_value($v);
    if (!$val) continue;
    $label = $key !== '' ? labelize_key($key) : 'Atributo';
    $attributes[] = [
      'key' => $key !== '' ? $key : null,
      'label' => $label,
      'value' => $val,
    ];
    if (count($attributes) >= 30) break 2;
  }
}

$link = null; // no exponer links externos

// Imágenes y documentos: traemos media del parent (si está disponible) para miniaturas + PDFs.
$images = [];
if ($image) $images[] = $image;

$apiRoot = preg_replace('#/wp-json/wp/v2/product/?$#', '/wp-json/wp/v2', $endpoint);
$mediaUrl = null;
$mediaFoundCount = 0;
if (is_string($apiRoot) && $apiRoot) {
  // Importante: si la búsqueda fue por slug, $id puede ser 0.
  // Usamos SIEMPRE el ID real del item para evitar parent=0 (que trae media global/no adjunta).
  if ($itemId > 0) {
    $mediaUrl = rtrim($apiRoot, '/') . '/media?' . http_build_query([
      'parent' => (string)$itemId,
      'per_page' => '100',
    ]);
    $mediaRes = http_get($mediaUrl, $timeout, $maxBytes);
    if ($mediaRes['ok']) {
      try {
        $media = json_decode($mediaRes['body'], true, 512, JSON_THROW_ON_ERROR);
      } catch (Throwable $e) {
        $media = null;
      }
      if (is_array($media)) {
        $mediaFoundCount = count($media);
        $docs = [];
        foreach ($media as $m) {
          if (!is_array($m)) continue;
          $mime = isset($m['mime_type']) && is_string($m['mime_type']) ? $m['mime_type'] : '';
          $src = isset($m['source_url']) && is_string($m['source_url']) ? $m['source_url'] : null;
          if (!$src) continue;

          if (str_starts_with($mime, 'image/')) {
            $images[] = $src;
            continue;
          }

          // PDFs / docs
          if ($mime === 'application/pdf' || str_contains($mime, 'pdf')) {
            $titleHtml = $m['title']['rendered'] ?? '';
            $title = normalize_text(is_string($titleHtml) ? $titleHtml : '') ?: 'Documento';
            $docs[] = [
              'title' => $title,
              'url' => $src,
              'mimeType' => $mime ?: null,
            ];
          }
        }

        // dedupe images
        $images = array_values(array_unique($images));

        // Clasificación simple: intenta asignar manual/ficha por el título.
        $manual = null;
        $spec = null;
        foreach ($docs as $d) {
          $t = strtolower((string)($d['title'] ?? ''));
          if (!$manual && (str_contains($t, 'manual') || str_contains($t, 'usuario'))) $manual = $d;
          if (!$spec && (str_contains($t, 'ficha') || str_contains($t, 'técnica') || str_contains($t, 'tecnica'))) $spec = $d;
        }
        $documents = [
          'specSheet' => $spec,
          'manual' => $manual,
          'all' => $docs,
        ];
      }
    }
  }
}

$payload = [
  'ok' => true,
  'product' => [
    'id' => $item['id'] ?? ($id ?: null),
    'slug' => (isset($item['slug']) && is_string($item['slug'])) ? $item['slug'] : ($slug ?: null),
    'name' => $name ?: ('Producto #' . (string)$id),
    'category' => $category,
    'categoryName' => $categoryName,
    'image' => $image,
    'images' => $images,
    'excerpt' => $excerpt ?: null,
    'descriptionHtml' => $descriptionHtml,
    'attributes' => $attributes,
    'link' => $link,
    'documents' => $documents ?? ['specSheet' => null, 'manual' => null, 'all' => []],
  ],
  'meta' => $debug ? [
    'debug' => [
      'requested' => ['id' => $id > 0 ? $id : null, 'slug' => $slug ?: null],
      'itemId' => $itemId ?: null,
      'mediaUrl' => $mediaUrl,
      'mediaFoundCount' => $mediaFoundCount,
      'imagesCount' => is_array($images) ? count($images) : 0,
    ],
  ] : [],
];

$body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$etag = '"' . sha1($body ?: '') . '"';
header('ETag: ' . $etag);
header('Cache-Control: private, max-age=' . $effectiveTtl);
if (is_string($body)) {
  if ($effectiveTtl > 0) {
    cache_write($url, $body, $etag);
  }
  if (!$isHead) echo $body;
  exit;
}

respond(200, $payload);

