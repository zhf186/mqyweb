BEGIN;

ALTER TABLE IF EXISTS cms_products
    ADD COLUMN IF NOT EXISTS version INT DEFAULT 0 NOT NULL;

ALTER TABLE IF EXISTS cms_partners
    ADD COLUMN IF NOT EXISTS version INT DEFAULT 0 NOT NULL;


WITH asset_sources AS (
    SELECT DISTINCT
        'routes'::text AS category,
        CASE
            WHEN left(image_path, 1) = '/' THEN image_path
            ELSE '/' || image_path
        END AS file_url,
        route_title AS alt_text_zh,
        route_title_en AS alt_text_en
    FROM (
        SELECT
            r.title AS route_title,
            COALESCE(NULLIF(r.title_en, ''), r.title) AS route_title_en,
            jsonb_array_elements_text(COALESCE(r.images, '[]'::jsonb)) AS image_path
        FROM route r
    ) route_images
    WHERE image_path IS NOT NULL AND image_path <> ''

    UNION ALL

    SELECT DISTINCT
        'goods'::text AS category,
        CASE
            WHEN left(image_path, 1) = '/' THEN image_path
            ELSE '/' || image_path
        END AS file_url,
        goods_name AS alt_text_zh,
        goods_name_en AS alt_text_en
    FROM (
        SELECT
            g.name AS goods_name,
            COALESCE(NULLIF(g.name_en, ''), g.name) AS goods_name_en,
            jsonb_array_elements_text(COALESCE(g.images, '[]'::jsonb)) AS image_path
        FROM goods g
    ) goods_images
    WHERE image_path IS NOT NULL AND image_path <> ''

    UNION ALL

    SELECT DISTINCT
        'partners'::text AS category,
        CASE
            WHEN left(p.logo, 1) = '/' THEN p.logo
            ELSE '/' || p.logo
        END AS file_url,
        p.name AS alt_text_zh,
        COALESCE(NULLIF(p.name_en, ''), p.name) AS alt_text_en
    FROM partner p
    WHERE p.logo IS NOT NULL AND p.logo <> ''

    UNION ALL

    SELECT DISTINCT
        'home'::text AS category,
        CASE
            WHEN left(image_path, 1) = '/' THEN image_path
            ELSE '/' || image_path
        END AS file_url,
        title AS alt_text_zh,
        COALESCE(NULLIF(title_en, ''), title) AS alt_text_en
    FROM (
        SELECT
            c.title,
            c.title_en,
            jsonb_array_elements_text(COALESCE(c.images, '[]'::jsonb)) AS image_path
        FROM content c
    ) content_images
    WHERE image_path IS NOT NULL AND image_path <> ''
),
normalized_assets AS (
    SELECT DISTINCT ON (file_url)
        category,
        file_url,
        regexp_replace(file_url, '^.*/', '') AS original_filename,
        alt_text_zh,
        alt_text_en
    FROM asset_sources
    ORDER BY file_url, category
)
INSERT INTO cms_assets (
    category,
    original_filename,
    file_key,
    file_url,
    large_url,
    medium_url,
    small_url,
    thumbnail_url,
    file_size,
    width,
    height,
    mime_type,
    is_processed,
    webp_converted,
    processing_status,
    alt_text_zh,
    alt_text_en,
    uploaded_by,
    created_at,
    updated_at
)
SELECT
    assets.category,
    assets.original_filename,
    'legacy/' || assets.category || '/' || md5(assets.file_url),
    assets.file_url,
    assets.file_url,
    assets.file_url,
    assets.file_url,
    assets.file_url,
    0,
    NULL,
    NULL,
    CASE
        WHEN assets.file_url ILIKE '%.png' THEN 'image/png'
        WHEN assets.file_url ILIKE '%.webp' THEN 'image/webp'
        ELSE 'image/jpeg'
    END,
    TRUE,
    FALSE,
    'completed',
    assets.alt_text_zh,
    assets.alt_text_en,
    (SELECT id FROM cms_admin_users ORDER BY id LIMIT 1),
    NOW(),
    NOW()
