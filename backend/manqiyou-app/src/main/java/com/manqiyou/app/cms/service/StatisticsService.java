package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.dto.DashboardStatsDTO;
import com.manqiyou.app.cms.dto.RouteStatsDTO;
import com.manqiyou.app.cms.entity.*;
import com.manqiyou.app.cms.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 统计服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {
    
    private final PageMapper pageMapper;
    private final AssetMapper assetMapper;
    private final CmsRouteMapper routeMapper;
    private final ProductMapper productMapper;
    private final ContentItemMapper contentItemMapper;
    private final OperationLogMapper operationLogMapper;
    
    /**
     * 获取仪表盘统计数据
     */
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // 统计总数
        stats.setTotalPages(pageMapper.selectCount(null));
        stats.setTotalAssets(assetMapper.selectCount(null));
        stats.setTotalRoutes(routeMapper.selectCount(null));
        stats.setTotalProducts(productMapper.selectCount(null));
        
        // 最近更新
        stats.setRecentUpdates(getRecentUpdates());
        
        // 待办事项
        stats.setTodoItems(getTodoItems());
        
        return stats;
    }
    
    /**
     * 获取最近更新列表
     */
    private List<DashboardStatsDTO.RecentUpdate> getRecentUpdates() {
        List<DashboardStatsDTO.RecentUpdate> updates = new ArrayList<>();
        
        // 获取最近7天的操作日志
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        LambdaQueryWrapper<OperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(OperationLog::getCreatedAt, sevenDaysAgo)
               .in(OperationLog::getAction, "create", "update", "publish")
               .orderByDesc(OperationLog::getCreatedAt)
               .last("LIMIT 10");
        
        List<OperationLog> logs = operationLogMapper.selectList(wrapper);
        
        for (OperationLog log : logs) {
            DashboardStatsDTO.RecentUpdate update = new DashboardStatsDTO.RecentUpdate();
            update.setType(log.getResourceType());
            update.setTitle(getResourceTitle(log.getResourceType(), log.getResourceId()));
            update.setUpdatedBy(getUserName(log.getUserId()));
            update.setUpdatedAt(log.getCreatedAt().toString());
            updates.add(update);
        }
        
        return updates;
    }
    
    /**
     * 获取待办事项
     */
    private DashboardStatsDTO.TodoItems getTodoItems() {
        DashboardStatsDTO.TodoItems todoItems = new DashboardStatsDTO.TodoItems();
        
        // 统计缺失翻译的内容
        LambdaQueryWrapper<ContentItem> missingTransWrapper = new LambdaQueryWrapper<>();
        missingTransWrapper.and(w -> w.isNull(ContentItem::getContentZh).or().eq(ContentItem::getContentZh, ""))
                          .or(w -> w.isNull(ContentItem::getContentEn).or().eq(ContentItem::getContentEn, ""));
        todoItems.setMissingTranslations(contentItemMapper.selectCount(missingTransWrapper));
        
        // 统计待发布的草稿
        LambdaQueryWrapper<Route> draftRoutesWrapper = new LambdaQueryWrapper<>();
        draftRoutesWrapper.eq(Route::getStatus, "draft");
        Long draftRoutes = routeMapper.selectCount(draftRoutesWrapper);
        
        LambdaQueryWrapper<Product> draftProductsWrapper = new LambdaQueryWrapper<>();
        draftProductsWrapper.eq(Product::getStatus, "draft");
        Long draftProducts = productMapper.selectCount(draftProductsWrapper);
        
        todoItems.setPendingDrafts(draftRoutes + draftProducts);
        
        return todoItems;
    }
    
    /**
     * 获取路线统计数据
     */
    public RouteStatsDTO getRouteStats(Long routeId) {
        Route route = routeMapper.selectById(routeId);
        if (route == null) {
            throw new IllegalArgumentException("Route not found: " + routeId);
        }
        
        RouteStatsDTO stats = new RouteStatsDTO();
        stats.setViews(route.getViewCount());
        stats.setBookings(route.getBookingCount());
        
        // 计算收入 = 预订量 * 价格
        if (route.getPrice() != null && route.getBookingCount() != null) {
            stats.setRevenue(route.getPrice().doubleValue() * route.getBookingCount());
        } else {
            stats.setRevenue(0.0);
        }
        
        return stats;
    }
    
    /**
     * 获取资源标题
     */
    private String getResourceTitle(String resourceType, Long resourceId) {
        if (resourceId == null) {
            return "Unknown";
        }
        
        switch (resourceType) {
            case "content":
                ContentItem content = contentItemMapper.selectById(resourceId);
                return content != null ? content.getFieldKey() : "Unknown Content";
            case "page":
                Page page = pageMapper.selectById(resourceId);
                return page != null ? page.getNameZh() : "Unknown Page";
            case "route":
                Route route = routeMapper.selectById(resourceId);
                return route != null ? route.getNameZh() : "Unknown Route";
            case "product":
                Product product = productMapper.selectById(resourceId);
                return product != null ? product.getNameZh() : "Unknown Product";
            case "asset":
                Asset asset = assetMapper.selectById(resourceId);
                return asset != null ? asset.getOriginalFilename() : "Unknown Asset";
            default:
                return "Unknown";
        }
    }
    
    /**
     * 获取用户名
     */
    private String getUserName(Long userId) {
        // TODO: 从AdminUser表获取用户名
        return "Admin User " + userId;
    }
}
