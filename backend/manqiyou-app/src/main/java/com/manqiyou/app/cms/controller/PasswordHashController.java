package com.manqiyou.app.cms.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

/**
 * 临时控制器用于生成密码哈希（仅用于开发）
 */
@RestController
@Profile("dev")
@RequestMapping("/api/dev")
public class PasswordHashController {
    
    private final PasswordEncoder passwordEncoder;
    
    public PasswordHashController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    @GetMapping("/hash")
    public String generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return "Password: " + password + "\nHash: " + hash + "\nMatches: " + passwordEncoder.matches(password, hash);
    }
}
