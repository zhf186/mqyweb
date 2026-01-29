package com.manqiyou.app.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.manqiyou.app.entity.Category;
import com.manqiyou.app.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 分类服务
 */
@Service
public class CategoryService extends ServiceImpl<CategoryMapper, Category> {

    /**
     * 获取所有分类
     */
    public List<Category> getAllCategories() {
        return lambdaQuery()
            .orderByAsc(Category::getSortOrder)
            .list();
    }
}
