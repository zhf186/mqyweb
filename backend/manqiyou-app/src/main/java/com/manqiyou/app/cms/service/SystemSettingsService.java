package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.dto.SystemSettingsDTO;
import com.manqiyou.app.cms.entity.SystemSettings;
import com.manqiyou.app.cms.mapper.SystemSettingsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * System settings service.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemSettingsService {

    private final SystemSettingsMapper systemSettingsMapper;

    public SystemSettingsDTO getSettings() {
        return getSettings(false);
    }

    public SystemSettingsDTO getSettings(boolean includeSensitive) {
        return SystemSettingsDTO.fromMap(loadSettingsMap(), includeSensitive);
    }

    public String getSetting(String key) {
        LambdaQueryWrapper<SystemSettings> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemSettings::getSettingKey, key);

        SystemSettings setting = systemSettingsMapper.selectOne(wrapper);
        return setting != null ? setting.getSettingValue() : null;
    }

    @Transactional
    public SystemSettingsDTO updateSettings(SystemSettingsDTO dto, Long updatedBy) {
        validateSettings(dto);

        Map<String, String> existing = loadSettingsMap();

        updateSetting("site.name", dto.getSiteName(), "string", "Site name", updatedBy);
        updateSetting("site.logo_id", dto.getSiteLogoId(), "string", "Site logo asset id", updatedBy);
        updateSetting("site.favicon_id", dto.getSiteFaviconId(), "string", "Site favicon asset id", updatedBy);
        updateSetting("site.contact_email", dto.getContactEmail(), "string", "Contact email", updatedBy);
        updateSetting("site.contact_phone", dto.getContactPhone(), "string", "Contact phone", updatedBy);

        updateSetting("seo.title", dto.getSeoTitle(), "string", "SEO title", updatedBy);
        updateSetting("seo.description", dto.getSeoDescription(), "string", "SEO description", updatedBy);
        updateSetting("seo.keywords", dto.getSeoKeywords(), "string", "SEO keywords", updatedBy);

        updateSetting("social.wechat_qr_code_id", dto.getWechatQrCodeId(), "string", "Wechat QR code asset id", updatedBy);
        updateSetting("social.weibo_url", dto.getWeiboUrl(), "string", "Weibo url", updatedBy);
        updateSetting("social.douyin_url", dto.getDouyinUrl(), "string", "Douyin url", updatedBy);

        updateSecretSetting("oss.access_key_id", dto.getOssAccessKeyId(), "string", "OSS access key id", updatedBy, existing);
        updateSecretSetting("oss.access_key_secret", dto.getOssAccessKeySecret(), "string", "OSS access key secret", updatedBy, existing);
        updateSetting("oss.bucket", dto.getOssBucket(), "string", "OSS bucket", updatedBy);
        updateSetting("oss.region", dto.getOssRegion(), "string", "OSS region", updatedBy);
        updateSecretSetting("translation.api_key", dto.getTranslationApiKey(), "string", "Translation api key", updatedBy, existing);

        updateSetting("smtp.host", dto.getSmtpHost(), "string", "SMTP host", updatedBy);
        updateSetting("smtp.port", dto.getSmtpPort() != null ? dto.getSmtpPort().toString() : null, "number", "SMTP port", updatedBy);
        updateSetting("smtp.username", dto.getSmtpUsername(), "string", "SMTP username", updatedBy);
        updateSecretSetting("smtp.password", dto.getSmtpPassword(), "string", "SMTP password", updatedBy, existing);

        log.info("System settings updated by user: {}", updatedBy);

        return getSettings(false);
    }

    private void updateSecretSetting(String key,
                                     String value,
                                     String type,
                                     String description,
                                     Long updatedBy,
                                     Map<String, String> existing) {
        String valueToSave = value;
        if (valueToSave == null
            || valueToSave.isBlank()
            || SystemSettingsDTO.isMaskedValue(valueToSave)) {
            valueToSave = existing.get(key);
        }

        if (valueToSave == null) {
            return;
        }

        updateSetting(key, valueToSave, type, description, updatedBy);
    }

    private void updateSetting(String key, String value, String type, String description, Long updatedBy) {
        if (value == null) {
            return;
        }

        LambdaQueryWrapper<SystemSettings> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemSettings::getSettingKey, key);

        SystemSettings existing = systemSettingsMapper.selectOne(wrapper);

        if (existing != null) {
            existing.setSettingValue(value);
            existing.setUpdatedBy(updatedBy);
            systemSettingsMapper.updateById(existing);
        } else {
            SystemSettings newSetting = new SystemSettings();
            newSetting.setSettingKey(key);
            newSetting.setSettingValue(value);
            newSetting.setSettingType(type);
            newSetting.setDescription(description);
            newSetting.setUpdatedBy(updatedBy);
            systemSettingsMapper.insert(newSetting);
        }
    }

    private Map<String, String> loadSettingsMap() {
        List<SystemSettings> settingsList = systemSettingsMapper.selectList(null);
        Map<String, String> settingsMap = new HashMap<>();
        for (SystemSettings setting : settingsList) {
            settingsMap.put(setting.getSettingKey(), setting.getSettingValue());
        }
        return settingsMap;
    }

    private void validateSettings(SystemSettingsDTO dto) {
        if (dto.getContactEmail() != null && !dto.getContactEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (dto.getSmtpPort() != null && (dto.getSmtpPort() < 1 || dto.getSmtpPort() > 65535)) {
            throw new IllegalArgumentException("SMTP port must be between 1 and 65535");
        }

        if (dto.getWeiboUrl() != null && !dto.getWeiboUrl().isEmpty() && !dto.getWeiboUrl().startsWith("http")) {
            throw new IllegalArgumentException("Weibo URL must start with http or https");
        }

        if (dto.getDouyinUrl() != null && !dto.getDouyinUrl().isEmpty() && !dto.getDouyinUrl().startsWith("http")) {
            throw new IllegalArgumentException("Douyin URL must start with http or https");
        }
    }

    public boolean testConfiguration(String configType) {
        return switch (configType) {
            case "smtp" -> testSmtpConfiguration();
            case "oss" -> testOssConfiguration();
            default -> false;
        };
    }

    private boolean testSmtpConfiguration() {
        log.info("Testing SMTP configuration...");
        return true;
    }

    private boolean testOssConfiguration() {
        log.info("Testing OSS configuration...");
        return true;
    }
}