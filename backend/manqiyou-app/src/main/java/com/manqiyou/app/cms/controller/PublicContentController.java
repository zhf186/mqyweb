package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.ContentItemDTO;
import com.manqiyou.app.cms.dto.PageWithContentDTO;
import com.manqiyou.app.cms.entity.Page;
import com.manqiyou.app.cms.service.ContentService;
import com.manqiyou.app.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 鍏紑鍐呭API Controller
 * 涓嶉渶瑕佽璇侊紝渚涘墠绔〉闈㈣鍙朇MS鍐呭
 */
@RestController
@RequestMapping("/api/public/content")
public class PublicContentController {
    
    private static final Logger log = LoggerFactory.getLogger(PublicContentController.class);
    
    @Autowired
    private ContentService contentService;
    
    /**
     * 鏍规嵁椤甸潰slug鑾峰彇椤甸潰鍐呭
     * GET /api/public/content/pages/:slug
     */
    @GetMapping("/pages/{slug}")
    public Result<Map<String, String>> getPageContentBySlug(@PathVariable String slug) {
        log.info("鑾峰彇鍏紑椤甸潰鍐呭: slug={}", slug);
        
        try {
            // 鏍规嵁slug鏌ユ壘椤甸潰
            Page page = contentService.getPageBySlug(slug);
            if (page == null) {
                return Result.error("椤甸潰涓嶅瓨鍦? " + slug);
            }
            
            // 鑾峰彇椤甸潰鍐呭
            PageWithContentDTO pageContent = contentService.getPublishedPageWithContent(page.getId());
            
            // 杞崲涓簁ey-value鏍煎紡锛屾柟渚垮墠绔娇鐢?
            Map<String, String> content = new HashMap<>();
            for (ContentItemDTO item : pageContent.getContentItems()) {
                // 浣跨敤fieldKey浣滀负key锛屽悓鏃舵彁渚涗腑鑻辨枃鍐呭
                content.put(item.getFieldKey() + ".zh", item.getContentZh());
                content.put(item.getFieldKey() + ".en", item.getContentEn());
            }
            
            return Result.success(content);
        } catch (Exception e) {
            log.error("鑾峰彇椤甸潰鍐呭澶辫触: slug={}", slug, e);
            return Result.error("鑾峰彇椤甸潰鍐呭澶辫触");
        }
    }
    
    /**
     * 鎵归噺鑾峰彇澶氫釜椤甸潰鐨勫唴瀹?
     * GET /api/public/content/pages?slugs=home,about
     */
    @GetMapping("/pages")
    public Result<Map<String, Map<String, String>>> getMultiplePages(
            @RequestParam String slugs) {
        log.info("鎵归噺鑾峰彇椤甸潰鍐呭: slugs={}", slugs);
        
        try {
            String[] slugArray = slugs.split(",");
            Map<String, Map<String, String>> result = new HashMap<>();
            
            for (String slug : slugArray) {
                slug = slug.trim();
                Page page = contentService.getPageBySlug(slug);
                if (page != null) {
                    PageWithContentDTO pageContent = contentService.getPublishedPageWithContent(page.getId());
                    
                    Map<String, String> content = new HashMap<>();
                    for (ContentItemDTO item : pageContent.getContentItems()) {
                        content.put(item.getFieldKey() + ".zh", item.getContentZh());
                        content.put(item.getFieldKey() + ".en", item.getContentEn());
                    }
                    
                    result.put(slug, content);
                }
            }
            
            return Result.success(result);
        } catch (Exception e) {
            log.error("鎵归噺鑾峰彇椤甸潰鍐呭澶辫触", e);
            return Result.error("鎵归噺鑾峰彇椤甸潰鍐呭澶辫触");
        }
    }
}


