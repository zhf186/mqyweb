-- 同步 cms_content_items 中的图片到 cms_assets 表
-- 使用页面 slug 作为 category

-- 插入所有页面的图片到 cms_assets 表（忽略重复记录）
INSERT IGNORE INTO cms_assets (
    category,
    original_filename,
    file_key,
    file_url,
    file_size,
    mime_type,
    is_processed,
    webp_converted,
    processing_status,
    created_at,
    updated_at
)
SELECT DISTINCT
    p.slug AS category,  -- 使用页面 slug 作为分类
    SUBSTRING_INDEX(ci.content_zh, '/', -1) AS original_filename,  -- 从路径提取文件名
    ci.content_zh AS file_key,  -- 使用完整路径作为 key
    ci.content_zh AS file_url,  -- 图片 URL
    0 AS file_size,  -- 默认大小
    CASE 
        WHEN ci.content_zh LIKE '%.jpg' OR ci.content_zh LIKE '%.jpeg' THEN 'image/jpeg'
        WHEN ci.content_zh LIKE '%.png' THEN 'image/png'
        WHEN ci.content_zh LIKE '%.webp' THEN 'image/webp'
        ELSE 'image/jpeg'
    END AS mime_type,
    false AS is_processed,
    false AS webp_converted,
    'completed' AS processing_status,
    NOW() AS created_at,
    NOW() AS updated_at
FROM cms_content_items ci
JOIN cms_pages p ON ci.page_id = p.id
WHERE (ci.field_key LIKE '%.image' OR ci.field_key LIKE '%.icon%')
  AND ci.content_zh IS NOT NULL
  AND ci.content_zh != '';

-- 显示插入结果
SELECT 
    category,
    COUNT(*) as image_count
FROM cms_assets
WHERE file_url LIKE '/brand_assets/%'
GROUP BY category
ORDER BY category;
