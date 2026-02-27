package com.manqiyou.app.cms.dto;

import lombok.Data;

/**
 * 资源上传请求DTO
 */
@Data
public class AssetUploadRequest {
    
    /**
     * 资源分类
     */
    private String category;
    
    /**
     * 中文替代文本
     */
    private String altTextZh;
    
    /**
     * 英文替代文本
     */
    private String altTextEn;
    
    /**
     * 是否自动处理图片（生成多尺寸）
     */
    private Boolean autoProcess = true;
}
