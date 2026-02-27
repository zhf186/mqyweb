package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * CMS商品实体
 * 对应数据库表: cms_products
 */
@TableName("cms_products")
public class Product {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 商品名称(中文)
     */
    private String nameZh;
    
    /**
     * 商品名称(英文)
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
     * 分类 (衣、食、住、行、乐)
     */
    private String category;
    
    /**
     * 原价
     */
    private BigDecimal originalPrice;
    
    /**
     * 现价
     */
    private BigDecimal currentPrice;
    
    /**
     * 库存数量
     */
    private Integer stockQuantity;
    
    /**
     * 封面图片ID
     */
    private Long coverImageId;
    
    /**
     * 商家名称
     */
    private String merchantName;
    
    /**
     * 商家地址
     */
    private String merchantAddress;
    
    /**
     * 商家联系方式
     */
    private String merchantContact;
    
    /**
     * 状态 (draft, active, inactive)
     */
    private String status;
    
    /**
     * 浏览量
     */
    private Integer viewCount;
    
    /**
     * 销售量
     */
    private Integer saleCount;
    
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
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public Long getCoverImageId() { return coverImageId; }
    public void setCoverImageId(Long coverImageId) { this.coverImageId = coverImageId; }
    
    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    
    public String getMerchantAddress() { return merchantAddress; }
    public void setMerchantAddress(String merchantAddress) { this.merchantAddress = merchantAddress; }
    
    public String getMerchantContact() { return merchantContact; }
    public void setMerchantContact(String merchantContact) { this.merchantContact = merchantContact; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public Integer getSaleCount() { return saleCount; }
    public void setSaleCount(Integer saleCount) { this.saleCount = saleCount; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
