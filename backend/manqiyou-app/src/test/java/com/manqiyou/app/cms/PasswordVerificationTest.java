package com.manqiyou.app.cms;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 密码验证测试 - 用于调试密码哈希问题
 */
class PasswordVerificationTest {
    
    @Test
    void testPasswordHashVerification() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 测试密码
        String password = "Admin@123";
        
        // 数据库中的哈希值 (来自 data.sql - H2测试数据库使用的哈希)
        String hashFromDatabase = "$2a$10$HUgM3xpw29rxBwwTjJEfPeNnxKapnTbehdzJ4/K5RvQT/kI9ONmYW";
        
        // 验证
        boolean matches = encoder.matches(password, hashFromDatabase);
        
        System.out.println("Password: " + password);
        System.out.println("Hash from database: " + hashFromDatabase);
        System.out.println("Matches: " + matches);
        
        // 生成新的哈希值进行对比
        String newHash = encoder.encode(password);
        System.out.println("Newly generated hash: " + newHash);
        System.out.println("New hash matches: " + encoder.matches(password, newHash));
        
        assertTrue(matches, "Password should match the hash from database");
    }
}
