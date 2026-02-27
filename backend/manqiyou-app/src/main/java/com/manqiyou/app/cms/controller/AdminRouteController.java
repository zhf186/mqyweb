package com.manqiyou.app.cms.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.manqiyou.app.cms.dto.CreateRouteRequest;
import com.manqiyou.app.cms.dto.RouteDTO;
import com.manqiyou.app.cms.dto.UpdateRouteRequest;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.CmsRouteService;
import com.manqiyou.app.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * CMS route management controller.
 */
@RestController
@RequestMapping("/api/admin/routes")
public class AdminRouteController {

    private static final Logger log = LoggerFactory.getLogger(AdminRouteController.class);

    @Autowired
    private CmsRouteService routeService;

    @GetMapping
    public Result<IPage<RouteDTO>> listRoutes(@RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "10") int limit,
                                              @RequestParam(required = false) String status,
                                              @RequestParam(required = false) String search) {
        IPage<RouteDTO> routes = routeService.listRoutes(page, limit, status, search);
        return Result.success(routes);
    }

    @GetMapping("/{routeId}")
    public Result<RouteDTO> getRoute(@PathVariable Long routeId) {
        RouteDTO route = routeService.getRouteById(routeId);
        return Result.success(route);
    }

    @PostMapping
    public Result<RouteDTO> createRoute(@RequestBody CreateRouteRequest request,
                                        Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Creating route {} by user {}", request.getNameZh(), userId);

        RouteDTO route = routeService.createRoute(request, userId);
        return Result.success(route);
    }

    @PutMapping("/{routeId}")
    public Result<RouteDTO> updateRoute(@PathVariable Long routeId,
                                        @RequestBody UpdateRouteRequest request,
                                        Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Updating route {} by user {}", routeId, userId);

        RouteDTO route = routeService.updateRoute(routeId, request, userId);
        return Result.success(route);
    }

    @DeleteMapping("/{routeId}")
    public Result<Void> deleteRoute(@PathVariable Long routeId) {
        routeService.deleteRoute(routeId);
        return Result.success(null);
    }

    @PostMapping("/{routeId}/publish")
    public Result<RouteDTO> publishRoute(@PathVariable Long routeId) {
        RouteDTO route = routeService.publishRoute(routeId);
        return Result.success(route);
    }

    @GetMapping("/{routeId}/statistics")
    public Result<CmsRouteService.RouteStatistics> getRouteStatistics(@PathVariable Long routeId) {
        CmsRouteService.RouteStatistics stats = routeService.getRouteStatistics(routeId);
        return Result.success(stats);
    }
}