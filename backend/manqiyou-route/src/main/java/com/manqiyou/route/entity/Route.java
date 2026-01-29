package com.manqiyou.route.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 线路实体
 */
@Data
@TableName(value = "route", autoResultMap = true)
public class Route {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String title;

    private String titleEn;

    private String subtitle;

    private String description;

    private String descriptionEn;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> images;

    private BigDecimal price;

    private String duration;

    private String difficulty;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> highlights;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> highlightsEn;

    private String categoryId;

    private Integer maxParticipants;

    private Boolean isActive;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
