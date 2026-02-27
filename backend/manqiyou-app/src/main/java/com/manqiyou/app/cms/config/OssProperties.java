package com.manqiyou.app.cms.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 阿里云OSS配置属性
 */
@Data
@Component
@ConfigurationProperties(prefix = "aliyun.oss")
public class OssProperties {
    
    /**
     * OSS访问密钥ID
     */
    private String accessKeyId;
    
    /**
     * OSS访问密钥Secret
     */
    private String accessKeySecret;
    
    /**
     * OSS Bucket名称
     */
    private String bucket;
    
    /**
     * OSS区域端点
     */
    private String endpoint;
    
    /**
     * 自定义域名（可选）
     */
    private String customDomain;
}
