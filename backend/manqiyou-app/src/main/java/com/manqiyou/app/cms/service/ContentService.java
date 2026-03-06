package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.dto.ContentItemDTO;
import com.manqiyou.app.cms.dto.PageWithContentDTO;
import com.manqiyou.app.cms.dto.UpdateContentRequest;
import com.manqiyou.app.cms.entity.ContentItem;
import com.manqiyou.app.cms.entity.ContentVersion;
import com.manqiyou.app.cms.entity.Page;
import com.manqiyou.app.cms.exception.ConcurrentModificationException;
import com.manqiyou.app.cms.mapper.ContentItemMapper;
import com.manqiyou.app.cms.mapper.ContentVersionMapper;
import com.manqiyou.app.cms.mapper.PageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * CMS content service.
 */
@Service
public class ContentService {

    private static final Logger log = LoggerFactory.getLogger(ContentService.class);

    private static final Set<String> SUPPORTED_FIELD_TYPES = Set.of("text", "textarea", "richtext");

    private static final List<PageSeed> DEFAULT_PAGE_SEEDS = List.of(
        new PageSeed("home", "首页", "Home", "Website home page"),
        new PageSeed("ebike", "E-BIKE页面", "E-BIKE Page", "E-bike product page"),
        new PageSeed("routes", "路线页面", "Routes Page", "Route list and details page"),
        new PageSeed("goods", "在地好物", "Goods Page", "Goods and products page"),
        new PageSeed("community", "社群活动", "Community Page", "Community activities page"),
        new PageSeed("partners", "合作伙伴", "Partners Page", "Partners page"),
        new PageSeed("about", "关于我们", "About Page", "About us page"),
        new PageSeed("community-events", "社群活动子页", "Community Events Page", "Community events page"),
        new PageSeed("careers", "招贤纳士", "Careers Page", "Careers page"),
        new PageSeed("contact", "联系我们", "Contact Page", "Contact page"),
        new PageSeed("faq", "常见问题", "FAQ Page", "FAQ page"),
        new PageSeed("privacy", "隐私政策", "Privacy Page", "Privacy policy page"),
        new PageSeed("terms", "服务条款", "Terms Page", "Terms of service page")
    );

