package com.manqiyou.member;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 漫骑游会员服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.manqiyou")
@MapperScan("com.manqiyou.member.mapper")
public class MemberApplication {

    public static void main(String[] args) {
        SpringApplication.run(MemberApplication.class, args);
    }
}
