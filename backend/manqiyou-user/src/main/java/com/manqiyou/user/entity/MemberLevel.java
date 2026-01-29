package com.manqiyou.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.util.List;

/**
 * 会员等级实体
 */
@Data
@TableName(value = "member_level", autoResultMap = true)
public class MemberLevel {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String name;

    private Integer minPoints;

    @com.baomidou.mybatisplus.annotation.TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> benefits;
}
