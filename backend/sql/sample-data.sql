-- 漫骑游示例数据
-- PostgreSQL

-- 插入示例线路
INSERT INTO route (id, title, title_en, subtitle, description, description_en, images, price, duration, difficulty, highlights, highlights_en, category_id, max_participants, is_active) VALUES
(
    'route-1',
    '奉化三湖双海骑行环线',
    'Fenghua Three Lakes Double Sea Cycling Loop',
    '探索奉化最美骑行线路',
    '奉化三湖双海骑行环线是漫骑游精心设计的深度骑游线路，途经三个美丽湖泊和两片海域，全程约60公里，适合中等体力骑行者。沿途可欣赏到奉化独特的山水风光，体验当地的人文历史。',
    'The Fenghua Three Lakes Double Sea Cycling Loop is a carefully designed deep cycling route by Manqiyou, passing through three beautiful lakes and two sea areas.',
    '["brand_assets/routes/page12_img1.jpeg", "brand_assets/routes/page12_img2.jpeg"]',
    599.00,
    '1天',
    'medium',
    '["三湖美景", "双海风光", "当地美食", "专业领骑"]',
    '["Three Lakes Scenery", "Double Sea Views", "Local Cuisine", "Professional Guide"]',
    'cat-1',
    20,
    true
),
(
    'route-2',
    '三江古韵漫骑环游线',
    'Three Rivers Ancient Charm Cycling Tour',
    '穿越历史的骑行之旅',
    '三江古韵漫骑环游线带您穿越宁波三江交汇处的历史文化区域，感受千年古城的韵味。全程约40公里，难度较低，适合家庭出游。',
    'The Three Rivers Ancient Charm Cycling Tour takes you through the historical and cultural area where three rivers meet in Ningbo.',
    '["brand_assets/routes/page12_img3.jpeg", "brand_assets/routes/page12_img4.jpeg"]',
    399.00,
    '半天',
    'easy',
    '["古城风韵", "三江交汇", "历史文化", "亲子友好"]',
    '["Ancient City Charm", "Three Rivers Confluence", "Historical Culture", "Family Friendly"]',
    'cat-2',
    30,
    true
),
(
    'route-3',
    '东钱湖最美骑行环线',
    'Dongqian Lake Most Beautiful Cycling Loop',
    '宁波最美湖泊骑行体验',
    '东钱湖最美骑行环线环绕宁波最大的天然淡水湖，全程约30公里，沿途风景如画，是休闲骑行的绝佳选择。',
    'The Dongqian Lake Most Beautiful Cycling Loop circles around the largest natural freshwater lake in Ningbo.',
    '["brand_assets/routes/page12_img5.jpeg", "brand_assets/routes/page12_img6.jpeg"]',
    299.00,
    '半天',
    'easy',
    '["湖光山色", "休闲骑行", "摄影胜地", "茶园风光"]',
    '["Lake and Mountain Views", "Leisure Cycling", "Photography Paradise", "Tea Garden Scenery"]',
    'cat-1',
    25,
    true
),
(
    'route-4',
    '横溪镇爱心骑行环线',
    'Hengxi Town Heart-shaped Cycling Loop',
    '爱心形状的浪漫骑行',
    '横溪镇爱心骑行环线因其独特的爱心形状路线而闻名，全程约25公里，是情侣和家庭的热门选择。',
    'The Hengxi Town Heart-shaped Cycling Loop is famous for its unique heart-shaped route.',
    '["brand_assets/routes/page12_img7.jpeg"]',
    249.00,
    '半天',
    'easy',
    '["爱心路线", "浪漫骑行", "田园风光", "特色民宿"]',
    '["Heart-shaped Route", "Romantic Cycling", "Countryside Views", "Boutique B&B"]',
    'cat-5',
    20,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 插入线路排期
INSERT INTO route_schedule (id, route_id, schedule_date, available_spots) VALUES
    ('schedule-1', 'route-1', CURRENT_DATE + INTERVAL '7 days', 15),
    ('schedule-2', 'route-1', CURRENT_DATE + INTERVAL '14 days', 20),
    ('schedule-3', 'route-2', CURRENT_DATE + INTERVAL '3 days', 25),
    ('schedule-4', 'route-2', CURRENT_DATE + INTERVAL '10 days', 30),
    ('schedule-5', 'route-3', CURRENT_DATE + INTERVAL '5 days', 20),
    ('schedule-6', 'route-4', CURRENT_DATE + INTERVAL '8 days', 18)
ON CONFLICT (id) DO NOTHING;

-- 插入示例内容（轮播图）
INSERT INTO content (id, type, title, title_en, content, images, is_active, sort_order) VALUES
(
    'banner-1',
    'banner',
    '漫骑游 - 高端跨界骑游生活平台',
    'Manqiyou - Premium Cross-border Cycling Life Platform',
    '有深度的线路、有智趣的社群、有品质的好物、有境界的异业、有风景的生活馆',
    '["brand_assets/hero/page1_img1.jpeg"]',
    true,
    1
),
(
    'banner-2',
    'banner',
    '德国血统E-BIKE',
    'German Heritage E-BIKE',
    '途尔电助力自行车，彻底解决深度探索与体力透支的根本矛盾',
    '["brand_assets/ebike/page9_img1.jpeg"]',
    true,
    2
),
(
    'banner-3',
    'banner',
    '深度骑游线路',
    'Deep Cycling Routes',
    '融入当地文化、历史与自然，变「观光」为「深度体验」',
    '["brand_assets/routes/page12_img1.jpeg"]',
    true,
    3
)
ON CONFLICT (id) DO NOTHING;

-- 插入示例好物
INSERT INTO goods (id, name, name_en, description, category, images, price, is_active, sort_order) VALUES
(
    'goods-1',
    '骑行手套',
    'Cycling Gloves',
    '专业骑行手套，透气防滑',
    'clothing',
    '["brand_assets/goods/page7_img1.jpeg"]',
    99.00,
    true,
    1
),
(
    'goods-2',
    '能量棒套装',
    'Energy Bar Set',
    '骑行专用能量补给',
    'food',
    '["brand_assets/goods/page7_img2.jpeg"]',
    59.00,
    true,
    2
),
(
    'goods-3',
    '骑行水壶',
    'Cycling Water Bottle',
    '保温骑行水壶',
    'transportation',
    '["brand_assets/goods/page7_img3.jpeg"]',
    79.00,
    true,
    3
)
ON CONFLICT (id) DO NOTHING;

-- 插入示例合作伙伴
INSERT INTO partner (id, name, name_en, logo, description, type, is_active, sort_order) VALUES
(
    'partner-1',
    '宁波市文化广电旅游局',
    'Ningbo Culture, Radio, Television and Tourism Bureau',
    'brand_assets/partner/page17_img1.jpeg',
    '政府合作伙伴',
    'government',
    true,
    1
),
(
    'partner-2',
    '途尔自行车',
    'Tour Bicycle',
    'brand_assets/partner/page17_img2.jpeg',
    'E-BIKE供应商',
    'enterprise',
    true,
    2
)
ON CONFLICT (id) DO NOTHING;
