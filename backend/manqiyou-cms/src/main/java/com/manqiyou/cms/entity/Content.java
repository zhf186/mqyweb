package com.manqiyou.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 内容实体
 */
@Data
@TableName(value = "content", autoResultMap = true)
public class Content {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 类型: banner, news, activity
     */
    private String type;

    private String title;

    private String titleEn;

    private String content;

    private String contentEn;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> images;

    private Boolean isActive;

    private Integer sortOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
