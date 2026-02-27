package com.manqiyou.app.cms.dto;

import java.util.List;

/**
 * 页面及其内容项DTO
 */
public class PageWithContentDTO {
    private Long id;
    private String slug;
    private String nameZh;
    private String nameEn;
    private String description;
    private Boolean isActive;
    private List<ContentItemDTO> contentItems;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getNameZh() { return nameZh; }
    public void setNameZh(String nameZh) { this.nameZh = nameZh; }
    
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public List<ContentItemDTO> getContentItems() { return contentItems; }
    public void setContentItems(List<ContentItemDTO> contentItems) { this.contentItems = contentItems; }
}
