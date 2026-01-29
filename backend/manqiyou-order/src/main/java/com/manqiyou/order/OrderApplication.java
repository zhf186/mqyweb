package com.manqiyou.order;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 漫骑游订单服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.manqiyou")
@MapperScan("com.manqiyou.order.mapper")
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
