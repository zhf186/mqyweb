package com.manqiyou.member.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 积分记录实体
 */
@Data
@TableName("points_record")
public class PointsRecord {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String userId;

    private Integer amount;

    /**
     * 类型: earn(获得), spend(消费)
     */
    private String type;

    private String source;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
