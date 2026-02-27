-- 为商品和合作伙伴添加图片资产

-- 插入商品图片资产
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
    uploaded_by
) VALUES
-- 商品图片 1: 宁波年糕
(
    'product',
    'page13_img1.jpeg',
    'products/ningbo-rice-cake.jpg',
    '/brand_assets/goods/page13_img1.jpeg',
    '/brand_assets/goods/page13_img1.jpeg',
    '/brand_assets/goods/page13_img1.jpeg',
    '/brand_assets/goods/page13_img1.jpeg',
    '/brand_assets/goods/page13_img1.jpeg',
    150000,
    800,
    600,
    'image/jpeg',
    1,
    0,
    'completed',
    '宁波年糕',
    'Ningbo Rice Cake',
    1
),
-- 商品图片 2: 水果茶
(
    'product',
    'page13_img2.jpeg',
    'products/fruit-tea.jpg',
    '/brand_assets/goods/page13_img2.jpeg',
    '/brand_assets/goods/page13_img2.jpeg',
    '/brand_assets/goods/page13_img2.jpeg',
    '/brand_assets/goods/page13_img2.jpeg',
    '/brand_assets/goods/page13_img2.jpeg',
    150000,
    800,
    600,
    'image/jpeg',
    1,
    0,
    'completed',
    '水果茶',
    'Fruit Tea',
    1
),
-- 商品图片 3: 骑行头盔
(
    'product',
    'page7_img1.jpeg',
    'products/cycling-helmet.jpg',
    '/brand_assets/goods/page7_img1.jpeg',
    '/brand_assets/goods/page7_img1.jpeg',
    '/brand_assets/goods/page7_img1.jpeg',
    '/brand_assets/goods/page7_img1.jpeg',
    '/brand_assets/goods/page7_img1.jpeg',
    150000,
    800,
    600,
    'image/jpeg',
    1,
    0,
    'completed',
    '骑行头盔',
    'Cycling Helmet',
    1
),
-- 商品图片 4: 骑行服
(
    'product',
    'page7_img2.jpeg',
    'products/cycling-jersey.jpg',
    '/brand_assets/goods/page7_img2.jpeg',
    '/brand_assets/goods/page7_img2.jpeg',
    '/brand_assets/goods/page7_img2.jpeg',
    '/brand_assets/goods/page7_img2.jpeg',
    '/brand_assets/goods/page7_img2.jpeg',
    150000,
    800,
    600,
    'image/jpeg',
    1,
    0,
    'completed',
    '骑行服',
    'Cycling Jersey',
    1
),
-- 合作伙伴 Logo 1: 途尔 E-BIKE
(
    'partner',
    'page17_img1.jpeg',
    'partners/tour-ebike-logo.jpg',
    '/brand_assets/partner/page17_img1.jpeg',
    '/brand_assets/partner/page17_img1.jpeg',
    '/brand_assets/partner/page17_img1.jpeg',
    '/brand_assets/partner/page17_img1.jpeg',
    '/brand_assets/partner/page17_img1.jpeg',
    100000,
    400,
    400,
    'image/jpeg',
    1,
    0,
    'completed',
    '途尔 E-BIKE Logo',
    'Tour E-BIKE Logo',
    1
),
-- 合作伙伴 Logo 2: 东钱湖
(
    'partner',
    'page17_img2.jpeg',
    'partners/dongqianlake-logo.jpg',
    '/brand_assets/partner/page17_img2.jpeg',
    '/brand_assets/partner/page17_img2.jpeg',
    '/brand_assets/partner/page17_img2.jpeg',
    '/brand_assets/partner/page17_img2.jpeg',
    '/brand_assets/partner/page17_img2.jpeg',
    100000,
    400,
    400,
    'image/jpeg',
    1,
    0,
    'completed',
    '东钱湖旅游度假区 Logo',
    'Dongqian Lake Logo',
    1
),
-- 合作伙伴 Logo 3: 慈城
(
    'partner',
    'page17_img3.jpeg',
    'partners/cicheng-logo.jpg',
    '/brand_assets/partner/page17_img3.jpeg',
    '/brand_assets/partner/page17_img3.jpeg',
    '/brand_assets/partner/page17_img3.jpeg',
    '/brand_assets/partner/page17_img3.jpeg',
    '/brand_assets/partner/page17_img3.jpeg',
    100000,
    400,
    400,
    'image/jpeg',
    1,
    0,
    'completed',
    '慈城古县城 Logo',
    'Cicheng Logo',
    1
),
-- 合作伙伴 Logo 4: 四明山
(
    'partner',
    'page17_img4.jpeg',
    'partners/simingshan-logo.jpg',
    '/brand_assets/partner/page17_img4.jpeg',
    '/brand_assets/partner/page17_img4.jpeg',
    '/brand_assets/partner/page17_img4.jpeg',
    '/brand_assets/partner/page17_img4.jpeg',
    '/brand_assets/partner/page17_img4.jpeg',
    100000,
    400,
    400,
    'image/jpeg',
    1,
    0,
    'completed',
    '四明山国家森林公园 Logo',
    'Siming Mountain Logo',
    1
);

