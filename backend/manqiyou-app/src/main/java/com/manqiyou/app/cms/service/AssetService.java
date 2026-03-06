package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.manqiyou.app.cms.dto.AssetUploadRequest;
import com.manqiyou.app.cms.dto.AssetUploadResponse;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.entity.AssetUsage;
import com.manqiyou.app.cms.mapper.AssetMapper;
import com.manqiyou.app.cms.mapper.AssetUsageMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * 资源管理服务
 */
@Slf4j
@Service
public class AssetService {

    private static final String[] IMAGE_EXTENSIONS = { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp" };
    
    @Autowired
    private AssetMapper assetMapper;
    
    @Autowired
    private AssetUsageMapper assetUsageMapper;
    
    @Autowired
    private OssService ossService;
    
    @Autowired
    private ImageProcessingService imageProcessingService;
    
    /**
     * 上传图片资源
     *
     * @param file 上传的文件
     * @param request 上传请求参数
     * @param uploadedBy 上传者ID
     * @return 上传响应
     */
    @Transactional
    public AssetUploadResponse uploadImage(MultipartFile file, AssetUploadRequest request, Long uploadedBy) {
        try {
            // 验证文件
            validateImageFile(file);
            
            // 获取图片尺寸
            int[] dimensions = imageProcessingService.getImageDimensions(file.getInputStream());
            int width = dimensions[0];
            int height = dimensions[1];
            
            // 创建资源实体
            Asset asset = new Asset();
            asset.setCategory(request.getCategory());
            asset.setOriginalFilename(file.getOriginalFilename());
            asset.setFileSize(file.getSize());
            asset.setWidth(width);
            asset.setHeight(height);
            asset.setMimeType(file.getContentType());
            asset.setAltTextZh(request.getAltTextZh());
            asset.setAltTextEn(request.getAltTextEn());
            asset.setUploadedBy(uploadedBy);
            asset.setIsProcessed(false);
            asset.setWebpConverted(false);
            asset.setProcessingStatus("pending");
            
            // 如果启用自动处理
            if (Boolean.TRUE.equals(request.getAutoProcess())) {
                processAndUploadImage(file, asset);
            } else {
                // 直接上传原图
                uploadOriginalOnly(file, asset);
            }
            
            // 保存到数据库
            assetMapper.insert(asset);
            
            log.info("Successfully uploaded asset: {} (ID: {})", asset.getOriginalFilename(), asset.getId());
            
            return new AssetUploadResponse(asset);
            
        } catch (IOException e) {
            log.error("Failed to upload image", e);
            throw new RuntimeException("图片上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 批量上传图片
     *
     * @param files 文件列表
     * @param request 上传请求参数
     * @param uploadedBy 上传者ID
     * @return 上传响应列表
     */
    @Transactional
    public List<AssetUploadResponse> uploadImages(List<MultipartFile> files, AssetUploadRequest request, Long uploadedBy) {
        List<AssetUploadResponse> responses = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                AssetUploadResponse response = uploadImage(file, request, uploadedBy);
                responses.add(response);
            } catch (Exception e) {
                log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                // 继续处理其他文件
            }
        }

        if (responses.isEmpty()) {
            throw new RuntimeException("图片上传失败：所有文件均上传失败，请检查文件格式/大小或OSS配置");
        }
        
        return responses;
    }
    
    /**
     * 替换资源
     *
     * @param assetId 资源ID
     * @param file 新文件
     * @param uploadedBy 上传者ID
     * @return 更新后的资源
     */
    @Transactional
    public Asset replaceAsset(Long assetId, MultipartFile file, Long uploadedBy) {
        Asset asset = assetMapper.selectById(assetId);
        if (asset == null) {
            throw new RuntimeException("资源不存在");
        }
        
        try {
            // 删除旧文件
            deleteOssFiles(asset);
            
            // 验证新文件
            validateImageFile(file);
            
            // 获取新图片尺寸
            int[] dimensions = imageProcessingService.getImageDimensions(file.getInputStream());
            
            // 更新资源信息
            asset.setOriginalFilename(file.getOriginalFilename());
            asset.setFileSize(file.getSize());
            asset.setWidth(dimensions[0]);
            asset.setHeight(dimensions[1]);
            asset.setMimeType(file.getContentType());
            asset.setIsProcessed(false);
            asset.setWebpConverted(false);
            asset.setProcessingStatus("pending");
            
            // 处理并上传新图片
            processAndUploadImage(file, asset);
            
            // 更新数据库
            assetMapper.updateById(asset);
            
            log.info("Successfully replaced asset: {} (ID: {})", asset.getOriginalFilename(), asset.getId());
            
            return asset;
            
        } catch (IOException e) {
            log.error("Failed to replace asset", e);
            throw new RuntimeException("资源替换失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除资源
     *
     * @param assetId 资源ID
     */
    @Transactional
    public void deleteAsset(Long assetId) {
        Asset asset = assetMapper.selectById(assetId);
        if (asset == null) {
            throw new RuntimeException("资源不存在");
        }
        
        // 检查是否正在使用
        List<AssetUsage> usages = getAssetUsages(assetId);
        if (!usages.isEmpty()) {
            throw new RuntimeException("资源正在使用中，无法删除。使用位置数量: " + usages.size());
        }
        
        // 删除OSS文件
        deleteOssFiles(asset);
        
        // 删除数据库记录
        assetMapper.deleteById(assetId);
        
        log.info("Successfully deleted asset: {} (ID: {})", asset.getOriginalFilename(), asset.getId());
    }
    
    /**
     * 查询资源列表
     *
     * @param category 分类（可选）
     * @param search 搜索关键词（可选）
     * @param page 页码
     * @param limit 每页数量
     * @return 分页结果
     */
    public IPage<Asset> listAssets(String category, String search, int page, int limit) {
        bootstrapAssetsIfEmpty();

        Page<Asset> pageParam = new Page<>(page, limit);
        LambdaQueryWrapper<Asset> wrapper = new LambdaQueryWrapper<>();
        
        if (category != null && !category.isEmpty()) {
            wrapper.eq(Asset::getCategory, category);
        }
        
        if (search != null && !search.isEmpty()) {
            wrapper.and(w -> w
                .like(Asset::getOriginalFilename, search)
                .or()
                .like(Asset::getAltTextZh, search)
                .or()
                .like(Asset::getAltTextEn, search)
            );
        }
        
        wrapper.orderByDesc(Asset::getCreatedAt);

        IPage<Asset> result = assetMapper.selectPage(pageParam, wrapper);
        if (result.getRecords() != null) {
            result.getRecords().forEach(this::repairAssetFileSizeIfNeeded);
        }
        return result;
    }
    
    /**
     * 获取资源详情
     *
     * @param assetId 资源ID
     * @return 资源实体
     */
    public Asset getAssetById(Long assetId) {
        Asset asset = assetMapper.selectById(assetId);
        if (asset == null) {
            throw new RuntimeException("资源不存在");
        }
        repairAssetFileSizeIfNeeded(asset);
        return asset;
    }
    
    /**
     * 获取资源使用情况
     *
     * @param assetId 资源ID
     * @return 使用记录列表
     */
    public List<AssetUsage> getAssetUsages(Long assetId) {
        LambdaQueryWrapper<AssetUsage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssetUsage::getAssetId, assetId);
        return assetUsageMapper.selectList(wrapper);
    }
    
    /**
     * 记录资源使用
     *
     * @param assetId 资源ID
     * @param usageType 使用类型
     * @param usageId 使用实体ID
     * @param fieldName 字段名称
     */
    @Transactional
    public void recordAssetUsage(Long assetId, String usageType, Long usageId, String fieldName) {
        // 检查是否已存在
        LambdaQueryWrapper<AssetUsage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssetUsage::getAssetId, assetId)
               .eq(AssetUsage::getUsageType, usageType)
               .eq(AssetUsage::getUsageId, usageId)
               .eq(AssetUsage::getFieldName, fieldName);
        
        AssetUsage existing = assetUsageMapper.selectOne(wrapper);
        if (existing == null) {
            AssetUsage usage = new AssetUsage(assetId, usageType, usageId, fieldName);
            assetUsageMapper.insert(usage);
        }
    }
    
    /**
     * 删除资源使用记录
     *
     * @param assetId 资源ID
     * @param usageType 使用类型
     * @param usageId 使用实体ID
     */
    @Transactional
    public void removeAssetUsage(Long assetId, String usageType, Long usageId) {
        LambdaQueryWrapper<AssetUsage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AssetUsage::getAssetId, assetId)
               .eq(AssetUsage::getUsageType, usageType)
               .eq(AssetUsage::getUsageId, usageId);
        
        assetUsageMapper.delete(wrapper);
    }
    
    /**
     * 处理并上传图片（生成多尺寸）
     */
    private void processAndUploadImage(MultipartFile file, Asset asset) throws IOException {
        asset.setProcessingStatus("processing");
        
        try {
            // 处理图片生成多尺寸
            Map<String, byte[]> processedImages = imageProcessingService.processImage(
                file.getInputStream(),
                file.getOriginalFilename()
            );
            
            // 上传各个尺寸到OSS
            for (Map.Entry<String, byte[]> entry : processedImages.entrySet()) {
                String sizeName = entry.getKey();
                byte[] imageBytes = entry.getValue();
                
                // 生成文件名
                String filename = generateFilename(file.getOriginalFilename(), sizeName);
                
                // 上传到OSS
                String url = ossService.uploadBytes(imageBytes, filename, "image/jpeg");
                
                // 设置对应的URL
                switch (sizeName) {
                    case "original":
                        asset.setFileUrl(url);
                        asset.setFileKey(ossService.extractFileKey(url));
                        break;
                    case "large":
                        asset.setLargeUrl(url);
                        break;
                    case "medium":
                        asset.setMediumUrl(url);
                        break;
                    case "small":
                        asset.setSmallUrl(url);
                        break;
                    case "thumbnail":
                        asset.setThumbnailUrl(url);
                        break;
                }
            }
            
            asset.setIsProcessed(true);
            asset.setWebpConverted(true);
            asset.setProcessingStatus("completed");
            
        } catch (Exception e) {
            asset.setProcessingStatus("failed");
            log.error("Failed to process image", e);
            throw new IOException("图片处理失败: " + e.getMessage());
        }
    }
    
    /**
     * 仅上传原图
     */
    private void uploadOriginalOnly(MultipartFile file, Asset asset) throws IOException {
        String url = ossService.uploadFile(
            file.getInputStream(),
            file.getOriginalFilename(),
            file.getContentType()
        );
        
        asset.setFileUrl(url);
        asset.setFileKey(ossService.extractFileKey(url));
        asset.setIsProcessed(false);
        asset.setWebpConverted(false);
        asset.setProcessingStatus("completed");
    }
    
    /**
     * 删除OSS文件
     */
    private void deleteOssFiles(Asset asset) {
        try {
            if (asset.getFileKey() != null) {
                ossService.deleteFile(asset.getFileKey());
            }
            
            // 删除各尺寸文件
            if (asset.getLargeUrl() != null) {
                ossService.deleteFile(ossService.extractFileKey(asset.getLargeUrl()));
            }
            if (asset.getMediumUrl() != null) {
                ossService.deleteFile(ossService.extractFileKey(asset.getMediumUrl()));
            }
            if (asset.getSmallUrl() != null) {
                ossService.deleteFile(ossService.extractFileKey(asset.getSmallUrl()));
            }
            if (asset.getThumbnailUrl() != null) {
                ossService.deleteFile(ossService.extractFileKey(asset.getThumbnailUrl()));
            }
        } catch (Exception e) {
            log.error("Failed to delete OSS files for asset: {}", asset.getId(), e);
            // 不抛出异常，继续执行
        }
    }
    
    /**
     * 生成文件名
     */
    private String generateFilename(String originalFilename, String sizeName) {
        String baseName = originalFilename;
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            baseName = originalFilename.substring(0, dotIndex);
        }
        
        if ("original".equals(sizeName)) {
            return baseName + ".jpg";
        } else {
            return baseName + "_" + sizeName + ".jpg";
        }
    }
    
    /**
     * 验证图片文件
     */
    private void validateImageFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("文件不能为空");
        }
        
