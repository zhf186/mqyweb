-- ============================================
-- 为所有7个页面添加图片内容项
-- 页面：home, about, ebike, routes, goods, community, partners
-- ============================================

-- ============================================
-- 1. 首页 (Home) 图片
-- ============================================
SET @home_page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @home_page_id AND field_key LIKE '%.image';

-- Hero区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'hero.background.image', 'text', '/brand_assets/page1_img2.jpeg', '/brand_assets/page1_img2.jpeg', 50, 1);

-- 品牌介绍区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'brand.background.image', 'text', '/brand_assets/page3_img4.jpeg', '/brand_assets/page3_img4.jpeg', 51, 1);

-- 路线卡片1-4
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card1.image', 'text', '/brand_assets/page12_img1.jpeg', '/brand_assets/page12_img1.jpeg', 52, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card2.image', 'text', '/brand_assets/page12_img2.jpeg', '/brand_assets/page12_img2.jpeg', 55, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card3.image', 'text', '/brand_assets/page12_img3.jpeg', '/brand_assets/page12_img3.jpeg', 58, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'routes.card4.image', 'text', '/brand_assets/page12_img4.jpeg', '/brand_assets/page12_img4.jpeg', 61, 1);

-- CTA区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@home_page_id, 'cta.background.image', 'text', '/brand_assets/page11_img3.jpeg', '/brand_assets/page11_img3.jpeg', 64, 1);

SELECT '首页图片添加完成' AS status;

-- ============================================
-- 2. 关于我们 (About) 图片
-- ============================================
SET @about_page_id = (SELECT id FROM cms_pages WHERE slug = 'about' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @about_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'hero.background.image', 'text', '/brand_assets/page3_img1.jpeg', '/brand_assets/page3_img1.jpeg', 100, 1);


-- 品牌故事区域图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'story.image1', 'text', '/brand_assets/page3_img2.jpeg', '/brand_assets/page3_img2.jpeg', 101, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'story.image2', 'text', '/brand_assets/page3_img3.jpeg', '/brand_assets/page3_img3.jpeg', 102, 1);

-- 团队照片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'team.image', 'text', '/brand_assets/page4_img1.jpeg', '/brand_assets/page4_img1.jpeg', 103, 1);

-- 价值观图标
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'values.icon1', 'text', '/brand_assets/page4_img2.png', '/brand_assets/page4_img2.png', 104, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@about_page_id, 'values.icon2', 'text', '/brand_assets/page4_img3.png', '/brand_assets/page4_img3.png', 105, 1);

SELECT '关于我们页面图片添加完成' AS status;

-- ============================================
-- 3. E-BIKE页面图片
-- ============================================
SET @ebike_page_id = (SELECT id FROM cms_pages WHERE slug = 'ebike' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @ebike_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'hero.background.image', 'text', '/brand_assets/page9_img1.jpeg', '/brand_assets/page9_img1.jpeg', 200, 1);

-- 产品展示图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'product.image1', 'text', '/brand_assets/page9_img2.jpeg', '/brand_assets/page9_img2.jpeg', 201, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'product.image2', 'text', '/brand_assets/page9_img3.jpeg', '/brand_assets/page9_img3.jpeg', 202, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'product.image3', 'text', '/brand_assets/page9_img4.jpeg', '/brand_assets/page9_img4.jpeg', 203, 1);

-- 特性展示图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'features.image1', 'text', '/brand_assets/page10_img1.jpeg', '/brand_assets/page10_img1.jpeg', 204, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'features.image2', 'text', '/brand_assets/page10_img2.jpeg', '/brand_assets/page10_img2.jpeg', 205, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'features.image3', 'text', '/brand_assets/page10_img3.jpeg', '/brand_assets/page10_img3.jpeg', 206, 1);


-- 技术细节图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'tech.image1', 'text', '/brand_assets/page10_img4.jpeg', '/brand_assets/page10_img4.jpeg', 207, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'tech.image2', 'text', '/brand_assets/page10_img5.jpeg', '/brand_assets/page10_img5.jpeg', 208, 1);

-- 使用场景图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'scene.image1', 'text', '/brand_assets/page11_img1.jpeg', '/brand_assets/page11_img1.jpeg', 209, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'scene.image2', 'text', '/brand_assets/page11_img2.jpeg', '/brand_assets/page11_img2.jpeg', 210, 1);

