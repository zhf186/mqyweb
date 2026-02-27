package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.DashboardStatsDTO;
import com.manqiyou.app.cms.dto.RouteStatsDTO;
import com.manqiyou.app.cms.service.StatisticsService;
import com.manqiyou.app.common.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 统计 Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    
    private final StatisticsService statisticsService;
    
    /**
     * 获取仪表盘统计数据
     */
    @GetMapping("/dashboard")
    public Result<DashboardStatsDTO> getDashboardStats() {
        log.info("Getting dashboard statistics");
        DashboardStatsDTO stats = statisticsService.getDashboardStats();
        return Result.success(stats);
    }
    
    /**
     * 获取路线统计数据
     */
    @GetMapping("/routes/{routeId}")
    public Result<RouteStatsDTO> getRouteStats(@PathVariable Long routeId) {
        log.info("Getting statistics for route: {}", routeId);
        RouteStatsDTO stats = statisticsService.getRouteStats(routeId);
        return Result.success(stats);
    }
}
