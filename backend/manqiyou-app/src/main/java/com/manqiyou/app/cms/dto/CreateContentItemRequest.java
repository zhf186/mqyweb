package com.manqiyou.app.cms.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Create content item request.
 */
public class CreateContentItemRequest {

    @NotBlank(message = "fieldKey 不能为空")
    private String fieldKey;

    private String fieldType;

    private String contentZh;

    private String contentEn;

    public String getFieldKey() {
        return fieldKey;
    }

    public void setFieldKey(String fieldKey) {
        this.fieldKey = fieldKey;
    }

    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public String getContentZh() {
        return contentZh;
    }

    public void setContentZh(String contentZh) {
        this.contentZh = contentZh;
    }

    public String getContentEn() {
        return contentEn;
    }

    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }
}
