package com.manqiyou.app.cms.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.manqiyou.app.cms.entity.Product;
import org.apache.ibatis.annotations.Mapper;

/**
 * CMS商品Mapper
 */
@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
