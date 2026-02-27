package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 资源使用记录实体 - 跟踪资源在哪里被使用
 */
@Data
@TableName("cms_asset_usages")
public class AssetUsage {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 资源ID
     */
    private Long assetId;
    
    /**
     * 使用类型：page_content, route, product, partner等
     */
    private String usageType;
    
    /**
     * 使用实体的ID
     */
    private Long usageId;
    
    /**
     * 使用的字段名称
     */
    private String fieldName;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 构造函数
     */
    public AssetUsage() {
    }
    
    /**
     * 便捷构造函数
     */
    public AssetUsage(Long assetId, String usageType, Long usageId) {
        this.assetId = assetId;
        this.usageType = usageType;
        this.usageId = usageId;
    }
    
    /**
     * 完整构造函数
     */
    public AssetUsage(Long assetId, String usageType, Long usageId, String fieldName) {
        this.assetId = assetId;
        this.usageType = usageType;
        this.usageId = usageId;
        this.fieldName = fieldName;
    }
}
