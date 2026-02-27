package com.manqiyou.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.manqiyou.app.common.Result;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.service.AssetService;
import com.manqiyou.app.cms.mapper.CmsRouteMapper;
import com.manqiyou.app.entity.Route;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 线路 API
 */
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final CmsRouteMapper cmsRouteMapper;
    private final AssetService assetService;

    public RouteController(CmsRouteMapper cmsRouteMapper, AssetService assetService) {
        this.cmsRouteMapper = cmsRouteMapper;
        this.assetService = assetService;
    }

    /**
     * 获取热门线路
     */
    @GetMapping("/featured")
    public Result<List<Route>> getFeaturedRoutes(
            @RequestParam(defaultValue = "4") int limit) {
        LambdaQueryWrapper<com.manqiyou.app.cms.entity.Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(com.manqiyou.app.cms.entity.Route::getStatus, "published")
                .eq(com.manqiyou.app.cms.entity.Route::getIsFeatured, true)
                .orderByDesc(com.manqiyou.app.cms.entity.Route::getCreatedAt)
                .last("LIMIT " + limit);

        List<com.manqiyou.app.cms.entity.Route> cmsRoutes = cmsRouteMapper.selectList(wrapper);
        List<com.manqiyou.app.entity.Route> result = new ArrayList<>();
        for (com.manqiyou.app.cms.entity.Route cmsRoute : cmsRoutes) {
            result.add(toPublicRoute(cmsRoute));
        }
        return Result.success(result);
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
        Page<com.manqiyou.app.cms.entity.Route> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<com.manqiyou.app.cms.entity.Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(com.manqiyou.app.cms.entity.Route::getStatus, "published");

        if (categoryId != null) {
            // CMS 版本暂不支持 categoryId，忽略
        }
        if (difficulty != null && !difficulty.isEmpty()) {
            wrapper.eq(com.manqiyou.app.cms.entity.Route::getDifficulty, difficulty);
        }

        wrapper.orderByDesc(com.manqiyou.app.cms.entity.Route::getCreatedAt);
        IPage<com.manqiyou.app.cms.entity.Route> cmsPage = cmsRouteMapper.selectPage(pageParam, wrapper);

        Page<com.manqiyou.app.entity.Route> publicPage = new Page<>(cmsPage.getCurrent(), cmsPage.getSize(), cmsPage.getTotal());
        List<com.manqiyou.app.entity.Route> records = new ArrayList<>();
        for (com.manqiyou.app.cms.entity.Route cmsRoute : cmsPage.getRecords()) {
            records.add(toPublicRoute(cmsRoute));
        }
        publicPage.setRecords(records);
        return Result.success(publicPage);
    }

    /**
     * 获取线路详情
     */
    @GetMapping("/{id}")
    public Result<Route> getRouteDetail(@PathVariable Long id) {
        com.manqiyou.app.cms.entity.Route cmsRoute = cmsRouteMapper.selectById(id);
        if (cmsRoute == null || !"published".equals(cmsRoute.getStatus())) {
            return Result.error(404, "线路不存在");
        }
        return Result.success(toPublicRoute(cmsRoute));
    }

    private com.manqiyou.app.entity.Route toPublicRoute(com.manqiyou.app.cms.entity.Route cmsRoute) {
        com.manqiyou.app.entity.Route r = new com.manqiyou.app.entity.Route();
        r.setId(cmsRoute.getId());
        r.setName(cmsRoute.getNameZh());
        r.setNameEn(cmsRoute.getNameEn());
        r.setSummary(cmsRoute.getShortDescZh());
        r.setDescription(cmsRoute.getFullDescZh());
        r.setDifficulty(cmsRoute.getDifficulty());
        r.setDuration(cmsRoute.getDuration());
        r.setDistance(cmsRoute.getDistance());
        r.setPrice(cmsRoute.getPrice());
        r.setFeatured(Boolean.TRUE.equals(cmsRoute.getIsFeatured()));
        r.setStatus(1);
        r.setSortOrder(0);

        if (cmsRoute.getCoverImageId() != null) {
            try {
                Asset asset = assetService.getAssetById(cmsRoute.getCoverImageId());
                String url = asset.getLargeUrl();
                if (url == null || url.isEmpty()) url = asset.getMediumUrl();
                if (url == null || url.isEmpty()) url = asset.getFileUrl();
                r.setCoverImage(url);
            } catch (Exception ignored) {
                r.setCoverImage(null);
            }
        }
        return r;
    }
}
