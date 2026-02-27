package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.manqiyou.app.cms.dto.ProductDTO;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.entity.Product;
import com.manqiyou.app.cms.entity.ProductImage;
import com.manqiyou.app.cms.mapper.AssetMapper;
import com.manqiyou.app.cms.mapper.ProductImageMapper;
import com.manqiyou.app.cms.mapper.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 商品管理服务
 */
@Service
public class ProductService {
    
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    
    @Autowired
    private ProductMapper productMapper;
    
    @Autowired
    private ProductImageMapper productImageMapper;
    
    @Autowired
    private AssetMapper assetMapper;
    
    /**
     * 分页查询商品列表
     */
    public IPage<ProductDTO> listProducts(int page, int limit, String status, String category, String search) {
        Page<Product> pageParam = new Page<>(page, limit);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(status)) {
            wrapper.eq(Product::getStatus, status);
        }
        if (StringUtils.hasText(category)) {
            wrapper.eq(Product::getCategory, category);
        }
        if (StringUtils.hasText(search)) {
            wrapper.and(w -> w.like(Product::getNameZh, search)
                             .or()
                             .like(Product::getNameEn, search));
        }
        
        wrapper.orderByDesc(Product::getCreatedAt);
        
        IPage<Product> productPage = productMapper.selectPage(pageParam, wrapper);
        
        IPage<ProductDTO> dtoPage = new Page<>(productPage.getCurrent(), productPage.getSize(), productPage.getTotal());
        dtoPage.setRecords(productPage.getRecords().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList()));
        
        return dtoPage;
    }
    
    /**
     * 根据ID获取商品详情
     */
    public ProductDTO getProductById(Long productId) {
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在: " + productId);
        }
        
        ProductDTO dto = convertToDTO(product);
        dto.setImageIds(getProductImageIds(productId));
        
        return dto;
    }
    
    /**
     * 创建商品
     */
    @Transactional(rollbackFor = Exception.class)
    public ProductDTO createProduct(ProductDTO request, Long userId) {
        log.info("创建商品: nameZh={}, userId={}", request.getNameZh(), userId);
        
        Product product = new Product();
        BeanUtils.copyProperties(request, product);
        if (product.getStatus() == null || product.getStatus().isEmpty()) {
            product.setStatus("draft");
        }
        product.setViewCount(0);
        product.setSaleCount(0);
        product.setCreatedBy(userId);
        
        productMapper.insert(product);
        log.info("商品创建成功: productId={}", product.getId());
        
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            saveProductImages(product.getId(), request.getImageIds());
        }
        
        return getProductById(product.getId());
    }
    
    /**
     * 更新商品
     */
    @Transactional(rollbackFor = Exception.class)
    public ProductDTO updateProduct(Long productId, ProductDTO request) {
        log.info("更新商品: productId={}", productId);
        
        Product product = productMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在: " + productId);
        }
        
        if (request.getVersion() != null && !product.getVersion().equals(request.getVersion())) {
            throw new RuntimeException("商品已被其他用户修改，请刷新后重试");
        }
        
        BeanUtils.copyProperties(request, product, "id", "createdBy", "createdAt", "version");
        
        int updated = productMapper.updateById(product);
        if (updated == 0) {
            throw new RuntimeException("更新失败，商品可能已被其他用户修改");
        }
        
        if (request.getImageIds() != null) {
            deleteProductImages(productId);
            saveProductImages(productId, request.getImageIds());
        }
        
        log.info("商品更新成功: productId={}", productId);
        return getProductById(productId);
    }
    
    /**
     * 删除商品
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long productId) {
        log.info("删除商品: productId={}", productId);
        
        deleteProductImages(productId);
        productMapper.deleteById(productId);
        
        log.info("商品删除成功: productId={}", productId);
    }
    
    // ========== 私有辅助方法 ==========
    
    private List<Long> getProductImageIds(Long productId) {
        LambdaQueryWrapper<ProductImage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductImage::getProductId, productId)
               .orderByAsc(ProductImage::getDisplayOrder);
        return productImageMapper.selectList(wrapper).stream()
            .map(ProductImage::getAssetId)
            .collect(Collectors.toList());
    }
    
    private void saveProductImages(Long productId, List<Long> imageIds) {
        for (int i = 0; i < imageIds.size(); i++) {
            ProductImage productImage = new ProductImage();
            productImage.setProductId(productId);
            productImage.setAssetId(imageIds.get(i));
            productImage.setDisplayOrder(i);
            productImageMapper.insert(productImage);
        }
    }
    
    private void deleteProductImages(Long productId) {
        LambdaQueryWrapper<ProductImage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductImage::getProductId, productId);
        productImageMapper.delete(wrapper);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        BeanUtils.copyProperties(product, dto);
        
        // Populate cover image URL
        if (product.getCoverImageId() != null) {
            Asset asset = assetMapper.selectById(product.getCoverImageId());
            if (asset != null) {
                dto.setCoverImageUrl(asset.getFileUrl());
            }
        }
        
        return dto;
    }
}
