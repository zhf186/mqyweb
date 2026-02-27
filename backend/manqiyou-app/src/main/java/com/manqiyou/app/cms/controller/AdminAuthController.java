package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.AdminUserDTO;
import com.manqiyou.app.cms.dto.LoginRequest;
import com.manqiyou.app.cms.dto.LoginResponse;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.AdminAuthService;
import com.manqiyou.app.common.Result;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Admin authentication controller.
 */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthController.class);

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = adminAuthService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            log.error("Admin login failed", e);
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public Result<String> logout(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return Result.error("Invalid Authorization header.");
            }
            String token = authorization.substring(7);
            adminAuthService.logout(token);
            return Result.success("Logout successful");
        } catch (Exception e) {
            log.error("Admin logout failed", e);
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/me")
    public Result<AdminUserDTO> getCurrentUser(Authentication authentication) {
        try {
            Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
            AdminUserDTO user = adminAuthService.getCurrentUser(userId);
            return Result.success(user);
        } catch (Exception e) {
            log.error("Get current admin user failed", e);
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public Result<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            if (request == null || request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
                return Result.error("refreshToken is required");
            }

            LoginResponse response = adminAuthService.refreshToken(request.getRefreshToken());
            return Result.success(response);
        } catch (Exception e) {
            log.error("Refresh token failed", e);
            return Result.error(e.getMessage());
        }
    }

    public static class RefreshTokenRequest {
        private String refreshToken;

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}