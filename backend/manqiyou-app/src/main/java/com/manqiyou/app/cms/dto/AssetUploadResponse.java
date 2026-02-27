package com.manqiyou.app.cms.dto;

import com.manqiyou.app.cms.entity.Asset;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 资源上传响应DTO
 */
@Data
public class AssetUploadResponse {
    
    /**
     * 资源实体
     */
    private Asset asset;
    
    /**
     * 处理后的各尺寸URL
     */
    private Map<String, String> processedSizes = new HashMap<>();
    
    public AssetUploadResponse(Asset asset) {
        this.asset = asset;
        
        // 填充各尺寸URL
        if (asset.getFileUrl() != null) {
            processedSizes.put("original", asset.getFileUrl());
        }
        if (asset.getLargeUrl() != null) {
            processedSizes.put("large", asset.getLargeUrl());
        }
        if (asset.getMediumUrl() != null) {
            processedSizes.put("medium", asset.getMediumUrl());
        }
        if (asset.getSmallUrl() != null) {
            processedSizes.put("small", asset.getSmallUrl());
        }
        if (asset.getThumbnailUrl() != null) {
            processedSizes.put("thumbnail", asset.getThumbnailUrl());
        }
    }
}
