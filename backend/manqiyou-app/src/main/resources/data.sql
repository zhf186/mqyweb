-- 插入分类数据
INSERT INTO categories (name, name_en, icon, sort_order) VALUES
('城市骑行', 'City Cycling', '🏙️', 1),
('山地探险', 'Mountain Adventure', '⛰️', 2),
('海岸风光', 'Coastal Scenery', '🌊', 3),
('古镇人文', 'Ancient Town Culture', '🏛️', 4),
('田园风光', 'Countryside', '🌾', 5);

-- 插入线路数据
INSERT INTO routes (name, name_en, summary, description, cover_image, category_id, difficulty, duration, distance, price, max_participants, status, featured, sort_order) VALUES
('东钱湖环湖骑游', 'Dongqian Lake Circuit', '环湖骑行，湖光山色尽收眼底', '东钱湖是浙江省最大的天然淡水湖，环湖骑行全程约45公里。沿途可欣赏湖光山色、古村落、茶园等多种风景。途经小普陀、陶公岛、福泉山等景点，是宁波最经典的骑行线路之一。', '/brand_assets/routes/page12_img1.jpeg', 3, 'easy', 6, 45.00, 680.00, 25, 1, true, 1),
('慈城古县城文化骑游', 'Cicheng Ancient County Tour', '穿越千年古县城，感受历史沉淀', '慈城是江南地区保存最完整的古县城之一，拥有1200多年历史。骑行穿越古城，游览孔庙、县衙、城隍庙等古建筑群，品味江南水乡的独特魅力。线路平坦，适合家庭亲子骑游。', '/brand_assets/routes/page12_img2.jpeg', 4, 'easy', 6, 30.00, 480.00, 20, 1, true, 2),
('姚江绿道休闲骑行', 'Yaojiang Greenway Leisure Ride', '沿江骑行，城市绿肺中的惬意时光', '姚江绿道全长约35公里，是宁波市区最美的骑行绿道。沿途经过姚江公园、三江口、老外滩等地标，可以欣赏到现代都市与历史文化的完美融合。适合城市休闲骑行。', '/brand_assets/routes/page12_img3.jpeg', 1, 'easy', 4, 35.00, 380.00, 30, 1, true, 3),
('四明山森林骑游挑战', 'Siming Mountain Forest Challenge', '征服四明山，挑战自我极限', '四明山是宁波最高峰，海拔1000余米。这条线路适合有一定骑行经验的骑友，沿途风景壮丽，空气清新。途经四明山国家森林公园、丹山赤水等景区，是挑战自我的绝佳选择。', '/brand_assets/routes/page12_img4.jpeg', 2, 'hard', 72, 120.00, 2580.00, 10, 1, false, 4),
('海南儋州滨海骑游', 'Hainan Danzhou Coastal Ride', '椰风海韵，热带风情骑游体验', '海南儋州滨海旅游度假区骑游线路，全程约50公里。沿着海岸线骑行，感受热带海岛的独特魅力。途经神冲驿站、海花岛等景点，可以体验海南特色文化和美食。', '/brand_assets/routes/page12_img5.jpeg', 3, 'medium', 48, 50.00, 1280.00, 15, 1, true, 5),
('贵州兴义万峰林骑游', 'Guizhou Xingyi Wanfenglin Ride', '喀斯特地貌奇观，万峰林中穿行', '贵州兴义万峰林是中国最美的峰林之一，骑行其中仿佛置身仙境。线路全程约40公里，途经纳灰村、八卦田等特色景点，可以深度体验布依族文化和喀斯特地貌的壮美。', '/brand_assets/routes/page12_img6.jpeg', 2, 'medium', 48, 40.00, 980.00, 15, 1, true, 6);

-- CMS admin seed account (dev/test only)
-- username: admin
-- password: Admin@123
INSERT INTO cms_admin_users (username, password_hash, email, full_name, role, is_active) VALUES
('admin', '$2a$10$HUgM3xpw29rxBwwTjJEfPeNnxKapnTbehdzJ4/K5RvQT/kI9ONmYW', 'admin@manqiyou.com', '系统管理员', 'super_admin', true);

-- 插入CMS测试页面
INSERT INTO cms_pages (slug, name_zh, name_en, description, is_active) VALUES
('home', '首页', 'Home', '网站首页', true),
('ebike', 'E-BIKE页面', 'E-BIKE Page', 'E-BIKE产品介绍页面', true),
('routes', '路线页面', 'Routes Page', '骑游路线列表页面', true);

-- 插入CMS测试内容项
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, published_content_zh, published_content_en, published_at, max_length, is_required, display_order, version) VALUES
(1, 'hero.title', 'text', '骑遇无限美好人生', 'Encounter Infinite Beautiful Life', '骑遇无限美好人生', 'Encounter Infinite Beautiful Life', CURRENT_TIMESTAMP, 100, true, 1, 0),
(1, 'hero.subtitle', 'text', '德国工艺电助力自行车 × 深度探索骑游路线', 'German E-BIKE × Deep Exploration Routes', '德国工艺电助力自行车 × 深度探索骑游路线', 'German E-BIKE × Deep Exploration Routes', CURRENT_TIMESTAMP, 200, true, 2, 0),
(1, 'hero.cta', 'text', '开始探索', 'Start Exploring', '开始探索', 'Start Exploring', CURRENT_TIMESTAMP, 50, true, 3, 0),
(2, 'intro.title', 'text', '途尔 E-BIKE', 'Tour E-BIKE', '途尔 E-BIKE', 'Tour E-BIKE', CURRENT_TIMESTAMP, 100, true, 1, 0),
(2, 'intro.description', 'textarea', '德国工艺，智能电助力系统，让骑行更轻松', 'German craftsmanship, intelligent electric assist system', '德国工艺，智能电助力系统，让骑行更轻松', 'German craftsmanship, intelligent electric assist system', CURRENT_TIMESTAMP, 500, true, 2, 0),
(3, 'header.title', 'text', '精选骑游路线', 'Featured Routes', '精选骑游路线', 'Featured Routes', CURRENT_TIMESTAMP, 100, true, 1, 0);


-- ============================================
-- 数据迁移：将旧表数据迁移到 CMS 表
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
    duration AS duration,
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

-- 添加示例商品数据
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

-- 添加示例合作伙伴数据
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
