package com.manqiyou.app.config;

import com.manqiyou.app.cms.config.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] BASE_PUBLIC_PATHS = {
        "/api/health",
        "/api/info",
        "/api/routes",
        "/api/routes/**",
        "/api/categories",
        "/api/categories/**",
        "/api/content/**",
        "/api/goods/**",
        "/api/activities/**",
        "/api/public/**",
        "/api/admin/auth/login",
        "/api/admin/auth/refresh",
        "/uploads/**"
    };

    private static final String[] DEV_PUBLIC_PATHS = {
        "/api/auth/**",
        "/api/dev/**",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.security.allow-dev-endpoints:false}")
    private boolean allowDevEndpoints;

    @Value("${app.security.allow-h2-console:false}")
    private boolean allowH2Console;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> {
                if (allowH2Console) {
                    headers.frameOptions(frame -> frame.sameOrigin());
                }
            })
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(buildPublicMatchers()).permitAll()
                .requestMatchers("/api/admin/settings/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/admin/**").hasAnyRole("SUPER_ADMIN", "CONTENT_EDITOR")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private String[] buildPublicPaths() {
        List<String> paths = new ArrayList<>(Arrays.asList(BASE_PUBLIC_PATHS));

        if (allowDevEndpoints) {
            paths.addAll(Arrays.asList(DEV_PUBLIC_PATHS));
        }

        if (allowH2Console) {
            paths.add("/h2-console/**");
        }

        return paths.toArray(String[]::new);
    }

    private RequestMatcher[] buildPublicMatchers() {
        String[] paths = buildPublicPaths();
        RequestMatcher[] matchers = new RequestMatcher[paths.length];
        for (int i = 0; i < paths.length; i++) {
            matchers[i] = new AntPathRequestMatcher(paths[i]);
        }
        return matchers;
    }
}