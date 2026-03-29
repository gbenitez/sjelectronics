<?php
declare(strict_types=1);

/** Query en la URL del proxy PHP: `?debug=1` → `SJ_API_DEBUG_QUERY` + `SJ_API_DEBUG_VALUE`. */
const SJ_API_DEBUG_QUERY = 'debug';
const SJ_API_DEBUG_VALUE = '1';
/** Variable de entorno alternativa (mismo efecto que el query). */
const SJ_API_DEBUG_ENV = 'WP_API_DEBUG';

/**
 * Lee `.env` en la raíz del proyecto y aplica putenv() solo si la variable no existe ya.
 * Así `WP_API_BASE` y el resto llegan a getenv() aunque uses `php -S` sin wrapper Node
 * o PHP-FPM sin env_file (antes el proxy caía en fallback local siempre).
 */
function sj_load_env_file(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;
    $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (!is_readable($path)) {
        return;
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return;
    }
    $raw = preg_replace('/^\xEF\xBB\xBF/', '', $raw);
    foreach (preg_split('/\r\n|\r|\n/', $raw) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $eq = strpos($line, '=');
        if ($eq === false) {
            continue;
        }
        $k = trim(substr($line, 0, $eq));
        $v = trim(substr($line, $eq + 1));
        if ($k === '') {
            continue;
        }
        $len = strlen($v);
        if ($len >= 2 && (($v[0] === '"' && $v[$len - 1] === '"') || ($v[0] === "'" && $v[$len - 1] === "'"))) {
            $v = substr($v, 1, -1);
            $v = str_replace(['\\n', '\\"'], ["\n", '"'], $v);
        }
        if (getenv($k) !== false) {
            continue;
        }
        putenv("$k=$v");
        $_ENV[$k] = $v;
    }
}

sj_load_env_file();

/**
 * Resolución de URLs del REST API de WordPress (evita duplicar el fallback local).
 *
 * Prioridad:
 * 1) WP_PRODUCTS_ENDPOINT / WP_POSTS_ENDPOINT (URL completa del recurso)
 * 2) WP_API_BASE + sufijo (/product/ o /posts/)
 * 3) WP_API_DEFAULT_BASE + sufijo (opcional; mismo formato que WP_API_BASE)
 *
 * Si nada está definido, el endpoint queda vacío y los proxies usan el catálogo local (fallback).
 * Cambiá WP_API_BASE (o WP_API_DEFAULT_BASE) en .env para alternar local / producción.
 */

function sj_default_wp_api_base(): string
{
    $v = trim((string)(getenv('WP_API_DEFAULT_BASE') ?: ''));

    return $v === '' ? '' : rtrim($v, '/');
}

function sj_resolve_products_endpoint(): string
{
    $e = trim((string)(getenv('WP_PRODUCTS_ENDPOINT') ?: ''));
    if ($e !== '') {
        return $e;
    }
    $apiBase = trim((string)(getenv('WP_API_BASE') ?: ''));
    if ($apiBase !== '') {
        return rtrim($apiBase, '/') . '/product/';
    }
    $fallbackBase = sj_default_wp_api_base();

    return $fallbackBase !== '' ? $fallbackBase . '/product/' : '';
}

function sj_resolve_posts_endpoint(): string
{
    $e = trim((string)(getenv('WP_POSTS_ENDPOINT') ?: ''));
    if ($e !== '') {
        return $e;
    }
    $apiBase = trim((string)(getenv('WP_API_BASE') ?: ''));
    if ($apiBase !== '') {
        return rtrim($apiBase, '/') . '/posts/';
    }
    $fallbackBase = sj_default_wp_api_base();

    return $fallbackBase !== '' ? $fallbackBase . '/posts/' : '';
}

/**
 * Debug de conexión a WordPress: query `?debug=1` (ver SJ_API_DEBUG_*) o env WP_API_DEBUG.
 * Cabeceras X-SJ-* en la respuesta (Network en DevTools) y meta.debugUpstream en JSON.
 */
function sj_api_debug_request(): bool
{
    if ((string)($_GET[SJ_API_DEBUG_QUERY] ?? '') === SJ_API_DEBUG_VALUE) {
        return true;
    }
    $v = strtolower(trim((string)(getenv(SJ_API_DEBUG_ENV) ?: '')));

    return $v === '1' || $v === 'true' || $v === 'yes';
}

function sj_api_debug_parse_host(string $url): string
{
    $p = parse_url($url);

    return is_array($p) && isset($p['host']) ? (string)$p['host'] : '';
}

function sj_api_debug_headers(string $wpEndpoint, string $upstreamUrl, ?array $httpGetResult = null): void
{
    if (!sj_api_debug_request()) {
        return;
    }
    $safeEp = str_replace(["\r", "\n"], '', $wpEndpoint);
    $safeUrl = str_replace(["\r", "\n"], '', $upstreamUrl);
    header('X-SJ-WP-Endpoint: ' . substr($safeEp, 0, 2000));
    header('X-SJ-Upstream-URL: ' . substr($safeUrl, 0, 2000));
    $host = sj_api_debug_parse_host($upstreamUrl);
    if ($host !== '') {
        header('X-SJ-Upstream-Host: ' . substr($host, 0, 500));
    }
    if ($httpGetResult !== null) {
        header('X-SJ-Upstream-Status: ' . (string)(int)($httpGetResult['status'] ?? 0));
        $err = (string)($httpGetResult['error'] ?? '');
        if ($err !== '') {
            header('X-SJ-Upstream-Error: ' . substr(str_replace(["\r", "\n"], ' ', $err), 0, 500));
        }
    }
}

/**
 * @return array<string, mixed>
 */
function sj_api_debug_meta(string $wpEndpoint, string $upstreamUrl, ?array $httpGetResult = null): array
{
    if (!sj_api_debug_request()) {
        return [];
    }
    $out = [
        'wpEndpoint' => $wpEndpoint,
        'upstreamUrl' => $upstreamUrl,
        'upstreamHost' => sj_api_debug_parse_host($upstreamUrl),
    ];
    if ($httpGetResult !== null) {
        $out['httpStatus'] = (int)($httpGetResult['status'] ?? 0);
        $out['httpOk'] = (bool)($httpGetResult['ok'] ?? false);
        if (!empty($httpGetResult['error'])) {
            $out['httpError'] = $httpGetResult['error'];
        }
    }

    return ['debugUpstream' => $out];
}

/**
 * @param array<string, mixed> $meta
 * @return array<string, mixed>
 */
function sj_api_debug_merge_meta(array $meta, string $wpEndpoint, string $upstreamUrl, ?array $httpGetResult = null): array
{
    $d = sj_api_debug_meta($wpEndpoint, $upstreamUrl, $httpGetResult);

    return $d === [] ? $meta : array_merge($meta, $d);
}

/**
 * Opciones cURL para HTTPS con certificado autofirmado (solo dev / entornos controlados).
 * En .env: WP_TLS_INSECURE=1
 *
 * @return array<int, mixed>
 */
function sj_curl_insecure_tls_opts(): array
{
    $v = strtolower(trim((string)(getenv('WP_TLS_INSECURE') ?: '')));
    if ($v === '1' || $v === 'true' || $v === 'yes') {
        return [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
        ];
    }

    return [];
}
