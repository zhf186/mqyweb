package com.manqiyou.common.core.result;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页结果
 */
@Data
public class PageResult<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private List<T> items;
    private Long total;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;

    public PageResult() {
    }

    public PageResult(List<T> items, Long total, Integer page, Integer pageSize) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) total / pageSize);
    }

    public static <T> PageResult<T> of(List<T> items, Long total, Integer page, Integer pageSize) {
        return new PageResult<>(items, total, page, pageSize);
    }
}