FROM normalized_assets assets
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_assets existing
    WHERE existing.file_url = assets.file_url
);

WITH route_source AS (
    SELECT
        r.id AS legacy_id,
        r.title AS name_zh,
        COALESCE(NULLIF(r.title_en, ''), r.title) AS name_en,
        COALESCE(
            NULLIF(
                trim(both '-' FROM regexp_replace(lower(COALESCE(NULLIF(r.title_en, ''), r.id)), '[^a-z0-9]+', '-', 'g')),
                ''
            ),
            lower(r.id)
        ) AS slug,
        COALESCE(NULLIF(r.subtitle, ''), r.title) AS short_desc_zh,
        COALESCE(NULLIF(r.title_en, ''), r.title) AS short_desc_en,
        COALESCE(NULLIF(r.description, ''), COALESCE(NULLIF(r.subtitle, ''), r.title)) AS full_desc_zh,
        COALESCE(NULLIF(r.description_en, ''), COALESCE(NULLIF(r.title_en, ''), r.title)) AS full_desc_en,
        0::numeric(10, 2) AS distance,
        CASE
            WHEN lower(COALESCE(r.difficulty, '')) IN ('easy', 'medium', 'hard') THEN lower(r.difficulty)
            ELSE 'medium'
        END AS difficulty,
        CASE r.duration
            WHEN '半天' THEN 240
            WHEN '1天' THEN 480
            WHEN '一天' THEN 480
            WHEN '2天' THEN 960
            WHEN '2天1夜' THEN 960
            WHEN '3天2夜' THEN 1440
            ELSE 480
        END AS duration_minutes,
        COALESCE(r.price, 0)::numeric(10, 2) AS price,
        CASE
            WHEN COALESCE(jsonb_array_length(r.images), 0) > 0 THEN
                CASE
                    WHEN left(r.images ->> 0, 1) = '/' THEN r.images ->> 0
                    ELSE '/' || (r.images ->> 0)
                END
            ELSE NULL
        END AS cover_url,
        COALESCE(r.is_active, TRUE) AS is_active
    FROM route r
)
INSERT INTO cms_routes (
    name_zh,
    name_en,
    slug,
    short_desc_zh,
    short_desc_en,
    full_desc_zh,
    full_desc_en,
    distance,
    difficulty,
    duration,
    price,
    cover_image_id,
    status,
    is_featured,
    view_count,
    booking_count,
    created_by,
    version,
    created_at,
    updated_at
)
SELECT
    routes.name_zh,
    routes.name_en,
    routes.slug,
    routes.short_desc_zh,
    routes.short_desc_en,
    routes.full_desc_zh,
    routes.full_desc_en,
    routes.distance,
    routes.difficulty,
    routes.duration_minutes,
    routes.price,
    assets.id,
    CASE WHEN routes.is_active THEN 'published' ELSE 'draft' END,
    FALSE,
    0,
    0,
    (SELECT id FROM cms_admin_users ORDER BY id LIMIT 1),
    0,
    NOW(),
    NOW()
FROM route_source routes
LEFT JOIN cms_assets assets ON assets.file_url = routes.cover_url
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_routes existing
    WHERE existing.slug = routes.slug
);

WITH route_source AS (
    SELECT
        r.id AS legacy_id,
        COALESCE(
            NULLIF(
                trim(both '-' FROM regexp_replace(lower(COALESCE(NULLIF(r.title_en, ''), r.id)), '[^a-z0-9]+', '-', 'g')),
                ''
            ),
            lower(r.id)
        ) AS slug
    FROM route r
),
route_images AS (
    SELECT
        cms.id AS route_id,
        CASE
            WHEN left(image_path, 1) = '/' THEN image_path
            ELSE '/' || image_path
        END AS file_url,
        image_order - 1 AS display_order
    FROM route r
    JOIN route_source src ON src.legacy_id = r.id
    JOIN cms_routes cms ON cms.slug = src.slug
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(r.images, '[]'::jsonb)) WITH ORDINALITY AS image_item(image_path, image_order)
)
INSERT INTO cms_route_images (route_id, asset_id, display_order, created_at)
SELECT
    images.route_id,
    assets.id,
    images.display_order,
    NOW()
