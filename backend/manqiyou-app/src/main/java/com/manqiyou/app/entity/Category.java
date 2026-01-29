package com.manqiyou.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.time.LocalDateTime;

/**
 * 线路分类实体
 */
@TableName("categories")
public class Category {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String nameEn;
    private String icon;
    private Integer sortOrder;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
