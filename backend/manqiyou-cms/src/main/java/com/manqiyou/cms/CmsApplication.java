package com.manqiyou.cms;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 漫骑游内容管理服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.manqiyou")
@MapperScan("com.manqiyou.cms.mapper")
public class CmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CmsApplication.class, args);
    }
}
