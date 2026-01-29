package com.manqiyou.app.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.manqiyou.app.entity.Route;
import com.manqiyou.app.mapper.RouteMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 线路服务
 */
@Service
public class RouteService extends ServiceImpl<RouteMapper, Route> {

    /**
     * 获取热门线路
     */
    public List<Route> getFeaturedRoutes(int limit) {
        return lambdaQuery()
            .eq(Route::getStatus, 1)
            .eq(Route::getFeatured, true)
            .orderByAsc(Route::getSortOrder)
            .last("LIMIT " + limit)
            .list();
    }

    /**
     * 分页查询线路
     */
    public Page<Route> getRoutes(int page, int size, Long categoryId, String difficulty) {
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Route::getStatus, 1);
        
        if (categoryId != null) {
            wrapper.eq(Route::getCategoryId, categoryId);
        }
        if (difficulty != null && !difficulty.isEmpty()) {
            wrapper.eq(Route::getDifficulty, difficulty);
        }
        
        wrapper.orderByAsc(Route::getSortOrder);
        
        return page(new Page<>(page, size), wrapper);
    }

    /**
     * 获取线路详情
     */
    public Route getRouteDetail(Long id) {
        return lambdaQuery()
            .eq(Route::getId, id)
            .eq(Route::getStatus, 1)
            .one();
    }
}