        // 验证文件大小（最大5MB）
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IOException("文件大小不能超过5MB");
        }
        
        // 验证文件类型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("只支持图片文件");
        }
        
        // 验证是否为有效图片
        try (InputStream inputStream = file.getInputStream()) {
            if (!imageProcessingService.isValidImage(inputStream)) {
                throw new IOException("无效的图片文件");
            }
        }
    }
    private void repairAssetFileSizeIfNeeded(Asset asset) {
        if (asset == null) {
            return;
        }

        Long fileSize = asset.getFileSize();
        if (fileSize != null && fileSize > 0) {
            return;
        }

        String fileKey = asset.getFileKey();
        if (fileKey == null || fileKey.isBlank()) {
            fileKey = ossService.extractFileKey(asset.getFileUrl());
        }

        if (fileKey == null || fileKey.isBlank()) {
            return;
        }

        Long detectedSize = ossService.getFileSize(fileKey);
        if (detectedSize == null || detectedSize <= 0) {
            return;
        }

        asset.setFileSize(detectedSize);

        try {
            assetMapper.updateById(asset);
            log.info("Repaired asset fileSize: id={}, size={}", asset.getId(), detectedSize);
        } catch (Exception e) {
            log.warn("Failed to persist repaired fileSize for asset id={}", asset.getId(), e);
        }
    }

    private void bootstrapAssetsIfEmpty() {
        synchronized (this) {
            Long count = assetMapper.selectCount(new LambdaQueryWrapper<>());
            if (count != null && count > 0) {
                return;
            }

            int inserted = 0;
            inserted += importBrandAssets();
            inserted += importLocalUploads();

            if (inserted > 0) {
                log.info("Bootstrapped {} asset records from local files", inserted);
            }
        }
    }

    private int importBrandAssets() {
        Path baseDir = resolveBrandAssetsDir();
        if (baseDir == null) {
            return 0;
        }

        int inserted = 0;

        try (Stream<Path> stream = Files.walk(baseDir)) {
            List<Path> files = stream
                .filter(Files::isRegularFile)
                .filter(this::isImageFile)
                .toList();

            for (Path file : files) {
                Path relativePath = baseDir.relativize(file);
                String relative = normalizePath(relativePath);
                String fileKey = "brand_assets/" + relative;

                Asset asset = new Asset();
                asset.setCategory(inferBrandAssetCategory(relative));
                asset.setOriginalFilename(file.getFileName().toString());
                asset.setFileKey(fileKey);
                String url = "/brand_assets/" + relative;
                asset.setFileUrl(url);
                asset.setLargeUrl(url);
                asset.setMediumUrl(url);
                asset.setSmallUrl(url);
                asset.setThumbnailUrl(url);
                asset.setFileSize(safeFileSize(file));
                fillImageMeta(asset, file);
                asset.setIsProcessed(true);
                asset.setWebpConverted(false);
                asset.setProcessingStatus("completed");
                asset.setAltTextZh(asset.getOriginalFilename());
                asset.setAltTextEn(asset.getOriginalFilename());

                try {
                    assetMapper.insert(asset);
                    inserted++;
                } catch (Exception e) {
                    // Duplicate or invalid row, skip only this file.
                    log.debug("Skip brand asset bootstrap for file {}: {}", file, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to import brand assets from {}", baseDir, e);
        }

        return inserted;
    }

    private int importLocalUploads() {
        Path uploadsDir = Paths.get("uploads").toAbsolutePath().normalize();
        if (!Files.exists(uploadsDir) || !Files.isDirectory(uploadsDir)) {
            return 0;
        }

        int inserted = 0;

        try (Stream<Path> stream = Files.walk(uploadsDir)) {
            List<Path> files = stream
                .filter(Files::isRegularFile)
                .filter(this::isImageFile)
                .toList();

            for (Path file : files) {
                Path relativePath = uploadsDir.relativize(file);
                String relative = normalizePath(relativePath);

                Asset asset = new Asset();
                asset.setCategory("home");
                asset.setOriginalFilename(file.getFileName().toString());
                asset.setFileKey(relative);
                String url = "http://localhost:8080/uploads/" + relative;
                asset.setFileUrl(url);
                asset.setLargeUrl(url);
                asset.setMediumUrl(url);
                asset.setSmallUrl(url);
                asset.setThumbnailUrl(url);
                asset.setFileSize(safeFileSize(file));
                fillImageMeta(asset, file);
                asset.setIsProcessed(false);
                asset.setWebpConverted(false);
                asset.setProcessingStatus("completed");
                asset.setAltTextZh(asset.getOriginalFilename());
                asset.setAltTextEn(asset.getOriginalFilename());

                try {
                    assetMapper.insert(asset);
                    inserted++;
                } catch (Exception e) {
                    // Duplicate or invalid row, skip only this file.
                    log.debug("Skip upload asset bootstrap for file {}: {}", file, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to import local uploads from {}", uploadsDir, e);
        }

        return inserted;
    }

    private Path resolveBrandAssetsDir() {
        Path[] candidates = new Path[] {
            Paths.get("frontend/public/brand_assets").toAbsolutePath().normalize(),
            Paths.get("../frontend/public/brand_assets").toAbsolutePath().normalize(),
            Paths.get("../../frontend/public/brand_assets").toAbsolutePath().normalize()
        };

        for (Path candidate : candidates) {
            if (Files.exists(candidate) && Files.isDirectory(candidate)) {
                return candidate;
            }
        }

        return null;
    }

    private String inferBrandAssetCategory(String relativePath) {
        String path = relativePath.toLowerCase();
        if (path.startsWith("ebike/")) return "ebike";
        if (path.startsWith("routes/")) return "routes";
        if (path.startsWith("goods/")) return "goods";
        if (path.startsWith("community/")) return "community";
        if (path.startsWith("partner/")) return "partners";
        if (path.startsWith("cities/")) return "partners";
        if (path.startsWith("about/")) return "about";
        if (path.startsWith("page1_") || path.startsWith("page11_")) return "about";
        return "home";
    }

    private boolean isImageFile(Path file) {
        String name = file.getFileName().toString().toLowerCase();
        for (String ext : IMAGE_EXTENSIONS) {
            if (name.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    private String normalizePath(Path path) {
        return path.toString().replace('\\', '/');
    }

    private long safeFileSize(Path file) {
        try {
            return Files.size(file);
        } catch (Exception e) {
            return 0L;
        }
    }

    private void fillImageMeta(Asset asset, Path file) {
        String mimeType = null;
        try {
            mimeType = Files.probeContentType(file);
        } catch (Exception ignored) {
            // no-op
        }

        if (mimeType == null || !mimeType.startsWith("image/")) {
            String lowerName = file.getFileName().toString().toLowerCase();
            if (lowerName.endsWith(".png")) {
                mimeType = "image/png";
            } else if (lowerName.endsWith(".webp")) {
                mimeType = "image/webp";
            } else if (lowerName.endsWith(".gif")) {
                mimeType = "image/gif";
            } else if (lowerName.endsWith(".bmp")) {
                mimeType = "image/bmp";
            } else {
                mimeType = "image/jpeg";
            }
        }
        asset.setMimeType(mimeType);

        try (InputStream inputStream = Files.newInputStream(file)) {
            int[] dimensions = imageProcessingService.getImageDimensions(inputStream);
            asset.setWidth(dimensions[0]);
            asset.setHeight(dimensions[1]);
        } catch (Exception e) {
            asset.setWidth(0);
            asset.setHeight(0);
        }
    }
}