    private static final Map<String, List<ContentItemSeed>> DEFAULT_CONTENT_SEEDS = Map.ofEntries(
        Map.entry("home", List.of(
            new ContentItemSeed("common.brand", "text", 100),
            new ContentItemSeed("common.slogan", "text", 200),
            new ContentItemSeed("hero.background.image", "text", 500),
            new ContentItemSeed("home.brand.badge", "text", 100),
            new ContentItemSeed("home.cta.title", "text", 200)
        )),
        Map.entry("ebike", List.of(
            new ContentItemSeed("ebike.hero.background", "text", 500),
            new ContentItemSeed("ebikePage.heroTitle", "text", 200),
            new ContentItemSeed("ebikePage.heroSubtitle", "text", 300),
            new ContentItemSeed("ebikePage.intro.title", "text", 200),
            new ContentItemSeed("ebikePage.cta.title", "text", 200)
        )),
        Map.entry("routes", List.of(
            new ContentItemSeed("routes.hero.background", "text", 500),
            new ContentItemSeed("routesPage.heroBadge", "text", 100),
            new ContentItemSeed("routesPage.heroTitle", "text", 200),
            new ContentItemSeed("routesPage.heroDesc", "textarea", 1000),
            new ContentItemSeed("routesPage.features.badge", "text", 100),
            new ContentItemSeed("routesPage.features.title", "text", 200),
            new ContentItemSeed("routesPage.gallery.badge", "text", 100),
            new ContentItemSeed("routesPage.gallery.title", "text", 200),
            new ContentItemSeed("routesPage.gallery.desc", "textarea", 1000),
            new ContentItemSeed("routesPage.customCta.title", "text", 200),
            new ContentItemSeed("routesPage.customCta.desc", "textarea", 1000),
            new ContentItemSeed("routesPage.customCta.button", "text", 100),
            new ContentItemSeed("routesPage.browseMore", "text", 100)
        )),
        Map.entry("goods", List.of(
            new ContentItemSeed("goods.hero.background", "text", 500),
            new ContentItemSeed("goodsPage.heroBadge", "text", 100),
            new ContentItemSeed("goodsPage.heroTitle", "text", 200),
            new ContentItemSeed("goodsPage.heroDesc", "textarea", 1000),
            new ContentItemSeed("goodsPage.feature.title", "text", 200)
        )),
        Map.entry("community", List.of(
            new ContentItemSeed("community.hero.background", "text", 500),
            new ContentItemSeed("communityPage.heroTitle", "text", 200),
            new ContentItemSeed("communityPage.heroDesc", "textarea", 1000),
            new ContentItemSeed("communityPage.intro.title", "text", 200),
            new ContentItemSeed("communityPage.cta.title", "text", 200)
        )),
        Map.entry("partners", List.of(
            new ContentItemSeed("partners.hero.background", "text", 500),
            new ContentItemSeed("partnersPage.heroTitle", "text", 200),
            new ContentItemSeed("partnersPage.heroDesc", "textarea", 1000),
            new ContentItemSeed("partnersPage.types.title", "text", 200),
            new ContentItemSeed("partnersPage.cta.title", "text", 200)
        )),
        Map.entry("about", List.of(
            new ContentItemSeed("about.hero.background", "text", 500),
            new ContentItemSeed("about.hero.title", "text", 200),
            new ContentItemSeed("about.hero.subtitle", "textarea", 1000),
            new ContentItemSeed("about.story.title", "text", 200),
            new ContentItemSeed("about.cta.title", "text", 200)
        )),
        Map.entry("community-events", List.of(
            new ContentItemSeed("communityEventsPage.title", "text", 200),
            new ContentItemSeed("communityEventsPage.desc", "textarea", 1000)
        )),
        Map.entry("careers", List.of(
            new ContentItemSeed("careersPage.title", "text", 200),
            new ContentItemSeed("careersPage.desc", "textarea", 1000),
            new ContentItemSeed("careersPage.backHome", "text", 100)
        )),
        Map.entry("contact", List.of(
            new ContentItemSeed("contactPage.title", "text", 200),
            new ContentItemSeed("contactPage.desc", "textarea", 1000),
            new ContentItemSeed("contactPage.backHome", "text", 100)
        )),
        Map.entry("faq", List.of(
            new ContentItemSeed("faqPage.title", "text", 200),
            new ContentItemSeed("faqPage.desc", "textarea", 1000),
            new ContentItemSeed("faqPage.backHome", "text", 100)
        )),
        Map.entry("privacy", List.of(
            new ContentItemSeed("privacyPage.heroTitle", "text", 200),
            new ContentItemSeed("privacyPage.lastUpdated", "text", 200),
            new ContentItemSeed("privacyPage.introLine1", "textarea", 1000),
            new ContentItemSeed("privacyPage.introLine2", "textarea", 1000),
            new ContentItemSeed("privacyPage.sections.collect.title", "text", 200),
            new ContentItemSeed("privacyPage.sections.contact.title", "text", 200),
            new ContentItemSeed("privacyPage.contact.email", "text", 200),
            new ContentItemSeed("privacyPage.contact.phone", "text", 100)
        )),
        Map.entry("terms", List.of(
            new ContentItemSeed("termsPage.heroTitle", "text", 200),
            new ContentItemSeed("termsPage.lastUpdated", "text", 200),
            new ContentItemSeed("termsPage.introLine1", "textarea", 1000),
            new ContentItemSeed("termsPage.introLine2", "textarea", 1000),
            new ContentItemSeed("termsPage.sections.service.title", "text", 200),
            new ContentItemSeed("termsPage.sections.safety.title", "text", 200),
            new ContentItemSeed("termsPage.sections.contact.title", "text", 200),
            new ContentItemSeed("termsPage.contact.email", "text", 200),
            new ContentItemSeed("termsPage.contact.phone", "text", 100)
        ))
    );

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    private ContentItemMapper contentItemMapper;

    @Autowired
    private ContentVersionMapper contentVersionMapper;

