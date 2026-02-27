package com.manqiyou.app.cms.dto;

import jakarta.validation.constraints.NotNull;

/**
 * 更新内容请求DTO
 */
public class UpdateContentRequest {
    
    /**
     * 中文内容
     */
    private String contentZh;
    
    /**
     * 英文内容
     */
    private String contentEn;
    
    /**
     * 版本号(用于乐观锁)
     */
    @NotNull(message = "版本号不能为空")
    private Integer version;
    
    /**
     * 修改摘要
     */
    private String changeSummary;
    
    // Getters and Setters
    public String getContentZh() { return contentZh; }
    public void setContentZh(String contentZh) { this.contentZh = contentZh; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getChangeSummary() { return changeSummary; }
    public void setChangeSummary(String changeSummary) { this.changeSummary = changeSummary; }
}
