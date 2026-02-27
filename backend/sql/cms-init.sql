-- 漫骑游 CMS 后台管理系统数据库初始化脚本
-- PostgreSQL
-- 创建日期: 2026-02-02

-- ============================================
-- CMS 管理员表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'content_editor')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_admin_users_username ON cms_admin_users(username);
CREATE INDEX idx_cms_admin_users_role ON cms_admin_users(role);
CREATE INDEX idx_cms_admin_users_email ON cms_admin_users(email);

COMMENT ON TABLE cms_admin_users IS 'CMS管理员用户表';
COMMENT ON COLUMN cms_admin_users.role IS '角色: super_admin=超级管理员, content_editor=内容编辑员';

-- ============================================
-- CMS 页面表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_pages (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_active ON cms_pages(is_active);

COMMENT ON TABLE cms_pages IS 'CMS可编辑页面表';
COMMENT ON COLUMN cms_pages.slug IS '页面标识符，如: home, ebike, routes';

-- ============================================
-- CMS 内容项表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content_items (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT REFERENCES cms_pages(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('text', 'textarea', 'richtext')),
    content_zh TEXT,
    content_en TEXT,
    max_length INT,
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    version INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_id, field_key)
);

CREATE INDEX idx_cms_content_items_page_id ON cms_content_items(page_id);
CREATE INDEX idx_cms_content_items_field_key ON cms_content_items(field_key);

COMMENT ON TABLE cms_content_items IS 'CMS内容项表，存储页面的可编辑文本内容';
COMMENT ON COLUMN cms_content_items.field_key IS '字段键，如: hero.title, hero.subtitle';
COMMENT ON COLUMN cms_content_items.field_type IS '字段类型: text=单行文本, textarea=多行文本, richtext=富文本';

