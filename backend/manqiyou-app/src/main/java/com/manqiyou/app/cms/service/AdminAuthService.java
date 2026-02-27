package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.config.JwtTokenProvider;
import com.manqiyou.app.cms.dto.AdminUserDTO;
import com.manqiyou.app.cms.dto.LoginRequest;
import com.manqiyou.app.cms.dto.LoginResponse;
import com.manqiyou.app.cms.entity.AdminUser;
import com.manqiyou.app.cms.mapper.AdminUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * Admin authentication service.
 */
@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);

    private static final String LOGIN_FAIL_KEY_PREFIX = "login:fail:";
    private static final String ACCOUNT_LOCK_KEY_PREFIX = "account:lock:";
    private static final String TOKEN_BLACKLIST_KEY_PREFIX = "token:blacklist:";
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    private final AdminUserMapper adminUserMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthService(AdminUserMapper adminUserMapper,
                            JwtTokenProvider jwtTokenProvider,
                            RedisTemplate<String, Object> redisTemplate,
                            PasswordEncoder passwordEncoder) {
        this.adminUserMapper = adminUserMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername();

        if (isAccountLocked(username)) {
            throw new RuntimeException("账号已被锁定，请稍后再试");
        }

        AdminUser user = adminUserMapper.selectOne(
            new LambdaQueryWrapper<AdminUser>()
                .eq(AdminUser::getUsername, username)
        );

        if (user == null) {
            recordLoginFailure(username);
            throw new RuntimeException("用户名或密码错误");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("账号已被禁用");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            recordLoginFailure(username);
            throw new RuntimeException("用户名或密码错误");
        }

        clearLoginFailures(username);

        user.setLastLoginAt(LocalDateTime.now());
        adminUserMapper.updateById(user);
        logLoginSuccess(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return LoginResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .expiresIn(jwtTokenProvider.getExpiration())
            .user(convertToDTO(user))
            .build();
    }

    public void logout(String token) {
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        long remaining = jwtTokenProvider.getRemainingValidityMillis(token);

        if (remaining > 0) {
            redisTemplate.opsForValue().set(
                TOKEN_BLACKLIST_KEY_PREFIX + token,
                userId,
                remaining,
                TimeUnit.MILLISECONDS
            );
        }

        log.info("User {} logged out", userId);
    }

    public boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(TOKEN_BLACKLIST_KEY_PREFIX + token));
    }

    public AdminUserDTO getCurrentUser(Long userId) {
        AdminUser user = adminUserMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        return convertToDTO(user);
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token.");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        AdminUser user = adminUserMapper.selectById(userId);

        if (user == null || !Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("User not found or disabled.");
        }

        String newToken = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());

        return LoginResponse.builder()
            .token(newToken)
            .refreshToken(refreshToken)
            .expiresIn(jwtTokenProvider.getExpiration())
            .user(convertToDTO(user))
            .build();
    }

    private void recordLoginFailure(String username) {
        String failKey = LOGIN_FAIL_KEY_PREFIX + username;
        Long failCount = redisTemplate.opsForValue().increment(failKey, 1);

        if (failCount == null) {
            return;
        }

        if (failCount == 1) {
            redisTemplate.expire(failKey, LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        }

        if (failCount >= MAX_LOGIN_ATTEMPTS) {
            lockAccount(username);
            log.warn("Too many login failures. Account locked: {}", username);
        }
    }

    private void lockAccount(String username) {
        redisTemplate.opsForValue().set(
            ACCOUNT_LOCK_KEY_PREFIX + username,
            true,
            LOCK_DURATION_MINUTES,
            TimeUnit.MINUTES
        );
    }

    private boolean isAccountLocked(String username) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(ACCOUNT_LOCK_KEY_PREFIX + username));
    }

    private void clearLoginFailures(String username) {
        redisTemplate.delete(LOGIN_FAIL_KEY_PREFIX + username);
    }

    private void logLoginSuccess(AdminUser user) {
        log.info("User {} ({}) logged in", user.getUsername(), user.getId());
    }

    private AdminUserDTO convertToDTO(AdminUser user) {
        return AdminUserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .isActive(user.getIsActive())
            .lastLoginAt(user.getLastLoginAt())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
