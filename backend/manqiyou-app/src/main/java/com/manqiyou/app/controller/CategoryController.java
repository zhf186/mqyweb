package com.manqiyou.app.controller;

import com.manqiyou.app.common.Result;
import com.manqiyou.app.entity.Category;
import com.manqiyou.app.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类 API
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * 获取所有分类
     */
    @GetMapping
    public Result<List<Category>> getAllCategories() {
        return Result.success(categoryService.getAllCategories());
    }

    /**
     * 获取分类详情
     */
    @GetMapping("/{id}")
    public Result<Category> getCategory(@PathVariable Long id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error(404, "分类不存在");
        }
        return Result.success(category);
    }
}
