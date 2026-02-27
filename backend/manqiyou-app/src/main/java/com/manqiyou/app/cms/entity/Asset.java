package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 资源实体 - 管理网站图片资源
 */
@Data
@TableName("cms_assets")
public class Asset {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 资源分类：hero, brand, ebike, route, goods, community, partner, cities
     */
    private String category;
    
    /**
     * 原始文件名
     */
    private String originalFilename;
    
    /**
     * OSS存储键
     */
    private String fileKey;
    
    /**
     * 原图URL
     */
    private String fileUrl;
    
    /**
     * 大图URL (1920px)
     */
    private String largeUrl;
    
    /**
     * 中图URL (1024px)
     */
    private String mediumUrl;
    
    /**
     * 小图URL (640px)
     */
    private String smallUrl;
    
    /**
     * 缩略图URL (200px)
     */
    private String thumbnailUrl;
    
    /**
     * 文件大小（字节）
     */
    private Long fileSize;
    
    /**
     * 原图宽度
     */
    private Integer width;
    
    /**
     * 原图高度
     */
    private Integer height;
    
    /**
     * MIME类型
     */
    private String mimeType;
    
    /**
     * 是否已处理
     */
    private Boolean isProcessed;
    
    /**
     * 是否已转换为WebP
     */
    private Boolean webpConverted;
    
    /**
     * 处理状态：pending, processing, completed, failed
     */
    private String processingStatus;
    
    /**
     * 中文替代文本
     */
    private String altTextZh;
    
    /**
     * 英文替代文本
     */
    private String altTextEn;
    
    /**
     * 上传者ID
     */
    private Long uploadedBy;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
