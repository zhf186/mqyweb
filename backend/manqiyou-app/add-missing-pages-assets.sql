-- ============================================
-- 添加缺失页面的图片资源
-- 骑行路线 (routes)、在地好物 (goods)、合作伙伴 (partners)
-- ============================================

-- ============================================
-- 1. 骑行路线 (routes) - 10张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('routes', 'page12_img1.jpeg', 'routes/hero-bg', '/brand_assets/page12_img1.jpeg', 0, 1920, 1080, 'image/jpeg', '路线Hero背景', 'Routes Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img3.jpeg', 'routes/culture-feature', '/brand_assets/routes/page12_img3.jpeg', 0, 800, 600, 'image/jpeg', '文化特色', 'Culture Feature', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page10_img1.jpeg', 'routes/ebike-feature', '/brand_assets/ebike/page10_img1.jpeg', 0, 800, 600, 'image/jpeg', 'E-BIKE特色', 'E-BIKE Feature', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page14_img1.jpeg', 'routes/experience-feature', '/brand_assets/community/page14_img1.jpeg', 0, 800, 600, 'image/jpeg', '体验特色', 'Experience Feature', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img1_gallery.jpeg', 'routes/gallery-1', '/brand_assets/page12_img1.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间1', 'Cycling Moment 1', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img2_gallery.jpeg', 'routes/gallery-2', '/brand_assets/page12_img2.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间2', 'Cycling Moment 2', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img3_gallery.jpeg', 'routes/gallery-3', '/brand_assets/page12_img3.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间3', 'Cycling Moment 3', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img4_gallery.jpeg', 'routes/gallery-4', '/brand_assets/page12_img4.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间4', 'Cycling Moment 4', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img5_gallery.jpeg', 'routes/gallery-5', '/brand_assets/page12_img5.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间5', 'Cycling Moment 5', 1, 0, 'completed', 1, NOW(), NOW()),
('routes', 'page12_img6_gallery.jpeg', 'routes/gallery-6', '/brand_assets/page12_img6.jpeg', 0, 600, 600, 'image/jpeg', '骑行瞬间6', 'Cycling Moment 6', 1, 0, 'completed', 1, NOW(), NOW());

SELECT '骑行路线页面图片添加完成 - 10张' AS status;

-- ============================================
-- 2. 在地好物 (goods) - 12张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('goods', 'page10_img1.jpeg', 'goods/hero-bg', '/brand_assets/page10_img1.jpeg', 0, 1920, 1080, 'image/jpeg', '在地好物Hero背景', 'Goods Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img1_product.jpeg', 'goods/product-1', '/brand_assets/page10_img1.jpeg', 0, 600, 600, 'image/jpeg', '宁波年糕礼盒', 'Ningbo Rice Cake Gift Box', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img2_product.jpeg', 'goods/product-2', '/brand_assets/page10_img2.jpeg', 0, 600, 600, 'image/jpeg', '奉化水蜜桃', 'Fenghua Honey Peach', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img3_product.jpeg', 'goods/product-3', '/brand_assets/page10_img3.jpeg', 0, 600, 600, 'image/jpeg', '专业骑行头盔', 'Pro Cycling Helmet', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img4_product.jpeg', 'goods/product-4', '/brand_assets/page10_img4.jpeg', 0, 600, 600, 'image/jpeg', '透气骑行服', 'Breathable Cycling Jersey', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img5_product.jpeg', 'goods/product-5', '/brand_assets/page10_img5.jpeg', 0, 600, 600, 'image/jpeg', '便携维修工具包', 'Portable Repair Tool Kit', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img6_product.jpeg', 'goods/product-6', '/brand_assets/page10_img6.jpeg', 0, 600, 600, 'image/jpeg', '慈溪杨梅酒', 'Cixi Bayberry Wine', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img7_product.jpeg', 'goods/product-7', '/brand_assets/page10_img7.jpeg', 0, 600, 600, 'image/jpeg', '骑行手套', 'Cycling Gloves', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img8_product.jpeg', 'goods/product-8', '/brand_assets/page10_img8.jpeg', 0, 600, 600, 'image/jpeg', '运动水壶', 'Sports Water Bottle', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img1_feature.jpeg', 'goods/feature-1', '/brand_assets/page10_img1.jpeg', 0, 400, 400, 'image/jpeg', '特色展示1', 'Feature Display 1', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img2_feature.jpeg', 'goods/feature-2', '/brand_assets/page10_img2.jpeg', 0, 400, 400, 'image/jpeg', '特色展示2', 'Feature Display 2', 1, 0, 'completed', 1, NOW(), NOW()),
('goods', 'page10_img3_feature.jpeg', 'goods/feature-3', '/brand_assets/page10_img3.jpeg', 0, 400, 400, 'image/jpeg', '特色展示3', 'Feature Display 3', 1, 0, 'completed', 1, NOW(), NOW());

SELECT '在地好物页面图片添加完成 - 12张' AS status;

-- ============================================
-- 3. 合作伙伴 (partners) - 14张图片
-- ============================================
INSERT INTO cms_assets (category, original_filename, file_key, file_url, file_size, width, height, mime_type, alt_text_zh, alt_text_en, is_processed, webp_converted, processing_status, uploaded_by, created_at, updated_at)
VALUES 
('partners', 'page12_img6.jpeg', 'partners/hero-bg', '/brand_assets/page12_img6.jpeg', 0, 1920, 1080, 'image/jpeg', '合作伙伴Hero背景', 'Partners Hero Background', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img1.jpeg', 'partners/scenic-1', '/brand_assets/cities/page19_img1.jpeg', 0, 600, 600, 'image/jpeg', '四明山国家森林公园', 'Siming Mountain National Forest Park', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img2.jpeg', 'partners/scenic-2', '/brand_assets/cities/page19_img2.jpeg', 0, 600, 600, 'image/jpeg', '东钱湖旅游度假区', 'Dongqian Lake Tourist Resort', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img3.jpeg', 'partners/scenic-3', '/brand_assets/cities/page19_img3.jpeg', 0, 600, 600, 'image/jpeg', '溪口雪窦山风景区', 'Xikou Xuedou Mountain Scenic Area', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img4.jpeg', 'partners/scenic-4', '/brand_assets/cities/page19_img4.jpeg', 0, 600, 600, 'image/jpeg', '天一阁·月湖景区', 'Tianyi Pavilion & Moon Lake', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img5.jpeg', 'partners/scenic-5', '/brand_assets/cities/page19_img5.jpeg', 0, 600, 600, 'image/jpeg', '前童古镇', 'Qiantong Ancient Town', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img6.jpeg', 'partners/scenic-6', '/brand_assets/cities/page19_img6.jpeg', 0, 600, 600, 'image/jpeg', '松兰山海滨度假区', 'Songlan Mountain Beach Resort', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img7.jpeg', 'partners/scenic-7', '/brand_assets/cities/page19_img7.jpeg', 0, 600, 600, 'image/jpeg', '河姆渡遗址', 'Hemudu Site', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img8.jpeg', 'partners/scenic-8', '/brand_assets/cities/page19_img8.jpeg', 0, 600, 600, 'image/jpeg', '梁祝文化公园', 'Liang Zhu Cultural Park', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img9.jpeg', 'partners/scenic-9', '/brand_assets/cities/page19_img9.jpeg', 0, 600, 600, 'image/jpeg', '天下玉苑', 'Tianxia Jade Garden', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img10.jpeg', 'partners/scenic-10', '/brand_assets/cities/page19_img10.jpeg', 0, 600, 600, 'image/jpeg', '鸣鹤古镇', 'Minghe Ancient Town', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page19_img11.jpeg', 'partners/scenic-11', '/brand_assets/cities/page19_img11.jpeg', 0, 600, 600, 'image/jpeg', '浙东大峡谷', 'East Zhejiang Grand Canyon', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page10_img3_hotel.jpeg', 'partners/hotel-type', '/brand_assets/page10_img3.jpeg', 0, 800, 600, 'image/jpeg', '酒店类型', 'Hotel Type', 1, 0, 'completed', 1, NOW(), NOW()),
('partners', 'page11_img3_cta.jpeg', 'partners/cta-bg', '/brand_assets/page11_img3.jpeg', 0, 1920, 1080, 'image/jpeg', '合作CTA背景', 'Partnership CTA Background', 1, 0, 'completed', 1, NOW(), NOW());

SELECT '合作伙伴页面图片添加完成 - 14张' AS status;

-- ============================================
-- 完成统计
-- ============================================
SELECT 
    '缺失页面图片资源添加完成！' AS message,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'routes') AS routes_count,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'goods') AS goods_count,
    (SELECT COUNT(*) FROM cms_assets WHERE category = 'partners') AS partners_count;
