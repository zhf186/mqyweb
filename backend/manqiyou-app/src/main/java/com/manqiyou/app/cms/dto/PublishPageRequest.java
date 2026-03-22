package com.manqiyou.app.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload for publishing a CMS page.
 */
public class PublishPageRequest {

    @NotBlank(message = "发布说明不能为空")
    @Size(max = 200, message = "发布说明不能超过200个字符")
    private String summary;

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