FROM route_images images
JOIN cms_assets assets ON assets.file_url = images.file_url
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_route_images existing
    WHERE existing.route_id = images.route_id
      AND existing.asset_id = assets.id
);

WITH route_source AS (
    SELECT
        r.id AS legacy_id,
        COALESCE(
            NULLIF(
                trim(both '-' FROM regexp_replace(lower(COALESCE(NULLIF(r.title_en, ''), r.id)), '[^a-z0-9]+', '-', 'g')),
                ''
            ),
            lower(r.id)
        ) AS slug,
        zh.value AS title_zh,
        COALESCE(en.value, zh.value) AS title_en,
        zh.ord - 1 AS display_order
    FROM route r
    LEFT JOIN LATERAL jsonb_array_elements_text(COALESCE(r.highlights, '[]'::jsonb)) WITH ORDINALITY AS zh(value, ord) ON TRUE
    LEFT JOIN LATERAL jsonb_array_elements_text(COALESCE(r.highlights_en, '[]'::jsonb)) WITH ORDINALITY AS en(value, ord) ON en.ord = zh.ord
)
INSERT INTO cms_route_highlights (
    route_id,
    title_zh,
    title_en,
    description_zh,
    description_en,
    display_order,
    created_at
)
SELECT
    cms.id,
    highlights.title_zh,
    highlights.title_en,
    NULL,
    NULL,
    highlights.display_order,
    NOW()
FROM route_source highlights
JOIN cms_routes cms ON cms.slug = highlights.slug
WHERE highlights.title_zh IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM cms_route_highlights existing
      WHERE existing.route_id = cms.id
        AND existing.display_order = highlights.display_order
  );

WITH product_source AS (
    SELECT
        g.id AS legacy_id,
        g.name AS name_zh,
        COALESCE(NULLIF(g.name_en, ''), g.name) AS name_en,
        COALESCE(
            NULLIF(
                trim(both '-' FROM regexp_replace(lower(COALESCE(NULLIF(g.name_en, ''), g.id)), '[^a-z0-9]+', '-', 'g')),
                ''
            ),
            lower(g.id)
        ) AS slug,
        COALESCE(NULLIF(g.description, ''), g.name) AS short_desc_zh,
        COALESCE(NULLIF(g.description_en, ''), COALESCE(NULLIF(g.name_en, ''), g.name)) AS short_desc_en,
        COALESCE(NULLIF(g.description, ''), g.name) AS full_desc_zh,
        COALESCE(NULLIF(g.description_en, ''), COALESCE(NULLIF(g.name_en, ''), g.name)) AS full_desc_en,
        CASE
            WHEN COALESCE(g.category, '') IN ('clothing', 'food', 'accommodation', 'transportation', 'entertainment') THEN g.category
            ELSE 'clothing'
        END AS category,
        COALESCE(g.price, 0)::numeric(10, 2) AS original_price,
        COALESCE(g.price, 0)::numeric(10, 2) AS current_price,
        0 AS stock_quantity,
        CASE
            WHEN COALESCE(jsonb_array_length(g.images), 0) > 0 THEN
                CASE
                    WHEN left(g.images ->> 0, 1) = '/' THEN g.images ->> 0
                    ELSE '/' || (g.images ->> 0)
                END
            ELSE NULL
        END AS cover_url,
        NULL::text AS merchant_name,
        NULL::text AS merchant_address,
        NULL::text AS merchant_contact,
        CASE WHEN COALESCE(g.is_active, TRUE) THEN 'active' ELSE 'inactive' END AS status
    FROM goods g
)
INSERT INTO cms_products (
    name_zh,
    name_en,
    slug,
    short_desc_zh,
    short_desc_en,
    full_desc_zh,
    full_desc_en,
    category,
    original_price,
    current_price,
    stock_quantity,
    cover_image_id,
    merchant_name,
    merchant_address,
    merchant_contact,
    status,
    view_count,
    sale_count,
    created_by,
    created_at,
    updated_at
)
SELECT
    products.name_zh,
    products.name_en,
    products.slug,
    products.short_desc_zh,
    products.short_desc_en,
    products.full_desc_zh,
    products.full_desc_en,
    products.category,
    products.original_price,
    products.current_price,
    products.stock_quantity,
    assets.id,
    products.merchant_name,
    products.merchant_address,
    products.merchant_contact,
    products.status,
    0,
    0,
    (SELECT id FROM cms_admin_users ORDER BY id LIMIT 1),
    NOW(),
    NOW()
