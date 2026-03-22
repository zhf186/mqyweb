package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.ContentItemDTO;
import com.manqiyou.app.cms.dto.CreateContentItemRequest;
import com.manqiyou.app.cms.dto.PageWithContentDTO;
import com.manqiyou.app.cms.dto.PublishPageRequest;
import com.manqiyou.app.cms.dto.PublishPageResultDTO;
import com.manqiyou.app.cms.dto.UpdateContentRequest;
import com.manqiyou.app.cms.annotation.OperationLog;
import com.manqiyou.app.cms.entity.ContentVersion;
import com.manqiyou.app.cms.entity.Page;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.ContentService;
import com.manqiyou.app.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Content management controller.
 */
@RestController
@RequestMapping("/api/admin/content")
public class ContentController {

    private static final Logger log = LoggerFactory.getLogger(ContentController.class);

    @Autowired
    private ContentService contentService;

    @GetMapping("/pages")
    public Result<List<Page>> getAllPages() {
        List<Page> pages = contentService.getAllPages();
        return Result.success(pages);
    }

    @GetMapping("/pages/{pageId}")
    public Result<PageWithContentDTO> getPageWithContent(@PathVariable Long pageId) {
        PageWithContentDTO page = contentService.getPageWithContent(pageId);
        return Result.success(page);
    }

    @PostMapping("/pages/{pageId}/items")
    public Result<ContentItemDTO> ensureContentItem(@PathVariable Long pageId,
                                                    @Validated @RequestBody CreateContentItemRequest request) {
        ContentItemDTO item = contentService.ensureContentItem(
            pageId,
            request.getFieldKey(),
            request.getFieldType(),
            request.getContentZh(),
            request.getContentEn()
        );
        return Result.success(item);
    }

    @PutMapping("/items/{itemId}")
    public Result<ContentItemDTO> updateContentItem(@PathVariable Long itemId,
                                                    @Validated @RequestBody UpdateContentRequest request,
                                                    Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Updating content item {} by user {}", itemId, userId);

        ContentItemDTO updated = contentService.updateContentItem(itemId, request, userId);
        return Result.success(updated);
    }

    @PostMapping("/pages/{pageId}/publish")
    @OperationLog(action = "publish", resourceType = "page", description = "Publish CMS page content")
    public Result<PublishPageResultDTO> publishPage(@PathVariable Long pageId,
                                                    @Validated @RequestBody PublishPageRequest request,
                                                    Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Publishing page {} by user {}", pageId, userId);

        PublishPageResultDTO result = contentService.publishPage(pageId, request.getSummary(), userId);
        return Result.success(result);
    }

    @GetMapping("/items/{itemId}/versions")
    public Result<List<ContentVersion>> getVersionHistory(@PathVariable Long itemId) {
        List<ContentVersion> versions = contentService.getVersionHistory(itemId);
        return Result.success(versions);
    }

    @PostMapping("/items/{itemId}/restore")
    public Result<ContentItemDTO> restoreVersion(@PathVariable Long itemId,
                                                 @RequestParam(required = false) Long versionId,
                                                 @RequestBody(required = false) RestoreVersionRequest request,
                                                 Authentication authentication) {
        Long resolvedVersionId = versionId != null ? versionId : (request != null ? request.getVersionId() : null);
        if (resolvedVersionId == null) {
            return Result.error("versionId is required");
        }

        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Restoring content item {} to version {} by user {}", itemId, resolvedVersionId, userId);

        ContentItemDTO restored = contentService.restoreVersion(itemId, resolvedVersionId, userId);
        return Result.success(restored);
    }

    public static class RestoreVersionRequest {
        private Long versionId;

        public Long getVersionId() {
            return versionId;
        }

        public void setVersionId(Long versionId) {
            this.versionId = versionId;
        }
    }
}