-- 配件图标
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'accessories.icon1', 'text', '/brand_assets/page11_img4.png', '/brand_assets/page11_img4.png', 211, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'accessories.icon2', 'text', '/brand_assets/page11_img5.png', '/brand_assets/page11_img5.png', 212, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'accessories.icon3', 'text', '/brand_assets/page11_img6.png', '/brand_assets/page11_img6.png', 213, 1);

SELECT 'E-BIKE页面图片添加完成' AS status;

-- ============================================
-- 4. 路线 (Routes) 页面图片
-- ============================================
SET @routes_page_id = (SELECT id FROM cms_pages WHERE slug = 'routes' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @routes_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'hero.background.image', 'text', '/brand_assets/page12_img1.jpeg', '/brand_assets/page12_img1.jpeg', 300, 1);

-- 精选路线卡片图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route1.image', 'text', '/brand_assets/page12_img2.jpeg', '/brand_assets/page12_img2.jpeg', 301, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route2.image', 'text', '/brand_assets/page12_img3.jpeg', '/brand_assets/page12_img3.jpeg', 302, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route3.image', 'text', '/brand_assets/page12_img4.jpeg', '/brand_assets/page12_img4.jpeg', 303, 1);


INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route4.image', 'text', '/brand_assets/page12_img5.jpeg', '/brand_assets/page12_img5.jpeg', 304, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route5.image', 'text', '/brand_assets/page12_img6.jpeg', '/brand_assets/page12_img6.jpeg', 305, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'featured.route6.image', 'text', '/brand_assets/page12_img7.jpeg', '/brand_assets/page12_img7.jpeg', 306, 1);

-- 路线分类图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@routes_page_id, 'category.leisure.image', 'text', '/brand_assets/page12_img8.jpeg', '/brand_assets/page12_img8.jpeg', 307, 1);

SELECT '路线页面图片添加完成' AS status;

-- ============================================
-- 5. 商品 (Goods) 页面图片
-- ============================================
SET @goods_page_id = (SELECT id FROM cms_pages WHERE slug = 'goods' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @goods_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'hero.background.image', 'text', '/brand_assets/page7_img1.jpeg', '/brand_assets/page7_img1.jpeg', 400, 1);

-- 商品分类图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'category.ebike.image', 'text', '/brand_assets/page7_img2.jpeg', '/brand_assets/page7_img2.jpeg', 401, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'category.accessories.image', 'text', '/brand_assets/page7_img3.jpeg', '/brand_assets/page7_img3.jpeg', 402, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'category.gear.image', 'text', '/brand_assets/page7_img5.jpeg', '/brand_assets/page7_img5.jpeg', 403, 1);

-- 热门商品图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'hot.product1.image', 'text', '/brand_assets/page7_img7.jpeg', '/brand_assets/page7_img7.jpeg', 404, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'hot.product2.image', 'text', '/brand_assets/page7_img8.jpeg', '/brand_assets/page7_img8.jpeg', 405, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'hot.product3.image', 'text', '/brand_assets/page7_img9.jpeg', '/brand_assets/page7_img9.jpeg', 406, 1);


INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'hot.product4.image', 'text', '/brand_assets/page7_img10.jpeg', '/brand_assets/page7_img10.jpeg', 407, 1);

-- 新品推荐图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'new.product1.image', 'text', '/brand_assets/page13_img1.jpeg', '/brand_assets/page13_img1.jpeg', 408, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'new.product2.image', 'text', '/brand_assets/page13_img2.jpeg', '/brand_assets/page13_img2.jpeg', 409, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'new.product3.image', 'text', '/brand_assets/page13_img3.jpeg', '/brand_assets/page13_img3.jpeg', 410, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'new.product4.image', 'text', '/brand_assets/page13_img4.jpeg', '/brand_assets/page13_img4.jpeg', 411, 1);

-- 商品图标
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'icon.quality', 'text', '/brand_assets/page7_img4.png', '/brand_assets/page7_img4.png', 412, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@goods_page_id, 'icon.warranty', 'text', '/brand_assets/page7_img6.png', '/brand_assets/page7_img6.png', 413, 1);

SELECT '商品页面图片添加完成' AS status;

-- ============================================
-- 6. 社区 (Community) 页面图片
-- ============================================
SET @community_page_id = (SELECT id FROM cms_pages WHERE slug = 'community' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @community_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'hero.background.image', 'text', '/brand_assets/page14_img1.jpeg', '/brand_assets/page14_img1.jpeg', 500, 1);

