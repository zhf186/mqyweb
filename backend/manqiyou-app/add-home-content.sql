-- 添加首页需要的CMS内容项
-- 这些键对应前端 page.tsx 中使用的内容

-- 获取home页面的ID
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

-- 删除可能存在的旧数据（避免重复）
DELETE FROM cms_content_items WHERE page_id = @home_page_id AND field_key IN (
    'common.brand',
    'common.slogan',
    'home.brand.badge',
    'home.brand.title.part1',
    'home.brand.title.part2',
    'home.brand.desc',
    'home.ebike.subtitle',
    'home.ebike.weight',
    'home.ebike.range',
    'home.ebike.speed',
    'home.routes.subtitle',
    'home.routes.title',
    'home.cta.title',
    'home.cta.desc'
);

-- 插入新的内容项
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) VALUES
-- 品牌信息
(@home_page_id, 'common.brand', 'text', '漫骑游', 'Manqiyou', 1, 1),
(@home_page_id, 'common.slogan', 'text', '骑遇美好人生', 'Ride into Beautiful Life', 2, 1),

-- 品牌介绍区域
(@home_page_id, 'home.brand.badge', 'text', 'FUTURE LUXURY CYCLING', 'FUTURE LUXURY CYCLING', 3, 1),
(@home_page_id, 'home.brand.title.part1', 'text', '德国血统', 'German Heritage', 4, 1),
(@home_page_id, 'home.brand.title.part2', 'text', '智能骑行', 'Smart Cycling', 5, 1),
(@home_page_id, 'home.brand.desc', 'text', '高端跨界骑游生活平台', 'Premium E-Bike Tourism Platform', 6, 1),

-- E-BIKE展示区域
(@home_page_id, 'home.ebike.subtitle', 'text', '途尔 E-BIKE', 'Tour E-BIKE', 7, 1),
(@home_page_id, 'home.ebike.weight', 'text', '11.9', '11.9', 8, 1),
(@home_page_id, 'home.ebike.range', 'text', '100', '100', 9, 1),
(@home_page_id, 'home.ebike.speed', 'text', '25', '25', 10, 1),

-- 路线展示区域
(@home_page_id, 'home.routes.subtitle', 'text', 'ROUTES', 'ROUTES', 11, 1),
(@home_page_id, 'home.routes.title', 'text', '精选路线', 'Featured Routes', 12, 1),

-- CTA区域
(@home_page_id, 'home.cta.title', 'text', '开启骑行之旅', 'Start Your Journey', 13, 1),
(@home_page_id, 'home.cta.desc', 'text', '探索更多可能', 'Explore More', 14, 1);

SELECT '内容项添加完成' AS status;

