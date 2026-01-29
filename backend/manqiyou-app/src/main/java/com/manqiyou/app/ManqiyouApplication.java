package com.manqiyou.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 漫骑游单体应用启动类
 * 用于开发阶段，整合所有服务
 */
@SpringBootApplication
@MapperScan("com.manqiyou.app.mapper")
public class ManqiyouApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManqiyouApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  漫骑游后端服务启动成功！");
        System.out.println("  API地址: http://localhost:8080");
        System.out.println("  H2控制台: http://localhost:8080/h2-console");
        System.out.println("===========================================");
    }
}