FROM product_source products
LEFT JOIN cms_assets assets ON assets.file_url = products.cover_url
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_products existing
    WHERE existing.slug = products.slug
);

WITH product_source AS (
    SELECT
        g.id AS legacy_id,
        COALESCE(
            NULLIF(
                trim(both '-' FROM regexp_replace(lower(COALESCE(NULLIF(g.name_en, ''), g.id)), '[^a-z0-9]+', '-', 'g')),
                ''
            ),
            lower(g.id)
        ) AS slug
    FROM goods g
),
product_images AS (
    SELECT
        cms.id AS product_id,
        CASE
            WHEN left(image_path, 1) = '/' THEN image_path
            ELSE '/' || image_path
        END AS file_url,
        image_order - 1 AS display_order
    FROM goods g
    JOIN product_source src ON src.legacy_id = g.id
    JOIN cms_products cms ON cms.slug = src.slug
    CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(g.images, '[]'::jsonb)) WITH ORDINALITY AS image_item(image_path, image_order)
)
INSERT INTO cms_product_images (product_id, asset_id, display_order, created_at)
SELECT
    images.product_id,
    assets.id,
    images.display_order,
    NOW()
FROM product_images images
JOIN cms_assets assets ON assets.file_url = images.file_url
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_product_images existing
    WHERE existing.product_id = images.product_id
      AND existing.asset_id = assets.id
);

WITH partner_source AS (
    SELECT
        p.id AS legacy_id,
        p.name,
        CASE
            WHEN p.type = 'enterprise' THEN 'brand'
            ELSE 'scenic_area'
        END AS type,
        COALESCE(NULLIF(p.description, ''), p.name) AS description_zh,
        COALESCE(NULLIF(p.description_en, ''), COALESCE(NULLIF(p.name_en, ''), p.name)) AS description_en,
        CASE
            WHEN p.logo IS NULL OR p.logo = '' THEN NULL
            WHEN left(p.logo, 1) = '/' THEN p.logo
            ELSE '/' || p.logo
        END AS logo_url,
        NULLIF(p.website, '') AS website_url,
        COALESCE(p.sort_order, 0) AS display_order,
        COALESCE(p.is_active, TRUE) AS is_active
    FROM partner p
)
INSERT INTO cms_partners (
    name,
    type,
    description_zh,
    description_en,
    logo_id,
    website_url,
    display_order,
    is_active,
    created_at,
    updated_at
)
SELECT
    partners.name,
    partners.type,
    partners.description_zh,
    partners.description_en,
    assets.id,
    partners.website_url,
    partners.display_order,
    partners.is_active,
    NOW(),
    NOW()
FROM partner_source partners
LEFT JOIN cms_assets assets ON assets.file_url = partners.logo_url
WHERE NOT EXISTS (
    SELECT 1
    FROM cms_partners existing
    WHERE existing.name = partners.name
);

COMMIT;
