package com.manqiyou.app.cms.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 操作日志实体
 */
@Data
@TableName("cms_operation_logs")
public class OperationLog {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String action;
    
    private String resourceType;
    
    private Long resourceId;
    
    private String details;
    
    private String ipAddress;
    
    private String userAgent;
    
    private LocalDateTime createdAt;
}
