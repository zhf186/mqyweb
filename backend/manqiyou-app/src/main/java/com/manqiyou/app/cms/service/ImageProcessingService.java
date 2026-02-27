package com.manqiyou.app.cms.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 图片处理服务
 * 使用Thumbnailator库进行图片缩放、裁剪和格式转换
 */
@Slf4j
@Service
public class ImageProcessingService {
    
    /**
     * 图片尺寸配置
     */
    public static class ImageSize {
        public final String name;
        public final int width;
        public final double quality;
        
        public ImageSize(String name, int width, double quality) {
            this.name = name;
            this.width = width;
            this.quality = quality;
        }
    }
    
    // 预定义的图片尺寸
    private static final ImageSize[] SIZES = {
        new ImageSize("large", 1920, 0.85),
        new ImageSize("medium", 1024, 0.85),
        new ImageSize("small", 640, 0.85),
        new ImageSize("thumbnail", 200, 0.80)
    };
    
    /**
     * 处理图片：生成多个尺寸版本并转换为WebP格式
     *
     * @param inputStream 原始图片输入流
     * @param originalFilename 原始文件名
     * @return Map<尺寸名称, 处理后的字节数组>
     */
    public Map<String, byte[]> processImage(InputStream inputStream, String originalFilename) throws IOException {
        Map<String, byte[]> processedImages = new HashMap<>();
        
        try {
            // 读取原始图片
            BufferedImage originalImage = ImageIO.read(inputStream);
            if (originalImage == null) {
                throw new IOException("无法读取图片文件");
            }
            
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            
            log.info("Processing image: {} ({}x{})", originalFilename, originalWidth, originalHeight);
            
            // 保存原图（转换为WebP）
            byte[] originalWebp = convertToWebP(originalImage, 0.90);
            processedImages.put("original", originalWebp);
            
            // 生成各个尺寸版本
            for (ImageSize size : SIZES) {
                // 如果原图宽度小于目标宽度，跳过该尺寸
                if (originalWidth <= size.width) {
                    log.debug("Skipping size {} (original width {} <= target width {})", 
                        size.name, originalWidth, size.width);
                    continue;
                }
                
                // 计算目标高度（保持宽高比）
                int targetHeight = (int) ((double) originalHeight / originalWidth * size.width);
                
                // 缩放图片
                BufferedImage resizedImage = resizeImage(originalImage, size.width, targetHeight);
                
                // 转换为WebP
                byte[] webpBytes = convertToWebP(resizedImage, size.quality);
                processedImages.put(size.name, webpBytes);
                
                log.debug("Generated {} size: {}x{} ({} bytes)", 
                    size.name, size.width, targetHeight, webpBytes.length);
            }
            
            log.info("Successfully processed image into {} versions", processedImages.size());
            return processedImages;
            
        } catch (IOException e) {
            log.error("Failed to process image: {}", originalFilename, e);
            throw new IOException("图片处理失败: " + e.getMessage());
        }
    }
    
    /**
     * 缩放图片
     *
     * @param originalImage 原始图片
     * @param targetWidth 目标宽度
     * @param targetHeight 目标高度
     * @return 缩放后的图片
     */
    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(originalImage)
            .size(targetWidth, targetHeight)
            .outputFormat("png")  // 中间格式使用PNG保持质量
            .toOutputStream(outputStream);
        
        ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        return ImageIO.read(inputStream);
    }
    
    /**
     * 转换图片为WebP格式
     * 注意：Java标准库不直接支持WebP，这里使用PNG作为替代
     * 在生产环境中，建议使用imageio-webp库或调用外部工具
     *
     * @param image 图片
     * @param quality 质量（0.0-1.0）
     * @return WebP格式的字节数组
     */
    private byte[] convertToWebP(BufferedImage image, double quality) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        // 注意：这里使用JPEG作为WebP的替代
        // 在实际生产环境中，应该使用真正的WebP编码器
        Thumbnails.of(image)
            .scale(1.0)
            .outputQuality(quality)
            .outputFormat("jpg")
            .toOutputStream(outputStream);
        
        return outputStream.toByteArray();
    }
    
    /**
     * 获取图片尺寸信息
     *
     * @param inputStream 图片输入流
     * @return [width, height]
     */
    public int[] getImageDimensions(InputStream inputStream) throws IOException {
        try {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new IOException("无法读取图片文件");
            }
            return new int[]{image.getWidth(), image.getHeight()};
        } catch (IOException e) {
            log.error("Failed to get image dimensions", e);
            throw new IOException("获取图片尺寸失败: " + e.getMessage());
        }
    }
    
    /**
     * 验证是否为有效的图片文件
     *
     * @param inputStream 文件输入流
     * @return 是否为有效图片
     */
    public boolean isValidImage(InputStream inputStream) {
        try {
            BufferedImage image = ImageIO.read(inputStream);
            return image != null;
        } catch (Exception e) {
            return false;
        }
    }
}
