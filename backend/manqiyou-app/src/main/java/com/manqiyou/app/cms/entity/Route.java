package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * CMS路线实体
 * 对应数据库表: cms_routes
 */
@TableName("cms_routes")
public class Route {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 路线名称(中文)
     */
    private String nameZh;
    
    /**
     * 路线名称(英文)
     */
    private String nameEn;
    
    /**
     * URL slug
     */
    private String slug;
    
    /**
     * 简短描述(中文)
     */
    private String shortDescZh;
    
    /**
     * 简短描述(英文)
     */
    private String shortDescEn;
    
    /**
     * 完整描述(中文)
     */
    private String fullDescZh;
    
    /**
     * 完整描述(英文)
     */
    private String fullDescEn;
    
    /**
     * 距离(公里)
     */
    private BigDecimal distance;
    
    /**
     * 难度等级 (easy, medium, hard)
     */
    private String difficulty;
    
    /**
     * 预计时间(分钟)
     */
    private Integer duration;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 封面图片ID
     */
    private Long coverImageId;
    
    /**
     * 状态 (draft, published, archived)
     */
    private String status;
    
    /**
     * 是否精选
     */
    private Boolean isFeatured;
    
    /**
     * 浏览量
     */
    private Integer viewCount;
    
    /**
     * 预订量
     */
    private Integer bookingCount;
    
    /**
     * 创建人ID
     */
    private Long createdBy;
    
    /**
     * 版本号(用于乐观锁)
     */
    @Version
    private Integer version;
    
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
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNameZh() { return nameZh; }
    public void setNameZh(String nameZh) { this.nameZh = nameZh; }
    
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getShortDescZh() { return shortDescZh; }
    public void setShortDescZh(String shortDescZh) { this.shortDescZh = shortDescZh; }
    
    public String getShortDescEn() { return shortDescEn; }
    public void setShortDescEn(String shortDescEn) { this.shortDescEn = shortDescEn; }
    
    public String getFullDescZh() { return fullDescZh; }
    public void setFullDescZh(String fullDescZh) { this.fullDescZh = fullDescZh; }
    
    public String getFullDescEn() { return fullDescEn; }
    public void setFullDescEn(String fullDescEn) { this.fullDescEn = fullDescEn; }
    
    public BigDecimal getDistance() { return distance; }
    public void setDistance(BigDecimal distance) { this.distance = distance; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Long getCoverImageId() { return coverImageId; }
    public void setCoverImageId(Long coverImageId) { this.coverImageId = coverImageId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public Integer getBookingCount() { return bookingCount; }
    public void setBookingCount(Integer bookingCount) { this.bookingCount = bookingCount; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
