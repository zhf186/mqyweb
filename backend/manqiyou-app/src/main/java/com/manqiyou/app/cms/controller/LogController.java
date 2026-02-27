package com.manqiyou.app.cms.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.manqiyou.app.cms.entity.OperationLog;
import com.manqiyou.app.cms.mapper.OperationLogMapper;
import com.manqiyou.app.common.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * 操作日志 Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
public class LogController {
    
    private final OperationLogMapper operationLogMapper;
    
    /**
     * 查询操作日志列表（支持筛选和分页）
     */
    @GetMapping
    public Result<IPage<OperationLog>> getLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resourceType,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer limit
    ) {
        log.info("Querying operation logs: page={}, limit={}, userId={}, action={}", 
            page, limit, userId, action);
        
        // 构建查询条件
        LambdaQueryWrapper<OperationLog> wrapper = new LambdaQueryWrapper<>();
        
        if (startDate != null) {
            wrapper.ge(OperationLog::getCreatedAt, startDate);
        }
        if (endDate != null) {
            wrapper.le(OperationLog::getCreatedAt, endDate);
        }
        if (userId != null) {
            wrapper.eq(OperationLog::getUserId, userId);
        }
        if (action != null && !action.isEmpty()) {
            wrapper.eq(OperationLog::getAction, action);
        }
        if (resourceType != null && !resourceType.isEmpty()) {
            wrapper.eq(OperationLog::getResourceType, resourceType);
        }
        
        // 按创建时间倒序排列
        wrapper.orderByDesc(OperationLog::getCreatedAt);
        
        // 分页查询
        Page<OperationLog> pageParam = new Page<>(page, limit);
        IPage<OperationLog> result = operationLogMapper.selectPage(pageParam, wrapper);
        
        return Result.success(result);
    }
    
    /**
     * 获取单个日志详情
     */
    @GetMapping("/{logId}")
    public Result<OperationLog> getLogById(@PathVariable Long logId) {
        log.info("Getting operation log: {}", logId);
        
        OperationLog log = operationLogMapper.selectById(logId);
        if (log == null) {
            return Result.error(404, "Log not found");
        }
        
        return Result.success(log);
    }
}
