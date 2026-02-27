-- 添加首页图片内容项
-- 第一批实施：使用简化方案，直接存储图片路径

-- 获取home页面的ID
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);

-- 删除可能存在的旧图片数据
DELETE FROM cms_content_items WHERE page_id = @home_page_id AND field_key LIKE '%.image%';

-- 插入图片内容项
-- 使用field_type='text'存储图片路径，后续可升级为'image'类型使用asset_id

-- Hero区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'hero.background.image', 'text', '/brand_assets/page1_img2.jpeg', '/brand_assets/page1_img2.jpeg', 50, 1);

-- 品牌介绍区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'brand.background.image', 'text', '/brand_assets/page3_img4.jpeg', '/brand_assets/page3_img4.jpeg', 51, 1);

-- 路线卡片1
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card1.image', 'text', '/brand_assets/page12_img1.jpeg', '/brand_assets/page12_img1.jpeg', 52, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card1.name', 'text', '东钱湖环湖', 'Dongqian Lake Loop', 53, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card1.distance', 'text', '35km', '35km', 54, 1);

-- 路线卡片2
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card2.image', 'text', '/brand_assets/page12_img2.jpeg', '/brand_assets/page12_img2.jpeg', 55, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card2.name', 'text', '四明山挑战', 'Siming Mountain Challenge', 56, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card2.distance', 'text', '68km', '68km', 57, 1);

-- 路线卡片3
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card3.image', 'text', '/brand_assets/page12_img3.jpeg', '/brand_assets/page12_img3.jpeg', 58, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card3.name', 'text', '海岸线骑行', 'Coastal Ride', 59, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card3.distance', 'text', '42km', '42km', 60, 1);

-- 路线卡片4
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card4.image', 'text', '/brand_assets/page12_img4.jpeg', '/brand_assets/page12_img4.jpeg', 61, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card4.name', 'text', '古镇探索', 'Ancient Town Exploration', 62, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card4.distance', 'text', '28km', '28km', 63, 1);

-- CTA区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'cta.background.image', 'text', '/brand_assets/page11_img3.jpeg', '/brand_assets/page11_img3.jpeg', 64, 1);

SELECT '首页图片内容项添加完成' AS status;
