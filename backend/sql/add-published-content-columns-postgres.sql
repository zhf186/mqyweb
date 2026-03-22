ALTER TABLE cms_content_items
    ADD COLUMN IF NOT EXISTS published_content_zh TEXT,
    ADD COLUMN IF NOT EXISTS published_content_en TEXT,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

UPDATE cms_content_items
SET published_content_zh = COALESCE(published_content_zh, content_zh),
    published_content_en = COALESCE(published_content_en, content_en),
    published_at = COALESCE(published_at, CURRENT_TIMESTAMP)
WHERE published_at IS NULL;
