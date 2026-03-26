<?php
/**
 * Catálogo local cuando WordPress no está disponible.
 * Origen único: src/data/fallback-catalog.json (en deploy se copia a dist/api/).
 */
declare(strict_types=1);

function sj_fallback_catalog_path(): string {
  $nextToPhp = __DIR__ . DIRECTORY_SEPARATOR . 'fallback-catalog.json';
  if (is_readable($nextToPhp)) {
    return $nextToPhp;
  }
  $srcData = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'fallback-catalog.json';
  if (is_readable($srcData)) {
    return $srcData;
  }
  return $nextToPhp;
}

/**
 * @return array<string,mixed>|null
 */
function sj_load_fallback_catalog(): ?array {
  static $cache = null;
  if ($cache !== null) {
    return $cache === false ? null : $cache;
  }
  $path = sj_fallback_catalog_path();
  if (!is_readable($path)) {
    $cache = false;
    return null;
  }
  $raw = @file_get_contents($path);
  if ($raw === false || $raw === '') {
    $cache = false;
    return null;
  }
  try {
    $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
  } catch (Throwable $e) {
    $cache = false;
    return null;
  }
  if (!is_array($data)) {
    $cache = false;
    return null;
  }
  $cache = $data;
  return $data;
}

/** @return list<array<string,mixed>> */
function sj_fallback_products_raw(): array {
  $c = sj_load_fallback_catalog();
  if (!is_array($c) || !isset($c['products']) || !is_array($c['products'])) {
    return [];
  }
  return $c['products'];
}

/** @return list<array<string,mixed>> */
function sj_fallback_categories_raw(): array {
  $c = sj_load_fallback_catalog();
  if (!is_array($c) || !isset($c['categories']) || !is_array($c['categories'])) {
    return [];
  }
  return $c['categories'];
}

/**
 * Productos en el mismo formato que wp-products.php devuelve al cliente.
 *
 * @return list<array<string,mixed>>
 */
function sj_fallback_products_for_list(): array {
  $out = [];
  foreach (sj_fallback_products_raw() as $p) {
    if (!is_array($p)) {
      continue;
    }
    $out[] = [
      'id' => $p['id'] ?? null,
      'slug' => isset($p['slug']) && is_string($p['slug']) ? $p['slug'] : null,
      'name' => isset($p['name']) && is_string($p['name']) ? $p['name'] : 'Producto',
      'category' => isset($p['category']) && is_string($p['category']) ? $p['category'] : null,
      'image' => isset($p['image']) && is_string($p['image']) ? $p['image'] : null,
    ];
  }
  return $out;
}

/**
 * Categorías en formato wp-product-categories.
 *
 * @return list<array<string,mixed>>
 */
function sj_fallback_categories_for_api(): array {
  $out = [];
  foreach (sj_fallback_categories_raw() as $c) {
    if (!is_array($c)) {
      continue;
    }
    $out[] = [
      'id' => $c['id'] ?? null,
      'slug' => isset($c['slug']) && is_string($c['slug']) ? $c['slug'] : '',
      'name' => isset($c['name']) && is_string($c['name']) ? $c['name'] : '',
      'count' => isset($c['count']) ? (int) $c['count'] : null,
    ];
  }
  return $out;
}

/** @return array<string,mixed>|null */
function sj_fallback_find_product(int $id, string $slug): ?array {
  foreach (sj_fallback_products_raw() as $p) {
    if (!is_array($p)) {
      continue;
    }
    if ($id > 0 && isset($p['id']) && (int) $p['id'] === $id) {
      return $p;
    }
    if ($slug !== '' && isset($p['slug']) && is_string($p['slug']) && $p['slug'] === $slug) {
      return $p;
    }
  }
  return null;
}

/**
 * Payload completo para wp-product.php (misma forma que el flujo WordPress).
 *
 * @param array<string,mixed> $p
 * @return array<string,mixed>
 */
