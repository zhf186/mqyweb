-- ============================================
-- 安全地清理并重新插入所有页面的图片资源
-- 处理外键约束问题
-- ============================================

-- 临时禁用外键检查
SET FOREIGN_KEY_CHECKS = 0;

-- 删除所有页面的现有图片记录
DELETE FROM cms_assets WHERE category IN ('home', 'about', 'ebike', 'routes', 'goods', 'community', 'partners');

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. 首页 (home) - 7张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('home', 'page1_img2.jpeg', 'home/hero-bg', '/brand_assets/page1_img2.jpeg', 0, 1920, 1080, 'image/jpeg', '首页Hero背景', 'Home Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page3_img4.jpeg', 'home/brand-bg', '/brand_assets/page3_img4.jpeg', 0, 1920, 1080, 'image/jpeg', '品牌介绍背景', 'Brand Background', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page12_img1.jpeg', 'home/route-card-1', '/brand_assets/page12_img1.jpeg', 0, 800, 600, 'image/jpeg', '路线卡片1', 'Route Card 1', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page12_img2.jpeg', 'home/route-card-2', '/brand_assets/page12_img2.jpeg', 0, 800, 600, 'image/jpeg', '路线卡片2', 'Route Card 2', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page12_img3.jpeg', 'home/route-card-3', '/brand_assets/page12_img3.jpeg', 0, 800, 600, 'image/jpeg', '路线卡片3', 'Route Card 3', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page12_img4.jpeg', 'home/route-card-4', '/brand_assets/page12_img4.jpeg', 0, 800, 600, 'image/jpeg', '路线卡片4', 'Route Card 4', 1, 0, 'completed', 1, NOW(), NOW()),
('home', 'page11_img3.jpeg', 'home/cta-bg', '/brand_assets/page11_img3.jpeg', 0, 1920, 1080, 'image/jpeg', 'CTA背景', 'CTA Background', 1, 0, 'completed', 1, NOW(), NOW());

