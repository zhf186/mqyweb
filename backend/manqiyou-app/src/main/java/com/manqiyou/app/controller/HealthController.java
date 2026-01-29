package com.manqiyou.app.controller;

import com.manqiyou.app.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查 API
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("service", "manqiyou-app");
        data.put("version", "1.0.0");
        data.put("timestamp", System.currentTimeMillis());
        return Result.success(data);
    }

    /**
     * API 信息
     */
    @GetMapping("/info")
    public Result<Map<String, Object>> info() {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "漫骑游后端服务");
        data.put("description", "漫骑游官方网站后端 API");
        data.put("version", "1.0.0");
        data.put("endpoints", new String[]{
            "GET /api/health - 健康检查",
            "GET /api/routes - 线路列表",
            "GET /api/routes/featured - 热门线路",
            "GET /api/routes/{id} - 线路详情",
            "GET /api/categories - 分类列表",
            "POST /api/auth/send-code - 发送验证码",
            "POST /api/auth/login - 登录"
        });
        return Result.success(data);
    }
}