    /**
     * Get all pages.
     */
    public List<Page> getAllPages() {
        ensureDefaultPages();
        LambdaQueryWrapper<Page> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Page::getIsActive, true)
            .orderByAsc(Page::getId);
        return pageMapper.selectList(wrapper);
    }

    /**
     * Get page by id.
     */
    public Page getPageById(Long pageId) {
        Page page = pageMapper.selectById(pageId);
        if (page == null) {
            throw new RuntimeException("濠碉紕鍋戦崐妤呭极鐠囧樊鐒介柣妤€鐗忛埢鏃傗偓骞垮劚閹虫劙骞楅悩缁樼厱? " + pageId);
        }
        return page;
    }

    /**
     * Get page by slug.
     */
    public Page getPageBySlug(String slug) {
        ensureDefaultPages();
        LambdaQueryWrapper<Page> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Page::getSlug, slug)
            .eq(Page::getIsActive, true);
        return pageMapper.selectOne(wrapper);
    }

    /**
     * Get page with all content items.
     */
    public PageWithContentDTO getPageWithContent(Long pageId) {
        Page page = getPageById(pageId);
        ensureDefaultContentItems(page);

        LambdaQueryWrapper<ContentItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentItem::getPageId, pageId)
            .orderByAsc(ContentItem::getDisplayOrder)
            .orderByAsc(ContentItem::getId);
        List<ContentItem> contentItems = contentItemMapper.selectList(wrapper);

        PageWithContentDTO dto = new PageWithContentDTO();
        BeanUtils.copyProperties(page, dto);
        dto.setContentItems(contentItems.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList()));
        return dto;
    }

    /**
     * Create the content item if it is missing; otherwise return existing item.
     */
    @Transactional(rollbackFor = Exception.class)
    public ContentItemDTO ensureContentItem(Long pageId,
                                            String fieldKey,
                                            String fieldType,
                                            String contentZh,
                                            String contentEn) {
        if (fieldKey == null || fieldKey.isBlank()) {
            throw new RuntimeException("fieldKey cannot be blank");
        }

        Page page = getPageById(pageId);
        ensureDefaultContentItems(page);

        ContentItem existing = findContentItemByPageAndFieldKey(pageId, fieldKey);
        if (existing != null) {
            return convertToDTO(existing);
        }

        ContentItem item = new ContentItem();
        item.setPageId(pageId);
        item.setFieldKey(fieldKey);
        item.setFieldType(normalizeFieldType(fieldType));
        item.setContentZh(contentZh == null ? "" : contentZh);
        item.setContentEn(contentEn == null ? "" : contentEn);
        item.setMaxLength(2000);
        item.setIsRequired(false);
        item.setDisplayOrder(resolveNextDisplayOrder(pageId));
        item.setVersion(0);

        try {
            contentItemMapper.insert(item);
            log.info("Created missing content item: pageId={}, fieldKey={}", pageId, fieldKey);
            return convertToDTO(item);
        } catch (Exception ex) {
            ContentItem concurrent = findContentItemByPageAndFieldKey(pageId, fieldKey);
            if (concurrent != null) {
                return convertToDTO(concurrent);
            }
            throw ex;
        }
    }

    /**
     * Get content item by id.
     */
    public ContentItem getContentItemById(Long itemId) {
        ContentItem item = contentItemMapper.selectById(itemId);
        if (item == null) {
            throw new RuntimeException("闂備礁鎲￠崝鏇㈠箠鎼搭煈鏁婇柟閭﹀幑娴滄粓姊洪锝囥€掗柣鐔哥箞閹鈽夊▍顓т簻閿? " + itemId);
        }
        return item;
    }

    /**
     * Update content item and create version history.
     */
    @Transactional(rollbackFor = Exception.class)
    public ContentItemDTO updateContentItem(Long itemId, UpdateContentRequest request, Long userId) {
        log.info("Updating content item: itemId={}, userId={}", itemId, userId);

        ContentItem currentItem = getContentItemById(itemId);

        if (!currentItem.getVersion().equals(request.getVersion())) {
            throw new ConcurrentModificationException("Content was modified by another user. Please refresh and retry.");
        }

        createVersionRecord(currentItem, userId, request.getChangeSummary());

        currentItem.setContentZh(request.getContentZh());
        currentItem.setContentEn(request.getContentEn());

        int updated = contentItemMapper.updateById(currentItem);
        if (updated == 0) {
            throw new ConcurrentModificationException("Update failed, content may have been modified by another user.");
        }

        ContentItem updatedItem = getContentItemById(itemId);
        log.info("Content item updated: itemId={}, version={}", itemId, updatedItem.getVersion());
        return convertToDTO(updatedItem);
    }

    /**
     * Get content item version history.
     */
    public List<ContentVersion> getVersionHistory(Long itemId) {
        LambdaQueryWrapper<ContentVersion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentVersion::getContentItemId, itemId)
            .orderByDesc(ContentVersion::getVersionNumber);
        return contentVersionMapper.selectList(wrapper);
    }

    /**
     * Restore content item to specific version.
     */
    @Transactional(rollbackFor = Exception.class)
    public ContentItemDTO restoreVersion(Long itemId, Long versionId, Long userId) {
        log.info("Restoring version: itemId={}, versionId={}, userId={}", itemId, versionId, userId);

        ContentVersion targetVersion = contentVersionMapper.selectById(versionId);
        if (targetVersion == null || !targetVersion.getContentItemId().equals(itemId)) {
            throw new RuntimeException("Version does not exist");
        }

        ContentItem currentItem = getContentItemById(itemId);
        createVersionRecord(currentItem, userId, "闂備浇顕栭崢褰掑垂瑜版崵鍥蓟閵夈儳顦梺瑙勵問閸犳牠銆傛總鍛婄厸?" + targetVersion.getVersionNumber());

        currentItem.setContentZh(targetVersion.getContentZh());
        currentItem.setContentEn(targetVersion.getContentEn());
        contentItemMapper.updateById(currentItem);

        ContentItem updatedItem = getContentItemById(itemId);
        return convertToDTO(updatedItem);
    }

    private void createVersionRecord(ContentItem item, Long userId, String changeSummary) {
        LambdaQueryWrapper<ContentVersion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentVersion::getContentItemId, item.getId())
            .orderByDesc(ContentVersion::getVersionNumber)
            .last("LIMIT 1");
        ContentVersion latestVersion = contentVersionMapper.selectOne(wrapper);

        int nextVersionNumber = (latestVersion != null) ? latestVersion.getVersionNumber() + 1 : 1;

        ContentVersion version = new ContentVersion();
        version.setContentItemId(item.getId());
        version.setVersionNumber(nextVersionNumber);
        version.setContentZh(item.getContentZh());
        version.setContentEn(item.getContentEn());
        version.setChangedBy(userId);
        version.setChangeSummary(changeSummary != null ? changeSummary : "Content update");
        contentVersionMapper.insert(version);
    }

    private void ensureDefaultPages() {
        List<Page> existingPages = pageMapper.selectList(new LambdaQueryWrapper<>());
        Set<String> existingSlugs = existingPages.stream()
            .map(Page::getSlug)
            .collect(Collectors.toSet());

        List<PageSeed> missingPages = DEFAULT_PAGE_SEEDS.stream()
            .filter(seed -> !existingSlugs.contains(seed.slug))
            .collect(Collectors.toList());

        for (PageSeed seed : missingPages) {
            Page page = new Page();
            page.setSlug(seed.slug);
            page.setNameZh(seed.nameZh);
            page.setNameEn(seed.nameEn);
            page.setDescription(seed.description);
            page.setIsActive(true);
            pageMapper.insert(page);
        }

        if (!missingPages.isEmpty()) {
            log.info("Initialized missing CMS pages: {}",
                missingPages.stream().map(seed -> seed.slug).collect(Collectors.joining(", ")));
        }

        List<Page> allPages = missingPages.isEmpty()
            ? existingPages
            : pageMapper.selectList(new LambdaQueryWrapper<>());

        Map<String, PageSeed> seedBySlug = DEFAULT_PAGE_SEEDS.stream()
            .collect(Collectors.toMap(seed -> seed.slug, seed -> seed));

        int normalizedCount = 0;
        for (Page page : allPages) {
            PageSeed seed = seedBySlug.get(page.getSlug());
            if (seed == null) {
                continue;
            }

            if (shouldNormalizeZhName(page.getNameZh(), seed.nameZh)) {
                page.setNameZh(seed.nameZh);
                pageMapper.updateById(page);
                normalizedCount++;
            }
        }

        if (normalizedCount > 0) {
            log.info("Normalized {} CMS page Chinese names.", normalizedCount);
        }
    }

    private boolean shouldNormalizeZhName(String currentNameZh, String targetNameZh) {
        if (currentNameZh == null || currentNameZh.isBlank()) {
            return true;
        }
        if (currentNameZh.equals(targetNameZh)) {
            return false;
        }
        return isAsciiOnly(currentNameZh);
    }

    private boolean isAsciiOnly(String value) {
        for (int i = 0; i < value.length(); i++) {
            if (value.charAt(i) > 127) {
                return false;
            }
        }
        return true;
    }

    private void ensureDefaultContentItems(Page page) {
        List<ContentItemSeed> seeds = DEFAULT_CONTENT_SEEDS.get(page.getSlug());
        if (seeds == null || seeds.isEmpty()) {
            return;
        }

        Set<String> existingFieldKeys = contentItemMapper.selectList(new LambdaQueryWrapper<ContentItem>()
                .eq(ContentItem::getPageId, page.getId())
                .select(ContentItem::getFieldKey))
            .stream()
            .map(ContentItem::getFieldKey)
            .collect(Collectors.toSet());

        int nextDisplayOrder = resolveNextDisplayOrder(page.getId());
        List<String> insertedKeys = new ArrayList<>();

        for (ContentItemSeed seed : seeds) {
            if (existingFieldKeys.contains(seed.fieldKey)) {
                continue;
            }

            ContentItem item = new ContentItem();
            item.setPageId(page.getId());
            item.setFieldKey(seed.fieldKey);
            item.setFieldType(seed.fieldType);
            item.setContentZh("");
            item.setContentEn("");
            item.setMaxLength(seed.maxLength);
            item.setIsRequired(false);
            item.setDisplayOrder(nextDisplayOrder++);
            item.setVersion(0);
            contentItemMapper.insert(item);
            insertedKeys.add(seed.fieldKey);
        }

        if (!insertedKeys.isEmpty()) {
            log.info("Initialized missing CMS content items for page {}: {}",
                page.getSlug(), String.join(", ", insertedKeys));
        }
    }

    private ContentItem findContentItemByPageAndFieldKey(Long pageId, String fieldKey) {
        LambdaQueryWrapper<ContentItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentItem::getPageId, pageId)
            .eq(ContentItem::getFieldKey, fieldKey)
            .last("LIMIT 1");
        return contentItemMapper.selectOne(wrapper);
    }

    private int resolveNextDisplayOrder(Long pageId) {
        LambdaQueryWrapper<ContentItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentItem::getPageId, pageId)
            .orderByDesc(ContentItem::getDisplayOrder)
            .last("LIMIT 1");
        ContentItem last = contentItemMapper.selectOne(wrapper);
        if (last == null || last.getDisplayOrder() == null) {
            return 1;
        }
        return last.getDisplayOrder() + 1;
    }

    private String normalizeFieldType(String fieldType) {
        if (fieldType == null || fieldType.isBlank()) {
            return "text";
        }
        String normalized = fieldType.trim().toLowerCase();
        return SUPPORTED_FIELD_TYPES.contains(normalized) ? normalized : "text";
    }

    private ContentItemDTO convertToDTO(ContentItem item) {
        ContentItemDTO dto = new ContentItemDTO();
        BeanUtils.copyProperties(item, dto);
        return dto;
    }

    private static class PageSeed {
        private final String slug;
        private final String nameZh;
        private final String nameEn;
        private final String description;

        private PageSeed(String slug, String nameZh, String nameEn, String description) {
            this.slug = slug;
            this.nameZh = nameZh;
            this.nameEn = nameEn;
            this.description = description;
        }
    }

    private static class ContentItemSeed {
        private final String fieldKey;
        private final String fieldType;
        private final Integer maxLength;

        private ContentItemSeed(String fieldKey, String fieldType, Integer maxLength) {
            this.fieldKey = fieldKey;
            this.fieldType = fieldType;
            this.maxLength = maxLength;
        }
    }
}