-- ============================================
-- 2. 关于我们 (about) - 2张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('about', 'page1_img1.jpeg', 'about/hero-bg', '/brand_assets/page1_img1.jpeg', 0, 1920, 1080, 'image/jpeg', '关于我们Hero背景', 'About Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('about', 'page11_img3.jpeg', 'about/cta-bg', '/brand_assets/page11_img3.jpeg', 0, 1920, 1080, 'image/jpeg', '加入我们CTA背景', 'Join Us CTA Background', 1, 0, 'completed', 1, NOW(), NOW());

-- ============================================
-- 3. E-BIKE页面 (ebike) - 9张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('ebike', 'page11_img1.jpeg', 'ebike/hero-bg', '/brand_assets/ebike/page11_img1.jpeg', 0, 1920, 1080, 'image/jpeg', 'E-BIKE Hero背景', 'E-BIKE Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img2.jpeg', 'ebike/design-bg', '/brand_assets/ebike/page10_img2.jpeg', 0, 1920, 1080, 'image/jpeg', '设计背景', 'Design Background', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img1.jpeg', 'ebike/gallery-1', '/brand_assets/ebike/page10_img1.jpeg', 0, 800, 600, 'image/jpeg', '产品画廊1', 'Product Gallery 1', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img2_gallery.jpeg', 'ebike/gallery-2', '/brand_assets/ebike/page10_img2.jpeg', 0, 800, 600, 'image/jpeg', '产品画廊2', 'Product Gallery 2', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img6.jpeg', 'ebike/gallery-3', '/brand_assets/ebike/page10_img6.jpeg', 0, 800, 600, 'image/jpeg', '产品画廊3', 'Product Gallery 3', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img5.jpeg', 'ebike/gallery-4', '/brand_assets/ebike/page10_img5.jpeg', 0, 800, 600, 'image/jpeg', '产品画廊4', 'Product Gallery 4', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img3.jpeg', 'ebike/carbon-bg', '/brand_assets/ebike/page10_img3.jpeg', 0, 1920, 1080, 'image/jpeg', '碳纤维背景', 'Carbon Fiber Background', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img2_tour1s.jpeg', 'ebike/model-tour1s', '/brand_assets/ebike/page10_img2.jpeg', 0, 800, 600, 'image/jpeg', 'Tour 1S型号', 'Tour 1S Model', 1, 0, 'completed', 1, NOW(), NOW()),
('ebike', 'page10_img6_tour1.jpeg', 'ebike/model-tour1', '/brand_assets/ebike/page10_img6.jpeg', 0, 800, 600, 'image/jpeg', 'Tour 1型号', 'Tour 1 Model', 1, 0, 'completed', 1, NOW(), NOW());

-- ============================================
-- 4. 社群活动 (community) - 20张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('community', 'page19_img3.jpeg', 'community/hero-bg', '/brand_assets/page19_img3.jpeg', 0, 1920, 1080, 'image/jpeg', '社区Hero背景', 'Community Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img4_act1.jpeg', 'community/activity-1', '/brand_assets/page19_img4.jpeg', 0, 800, 600, 'image/jpeg', '活动图片1', 'Activity Image 1', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img4_act2.jpeg', 'community/activity-2', '/brand_assets/page19_img4.jpeg', 0, 800, 600, 'image/jpeg', '活动图片2', 'Activity Image 2', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img6.jpeg', 'community/activity-3', '/brand_assets/page19_img6.jpeg', 0, 800, 600, 'image/jpeg', '活动图片3', 'Activity Image 3', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img1.jpeg', 'community/gallery-1', '/brand_assets/community/page14_img1.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊1', 'Community Gallery 1', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img2.jpeg', 'community/gallery-2', '/brand_assets/community/page14_img2.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊2', 'Community Gallery 2', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img3.jpeg', 'community/gallery-3', '/brand_assets/community/page14_img3.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊3', 'Community Gallery 3', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img4.jpeg', 'community/gallery-4', '/brand_assets/community/page14_img4.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊4', 'Community Gallery 4', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img5.jpeg', 'community/gallery-5', '/brand_assets/community/page14_img5.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊5', 'Community Gallery 5', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img6.jpeg', 'community/gallery-6', '/brand_assets/community/page14_img6.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊6', 'Community Gallery 6', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img7.jpeg', 'community/gallery-7', '/brand_assets/community/page14_img7.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊7', 'Community Gallery 7', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img8.jpeg', 'community/gallery-8', '/brand_assets/community/page14_img8.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊8', 'Community Gallery 8', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page14_img9.jpeg', 'community/gallery-9', '/brand_assets/community/page14_img9.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊9', 'Community Gallery 9', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img5.jpeg', 'community/gallery-10', '/brand_assets/page19_img5.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊10', 'Community Gallery 10', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img3_gallery.jpeg', 'community/gallery-11', '/brand_assets/page19_img3.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊11', 'Community Gallery 11', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page5_img3.jpeg', 'community/gallery-12', '/brand_assets/page5_img3.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊12', 'Community Gallery 12', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page6_img1.jpeg', 'community/gallery-13', '/brand_assets/page6_img1.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊13', 'Community Gallery 13', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page6_img5.jpeg', 'community/gallery-14', '/brand_assets/page6_img5.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊14', 'Community Gallery 14', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img1.jpeg', 'community/gallery-15', '/brand_assets/page19_img1.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊15', 'Community Gallery 15', 1, 0, 'completed', 1, NOW(), NOW()),
('community', 'page19_img2.jpeg', 'community/gallery-16', '/brand_assets/page19_img2.jpeg', 0, 600, 600, 'image/jpeg', '社区画廊16', 'Community Gallery 16', 1, 0, 'completed', 1, NOW(), NOW());

-- ============================================
-- 完成统计
-- ============================================
SELECT 
    '图片资源修复完成！' AS message,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'home') AS home_count,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'about') AS about_count,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'ebike') AS ebike_count,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'community') AS community_count;
