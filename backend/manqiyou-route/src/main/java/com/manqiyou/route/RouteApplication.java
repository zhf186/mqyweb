package com.manqiyou.route;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 漫骑游线路服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.manqiyou")
@MapperScan("com.manqiyou.route.mapper")
public class RouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(RouteApplication.class, args);
    }
}
