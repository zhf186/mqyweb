package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.SystemSettingsDTO;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.SystemSettingsService;
import com.manqiyou.app.common.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * System settings controller.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class SystemSettingsController {

    private final SystemSettingsService systemSettingsService;

    @GetMapping
    public Result<SystemSettingsDTO> getSettings(
        @RequestParam(defaultValue = "false") boolean includeSensitive,
        Authentication authentication) {

        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Getting system settings by user {}, includeSensitive={}", userId, includeSensitive);

        SystemSettingsDTO settings = systemSettingsService.getSettings(includeSensitive);
        return Result.success(settings);
    }

    @PutMapping
    public Result<SystemSettingsDTO> updateSettings(@RequestBody SystemSettingsDTO dto,
                                                    Authentication authentication) {
        Long currentUserId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Updating system settings by user {}", currentUserId);

        SystemSettingsDTO updated = systemSettingsService.updateSettings(dto, currentUserId);
        return Result.success(updated);
    }

    @PostMapping("/test/{configType}")
    public Result<Boolean> testConfiguration(@PathVariable String configType,
                                             Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Testing configuration {} by user {}", configType, userId);

        boolean result = systemSettingsService.testConfiguration(configType);
        if (result) {
            return Result.success("Configuration test successful", true);
        }
        return Result.error(500, "Configuration test failed");
    }
}