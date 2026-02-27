package com.manqiyou.app.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 搜索结果DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {
    private String id;
    private String type; // 'content', 'route', 'product', 'asset'
    private String title;
    private String description;
    private String url; // 跳转链接
    private String thumbnailUrl;
    private LocalDateTime updatedAt;
    private String highlightedText; // 高亮的匹配文本
}
