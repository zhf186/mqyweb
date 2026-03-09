package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.manqiyou.app.cms.dto.CreateRouteRequest;
import com.manqiyou.app.cms.dto.RouteDTO;
import com.manqiyou.app.cms.dto.RouteHighlightDTO;
import com.manqiyou.app.cms.dto.UpdateRouteRequest;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.entity.Route;
import com.manqiyou.app.cms.entity.RouteHighlight;
import com.manqiyou.app.cms.entity.RouteImage;
import com.manqiyou.app.cms.mapper.AssetMapper;
import com.manqiyou.app.cms.mapper.RouteHighlightMapper;
import com.manqiyou.app.cms.mapper.RouteImageMapper;
import com.manqiyou.app.cms.mapper.CmsRouteMapper;
import com.manqiyou.app.mapper.RouteMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 路线管理服务
 */
@Service
public class CmsRouteService {
    
    private static final Logger log = LoggerFactory.getLogger(CmsRouteService.class);
    
    @Autowired
    private CmsRouteMapper routeMapper;
    
    @Autowired
    private RouteImageMapper routeImageMapper;
    
    @Autowired
    private RouteHighlightMapper routeHighlightMapper;

    @Autowired
    private RouteMapper publicRouteMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private volatile Boolean publicRoutesTableAvailable;

    @Autowired
    private AssetService assetService;
    
    @Autowired
    private AssetMapper assetMapper;
    
    /**
     * 分页查询路线列表
     */
    public IPage<RouteDTO> listRoutes(int page, int limit, String status, String search) {
        Page<Route> pageParam = new Page<>(page, limit);
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        
        // 状态筛选
        if (StringUtils.hasText(status)) {
            wrapper.eq(Route::getStatus, status);
        }
        
        // 搜索
        if (StringUtils.hasText(search)) {
            wrapper.and(w -> w.like(Route::getNameZh, search)
                             .or()
                             .like(Route::getNameEn, search));
        }
        
        wrapper.orderByDesc(Route::getCreatedAt);
        
        IPage<Route> routePage = routeMapper.selectPage(pageParam, wrapper);
        
        // 转换为DTO
        IPage<RouteDTO> dtoPage = new Page<>(routePage.getCurrent(), routePage.getSize(), routePage.getTotal());
        dtoPage.setRecords(routePage.getRecords().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList()));
        
