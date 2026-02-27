package com.manqiyou.app.cms.annotation;

import java.lang.annotation.*;

/**
 * 操作日志注解
 * 用于标记需要记录操作日志的方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface OperationLog {
    
    /**
     * 操作类型
     */
    String action();
    
    /**
     * 资源类型
     */
    String resourceType();
    
    /**
     * 操作描述
     */
    String description() default "";
}
