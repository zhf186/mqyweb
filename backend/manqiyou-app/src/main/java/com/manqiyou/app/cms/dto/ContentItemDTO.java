package com.manqiyou.app.cms.dto;

import java.time.LocalDateTime;

/**
 * 内容项DTO
 */
public class ContentItemDTO {
    private Long id;
    private Long pageId;
    private String fieldKey;
    private String fieldType;
    private String contentZh;
    private String contentEn;
    private String publishedContentZh;
    private String publishedContentEn;
    private LocalDateTime publishedAt;
    private Boolean hasUnpublishedChanges;
    private Integer maxLength;
    private Boolean isRequired;
    private Integer displayOrder;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getPageId() { return pageId; }
    public void setPageId(Long pageId) { this.pageId = pageId; }
    
    public String getFieldKey() { return fieldKey; }
    public void setFieldKey(String fieldKey) { this.fieldKey = fieldKey; }
    
    public String getFieldType() { return fieldType; }
    public void setFieldType(String fieldType) { this.fieldType = fieldType; }
    
    public String getContentZh() { return contentZh; }
    public void setContentZh(String contentZh) { this.contentZh = contentZh; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }

    public String getPublishedContentZh() { return publishedContentZh; }
    public void setPublishedContentZh(String publishedContentZh) { this.publishedContentZh = publishedContentZh; }

    public String getPublishedContentEn() { return publishedContentEn; }
    public void setPublishedContentEn(String publishedContentEn) { this.publishedContentEn = publishedContentEn; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public Boolean getHasUnpublishedChanges() { return hasUnpublishedChanges; }
    public void setHasUnpublishedChanges(Boolean hasUnpublishedChanges) { this.hasUnpublishedChanges = hasUnpublishedChanges; }
    
    public Integer getMaxLength() { return maxLength; }
    public void setMaxLength(Integer maxLength) { this.maxLength = maxLength; }
    
    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