function sj_fallback_product_to_payload(array $p): array {
  $slug = isset($p['slug']) && is_string($p['slug']) ? $p['slug'] : null;
  $image = isset($p['image']) && is_string($p['image']) ? $p['image'] : null;
  $images = [];
  if (isset($p['images']) && is_array($p['images'])) {
    foreach ($p['images'] as $u) {
      if (is_string($u) && $u !== '') {
        $images[] = $u;
      }
    }
  }
  if (!$images && $image) {
    $images = [$image];
  }
  $images = array_values(array_unique($images));

  $excerpt = isset($p['excerpt']) && is_string($p['excerpt']) ? $p['excerpt'] : null;
  $descriptionHtml = isset($p['descriptionHtml']) && is_string($p['descriptionHtml']) ? $p['descriptionHtml'] : null;

  $attributes = [];
  if (isset($p['attributes']) && is_array($p['attributes'])) {
    foreach ($p['attributes'] as $a) {
      if (!is_array($a)) {
        continue;
      }
      $label = isset($a['label']) && is_string($a['label']) ? trim($a['label']) : '';
      $value = isset($a['value']) && is_string($a['value']) ? trim($a['value']) : '';
      if ($label === '' || $value === '') {
        continue;
      }
      $key = isset($a['key']) && is_string($a['key']) ? $a['key'] : null;
      $attributes[] = [
        'key' => $key,
        'label' => $label,
        'value' => $value,
      ];
    }
  }

  $category = isset($p['category']) && is_string($p['category']) ? $p['category'] : null;
  $categoryName = isset($p['categoryName']) && is_string($p['categoryName']) ? $p['categoryName'] : null;

  return [
    'id' => $p['id'] ?? null,
    'slug' => $slug,
    'name' => isset($p['name']) && is_string($p['name']) ? $p['name'] : 'Producto',
    'category' => $category,
    'categoryName' => $categoryName,
    'image' => $images[0] ?? $image,
    'images' => $images,
    'excerpt' => $excerpt,
    'descriptionHtml' => $descriptionHtml,
    'attributes' => $attributes,
    'link' => null,
    'documents' => ['specSheet' => null, 'manual' => null, 'all' => []],
  ];
}

// --- Posts (fallback-posts.json) ---

function sj_fallback_posts_path(): string {
  $nextToPhp = __DIR__ . DIRECTORY_SEPARATOR . 'fallback-posts.json';
  if (is_readable($nextToPhp)) {
    return $nextToPhp;
  }
  $srcData = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'fallback-posts.json';
  if (is_readable($srcData)) {
    return $srcData;
  }
  return $nextToPhp;
}

/**
 * @return array<string,mixed>|null
 */
function sj_load_fallback_posts(): ?array {
  static $cache = null;
  if ($cache !== null) {
    return $cache === false ? null : $cache;
  }
  $path = sj_fallback_posts_path();
  if (!is_readable($path)) {
    $cache = false;
    return null;
  }
  $raw = @file_get_contents($path);
  if ($raw === false || $raw === '') {
    $cache = false;
    return null;
  }
  try {
    $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
  } catch (Throwable $e) {
    $cache = false;
    return null;
  }
  if (!is_array($data)) {
    $cache = false;
    return null;
  }
  $cache = $data;
  return $data;
}

/** @return list<array<string,mixed>> */
function sj_fallback_posts_raw(): array {
  $c = sj_load_fallback_posts();
  if (!is_array($c) || !isset($c['posts']) || !is_array($c['posts'])) {
    return [];
  }
  return $c['posts'];
}

/**
 * Mismo formato que wp-posts.php.
 *
 * @return list<array<string,mixed>>
 */
function sj_fallback_posts_for_list(int $perPage): array {
  $all = sj_fallback_posts_raw();
  $out = [];
  foreach ($all as $p) {
    if (!is_array($p)) {
      continue;
    }
    $out[] = [
      'id' => $p['id'] ?? null,
      'slug' => isset($p['slug']) && is_string($p['slug']) ? $p['slug'] : null,
      'title' => isset($p['title']) && is_string($p['title']) ? $p['title'] : 'Post',
      'excerpt' => isset($p['excerpt']) && is_string($p['excerpt']) ? $p['excerpt'] : null,
      'date' => isset($p['date']) && is_string($p['date']) ? $p['date'] : null,
      'image' => isset($p['image']) && is_string($p['image']) ? $p['image'] : null,
      'link' => null,
    ];
  }
  if ($perPage > 0 && count($out) > $perPage) {
    return array_slice($out, 0, $perPage);
  }
  return $out;
}

/** @return array<string,mixed>|null */
function sj_fallback_find_post(int $id, string $slug): ?array {
  foreach (sj_fallback_posts_raw() as $p) {
    if (!is_array($p)) {
      continue;
    }
    if ($id > 0 && isset($p['id']) && (int) $p['id'] === $id) {
      return $p;
    }
    if ($slug !== '' && isset($p['slug']) && is_string($p['slug']) && $p['slug'] === $slug) {
      return $p;
    }
  }
  return null;
}

/**
 * Payload para wp-post.php.
 *
 * @param array<string,mixed> $p
 * @return array<string,mixed>
 */
function sj_fallback_post_to_payload(array $p): array {
  $contentHtml = isset($p['contentHtml']) && is_string($p['contentHtml']) ? $p['contentHtml'] : null;
  return [
    'id' => $p['id'] ?? null,
    'slug' => isset($p['slug']) && is_string($p['slug']) ? $p['slug'] : null,
    'title' => isset($p['title']) && is_string($p['title']) ? $p['title'] : 'Post',
    'excerpt' => isset($p['excerpt']) && is_string($p['excerpt']) ? $p['excerpt'] : null,
    'date' => isset($p['date']) && is_string($p['date']) ? $p['date'] : null,
    'image' => isset($p['image']) && is_string($p['image']) ? $p['image'] : null,
    'link' => null,
    'contentHtml' => $contentHtml,
  ];
}