        return dtoPage;
    }
    
    /**
     * 根据ID获取路线详情
     */
    public RouteDTO getRouteById(Long routeId) {
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("路线不存在: " + routeId);
        }
        
        RouteDTO dto = convertToDTO(route);
        
        // 加载图片
        dto.setImageIds(getRouteImageIds(routeId));
        
        // 加载亮点
        dto.setHighlights(getRouteHighlights(routeId));
        
        return dto;
    }
    
    /**
     * 创建路线
     */
    @Transactional(rollbackFor = Exception.class)
    public RouteDTO createRoute(CreateRouteRequest request, Long userId) {
        log.info("创建路线: nameZh={}, userId={}", request.getNameZh(), userId);
        
        // 验证slug唯一性
        if (slugExists(request.getSlug(), null)) {
            throw new RuntimeException("Slug已存在: " + request.getSlug());
        }
        
        // 创建路线
        Route route = new Route();
        BeanUtils.copyProperties(request, route);
        route.setStatus("draft");
        route.setIsFeatured(false);
        route.setViewCount(0);
        route.setBookingCount(0);
        route.setCreatedBy(userId);
        
        routeMapper.insert(route);
        log.info("路线创建成功: routeId={}", route.getId());

        syncPublicRoute(route);
        
        // 保存图片
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            saveRouteImages(route.getId(), request.getImageIds());
        }
        
        // 保存亮点
        if (request.getHighlights() != null && !request.getHighlights().isEmpty()) {
            saveRouteHighlights(route.getId(), request.getHighlights());
        }
        
        return getRouteById(route.getId());
    }
    
    /**
     * 更新路线
     */
    @Transactional(rollbackFor = Exception.class)
    public RouteDTO updateRoute(Long routeId, UpdateRouteRequest request, Long userId) {
        log.info("更新路线: routeId={}, userId={}", routeId, userId);
        
        // 获取当前路线
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("路线不存在: " + routeId);
        }
        
        // 验证版本号(乐观锁)
        if (request.getVersion() != null && !route.getVersion().equals(request.getVersion())) {
            throw new RuntimeException("路线已被其他用户修改，请刷新后重试");
        }
        
        // 验证slug唯一性
        if (request.getSlug() != null && !request.getSlug().equals(route.getSlug())) {
            if (slugExists(request.getSlug(), routeId)) {
                throw new RuntimeException("Slug已存在: " + request.getSlug());
            }
        }
        
        // 更新路线基本信息
        if (request.getNameZh() != null) route.setNameZh(request.getNameZh());
        if (request.getNameEn() != null) route.setNameEn(request.getNameEn());
        if (request.getSlug() != null) route.setSlug(request.getSlug());
        if (request.getShortDescZh() != null) route.setShortDescZh(request.getShortDescZh());
        if (request.getShortDescEn() != null) route.setShortDescEn(request.getShortDescEn());
        if (request.getFullDescZh() != null) route.setFullDescZh(request.getFullDescZh());
        if (request.getFullDescEn() != null) route.setFullDescEn(request.getFullDescEn());
        if (request.getDistance() != null) route.setDistance(request.getDistance());
        if (request.getDifficulty() != null) route.setDifficulty(request.getDifficulty());
        if (request.getDuration() != null) route.setDuration(request.getDuration());
        if (request.getPrice() != null) route.setPrice(request.getPrice());
        if (request.getCoverImageId() != null) route.setCoverImageId(request.getCoverImageId());
        if (request.getStatus() != null) route.setStatus(request.getStatus());
        if (request.getIsFeatured() != null) route.setIsFeatured(request.getIsFeatured());
        
        int updated = routeMapper.updateById(route);
        if (updated == 0) {
            throw new RuntimeException("更新失败，路线可能已被其他用户修改");
        }

        syncPublicRoute(route);
        
        // 更新图片
        if (request.getImageIds() != null) {
            deleteRouteImages(routeId);
            saveRouteImages(routeId, request.getImageIds());
        }
        
        // 更新亮点
        if (request.getHighlights() != null) {
            deleteRouteHighlights(routeId);
            saveRouteHighlights(routeId, request.getHighlights());
        }
        
        log.info("路线更新成功: routeId={}", routeId);
        return getRouteById(routeId);
    }
    
    /**
     * 删除路线
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteRoute(Long routeId) {
        log.info("删除路线: routeId={}", routeId);
        
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("路线不存在: " + routeId);
        }
        
        // 删除关联数据
        deleteRouteImages(routeId);
        deleteRouteHighlights(routeId);
        
        // 删除路线
        routeMapper.deleteById(routeId);
        log.info("路线删除成功: routeId={}", routeId);
    }
    
    /**
     * 发布路线
     */
    public RouteDTO publishRoute(Long routeId) {
        log.info("发布路线: routeId={}", routeId);
        
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("路线不存在: " + routeId);
        }
        
        route.setStatus("published");
        routeMapper.updateById(route);

        syncPublicRoute(route);
        
        log.info("路线发布成功: routeId={}", routeId);
        return getRouteById(routeId);
    }

    /**
     * 将 CMS 路线信息同步到公开 routes 表，确保官网 /routes 页面展示最新内容。
     */
    private void syncPublicRoute(Route cmsRoute) {
        if (!isPublicRoutesTableAvailable()) {
            return;
        }

        try {
            com.manqiyou.app.entity.Route publicRoute = publicRouteMapper.selectById(cmsRoute.getId());
            if (publicRoute == null) {
                log.warn("Public route not found for cmsRouteId={}, skip sync", cmsRoute.getId());
                return;
            }

            if (StringUtils.hasText(cmsRoute.getNameZh())) {
                publicRoute.setName(cmsRoute.getNameZh());
            }
            if (StringUtils.hasText(cmsRoute.getNameEn())) {
                publicRoute.setNameEn(cmsRoute.getNameEn());
            }

            // Map cms_routes.coverImageId to the public routes cover image when sync is available.
            if (cmsRoute.getCoverImageId() != null) {
                Asset asset = assetService.getAssetById(cmsRoute.getCoverImageId());
                String url = asset.getLargeUrl();
                if (!StringUtils.hasText(url)) url = asset.getMediumUrl();
                if (!StringUtils.hasText(url)) url = asset.getFileUrl();
                if (StringUtils.hasText(url)) {
                    publicRoute.setCoverImage(url);
                }
            }

            publicRouteMapper.updateById(publicRoute);
        } catch (Exception e) {
            // Sync failures should not break CMS writes.
            log.warn("Failed to sync public route for cmsRouteId={}: {}", cmsRoute.getId(), e.getMessage());
        }
    }

    private boolean isPublicRoutesTableAvailable() {
        if (publicRoutesTableAvailable != null) {
            return publicRoutesTableAvailable;
        }

        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'routes'",
                Integer.class
            );
            publicRoutesTableAvailable = count != null && count > 0;
            if (!publicRoutesTableAvailable) {
                log.info("Public routes table 'routes' not found, skip route sync.");
            }
        } catch (Exception e) {
            publicRoutesTableAvailable = false;
            log.warn("Failed to inspect public routes table: {}", e.getMessage());
        }

        return publicRoutesTableAvailable;
    }

    /**
     * Get route statistics.
     */
    public RouteStatistics getRouteStatistics(Long routeId) {
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new RuntimeException("路线不存在: " + routeId);
        }
        
        RouteStatistics stats = new RouteStatistics();
        stats.setRouteId(routeId);
        stats.setViewCount(route.getViewCount());
        stats.setBookingCount(route.getBookingCount());
        
        return stats;
    }
    
    // ========== 私有辅助方法 ==========
    
    /**
     * 检查slug是否存在
     */
    private boolean slugExists(String slug, Long excludeId) {
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Route::getSlug, slug);
        if (excludeId != null) {
            wrapper.ne(Route::getId, excludeId);
        }
        return routeMapper.selectCount(wrapper) > 0;
    }
    
    /**
     * 获取路线图片ID列表
     */
    private List<Long> getRouteImageIds(Long routeId) {
        LambdaQueryWrapper<RouteImage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RouteImage::getRouteId, routeId)
               .orderByAsc(RouteImage::getDisplayOrder);
        return routeImageMapper.selectList(wrapper).stream()
            .map(RouteImage::getAssetId)
            .collect(Collectors.toList());
    }
    
    /**
     * 获取路线亮点列表
     */
    private List<RouteHighlightDTO> getRouteHighlights(Long routeId) {
        LambdaQueryWrapper<RouteHighlight> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RouteHighlight::getRouteId, routeId)
               .orderByAsc(RouteHighlight::getDisplayOrder);
        return routeHighlightMapper.selectList(wrapper).stream()
            .map(this::convertHighlightToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 保存路线图片
     */
    private void saveRouteImages(Long routeId, List<Long> imageIds) {
        for (int i = 0; i < imageIds.size(); i++) {
            RouteImage routeImage = new RouteImage();
            routeImage.setRouteId(routeId);
            routeImage.setAssetId(imageIds.get(i));
            routeImage.setDisplayOrder(i);
            routeImageMapper.insert(routeImage);
        }
    }
    
    /**
     * 保存路线亮点
     */
    private void saveRouteHighlights(Long routeId, List<RouteHighlightDTO> highlights) {
        for (int i = 0; i < highlights.size(); i++) {
            RouteHighlightDTO dto = highlights.get(i);
            RouteHighlight highlight = new RouteHighlight();
            highlight.setRouteId(routeId);
            highlight.setTitleZh(dto.getTitleZh());
            highlight.setTitleEn(dto.getTitleEn());
            highlight.setDescriptionZh(dto.getDescriptionZh());
            highlight.setDescriptionEn(dto.getDescriptionEn());
            highlight.setDisplayOrder(i);
            routeHighlightMapper.insert(highlight);
        }
    }
    
    /**
     * 删除路线图片
     */
    private void deleteRouteImages(Long routeId) {
        LambdaQueryWrapper<RouteImage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RouteImage::getRouteId, routeId);
        routeImageMapper.delete(wrapper);
    }
    
    /**
     * 删除路线亮点
     */
    private void deleteRouteHighlights(Long routeId) {
        LambdaQueryWrapper<RouteHighlight> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RouteHighlight::getRouteId, routeId);
        routeHighlightMapper.delete(wrapper);
    }
    
    /**
     * 转换为DTO
     */
    private RouteDTO convertToDTO(Route route) {
        RouteDTO dto = new RouteDTO();
        BeanUtils.copyProperties(route, dto);
        
        // Populate cover image URL
        if (route.getCoverImageId() != null) {
            Asset asset = assetMapper.selectById(route.getCoverImageId());
            if (asset != null) {
                dto.setCoverImageUrl(asset.getFileUrl());
            }
        }
        
        return dto;
    }
    
    /**
     * 转换亮点为DTO
     */
    private RouteHighlightDTO convertHighlightToDTO(RouteHighlight highlight) {
        RouteHighlightDTO dto = new RouteHighlightDTO();
        BeanUtils.copyProperties(highlight, dto);
        return dto;
    }
    
    /**
     * 路线统计内部类
     */
    public static class RouteStatistics {
        private Long routeId;
        private Integer viewCount;
        private Integer bookingCount;
        
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
        
        public Integer getViewCount() { return viewCount; }
        public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
        
        public Integer getBookingCount() { return bookingCount; }
        public void setBookingCount(Integer bookingCount) { this.bookingCount = bookingCount; }
    }
}
