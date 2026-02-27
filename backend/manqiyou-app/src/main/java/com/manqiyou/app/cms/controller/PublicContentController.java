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
 * 公开内容API Controller
 * 不需要认证，供前端页面读取CMS内容
 */
@RestController
@RequestMapping("/api/public/content")
public class PublicContentController {
    
    private static final Logger log = LoggerFactory.getLogger(PublicContentController.class);
    
    @Autowired
    private ContentService contentService;
    
    /**
     * 根据页面slug获取页面内容
     * GET /api/public/content/pages/:slug
     */
    @GetMapping("/pages/{slug}")
    public Result<Map<String, String>> getPageContentBySlug(@PathVariable String slug) {
        log.info("获取公开页面内容: slug={}", slug);
        
        try {
            // 根据slug查找页面
            Page page = contentService.getPageBySlug(slug);
            if (page == null) {
                return Result.error("页面不存在: " + slug);
            }
            
            // 获取页面内容
            PageWithContentDTO pageContent = contentService.getPageWithContent(page.getId());
            
            // 转换为key-value格式，方便前端使用
            Map<String, String> content = new HashMap<>();
            for (ContentItemDTO item : pageContent.getContentItems()) {
                // 使用fieldKey作为key，同时提供中英文内容
                content.put(item.getFieldKey() + ".zh", item.getContentZh());
                content.put(item.getFieldKey() + ".en", item.getContentEn());
            }
            
            return Result.success(content);
        } catch (Exception e) {
            log.error("获取页面内容失败: slug={}", slug, e);
            return Result.error("获取页面内容失败");
        }
    }
    
    /**
     * 批量获取多个页面的内容
     * GET /api/public/content/pages?slugs=home,about
     */
    @GetMapping("/pages")
    public Result<Map<String, Map<String, String>>> getMultiplePages(
            @RequestParam String slugs) {
        log.info("批量获取页面内容: slugs={}", slugs);
        
        try {
            String[] slugArray = slugs.split(",");
            Map<String, Map<String, String>> result = new HashMap<>();
            
            for (String slug : slugArray) {
                slug = slug.trim();
                Page page = contentService.getPageBySlug(slug);
                if (page != null) {
                    PageWithContentDTO pageContent = contentService.getPageWithContent(page.getId());
                    
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
            log.error("批量获取页面内容失败", e);
            return Result.error("批量获取页面内容失败");
        }
    }
}
