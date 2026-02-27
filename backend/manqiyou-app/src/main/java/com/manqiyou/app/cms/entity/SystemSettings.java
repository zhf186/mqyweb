package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 系统设置实体
 */
@Data
@TableName("cms_system_settings")
public class SystemSettings {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 设置键
     */
    private String settingKey;
    
    /**
     * 设置值
     */
    private String settingValue;
    
    /**
     * 设置类型: string, number, boolean, json
     */
    private String settingType;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 更新人ID
     */
    private Long updatedBy;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
