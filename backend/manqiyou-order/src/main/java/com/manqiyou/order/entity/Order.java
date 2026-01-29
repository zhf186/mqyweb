package com.manqiyou.order.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 */
@Data
@TableName("orders")
public class Order {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    private String orderNo;

    private String userId;

    private String routeId;

    private String scheduleId;

    private Integer participants;

    private BigDecimal totalPrice;

    /**
     * 订单状态: pending, paid, confirmed, completed, cancelled, refunded
     */
    private String status;

    private String paymentMethod;

    private LocalDateTime paymentTime;

    private String contactName;

    private String contactPhone;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
