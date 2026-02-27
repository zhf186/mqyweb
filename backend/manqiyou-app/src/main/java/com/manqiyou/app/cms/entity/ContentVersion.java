package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.time.LocalDateTime;

/**
 * CMS内容版本实体
 * 对应数据库表: cms_content_versions
 */
@TableName("cms_content_versions")
public class ContentVersion {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 内容项ID
     */
    private Long contentItemId;
    
    /**
     * 版本号
     */
    private Integer versionNumber;
    
    /**
     * 内容(中文)
     */
    private String contentZh;
    
    /**
     * 内容(英文)
     */
    private String contentEn;
    
    /**
     * 修改人ID
     */
    private Long changedBy;
    
    /**
     * 修改摘要
     */
    private String changeSummary;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getContentItemId() { return contentItemId; }
    public void setContentItemId(Long contentItemId) { this.contentItemId = contentItemId; }
    
    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }
    
    public String getContentZh() { return contentZh; }
    public void setContentZh(String contentZh) { this.contentZh = contentZh; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    public Long getChangedBy() { return changedBy; }
    public void setChangedBy(Long changedBy) { this.changedBy = changedBy; }
    
    public String getChangeSummary() { return changeSummary; }
    public void setChangeSummary(String changeSummary) { this.changeSummary = changeSummary; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
