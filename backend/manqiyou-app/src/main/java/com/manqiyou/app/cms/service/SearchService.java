package com.manqiyou.app.cms.service;

import com.manqiyou.app.cms.dto.SearchResultDTO;
import com.manqiyou.app.cms.entity.*;
import com.manqiyou.app.cms.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 搜索服务
 * Requirements: 17.1, 17.2, 17.3
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final ContentItemMapper contentItemMapper;
    private final CmsRouteMapper routeMapper;
    private final ProductMapper productMapper;
    private final AssetMapper assetMapper;

    /**
     * 全局搜索
     * 
     * @param keyword 搜索关键词
     * @param types 搜索类型（可选，为空则搜索所有类型）
     * @return 搜索结果列表
     */
    public List<SearchResultDTO> globalSearch(String keyword, List<String> types) {
        log.info("Global search: keyword={}, types={}", keyword, types);
        
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        List<SearchResultDTO> results = new ArrayList<>();
        
        // 搜索内容项
        if (types == null || types.isEmpty() || types.contains("content")) {
            results.addAll(searchContent(keyword));
        }
        
        // 搜索路线
        if (types == null || types.isEmpty() || types.contains("route")) {
            results.addAll(searchRoutes(keyword));
        }
        
        // 搜索商品
        if (types == null || types.isEmpty() || types.contains("product")) {
            results.addAll(searchProducts(keyword));
        }
        
        // 搜索资源
        if (types == null || types.isEmpty() || types.contains("asset")) {
            results.addAll(searchAssets(keyword));
        }
        
        // 按更新时间倒序排序
        results.sort((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()));
        
        log.info("Search completed: found {} results", results.size());
        return results;
    }

    /**
     * 搜索内容项
     */
    private List<SearchResultDTO> searchContent(String keyword) {
        LambdaQueryWrapper<ContentItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(w -> w
            .like(ContentItem::getContentZh, keyword)
            .or()
            .like(ContentItem::getContentEn, keyword)
            .or()
            .like(ContentItem::getFieldKey, keyword)
        );
        
        List<ContentItem> items = contentItemMapper.selectList(wrapper);
        
        return items.stream().map(item -> {
            SearchResultDTO result = new SearchResultDTO();
            result.setId(item.getId().toString());
            result.setType("content");
            result.setTitle(item.getFieldKey());
            result.setDescription(truncate(item.getContentZh(), 100));
            result.setUrl("/admin/content?itemId=" + item.getId());
            result.setUpdatedAt(item.getUpdatedAt());
            result.setHighlightedText(highlightKeyword(item.getContentZh(), keyword));
            return result;
        }).collect(Collectors.toList());
    }

    /**
     * 搜索路线
     */
    private List<SearchResultDTO> searchRoutes(String keyword) {
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(w -> w
            .like(Route::getNameZh, keyword)
            .or()
            .like(Route::getNameEn, keyword)
            .or()
            .like(Route::getShortDescZh, keyword)
            .or()
            .like(Route::getShortDescEn, keyword)
        );
        
        List<Route> routes = routeMapper.selectList(wrapper);
        
        return routes.stream().map(route -> {
            SearchResultDTO result = new SearchResultDTO();
            result.setId(route.getId().toString());
            result.setType("route");
            result.setTitle(route.getNameZh());
            result.setDescription(truncate(route.getShortDescZh(), 100));
            result.setUrl("/admin/routes/" + route.getId());
            result.setUpdatedAt(route.getUpdatedAt());
            result.setHighlightedText(highlightKeyword(route.getNameZh(), keyword));
            return result;
        }).collect(Collectors.toList());
    }

    /**
     * 搜索商品
     */
    private List<SearchResultDTO> searchProducts(String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(w -> w
            .like(Product::getNameZh, keyword)
            .or()
            .like(Product::getNameEn, keyword)
            .or()
            .like(Product::getShortDescZh, keyword)
            .or()
            .like(Product::getShortDescEn, keyword)
        );
        
        List<Product> products = productMapper.selectList(wrapper);
        
        return products.stream().map(product -> {
            SearchResultDTO result = new SearchResultDTO();
            result.setId(product.getId().toString());
            result.setType("product");
            result.setTitle(product.getNameZh());
            result.setDescription(truncate(product.getShortDescZh(), 100));
            result.setUrl("/admin/products/" + product.getId());
            result.setUpdatedAt(product.getUpdatedAt());
            result.setHighlightedText(highlightKeyword(product.getNameZh(), keyword));
            return result;
        }).collect(Collectors.toList());
    }

    /**
     * 搜索资源
     */
    private List<SearchResultDTO> searchAssets(String keyword) {
        LambdaQueryWrapper<Asset> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(w -> w
            .like(Asset::getOriginalFilename, keyword)
            .or()
            .like(Asset::getAltTextZh, keyword)
            .or()
            .like(Asset::getAltTextEn, keyword)
            .or()
            .like(Asset::getCategory, keyword)
        );
        
        List<Asset> assets = assetMapper.selectList(wrapper);
        
        return assets.stream().map(asset -> {
            SearchResultDTO result = new SearchResultDTO();
            result.setId(asset.getId().toString());
            result.setType("asset");
            result.setTitle(asset.getOriginalFilename());
            result.setDescription(asset.getCategory() + " - " + asset.getAltTextZh());
            result.setUrl("/admin/assets?assetId=" + asset.getId());
            result.setThumbnailUrl(asset.getThumbnailUrl());
            result.setUpdatedAt(asset.getUpdatedAt());
            result.setHighlightedText(highlightKeyword(asset.getOriginalFilename(), keyword));
            return result;
        }).collect(Collectors.toList());
    }

    /**
     * 截断文本
     */
    private String truncate(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    /**
     * 高亮关键词
     */
    private String highlightKeyword(String text, String keyword) {
        if (text == null || keyword == null) {
            return text;
        }
        
        // 简单的高亮实现，使用<mark>标签
        String lowerText = text.toLowerCase();
        String lowerKeyword = keyword.toLowerCase();
        
        int index = lowerText.indexOf(lowerKeyword);
        if (index == -1) {
            return truncate(text, 200);
        }
        
        // 获取关键词前后的上下文
        int start = Math.max(0, index - 50);
        int end = Math.min(text.length(), index + keyword.length() + 50);
        
        String snippet = text.substring(start, end);
        String highlighted = snippet.replaceAll(
            "(?i)" + keyword, 
            "<mark>$0</mark>"
        );
        
        return (start > 0 ? "..." : "") + highlighted + (end < text.length() ? "..." : "");
    }
}
