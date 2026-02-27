package com.manqiyou.app.cms.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.manqiyou.app.cms.dto.AssetUploadRequest;
import com.manqiyou.app.cms.dto.AssetUploadResponse;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.entity.AssetUsage;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.AssetService;
import com.manqiyou.app.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Asset management controller.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/assets")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @GetMapping
    public Result<IPage<Asset>> listAssets(@RequestParam(required = false) String category,
                                           @RequestParam(required = false) String search,
                                           @RequestParam(defaultValue = "1") int page,
                                           @RequestParam(defaultValue = "20") int limit) {
        log.info("List assets category={}, search={}, page={}, limit={}", category, search, page, limit);
        IPage<Asset> assets = assetService.listAssets(category, search, page, limit);
        return Result.success(assets);
    }

    @GetMapping("/{assetId}")
    public Result<Asset> getAsset(@PathVariable Long assetId) {
        log.info("Get asset {}", assetId);
        Asset asset = assetService.getAssetById(assetId);
        return Result.success(asset);
    }

    @PostMapping("/upload")
    public Result<List<AssetUploadResponse>> uploadAssets(@RequestParam("files") List<MultipartFile> files,
                                                           @RequestParam String category,
                                                           @RequestParam(required = false) String altTextZh,
                                                           @RequestParam(required = false) String altTextEn,
                                                           @RequestParam(defaultValue = "true") Boolean autoProcess,
                                                           Authentication authentication) {
        log.info("Upload assets count={}, category={}", files.size(), category);

        try {
            if (files.size() > 20) {
                return Result.error("Batch upload supports up to 20 files.");
            }

            Long uploadedBy = AdminSecurityUtils.getCurrentUserId(authentication);

            AssetUploadRequest request = new AssetUploadRequest();
            request.setCategory(category);
            request.setAltTextZh(altTextZh);
            request.setAltTextEn(altTextEn);
            request.setAutoProcess(autoProcess);

            List<AssetUploadResponse> responses = assetService.uploadImages(files, request, uploadedBy);
            return Result.success(responses);
        } catch (Exception e) {
            log.error("Asset upload failed", e);
            return Result.error(e.getMessage() != null ? e.getMessage() : "Asset upload failed");
        }
    }

    @PutMapping("/{assetId}")
    public Result<Asset> replaceAsset(@PathVariable Long assetId,
                                      @RequestParam("file") MultipartFile file,
                                      Authentication authentication) {
        log.info("Replace asset {}", assetId);

        Long uploadedBy = AdminSecurityUtils.getCurrentUserId(authentication);
        Asset asset = assetService.replaceAsset(assetId, file, uploadedBy);
        return Result.success(asset);
    }

    @DeleteMapping("/{assetId}")
    public Result<Void> deleteAsset(@PathVariable Long assetId) {
        log.info("Delete asset {}", assetId);

        try {
            assetService.deleteAsset(assetId);
            return Result.success(null);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/{assetId}/usage")
    public Result<List<AssetUsage>> getAssetUsage(@PathVariable Long assetId) {
        log.info("Get asset usage {}", assetId);
        List<AssetUsage> usages = assetService.getAssetUsages(assetId);
        return Result.success(usages);
    }
}