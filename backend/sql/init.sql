-- 漫骑游数据库初始化脚本
-- PostgreSQL

-- 创建数据库（如果不存在）
-- CREATE DATABASE manqiyou;

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id VARCHAR(36) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    nickname VARCHAR(50),
    avatar VARCHAR(500),
    wechat_open_id VARCHAR(100) UNIQUE,
    member_level_id VARCHAR(36),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 会员等级表
CREATE TABLE IF NOT EXISTS member_level (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    min_points INTEGER NOT NULL,
    benefits JSONB
);

-- 线路分类表
CREATE TABLE IF NOT EXISTS route_category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 线路表
CREATE TABLE IF NOT EXISTS route (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    subtitle VARCHAR(500),
    description TEXT,
    description_en TEXT,
    images JSONB,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    difficulty VARCHAR(20),
    highlights JSONB,
    highlights_en JSONB,
    category_id VARCHAR(36) REFERENCES route_category(id),
    max_participants INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 线路排期表
CREATE TABLE IF NOT EXISTS route_schedule (
    id VARCHAR(36) PRIMARY KEY,
    route_id VARCHAR(36) REFERENCES route(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    available_spots INTEGER NOT NULL,
    UNIQUE(route_id, schedule_date)
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) REFERENCES sys_user(id),
    route_id VARCHAR(36) REFERENCES route(id),
    schedule_id VARCHAR(36) REFERENCES route_schedule(id),
    participants INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20),
    payment_time TIMESTAMP,
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 积分记录表
CREATE TABLE IF NOT EXISTS points_record (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES sys_user(id),
    amount INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('earn', 'spend')),
    source VARCHAR(50),
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorite (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES sys_user(id),
    route_id VARCHAR(36) REFERENCES route(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, route_id)
);

-- 内容管理表
CREATE TABLE IF NOT EXISTS content (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('banner', 'news', 'activity')),
    title VARCHAR(200),
    title_en VARCHAR(200),
    content TEXT,
    content_en TEXT,
    images JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admin (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 好物表
CREATE TABLE IF NOT EXISTS goods (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    description TEXT,
    description_en TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('clothing', 'food', 'accommodation', 'transportation', 'entertainment')),
    images JSONB,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 合作伙伴表
CREATE TABLE IF NOT EXISTS partner (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    logo VARCHAR(500),
    description TEXT,
    description_en TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('government', 'enterprise', 'alliance', 'franchise')),
    website VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_phone ON sys_user(phone);
CREATE INDEX IF NOT EXISTS idx_user_wechat ON sys_user(wechat_open_id);
CREATE INDEX IF NOT EXISTS idx_route_category ON route(category_id);
CREATE INDEX IF NOT EXISTS idx_route_active ON route(is_active);
CREATE INDEX IF NOT EXISTS idx_schedule_route ON route_schedule(route_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date ON route_schedule(schedule_date);
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_points_user ON points_record(user_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_goods_category ON goods(category);
CREATE INDEX IF NOT EXISTS idx_partner_type ON partner(type);

-- 插入默认会员等级
INSERT INTO member_level (id, name, min_points, benefits) VALUES
    ('level-1', '骑行新手', 0, '["基础会员权益", "积分累计"]'),
    ('level-2', '骑行达人', 1000, '["9.5折优惠", "优先预订", "专属客服"]'),
    ('level-3', '骑行大师', 5000, '["9折优惠", "免费升级", "专属活动邀请"]'),
    ('level-4', '骑行传奇', 20000, '["8.5折优惠", "VIP专属线路", "年度骑行礼包"]')
ON CONFLICT (id) DO NOTHING;

-- 插入默认线路分类
INSERT INTO route_category (id, name, name_en, slug, description) VALUES
    ('cat-1', '环湖骑行', 'Lake Cycling', 'lake-cycling', '环绕湖泊的骑行线路'),
    ('cat-2', '古镇探访', 'Ancient Town', 'ancient-town', '探访历史古镇的骑行线路'),
    ('cat-3', '山地挑战', 'Mountain Challenge', 'mountain-challenge', '山地骑行挑战线路'),
    ('cat-4', '海岸风光', 'Coastal Scenery', 'coastal-scenery', '沿海岸线的骑行线路'),
    ('cat-5', '田园风光', 'Countryside', 'countryside', '田园乡村骑行线路')
ON CONFLICT (id) DO NOTHING;

-- 插入默认管理员（密码: admin123，实际使用时需要加密）
INSERT INTO admin (id, username, password, name, role) VALUES
    ('admin-1', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 'admin')
ON CONFLICT (id) DO NOTHING;
