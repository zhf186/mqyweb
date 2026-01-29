package com.manqiyou.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@TableName("sys_user")
public class User {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String phone;

    private String nickname;

    private String avatar;

    private String wechatOpenId;

    private String memberLevelId;

    private Integer points;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
