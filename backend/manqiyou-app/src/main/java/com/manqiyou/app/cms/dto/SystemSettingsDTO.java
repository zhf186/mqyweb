package com.manqiyou.app.cms.dto;

import lombok.Data;

import java.util.Map;

/**
 * System settings DTO.
 */
@Data
public class SystemSettingsDTO {

    public static final String MASK_PLACEHOLDER = "********";

    private String siteName;
    private String siteLogoId;
    private String siteFaviconId;
    private String contactEmail;
    private String contactPhone;

    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;

    private String wechatQrCodeId;
    private String weiboUrl;
    private String douyinUrl;

    private String ossAccessKeyId;
    private String ossAccessKeySecret;
    private String ossBucket;
    private String ossRegion;
    private String translationApiKey;

    private String smtpHost;
    private Integer smtpPort;
    private String smtpUsername;
    private String smtpPassword;

    public static SystemSettingsDTO fromMap(Map<String, String> settings) {
        return fromMap(settings, false);
    }

    public static SystemSettingsDTO fromMap(Map<String, String> settings, boolean includeSensitive) {
        SystemSettingsDTO dto = new SystemSettingsDTO();

        dto.setSiteName(settings.get("site.name"));
        dto.setSiteLogoId(settings.get("site.logo_id"));
        dto.setSiteFaviconId(settings.get("site.favicon_id"));
        dto.setContactEmail(settings.get("site.contact_email"));
        dto.setContactPhone(settings.get("site.contact_phone"));

        dto.setSeoTitle(settings.get("seo.title"));
        dto.setSeoDescription(settings.get("seo.description"));
        dto.setSeoKeywords(settings.get("seo.keywords"));

        dto.setWechatQrCodeId(settings.get("social.wechat_qr_code_id"));
        dto.setWeiboUrl(settings.get("social.weibo_url"));
        dto.setDouyinUrl(settings.get("social.douyin_url"));

        dto.setOssAccessKeyId(maskIfNeeded(settings.get("oss.access_key_id"), includeSensitive));
        dto.setOssAccessKeySecret(maskIfNeeded(settings.get("oss.access_key_secret"), includeSensitive));
        dto.setOssBucket(settings.get("oss.bucket"));
        dto.setOssRegion(settings.get("oss.region"));
        dto.setTranslationApiKey(maskIfNeeded(settings.get("translation.api_key"), includeSensitive));

        dto.setSmtpHost(settings.get("smtp.host"));
        String smtpPort = settings.get("smtp.port");
        if (smtpPort != null && !smtpPort.isBlank()) {
            dto.setSmtpPort(Integer.parseInt(smtpPort));
        }
        dto.setSmtpUsername(settings.get("smtp.username"));
        dto.setSmtpPassword(maskIfNeeded(settings.get("smtp.password"), includeSensitive));

        return dto;
    }

    public static boolean isMaskedValue(String value) {
        return MASK_PLACEHOLDER.equals(value);
    }

    private static String maskIfNeeded(String value, boolean includeSensitive) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return includeSensitive ? value : MASK_PLACEHOLDER;
    }
}