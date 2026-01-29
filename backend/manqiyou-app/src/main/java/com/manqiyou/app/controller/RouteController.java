package com.manqiyou.app.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.manqiyou.app.common.Result;
import com.manqiyou.app.entity.Route;
import com.manqiyou.app.service.RouteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 线路 API
 */
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * 获取热门线路
     */
    @GetMapping("/featured")
    public Result<List<Route>> getFeaturedRoutes(
            @RequestParam(defaultValue = "4") int limit) {
        return Result.success(routeService.getFeaturedRoutes(limit));
    }

    /**
     * 分页查询线路
     */
    @GetMapping
    public Result<Page<Route>> getRoutes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String difficulty) {
        return Result.success(routeService.getRoutes(page, size, categoryId, difficulty));
    }

    /**
     * 获取线路详情
     */
    @GetMapping("/{id}")
    public Result<Route> getRouteDetail(@PathVariable Long id) {
        Route route = routeService.getRouteDetail(id);
        if (route == null) {
            return Result.error(404, "线路不存在");
        }
        return Result.success(route);
    }
}
