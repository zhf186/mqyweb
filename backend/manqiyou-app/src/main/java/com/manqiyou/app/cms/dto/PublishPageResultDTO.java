package com.manqiyou.app.cms.dto;

import java.time.LocalDateTime;

/**
 * Publish result for a CMS page.
 */
public class PublishPageResultDTO {

    private Long id;
    private String pageSlug;
    private String pageNameZh;
    private String pageNameEn;
    private String summary;
    private Integer publishedItems;
    private LocalDateTime publishedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPageSlug() {
        return pageSlug;
    }

    public void setPageSlug(String pageSlug) {
        this.pageSlug = pageSlug;
    }

    public String getPageNameZh() {
        return pageNameZh;
    }

    public void setPageNameZh(String pageNameZh) {
        this.pageNameZh = pageNameZh;
    }

    public String getPageNameEn() {
        return pageNameEn;
    }

    public void setPageNameEn(String pageNameEn) {
        this.pageNameEn = pageNameEn;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getPublishedItems() {
        return publishedItems;
    }

    public void setPublishedItems(Integer publishedItems) {
        this.publishedItems = publishedItems;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
