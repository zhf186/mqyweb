package com.manqiyou.app.cms.dto;

import lombok.Data;

/**
 * 路线统计数据 DTO
 */
@Data
public class RouteStatsDTO {
    
    /**
     * 浏览量
     */
    private Integer views;
    
    /**
     * 预订量
     */
    private Integer bookings;
    
    /**
     * 收入
     */
    private Double revenue;
}
