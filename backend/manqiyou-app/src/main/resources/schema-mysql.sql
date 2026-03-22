-- MySQL Schema for Manqiyou CMS
-- 字符集: UTF-8
-- 引擎: InnoDB

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 线路表
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    summary VARCHAR(500),
    description TEXT,
    cover_image VARCHAR(500),
    images TEXT,
    category_id BIGINT,
    difficulty VARCHAR(20) DEFAULT 'medium',
    duration INT,
    distance DECIMAL(10,2),
    price DECIMAL(10,2),
    max_participants INT DEFAULT 20,
    status INT DEFAULT 1,
    featured TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20),
    password VARCHAR(255),
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    wechat_openid VARCHAR(100),
    wechat_unionid VARCHAR(100),
    member_level VARCHAR(20) DEFAULT 'bronze',
    points INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 管理员表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cms_admin_users_username (username),
    INDEX idx_cms_admin_users_role (role),
    INDEX idx_cms_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 页面表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cms_pages_slug (slug),
    INDEX idx_cms_pages_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 内容项表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT,
    field_key VARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL,
    content_zh TEXT,
    content_en TEXT,
    published_content_zh TEXT,
    published_content_en TEXT,
    published_at TIMESTAMP NULL,
    max_length INT,
    is_required TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    version INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cms_content_items_page_field (page_id, field_key),
    CONSTRAINT fk_cms_content_items_page FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE,
    INDEX idx_cms_content_items_page_id (page_id),
    INDEX idx_cms_content_items_field_key (field_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 内容版本表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_item_id BIGINT,
    version_number INT NOT NULL,
    content_zh TEXT,
    content_en TEXT,
    changed_by BIGINT,
    change_summary VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_content_versions_item FOREIGN KEY (content_item_id) REFERENCES cms_content_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_cms_content_versions_user FOREIGN KEY (changed_by) REFERENCES cms_admin_users(id),
    INDEX idx_cms_content_versions_item_id (content_item_id),
    INDEX idx_cms_content_versions_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 资源表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    is_processed TINYINT(1) DEFAULT 0,
    webp_converted TINYINT(1) DEFAULT 0,
    processing_status VARCHAR(20) DEFAULT 'pending',
    alt_text_zh VARCHAR(255),
    alt_text_en VARCHAR(255),
    uploaded_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_assets_uploader FOREIGN KEY (uploaded_by) REFERENCES cms_admin_users(id),
    INDEX idx_cms_assets_category (category),
    INDEX idx_cms_assets_created_at (created_at DESC),
    INDEX idx_cms_assets_processing_status (processing_status),
    INDEX idx_cms_assets_file_key (file_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 资源使用表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_asset_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT,
    usage_type VARCHAR(50) NOT NULL,
    usage_id BIGINT NOT NULL,
    field_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_asset_usages_asset FOREIGN KEY (asset_id) REFERENCES cms_assets(id) ON DELETE CASCADE,
    INDEX idx_cms_asset_usages_asset_id (asset_id),
    INDEX idx_cms_asset_usages_usage (usage_type, usage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 路线表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_zh VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    short_desc_zh TEXT,
    short_desc_en TEXT,
    full_desc_zh TEXT,
    full_desc_en TEXT,
    distance DECIMAL(10, 2),
    difficulty VARCHAR(20),
    duration INT,
    price DECIMAL(10, 2),
    cover_image_id BIGINT,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured TINYINT(1) DEFAULT 0,
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    created_by BIGINT,
    version INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_routes_cover_image FOREIGN KEY (cover_image_id) REFERENCES cms_assets(id),
    CONSTRAINT fk_cms_routes_creator FOREIGN KEY (created_by) REFERENCES cms_admin_users(id),
    INDEX idx_cms_routes_status (status),
    INDEX idx_cms_routes_featured (is_featured),
    INDEX idx_cms_routes_slug (slug),
    INDEX idx_cms_routes_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 路线图片表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_route_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT,
    asset_id BIGINT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_route_images_route FOREIGN KEY (route_id) REFERENCES cms_routes(id) ON DELETE CASCADE,
    CONSTRAINT fk_cms_route_images_asset FOREIGN KEY (asset_id) REFERENCES cms_assets(id) ON DELETE CASCADE,
    INDEX idx_cms_route_images_route_id (route_id),
    INDEX idx_cms_route_images_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 路线亮点表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_route_highlights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT,
    title_zh VARCHAR(100) NOT NULL,
    title_en VARCHAR(100) NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_route_highlights_route FOREIGN KEY (route_id) REFERENCES cms_routes(id) ON DELETE CASCADE,
    INDEX idx_cms_route_highlights_route_id (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 商品表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_zh VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    short_desc_zh TEXT,
    short_desc_en TEXT,
    full_desc_zh TEXT,
    full_desc_en TEXT,
    category VARCHAR(50),
    original_price DECIMAL(10, 2),
    current_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    cover_image_id BIGINT,
    merchant_name VARCHAR(100),
    merchant_address VARCHAR(255),
    merchant_contact VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    view_count INT DEFAULT 0,
    sale_count INT DEFAULT 0,
    created_by BIGINT,
    version INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_products_cover_image FOREIGN KEY (cover_image_id) REFERENCES cms_assets(id),
    CONSTRAINT fk_cms_products_creator FOREIGN KEY (created_by) REFERENCES cms_admin_users(id),
    INDEX idx_cms_products_status (status),
    INDEX idx_cms_products_slug (slug),
    INDEX idx_cms_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 商品图片表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    asset_id BIGINT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_product_images_product FOREIGN KEY (product_id) REFERENCES cms_products(id) ON DELETE CASCADE,
    CONSTRAINT fk_cms_product_images_asset FOREIGN KEY (asset_id) REFERENCES cms_assets(id) ON DELETE CASCADE,
    INDEX idx_cms_product_images_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 合作伙伴表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_partners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    logo_id BIGINT,
    website_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    version INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_partners_logo FOREIGN KEY (logo_id) REFERENCES cms_assets(id),
    INDEX idx_cms_partners_type (type),
    INDEX idx_cms_partners_active (is_active),
    INDEX idx_cms_partners_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 系统设置表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description VARCHAR(255),
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_system_settings_updater FOREIGN KEY (updated_by) REFERENCES cms_admin_users(id),
    INDEX idx_cms_system_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CMS 操作日志表
-- ============================================
CREATE TABLE IF NOT EXISTS cms_operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cms_operation_logs_user FOREIGN KEY (user_id) REFERENCES cms_admin_users(id),
    INDEX idx_cms_operation_logs_user_id (user_id),
    INDEX idx_cms_operation_logs_action (action),
    INDEX idx_cms_operation_logs_resource (resource_type, resource_id),
    INDEX idx_cms_operation_logs_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