-- 更新商品的封面图片 ID
-- 假设新插入的图片 ID 从 2 开始（因为已有 1 条路线图片）
UPDATE cms_products SET cover_image_id = 2 WHERE id = 1; -- 宁波年糕
UPDATE cms_products SET cover_image_id = 3 WHERE id = 2; -- 水果茶
UPDATE cms_products SET cover_image_id = 4 WHERE id = 3; -- 骑行头盔
UPDATE cms_products SET cover_image_id = 5 WHERE id = 4; -- 骑行服

-- 更新合作伙伴的 Logo ID
UPDATE cms_partners SET logo_id = 6 WHERE id = 1; -- 途尔 E-BIKE
UPDATE cms_partners SET logo_id = 7 WHERE id = 2; -- 东钱湖
UPDATE cms_partners SET logo_id = 8 WHERE id = 3; -- 慈城
UPDATE cms_partners SET logo_id = 9 WHERE id = 4; -- 四明山

-- 为其他路线添加封面图片
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
    uploaded_by
) VALUES
-- 路线图片 2: 慈城古县城
(
    'route',
    'page12_img2.jpeg',
    'routes/cicheng.jpg',
    '/brand_assets/routes/page12_img2.jpeg',
    '/brand_assets/routes/page12_img2.jpeg',
    '/brand_assets/routes/page12_img2.jpeg',
    '/brand_assets/routes/page12_img2.jpeg',
    '/brand_assets/routes/page12_img2.jpeg',
    200000,
    1200,
    800,
    'image/jpeg',
    1,
    0,
    'completed',
    '慈城古县城',
    'Cicheng Ancient Town',
    1
),
-- 路线图片 3: 姚江绿道
(
    'route',
    'page12_img3.jpeg',
    'routes/yaojiang.jpg',
    '/brand_assets/routes/page12_img3.jpeg',
    '/brand_assets/routes/page12_img3.jpeg',
    '/brand_assets/routes/page12_img3.jpeg',
    '/brand_assets/routes/page12_img3.jpeg',
    '/brand_assets/routes/page12_img3.jpeg',
    200000,
    1200,
    800,
    'image/jpeg',
    1,
    0,
    'completed',
    '姚江绿道',
    'Yaojiang Greenway',
    1
),
-- 路线图片 4: 四明山
(
    'route',
    'page12_img4.jpeg',
    'routes/simingshan.jpg',
    '/brand_assets/routes/page12_img4.jpeg',
    '/brand_assets/routes/page12_img4.jpeg',
    '/brand_assets/routes/page12_img4.jpeg',
    '/brand_assets/routes/page12_img4.jpeg',
    '/brand_assets/routes/page12_img4.jpeg',
    200000,
    1200,
    800,
    'image/jpeg',
    1,
    0,
    'completed',
    '四明山森林',
    'Siming Mountain',
    1
),
-- 路线图片 5: 海南儋州
(
    'route',
    'page12_img5.jpeg',
    'routes/hainan.jpg',
    '/brand_assets/routes/page12_img5.jpeg',
    '/brand_assets/routes/page12_img5.jpeg',
    '/brand_assets/routes/page12_img5.jpeg',
    '/brand_assets/routes/page12_img5.jpeg',
    '/brand_assets/routes/page12_img5.jpeg',
    200000,
    1200,
    800,
    'image/jpeg',
    1,
    0,
    'completed',
    '海南儋州滨海',
    'Hainan Danzhou Coast',
    1
),
-- 路线图片 6: 贵州兴义
(
    'route',
    'page12_img6.jpeg',
    'routes/guizhou.jpg',
    '/brand_assets/routes/page12_img6.jpeg',
    '/brand_assets/routes/page12_img6.jpeg',
    '/brand_assets/routes/page12_img6.jpeg',
    '/brand_assets/routes/page12_img6.jpeg',
    '/brand_assets/routes/page12_img6.jpeg',
    200000,
    1200,
    800,
    'image/jpeg',
    1,
    0,
    'completed',
    '贵州兴义万峰林',
    'Guizhou Xingyi Wanfenglin',
    1
);

-- 更新其他路线的封面图片 ID
UPDATE cms_routes SET cover_image_id = 10 WHERE id = 2; -- 慈城
UPDATE cms_routes SET cover_image_id = 11 WHERE id = 3; -- 姚江
UPDATE cms_routes SET cover_image_id = 12 WHERE id = 4; -- 四明山
UPDATE cms_routes SET cover_image_id = 13 WHERE id = 5; -- 海南
UPDATE cms_routes SET cover_image_id = 14 WHERE id = 6; -- 贵州
