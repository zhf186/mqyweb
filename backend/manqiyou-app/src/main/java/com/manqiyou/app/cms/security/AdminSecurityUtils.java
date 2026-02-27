package com.manqiyou.app.cms.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility methods for extracting authenticated admin information.
 */
public final class AdminSecurityUtils {

    private AdminSecurityUtils() {
    }

    public static Long getCurrentUserId(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Unauthenticated request");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long userId) {
            return userId;
        }
        if (principal instanceof String text && !text.isBlank()) {
            return Long.parseLong(text);
        }

        String name = authentication.getName();
        if (name != null && !name.isBlank()) {
            return Long.parseLong(name);
        }

        throw new IllegalStateException("Cannot resolve current user id");
    }

    public static Long getCurrentUserId() {
        return getCurrentUserId(SecurityContextHolder.getContext().getAuthentication());
    }

    public static boolean hasRole(Authentication authentication, String role) {
        if (authentication == null || role == null || role.isBlank()) {
            return false;
        }

        String expected = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (expected.equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}