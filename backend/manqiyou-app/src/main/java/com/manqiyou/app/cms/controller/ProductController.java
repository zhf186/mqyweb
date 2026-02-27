package com.manqiyou.app.cms.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.manqiyou.app.cms.dto.ProductDTO;
import com.manqiyou.app.cms.security.AdminSecurityUtils;
import com.manqiyou.app.cms.service.ProductService;
import com.manqiyou.app.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Product management controller.
 */
@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping
    public Result<IPage<ProductDTO>> listProducts(@RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int limit,
                                                  @RequestParam(required = false) String status,
                                                  @RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String search) {
        IPage<ProductDTO> products = productService.listProducts(page, limit, status, category, search);
        return Result.success(products);
    }

    @GetMapping("/{productId}")
    public Result<ProductDTO> getProduct(@PathVariable Long productId) {
        ProductDTO product = productService.getProductById(productId);
        return Result.success(product);
    }

    @PostMapping
    public Result<ProductDTO> createProduct(@RequestBody ProductDTO request,
                                            Authentication authentication) {
        Long userId = AdminSecurityUtils.getCurrentUserId(authentication);
        log.info("Creating product {} by user {}", request.getNameZh(), userId);

        ProductDTO product = productService.createProduct(request, userId);
        return Result.success(product);
    }

    @PutMapping("/{productId}")
    public Result<ProductDTO> updateProduct(@PathVariable Long productId,
                                            @RequestBody ProductDTO request) {
        ProductDTO product = productService.updateProduct(productId, request);
        return Result.success(product);
    }

    @DeleteMapping("/{productId}")
    public Result<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return Result.success(null);
    }
}