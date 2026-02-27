package com.manqiyou.app.cms;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 生成正确的密码哈希
 */
class GenerateCorrectHash {
    
    @Test
    void generateHashForAdminPassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Admin@123";
        String hash = encoder.encode(password);
        
        System.out.println("=".repeat(80));
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("=".repeat(80));
        System.out.println("Update data.sql with this hash:");
        System.out.println("('admin', '" + hash + "', 'admin@manqiyou.com', '系统管理员', 'super_admin', true);");
        System.out.println("=".repeat(80));
        
        // Verify it works
        boolean matches = encoder.matches(password, hash);
        System.out.println("Verification: " + matches);
    }
}
