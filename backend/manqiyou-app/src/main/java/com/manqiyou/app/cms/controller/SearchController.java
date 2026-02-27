package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.SearchResultDTO;
import com.manqiyou.app.cms.service.SearchService;
import com.manqiyou.app.common.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 搜索控制器
 * Requirements: 17.1, 17.2, 17.3
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    /**
     * 全局搜索
     * 
     * @param keyword 搜索关键词
     * @param types 搜索类型（可选，逗号分隔：content,route,product,asset）
     * @return 搜索结果列表
     */
    @GetMapping
    public Result<List<SearchResultDTO>> search(
            @RequestParam String keyword,
            @RequestParam(required = false) List<String> types) {
        
        log.info("Search request: keyword={}, types={}", keyword, types);
        
        List<SearchResultDTO> results = searchService.globalSearch(keyword, types);
        
        return Result.success(results);
    }
}
