package com.manqiyou.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 漫骑游用户服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.manqiyou")
@MapperScan("com.manqiyou.user.mapper")
public class UserApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
