package com.manqiyou.app.cms;

import com.manqiyou.app.cms.dto.LoginRequest;
import com.manqiyou.app.cms.dto.LoginResponse;
import com.manqiyou.app.cms.service.AdminAuthService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 管理员认证集成测试
 * 
 * 测试认证系统的核心功能：
 * - 登录成功场景
 * - 登录失败场景
 * - 账号锁定机制
 */
@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminAuthIntegrationTest {
    
    @Autowired
    private AdminAuthService adminAuthService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 每个测试前清理Redis状态，避免测试间相互影响
     */
    @BeforeEach
    void setUp() {
        try {
            // 清理所有与登录失败和账号锁定相关的Redis键
            redisTemplate.delete(redisTemplate.keys("login:fail:*"));
            redisTemplate.delete(redisTemplate.keys("account:lock:*"));
            redisTemplate.delete(redisTemplate.keys("token:blacklist:*"));
        } catch (Exception e) {
            // Redis可能未启动，忽略错误
            System.out.println("Warning: Could not clear Redis state: " + e.getMessage());
        }
    }
    
    /**
     * 测试登录成功场景
     * 验证：使用正确的凭证应该返回有效的JWT令牌和用户信息
     */
    @Test
    @Order(1)
    void testLoginSuccess() {
        // Given: 正确的登录凭证
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("Admin@123");
        
        // When: 执行登录
        LoginResponse response = adminAuthService.login(request);
        
        // Then: 应该返回令牌和用户信息
        assertNotNull(response, "登录响应不应为空");
        assertNotNull(response.getToken(), "JWT令牌不应为空");
        assertNotNull(response.getRefreshToken(), "刷新令牌不应为空");
        assertNotNull(response.getUser(), "用户信息不应为空");
        assertEquals("admin", response.getUser().getUsername(), "用户名应该匹配");
        assertTrue(response.getExpiresIn() > 0, "令牌过期时间应该大于0");
    }
    
    /**
     * 测试登录失败场景 - 错误的密码
     * 验证：使用错误的密码应该抛出异常
     */
    @Test
    @Order(2)
    void testLoginFailureWithWrongPassword() {
        // Given: 错误的密码
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("WrongPassword");
        
        // When & Then: 应该抛出异常
        Exception exception = assertThrows(RuntimeException.class, () -> {
            adminAuthService.login(request);
        });
        
        assertTrue(exception.getMessage().contains("用户名或密码错误"), 
                "错误消息应该提示用户名或密码错误");
    }
    
    /**
     * 测试登录失败场景 - 不存在的用户
     * 验证：使用不存在的用户名应该抛出异常
     */
    @Test
    @Order(3)
    void testLoginFailureWithNonExistentUser() {
        // Given: 不存在的用户名
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("SomePassword");
        
        // When & Then: 应该抛出异常
        Exception exception = assertThrows(RuntimeException.class, () -> {
            adminAuthService.login(request);
        });
        
        assertTrue(exception.getMessage().contains("用户名或密码错误"), 
                "错误消息应该提示用户名或密码错误");
    }
    
    /**
     * 测试账号锁定机制
     * 验证：连续5次登录失败后，账号应该被锁定15分钟
     * 
     * 注意：此测试使用一个测试专用的用户名，避免影响其他测试
     */
    @Test
    @Order(4)
    void testAccountLockAfterMultipleFailures() {
        // Given: 一个测试用户名（不存在）
        String testUsername = "test_lock_user_" + System.currentTimeMillis();
        LoginRequest request = new LoginRequest();
        request.setUsername(testUsername);
        request.setPassword("WrongPassword");
        
        // When: 尝试登录5次失败
        for (int i = 0; i < 5; i++) {
            try {
                adminAuthService.login(request);
            } catch (RuntimeException e) {
                // 预期会失败
            }
        }
        
        // Then: 第6次尝试应该提示账号被锁定
        Exception exception = assertThrows(RuntimeException.class, () -> {
            adminAuthService.login(request);
        });
        
        assertTrue(exception.getMessage().contains("账号已被锁定"), 
                "错误消息应该提示账号已被锁定");
    }
    
    /**
     * 测试令牌刷新功能
     * 验证：使用有效的刷新令牌应该能获取新的访问令牌
     */
    @Test
    @Order(5)
    void testTokenRefresh() throws InterruptedException {
        // Given: 先登录获取刷新令牌
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("Admin@123");
        LoginResponse loginResponse = adminAuthService.login(loginRequest);
        String refreshToken = loginResponse.getRefreshToken();
        
        // 等待至少1秒，确保新令牌的时间戳不同（JWT使用秒级时间戳）
        Thread.sleep(1100);
        
        // When: 使用刷新令牌获取新的访问令牌
        LoginResponse refreshResponse = adminAuthService.refreshToken(refreshToken);
        
        // Then: 应该返回新的访问令牌
        assertNotNull(refreshResponse, "刷新响应不应为空");
        assertNotNull(refreshResponse.getToken(), "新的访问令牌不应为空");
        assertNotEquals(loginResponse.getToken(), refreshResponse.getToken(), 
                "新的访问令牌应该与原令牌不同");
    }
    
    /**
     * 测试获取当前用户信息
     * 验证：使用有效的用户ID应该能获取用户信息
     */
    @Test
    @Order(6)
    void testGetCurrentUser() {
        // Given: 先登录获取用户ID
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("Admin@123");
        LoginResponse loginResponse = adminAuthService.login(loginRequest);
        Long userId = loginResponse.getUser().getId();
        
        // When: 获取当前用户信息
        var userDTO = adminAuthService.getCurrentUser(userId);
        
        // Then: 应该返回正确的用户信息
        assertNotNull(userDTO, "用户信息不应为空");
        assertEquals(userId, userDTO.getId(), "用户ID应该匹配");
        assertEquals("admin", userDTO.getUsername(), "用户名应该匹配");
    }
}
