package com.manqiyou.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CORS 跨域配置
 * 注意：此配置优先级最高，确保不会被其他 CORS 配置覆盖
 */
@Configuration
public class CorsConfig {

    private final Environment environment;

    public CorsConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 允许的源（明确列出，不使用通配符）
        // 支持通过环境变量/配置覆盖：app.cors.allowed-origins（逗号分隔）
        List<String> allowedOrigins = resolveAllowedOrigins();
        config.setAllowedOrigins(allowedOrigins);
        
        // 允许的方法
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // 允许的头
        config.setAllowedHeaders(Collections.singletonList("*"));
        
        // 暴露的头
        config.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Total-Count"
        ));
        
        // 允许携带凭证
        config.setAllowCredentials(true);
        
        // 预检请求缓存时间（1小时）
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }

    private List<String> resolveAllowedOrigins() {
        String configured = environment.getProperty("app.cors.allowed-origins");
        if (configured != null && !configured.isBlank()) {
            return Arrays.stream(configured.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .collect(Collectors.toList());
        }

        return Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://www.zjmqy.cc",
                "https://zjmqy.cc",
                "http://www.zjmqy.cc",
                "http://zjmqy.cc"
        );
    }
}
