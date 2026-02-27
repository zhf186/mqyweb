-- 修复首页内容项的display_order，确保没有重复
-- 删除旧的重复内容项，只保留新添加的

-- 首先查看当前状态
SELECT id, field_key, display_order FROM cms_content_items WHERE page_id = 1 ORDER BY display_order, id;

-- 删除旧的hero.*内容项（这些已经被新的common.*和home.*替代）
DELETE FROM cms_content_items WHERE page_id = 1 AND field_key IN ('hero.title', 'hero.subtitle', 'hero.cta');

-- 重新设置display_order，确保顺序正确且无重复
UPDATE cms_content_items SET display_order = 1 WHERE page_id = 1 AND field_key = 'common.brand';
UPDATE cms_content_items SET display_order = 2 WHERE page_id = 1 AND field_key = 'common.slogan';
UPDATE cms_content_items SET display_order = 3 WHERE page_id = 1 AND field_key = 'home.brand.badge';
UPDATE cms_content_items SET display_order = 4 WHERE page_id = 1 AND field_key = 'home.brand.title.part1';
UPDATE cms_content_items SET display_order = 5 WHERE page_id = 1 AND field_key = 'home.brand.title.part2';
UPDATE cms_content_items SET display_order = 6 WHERE page_id = 1 AND field_key = 'home.brand.desc';
UPDATE cms_content_items SET display_order = 7 WHERE page_id = 1 AND field_key = 'home.ebike.subtitle';
UPDATE cms_content_items SET display_order = 8 WHERE page_id = 1 AND field_key = 'home.routes.subtitle';
UPDATE cms_content_items SET display_order = 9 WHERE page_id = 1 AND field_key = 'home.routes.title';
UPDATE cms_content_items SET display_order = 10 WHERE page_id = 1 AND field_key = 'home.cta.title';
UPDATE cms_content_items SET display_order = 11 WHERE page_id = 1 AND field_key = 'home.cta.desc';

-- 查看修复后的结果
SELECT id, field_key, display_order, content_zh, content_en FROM cms_content_items WHERE page_id = 1 ORDER BY display_order;
