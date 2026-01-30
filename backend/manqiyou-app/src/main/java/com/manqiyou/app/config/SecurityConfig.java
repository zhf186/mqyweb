package com.manqiyou.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 公开访问的路径
     */
    private static final String[] PUBLIC_PATHS = {
        "/api/health",
        "/api/info",
        "/api/auth/**",
        "/api/routes/**",
        "/api/categories/**",
        "/api/content/**",
        "/api/goods/**",
        "/api/activities/**",
        "/h2-console/**",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 启用 CORS（使用 CorsFilter 配置）
            .cors(cors -> cors.configure(http))
            // 禁用 CSRF（API 服务）
            .csrf(AbstractHttpConfigurer::disable)
            // 允许 H2 控制台的 iframe
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            // 无状态会话
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_PATHS).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