-- ============================================
-- CMS 内容版本表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content_versions (
    id BIGSERIAL PRIMARY KEY,
    content_item_id BIGINT REFERENCES cms_content_items(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content_zh TEXT,
    content_en TEXT,
    changed_by BIGINT REFERENCES cms_admin_users(id),
    change_summary VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_content_versions_item_id ON cms_content_versions(content_item_id);
CREATE INDEX idx_cms_content_versions_created_at ON cms_content_versions(created_at DESC);

COMMENT ON TABLE cms_content_versions IS 'CMS内容版本历史表';

-- ============================================
-- CMS 资源表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_assets (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_key VARCHAR(255) UNIQUE NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    large_url VARCHAR(500),
    medium_url VARCHAR(500),
    small_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    file_size BIGINT NOT NULL,
    width INT,
    height INT,
    mime_type VARCHAR(50),
    is_processed BOOLEAN DEFAULT FALSE,
    webp_converted BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    alt_text_zh VARCHAR(255),
    alt_text_en VARCHAR(255),
    uploaded_by BIGINT REFERENCES cms_admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_assets_category ON cms_assets(category);
CREATE INDEX idx_cms_assets_created_at ON cms_assets(created_at DESC);
CREATE INDEX idx_cms_assets_processing_status ON cms_assets(processing_status);
CREATE INDEX idx_cms_assets_file_key ON cms_assets(file_key);

COMMENT ON TABLE cms_assets IS 'CMS资源表，存储图片等媒体文件';
COMMENT ON COLUMN cms_assets.category IS '资源分类: hero, brand, ebike, route, goods, community, partner, city';
COMMENT ON COLUMN cms_assets.processing_status IS '处理状态: pending=待处理, processing=处理中, completed=已完成, failed=失败';

-- ============================================
-- CMS 资源使用表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_asset_usages (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT REFERENCES cms_assets(id) ON DELETE CASCADE,
    usage_type VARCHAR(50) NOT NULL,
    usage_id BIGINT NOT NULL,
    field_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_asset_usages_asset_id ON cms_asset_usages(asset_id);
CREATE INDEX idx_cms_asset_usages_usage ON cms_asset_usages(usage_type, usage_id);

COMMENT ON TABLE cms_asset_usages IS 'CMS资源使用记录表';
COMMENT ON COLUMN cms_asset_usages.usage_type IS '使用类型: page_content, route, product, partner';

-- ============================================
-- CMS 路线表（扩展现有route表）
-- ============================================
CREATE TABLE IF NOT EXISTS cms_routes (
    id BIGSERIAL PRIMARY KEY,
    name_zh VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    short_desc_zh TEXT,
    short_desc_en TEXT,
    full_desc_zh TEXT,
    full_desc_en TEXT,
    distance DECIMAL(10, 2),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration INT,
    price DECIMAL(10, 2),
    cover_image_id BIGINT REFERENCES cms_assets(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    created_by BIGINT REFERENCES cms_admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_routes_status ON cms_routes(status);
CREATE INDEX idx_cms_routes_featured ON cms_routes(is_featured);
CREATE INDEX idx_cms_routes_slug ON cms_routes(slug);
CREATE INDEX idx_cms_routes_difficulty ON cms_routes(difficulty);

COMMENT ON TABLE cms_routes IS 'CMS路线管理表';

-- ============================================
-- CMS 路线图片表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_route_images (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT REFERENCES cms_routes(id) ON DELETE CASCADE,
    asset_id BIGINT REFERENCES cms_assets(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_route_images_route_id ON cms_route_images(route_id);
CREATE INDEX idx_cms_route_images_display_order ON cms_route_images(display_order);

-- ============================================
-- CMS 路线亮点表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_route_highlights (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT REFERENCES cms_routes(id) ON DELETE CASCADE,
    title_zh VARCHAR(100) NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_route_highlights_route_id ON cms_route_highlights(route_id);

-- ============================================
-- CMS 商品表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_products (
    id BIGSERIAL PRIMARY KEY,
    name_zh VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    short_desc_zh TEXT,
    short_desc_en TEXT,
    full_desc_zh TEXT,
    full_desc_en TEXT,
    category VARCHAR(50) CHECK (category IN ('clothing', 'food', 'accommodation', 'transportation', 'entertainment')),
    original_price DECIMAL(10, 2),
    current_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    cover_image_id BIGINT REFERENCES cms_assets(id),
    merchant_name VARCHAR(200),
    merchant_address VARCHAR(500),
    merchant_contact VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    view_count INT DEFAULT 0,
    sale_count INT DEFAULT 0,
    created_by BIGINT REFERENCES cms_admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_products_status ON cms_products(status);
CREATE INDEX idx_cms_products_category ON cms_products(category);
CREATE INDEX idx_cms_products_slug ON cms_products(slug);

COMMENT ON TABLE cms_products IS 'CMS商品管理表';
COMMENT ON COLUMN cms_products.category IS '商品分类: clothing=衣, food=食, accommodation=住, transportation=行, entertainment=乐';

-- ============================================
-- CMS 商品图片表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES cms_products(id) ON DELETE CASCADE,
    asset_id BIGINT REFERENCES cms_assets(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_product_images_product_id ON cms_product_images(product_id);

-- ============================================
-- CMS 合作伙伴表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_partners (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('brand', 'scenic_area')),
    description_zh TEXT,
    description_en TEXT,
    logo_id BIGINT REFERENCES cms_assets(id),
    website_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_partners_type ON cms_partners(type);
CREATE INDEX idx_cms_partners_order ON cms_partners(display_order);
CREATE INDEX idx_cms_partners_active ON cms_partners(is_active);

COMMENT ON TABLE cms_partners IS 'CMS合作伙伴管理表';

-- ============================================
-- CMS 系统设置表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    updated_by BIGINT REFERENCES cms_admin_users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_system_settings_key ON cms_system_settings(setting_key);

COMMENT ON TABLE cms_system_settings IS 'CMS系统设置表';

-- ============================================
-- CMS 操作日志表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_operation_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES cms_admin_users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_operation_logs_user_id ON cms_operation_logs(user_id);
CREATE INDEX idx_cms_operation_logs_action ON cms_operation_logs(action);
CREATE INDEX idx_cms_operation_logs_created_at ON cms_operation_logs(created_at DESC);
CREATE INDEX idx_cms_operation_logs_resource ON cms_operation_logs(resource_type, resource_id);

COMMENT ON TABLE cms_operation_logs IS 'CMS操作日志表';
COMMENT ON COLUMN cms_operation_logs.action IS '操作类型: login, create, update, delete, publish';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入超级管理员账号
-- 用户名: admin
-- 密码: Admin@123 (BCrypt加密后的哈希值)
INSERT INTO cms_admin_users (username, password_hash, email, full_name, role, is_active) VALUES
    ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKfzq.CO', 'admin@manqiyou.com', '系统管理员', 'super_admin', true)
ON CONFLICT (username) DO NOTHING;

-- 插入页面数据
INSERT INTO cms_pages (slug, name_zh, name_en, description, is_active) VALUES
    ('home', '首页', 'Home', '网站首页，展示品牌核心价值和主要功能', true),
    ('ebike', 'E-BIKE页面', 'E-BIKE Page', '展示途尔E-BIKE产品和智能系统', true),
    ('routes', '路线页面', 'Routes Page', '展示骑游线路列表和详情', true),
    ('goods', '好物页面', 'Goods Page', '展示在地好物商品', true),
    ('community', '社群页面', 'Community Page', '展示社群活动和会员信息', true),
    ('partners', '合作伙伴页面', 'Partners Page', '展示合作伙伴信息', true),
    ('about', '关于我们页面', 'About Page', '展示品牌故事和公司信息', true)
ON CONFLICT (slug) DO NOTHING;

-- 插入首页内容项
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, max_length, is_required, display_order) VALUES
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'hero.title', 'text', '骑遇无限美好人生', 'Encounter Infinite Beautiful Life Through Cycling', 50, true, 1),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'hero.subtitle', 'text', '高端跨界骑游生活平台', 'Premium Cross-border Cycling Life Platform', 100, true, 2),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'hero.cta', 'text', '开始骑行', 'Start Cycling', 20, true, 3),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'brand.title', 'text', '漫骑游', 'Manqiyou', 30, true, 4),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'brand.description', 'textarea', '有深度的线路、有智趣的社群、有品质的好物、有境界的异业、有风景的生活馆', 'Deep routes, intelligent community, quality goods, cross-industry cooperation, scenic lifestyle stores', 200, true, 5),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'ebike.title', 'text', '德国血统 E-BIKE', 'German Heritage E-BIKE', 50, true, 6),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'ebike.feature1', 'text', '智能系统', 'Smart System', 30, true, 7),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'ebike.feature2', 'text', '超长续航', 'Long Range', 30, true, 8),
    ((SELECT id FROM cms_pages WHERE slug = 'home'), 'ebike.feature3', 'text', '轻量设计', 'Lightweight Design', 30, true, 9)
ON CONFLICT (page_id, field_key) DO NOTHING;

-- 插入E-BIKE页面内容项
INSERT INTO cms_content_items (page_id, field_key, field_type, content_zh, content_en, max_length, is_required, display_order) VALUES
    ((SELECT id FROM cms_pages WHERE slug = 'ebike'), 'hero.title', 'text', '途尔电助力自行车', 'Tour E-Bike', 50, true, 1),
    ((SELECT id FROM cms_pages WHERE slug = 'ebike'), 'hero.subtitle', 'text', '德国血统，智能骑行', 'German Heritage, Smart Cycling', 100, true, 2),
    ((SELECT id FROM cms_pages WHERE slug = 'ebike'), 'features.title', 'text', '核心特性', 'Core Features', 30, true, 3),
    ((SELECT id FROM cms_pages WHERE slug = 'ebike'), 'features.description', 'textarea', '彻底解决深度探索与体力透支的根本矛盾', 'Solve the fundamental contradiction between deep exploration and physical exhaustion', 200, true, 4),
    ((SELECT id FROM cms_pages WHERE slug = 'ebike'), 'specs.title', 'text', '技术参数', 'Technical Specifications', 30, true, 5)
ON CONFLICT (page_id, field_key) DO NOTHING;

-- 插入系统设置默认值
INSERT INTO cms_system_settings (setting_key, setting_value, setting_type, description) VALUES
    ('site_name', '漫骑游', 'string', '网站名称'),
    ('site_name_en', 'Manqiyou', 'string', '网站英文名称'),
    ('contact_email', 'contact@manqiyou.com', 'string', '联系邮箱'),
    ('contact_phone', '400-123-4567', 'string', '联系电话'),
    ('seo_title_zh', '漫骑游 - 高端跨界骑游生活平台', 'string', 'SEO标题（中文）'),
    ('seo_title_en', 'Manqiyou - Premium Cross-border Cycling Life Platform', 'string', 'SEO标题（英文）'),
    ('seo_description_zh', '漫骑游提供德国血统E-BIKE租赁和深度骑游线路，打造高端跨界骑游生活体验', 'string', 'SEO描述（中文）'),
    ('seo_description_en', 'Manqiyou provides German heritage E-BIKE rental and deep cycling routes', 'string', 'SEO描述（英文）'),
    ('seo_keywords', '骑游,E-BIKE,电助力自行车,骑行线路,宁波骑行', 'string', 'SEO关键词'),
    ('oss_bucket', 'manqiyou-assets', 'string', '阿里云OSS存储桶名称'),
    ('oss_region', 'oss-cn-hangzhou', 'string', '阿里云OSS区域'),
    ('max_upload_size', '5', 'number', '最大上传文件大小（MB）'),
    ('image_quality', '85', 'number', '图片压缩质量（0-100）')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- 完成提示
-- ============================================
-- CMS数据库初始化完成
-- 默认管理员账号:
--   用户名: admin
--   密码: Admin@123
--   邮箱: admin@manqiyou.com
-- 
-- 请在首次登录后立即修改密码！
