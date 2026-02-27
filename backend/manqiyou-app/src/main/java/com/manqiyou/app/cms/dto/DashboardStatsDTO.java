package com.manqiyou.app.cms.dto;

import lombok.Data;

import java.util.List;

/**
 * 仪表盘统计数据 DTO
 */
@Data
public class DashboardStatsDTO {
    
    /**
     * 总页面数
     */
    private Long totalPages;
    
    /**
     * 总图片数
     */
    private Long totalAssets;
    
    /**
     * 总路线数
     */
    private Long totalRoutes;
    
    /**
     * 总商品数
     */
    private Long totalProducts;
    
    /**
     * 最近更新列表
     */
    private List<RecentUpdate> recentUpdates;
    
    /**
     * 待办事项
     */
    private TodoItems todoItems;
    
    /**
     * 最近更新项
     */
    @Data
    public static class RecentUpdate {
        private String type; // 'content', 'asset', 'route', 'product'
        private String title;
        private String updatedBy;
        private String updatedAt;
    }
    
    /**
     * 待办事项
     */
    @Data
    public static class TodoItems {
        /**
         * 缺失翻译的内容数
         */
        private Long missingTranslations;
        
        /**
         * 待发布的草稿数
         */
        private Long pendingDrafts;
    }
}