-- 活动照片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'event.image1', 'text', '/brand_assets/page14_img2.jpeg', '/brand_assets/page14_img2.jpeg', 501, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'event.image2', 'text', '/brand_assets/page14_img3.jpeg', '/brand_assets/page14_img3.jpeg', 502, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'event.image3', 'text', '/brand_assets/page14_img4.jpeg', '/brand_assets/page14_img4.jpeg', 503, 1);


INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'event.image4', 'text', '/brand_assets/page14_img5.jpeg', '/brand_assets/page14_img5.jpeg', 504, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'event.image5', 'text', '/brand_assets/page14_img6.jpeg', '/brand_assets/page14_img6.jpeg', 505, 1);

-- 社区故事图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'story.image1', 'text', '/brand_assets/page14_img7.jpeg', '/brand_assets/page14_img7.jpeg', 506, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'story.image2', 'text', '/brand_assets/page14_img8.jpeg', '/brand_assets/page14_img8.jpeg', 507, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'story.image3', 'text', '/brand_assets/page14_img9.jpeg', '/brand_assets/page14_img9.jpeg', 508, 1);

-- 画廊图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'gallery.image1', 'text', '/brand_assets/page8_img1.jpeg', '/brand_assets/page8_img1.jpeg', 509, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'gallery.image2', 'text', '/brand_assets/page8_img2.jpeg', '/brand_assets/page8_img2.jpeg', 510, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'gallery.image3', 'text', '/brand_assets/page8_img3.jpeg', '/brand_assets/page8_img3.jpeg', 511, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'gallery.image4', 'text', '/brand_assets/page8_img4.jpeg', '/brand_assets/page8_img4.jpeg', 512, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'gallery.image5', 'text', '/brand_assets/page8_img5.jpeg', '/brand_assets/page8_img5.jpeg', 513, 1);

SELECT '社区页面图片添加完成' AS status;

-- ============================================
-- 7. 合作伙伴 (Partners) 页面图片
-- ============================================
SET @partners_page_id = (SELECT id FROM cms_pages WHERE slug = 'partners' LIMIT 1);
DELETE FROM cms_content_items WHERE page_id = @partners_page_id AND field_key LIKE '%.image';

-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'hero.background.image', 'text', '/brand_assets/page17_img1.jpeg', '/brand_assets/page17_img1.jpeg', 600, 1);


-- 合作伙伴Logo/图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'partner1.image', 'text', '/brand_assets/page17_img2.jpeg', '/brand_assets/page17_img2.jpeg', 601, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'partner2.image', 'text', '/brand_assets/page17_img3.jpeg', '/brand_assets/page17_img3.jpeg', 602, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'partner3.image', 'text', '/brand_assets/page17_img4.jpeg', '/brand_assets/page17_img4.jpeg', 603, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'partner4.image', 'text', '/brand_assets/page17_img5.jpeg', '/brand_assets/page17_img5.jpeg', 604, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'partner5.image', 'text', '/brand_assets/page17_img6.jpeg', '/brand_assets/page17_img6.jpeg', 605, 1);

-- 合作案例图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'case.image1', 'text', '/brand_assets/page15_img1.jpeg', '/brand_assets/page15_img1.jpeg', 606, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'case.image2', 'text', '/brand_assets/page16_img1.jpeg', '/brand_assets/page16_img1.jpeg', 607, 1);

-- 城市合作图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'city1.image', 'text', '/brand_assets/page19_img1.jpeg', '/brand_assets/page19_img1.jpeg', 608, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'city2.image', 'text', '/brand_assets/page19_img2.jpeg', '/brand_assets/page19_img2.jpeg', 609, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'city3.image', 'text', '/brand_assets/page19_img3.jpeg', '/brand_assets/page19_img3.jpeg', 610, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@partners_page_id, 'city4.image', 'text', '/brand_assets/page19_img4.jpeg', '/brand_assets/page19_img4.jpeg', 611, 1);

SELECT '合作伙伴页面图片添加完成' AS status;

-- ============================================
-- 完成统计
-- ============================================
SELECT 
    '所有页面图片添加完成！' AS message,
    COUNT(*) AS total_images
FROM cms_content_items 
WHERE field_key LIKE '%.image' OR field_key LIKE '%.icon%';

