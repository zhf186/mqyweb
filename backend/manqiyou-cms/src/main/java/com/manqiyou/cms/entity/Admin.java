package com.manqiyou.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 管理员实体
 */
@Data
@TableName("admin")
public class Admin {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String username;

    private String password;

    private String name;

    /**
     * 角色: admin, editor
     */
    private String role;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
