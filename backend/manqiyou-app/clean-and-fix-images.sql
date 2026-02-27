-- ============================================
-- 彻底清理并修复E-BIKE和社区页面图片数据
-- ============================================

-- ============================================
-- 1. E-BIKE页面 - 完全清理
-- ============================================
SET @ebike_page_id = (SELECT id FROM cms_pages WHERE slug = 'ebike' LIMIT 1);

-- 删除E-BIKE页面的所有图片相关记录
DELETE FROM cms_content_items WHERE page_id = @ebike_page_id;

-- 重新插入E-BIKE页面的正确图片数据
-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.hero.background', 'text', '/brand_assets/ebike/page11_img1.jpeg', '/brand_assets/ebike/page11_img1.jpeg', 200, 1);

-- 设计区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebikePage.design.background', 'text', '/brand_assets/ebike/page10_img2.jpeg', '/brand_assets/ebike/page10_img2.jpeg', 201, 1);

-- 画廊图片1-4
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.gallery.image1', 'text', '/brand_assets/ebike/page10_img1.jpeg', '/brand_assets/ebike/page10_img1.jpeg', 202, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.gallery.image2', 'text', '/brand_assets/ebike/page10_img2.jpeg', '/brand_assets/ebike/page10_img2.jpeg', 203, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.gallery.image3', 'text', '/brand_assets/ebike/page10_img6.jpeg', '/brand_assets/ebike/page10_img6.jpeg', 204, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.gallery.image4', 'text', '/brand_assets/ebike/page10_img5.jpeg', '/brand_assets/ebike/page10_img5.jpeg', 205, 1);

-- 碳纤维区域背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.carbon.background', 'text', '/brand_assets/ebike/page10_img3.jpeg', '/brand_assets/ebike/page10_img3.jpeg', 206, 1);

-- 型号对比图片
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.models.tour1s.image', 'text', '/brand_assets/ebike/page10_img2.jpeg', '/brand_assets/ebike/page10_img2.jpeg', 207, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@ebike_page_id, 'ebike.models.tour1.image', 'text', '/brand_assets/ebike/page10_img6.jpeg', '/brand_assets/ebike/page10_img6.jpeg', 208, 1);

SELECT 'E-BIKE页面清理并修复完成 - 共9张图片' AS status;

-- ============================================
-- 2. 社区页面 - 完全清理
-- ============================================
SET @community_page_id = (SELECT id FROM cms_pages WHERE slug = 'community' LIMIT 1);

-- 删除社区页面的所有图片相关记录
DELETE FROM cms_content_items WHERE page_id = @community_page_id;

-- 重新插入社区页面的正确图片数据
-- Hero背景图
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.hero.background', 'text', '/brand_assets/page19_img3.jpeg', '/brand_assets/page19_img3.jpeg', 500, 1);

-- 活动图片1-3
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.activity1.image', 'text', '/brand_assets/page19_img4.jpeg', '/brand_assets/page19_img4.jpeg', 501, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.activity2.image', 'text', '/brand_assets/page19_img4.jpeg', '/brand_assets/page19_img4.jpeg', 502, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.activity3.image', 'text', '/brand_assets/page19_img6.jpeg', '/brand_assets/page19_img6.jpeg', 503, 1);

-- 画廊图片1-16
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image1', 'text', '/brand_assets/community/page14_img1.jpeg', '/brand_assets/community/page14_img1.jpeg', 504, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image2', 'text', '/brand_assets/community/page14_img2.jpeg', '/brand_assets/community/page14_img2.jpeg', 505, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image3', 'text', '/brand_assets/community/page14_img3.jpeg', '/brand_assets/community/page14_img3.jpeg', 506, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image4', 'text', '/brand_assets/community/page14_img4.jpeg', '/brand_assets/community/page14_img4.jpeg', 507, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image5', 'text', '/brand_assets/community/page14_img5.jpeg', '/brand_assets/community/page14_img5.jpeg', 508, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image6', 'text', '/brand_assets/community/page14_img6.jpeg', '/brand_assets/community/page14_img6.jpeg', 509, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image7', 'text', '/brand_assets/community/page14_img7.jpeg', '/brand_assets/community/page14_img7.jpeg', 510, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image8', 'text', '/brand_assets/community/page14_img8.jpeg', '/brand_assets/community/page14_img8.jpeg', 511, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image9', 'text', '/brand_assets/community/page14_img9.jpeg', '/brand_assets/community/page14_img9.jpeg', 512, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image10', 'text', '/brand_assets/page19_img5.jpeg', '/brand_assets/page19_img5.jpeg', 513, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image11', 'text', '/brand_assets/page19_img3.jpeg', '/brand_assets/page19_img3.jpeg', 514, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image12', 'text', '/brand_assets/page5_img3.jpeg', '/brand_assets/page5_img3.jpeg', 515, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image13', 'text', '/brand_assets/page6_img1.jpeg', '/brand_assets/page6_img1.jpeg', 516, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image14', 'text', '/brand_assets/page6_img5.jpeg', '/brand_assets/page6_img5.jpeg', 517, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image15', 'text', '/brand_assets/page19_img1.jpeg', '/brand_assets/page19_img1.jpeg', 518, 1);

INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, display_order, version) 
VALUES (@community_page_id, 'community.gallery.image16', 'text', '/brand_assets/page19_img2.jpeg', '/brand_assets/page19_img2.jpeg', 519, 1);

SELECT '社区页面清理并修复完成 - 共20张图片' AS status;

-- ============================================
-- 完成统计
-- ============================================
SELECT 
    'E-BIKE和社区页面图片修复完成！' AS message,
    (SELECT COUNT(*) FROM cms_content_items WHERE page_id = @ebike_page_id) AS ebike_images,
    (SELECT COUNT(*) FROM cms_content_items WHERE page_id = @community_page_id) AS community_images;
