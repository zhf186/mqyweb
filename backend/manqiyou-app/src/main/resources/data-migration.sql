-- ============================================
-- 数据迁移脚本：将旧表数据迁移到 CMS 表
-- ============================================

-- 迁移路线数据：从 routes 表到 cms_routes 表
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
    status,
    is_featured,
    view_count,
    booking_count,
    created_by,
    version
)
SELECT 
    name AS name_zh,
    name_en,
    LOWER(REPLACE(REPLACE(name_en, ' ', '-'), ',', '')) AS slug,
    summary AS short_desc_zh,
    summary AS short_desc_en,
    description AS full_desc_zh,
    description AS full_desc_en,
    distance,
    CASE 
        WHEN difficulty = 'easy' THEN 'easy'
        WHEN difficulty = 'medium' THEN 'medium'
        WHEN difficulty = 'hard' THEN 'hard'
        ELSE 'medium'
    END AS difficulty,
    duration * 60 AS duration, -- 转换为分钟
    price,
    CASE 
        WHEN status = 1 THEN 'published'
        ELSE 'draft'
    END AS status,
    featured AS is_featured,
    0 AS view_count,
    0 AS booking_count,
    1 AS created_by, -- 默认为 admin 用户 (ID=1)
    0 AS version
FROM routes
WHERE deleted = 0;

-- 添加一些示例商品数据
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
    merchant_name,
    merchant_address,
    merchant_contact,
    status,
    view_count,
    sale_count,
    created_by,
    version
) VALUES
(
    '宁波年糕礼盒',
    'Ningbo Rice Cake Gift Box',
    'ningbo-rice-cake-gift-box',
    '传统宁波年糕，软糯香甜',
    'Traditional Ningbo rice cake, soft and sweet',
    '精选优质糯米，采用传统工艺制作。每盒500g，包含多种口味。适合作为伴手礼或自用。',
    'Made from premium glutinous rice using traditional methods. 500g per box with various flavors. Perfect as a gift or for personal enjoyment.',
    '食',
    128.00,
    128.00,
    100,
    '宁波老字号食品厂',
    '宁波市海曙区中山路123号',
    '0574-87654321',
    'active',
    0,
    0,
    1,
    0
),
(
    '老化水果茶',
    'Artisan Fruit Tea',
    'artisan-fruit-tea',
    '精选时令水果，手工调制',
    'Selected seasonal fruits, handcrafted',
    '采用当季新鲜水果，搭配优质茶叶，手工调制而成。每杯都是独特的味觉体验。',
    'Made with fresh seasonal fruits and premium tea leaves, handcrafted for a unique taste experience.',
    '食',
    88.00,
    88.00,
    50,
    '老化茶饮',
    '宁波市鄞州区天童南路456号',
    '0574-88765432',
    'active',
    0,
    0,
    1,
    0
),
(
    '专业骑行头盔',
    'Professional Cycling Helmet',
    'professional-cycling-helmet',
    '安全防护，轻量透气',
    'Safe protection, lightweight and breathable',
    '采用高强度PC材质，内置EPS缓冲层。多孔透气设计，佩戴舒适。符合国际安全标准。',
    'Made with high-strength PC material and EPS cushioning layer. Multi-hole ventilation design for comfort. Meets international safety standards.',
    '行',
    299.00,
    299.00,
    30,
    '骑行装备专营店',
    '宁波市江北区环城北路789号',
    '0574-89876543',
    'active',
    0,
    0,
    1,
    0
),
(
    '送气骑行服',
    'Breathable Cycling Jersey',
    'breathable-cycling-jersey',
    '速干透气，舒适骑行',
    'Quick-dry and breathable for comfortable riding',
    '采用专业速干面料，吸湿排汗。人体工学剪裁，贴合身形。背部反光条设计，夜间骑行更安全。',
    'Made with professional quick-dry fabric for moisture wicking. Ergonomic cut for body fit. Reflective strips on back for safer night riding.',
    '衣',
    198.00,
    198.00,
    50,
    '骑行服饰专卖',
    '宁波市镇海区骆驼街道321号',
    '0574-86543210',
    'active',
    0,
    0,
    1,
    0
);

-- 添加一些示例合作伙伴数据
INSERT INTO cms_partners (
    name,
    type,
    description_zh,
    description_en,
    website_url,
    display_order,
    is_active,
    version
) VALUES
(
    '途尔 E-BIKE',
    'brand',
    '德国工艺电助力自行车品牌，专注于高品质骑行体验',
    'German E-BIKE brand focusing on high-quality cycling experience',
    'https://www.tour-ebike.com',
    1,
    true,
    0
),
(
    '东钱湖旅游度假区',
    'scenic_area',
    '浙江省最大的天然淡水湖，国家级旅游度假区',
    'Largest natural freshwater lake in Zhejiang Province, national tourist resort',
    'https://www.dongqianlake.com',
    2,
    true,
    0
),
(
    '慈城古县城',
    'scenic_area',
    '江南地区保存最完整的古县城之一，拥有1200多年历史',
    'One of the best-preserved ancient county towns in Jiangnan region with over 1200 years of history',
    'https://www.cicheng.com',
    3,
    true,
    0
),
(
    '四明山国家森林公园',
    'scenic_area',
    '宁波最高峰，国家级森林公园，自然风光优美',
    'Highest peak in Ningbo, national forest park with beautiful natural scenery',
    'https://www.simingshan.com',
    4,
    true,
    0
);

-- 验证迁移结果
SELECT 'CMS Routes Count:' AS info, COUNT(*) AS count FROM cms_routes
UNION ALL
SELECT 'CMS Products Count:' AS info, COUNT(*) AS count FROM cms_products
UNION ALL
SELECT 'CMS Partners Count:' AS info, COUNT(*) AS count FROM cms_partners;
