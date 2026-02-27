package com.manqiyou.app.cms.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * 更新路线请求
 */
public class UpdateRouteRequest {
    
    private String nameZh;
    private String nameEn;
    private String slug;
    private String shortDescZh;
    private String shortDescEn;
    private String fullDescZh;
    private String fullDescEn;
    private BigDecimal distance;
    private String difficulty;
    private Integer duration;
    private BigDecimal price;
    private Long coverImageId;
    private String status;
    private Boolean isFeatured;
    private List<Long> imageIds;
    private List<RouteHighlightDTO> highlights;
    private Integer version; // For optimistic locking
    
    // Getters and Setters
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
    
    public List<Long> getImageIds() { return imageIds; }
    public void setImageIds(List<Long> imageIds) { this.imageIds = imageIds; }
    
    public List<RouteHighlightDTO> getHighlights() { return highlights; }
    public void setHighlights(List<RouteHighlightDTO> highlights) { this.highlights = highlights; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
}
