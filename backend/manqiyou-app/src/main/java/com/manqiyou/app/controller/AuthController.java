package com.manqiyou.app.controller;

import com.manqiyou.app.common.Result;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 认证 API（开发用模拟实现）
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // 模拟验证码存储
    private final Map<String, String> codeStore = new ConcurrentHashMap<>();

    /**
     * 发送验证码（模拟）
     */
    @PostMapping("/send-code")
    public Result<Map<String, Object>> sendCode(@RequestBody SendCodeRequest request) {
        String phone = request.getPhone();
        
        // 生成6位验证码
        String code = String.format("%06d", new Random().nextInt(1000000));
        codeStore.put(phone, code);
        
        // 开发环境直接返回验证码
        Map<String, Object> data = new HashMap<>();
        data.put("message", "验证码已发送");
        data.put("code", code); // 仅开发环境返回
        data.put("expiresIn", 300);
        
        System.out.println("发送验证码到 " + phone + ": " + code);
        
        return Result.success("验证码发送成功", data);
    }

    /**
     * 手机验证码登录（模拟）
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        String phone = request.getPhone();
        String code = request.getCode();
        
        // 验证验证码
        String storedCode = codeStore.get(phone);
        if (storedCode == null || !storedCode.equals(code)) {
            // 开发环境：允许使用 123456 作为万能验证码
            if (!"123456".equals(code)) {
                return Result.error(400, "验证码错误或已过期");
            }
        }
        
        // 清除验证码
        codeStore.remove(phone);
        
        // 生成模拟 token
        String token = "mock_token_" + System.currentTimeMillis();
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400);
        data.put("user", createMockUser(phone));
        
        return Result.success("登录成功", data);
    }

    /**
     * 微信登录（模拟）
     */
    @PostMapping("/wechat")
    public Result<Map<String, Object>> wechatLogin(@RequestBody WechatLoginRequest request) {
        // 模拟微信登录
        String token = "mock_wechat_token_" + System.currentTimeMillis();
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("tokenType", "Bearer");
        data.put("expiresIn", 86400);
        data.put("user", createMockWechatUser());
        
        return Result.success("微信登录成功", data);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public Result<Map<String, Object>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return Result.error(401, "未登录");
        }
        
        return Result.success(createMockUser("13800138000"));
    }

    private Map<String, Object> createMockUser(String phone) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("phone", phone);
        user.put("nickname", "骑行爱好者");
        user.put("avatar", "/images/default-avatar.png");
        user.put("memberLevel", "silver");
        user.put("points", 1280);
        return user;
    }

    private Map<String, Object> createMockWechatUser() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 2);
        user.put("phone", null);
        user.put("nickname", "微信用户");
        user.put("avatar", "/images/default-avatar.png");
        user.put("memberLevel", "bronze");
        user.put("points", 0);
        return user;
    }

    // Request DTOs
    public static class SendCodeRequest {
        private String phone;
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class LoginRequest {
        private String phone;
        private String code;
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class WechatLoginRequest {
        private String code;
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }
}
