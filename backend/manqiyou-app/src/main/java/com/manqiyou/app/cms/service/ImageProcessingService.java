package com.manqiyou.app.cms.service;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Image processing service.
 * Generates optimized renditions immediately after CMS upload.
 */
@Slf4j
@Service
public class ImageProcessingService {

    private static final int ORIGINAL_MAX_EDGE = 2560;
    private static final String WEBP_EXTENSION = "webp";
    private static final String WEBP_CONTENT_TYPE = "image/webp";
    private static final String JPEG_EXTENSION = "jpg";
    private static final String JPEG_CONTENT_TYPE = "image/jpeg";
    private static final String PNG_EXTENSION = "png";
    private static final String PNG_CONTENT_TYPE = "image/png";

    @Getter
    public static class ProcessedImage {
        private final byte[] bytes;
        private final String extension;
        private final String contentType;

        public ProcessedImage(byte[] bytes, String extension, String contentType) {
            this.bytes = bytes;
            this.extension = extension;
            this.contentType = contentType;
        }
    }

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

    private static final ImageSize[] SIZES = {
        new ImageSize("large", 1920, 0.84),
        new ImageSize("medium", 1280, 0.82),
        new ImageSize("small", 800, 0.80),
        new ImageSize("thumbnail", 240, 0.76)
    };

    public Map<String, ProcessedImage> processImage(InputStream inputStream, String originalFilename) throws IOException {
        Map<String, ProcessedImage> processedImages = new LinkedHashMap<>();

        try {
            BufferedImage originalImage = ImageIO.read(inputStream);
            if (originalImage == null) {
                throw new IOException("无法读取图片文件");
            }

            BufferedImage normalizedImage = normalizeImage(originalImage);
            boolean hasAlpha = normalizedImage.getColorModel().hasAlpha();
            int originalWidth = normalizedImage.getWidth();
            int originalHeight = normalizedImage.getHeight();

            log.info("Processing uploaded asset {} ({}x{}, alpha={})", originalFilename, originalWidth, originalHeight, hasAlpha);

            BufferedImage optimizedOriginal = resizeToMaxEdge(normalizedImage, ORIGINAL_MAX_EDGE);
            processedImages.put("original", encodeImage(optimizedOriginal, hasAlpha, hasAlpha ? 1.0 : 0.88));

            for (ImageSize size : SIZES) {
                if (originalWidth <= size.width) {
                    continue;
                }

                int targetHeight = Math.max(1, (int) Math.round((double) originalHeight / originalWidth * size.width));
                BufferedImage resizedImage = resizeImage(normalizedImage, size.width, targetHeight, hasAlpha);
                processedImages.put(size.name, encodeImage(resizedImage, hasAlpha, size.quality));
            }

            log.info("Generated {} optimized variants for {}", processedImages.size(), originalFilename);
            return processedImages;
        } catch (IOException e) {
            log.error("Failed to process image {}", originalFilename, e);
            throw new IOException("图片处理失败: " + e.getMessage(), e);
        }
    }

    public int[] getImageDimensions(InputStream inputStream) throws IOException {
        try {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                throw new IOException("无法读取图片文件");
            }
            return new int[]{image.getWidth(), image.getHeight()};
        } catch (IOException e) {
            log.error("Failed to get image dimensions", e);
            throw new IOException("获取图片尺寸失败: " + e.getMessage(), e);
        }
    }

    public boolean isValidImage(InputStream inputStream) {
        try {
            BufferedImage image = ImageIO.read(inputStream);
            return image != null;
        } catch (Exception e) {
            return false;
        }
    }

    private BufferedImage normalizeImage(BufferedImage sourceImage) {
        if (sourceImage.getType() == BufferedImage.TYPE_INT_RGB || sourceImage.getType() == BufferedImage.TYPE_INT_ARGB) {
            return sourceImage;
        }

        int targetType = sourceImage.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage normalizedImage = new BufferedImage(sourceImage.getWidth(), sourceImage.getHeight(), targetType);
        Graphics2D graphics = normalizedImage.createGraphics();
        graphics.setComposite(AlphaComposite.Src);
        graphics.drawImage(sourceImage, 0, 0, null);
        graphics.dispose();
        return normalizedImage;
    }

    private BufferedImage resizeToMaxEdge(BufferedImage image, int maxEdge) throws IOException {
        int width = image.getWidth();
        int height = image.getHeight();
        int longestEdge = Math.max(width, height);
        if (longestEdge <= maxEdge) {
            return image;
        }

        double scale = (double) maxEdge / longestEdge;
        int targetWidth = Math.max(1, (int) Math.round(width * scale));
        int targetHeight = Math.max(1, (int) Math.round(height * scale));
        return resizeImage(image, targetWidth, targetHeight, image.getColorModel().hasAlpha());
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight, boolean hasAlpha) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Thumbnails.of(originalImage)
            .size(targetWidth, targetHeight)
            .outputFormat(hasAlpha ? PNG_EXTENSION : JPEG_EXTENSION)
            .outputQuality(hasAlpha ? 1.0 : 0.90)
            .toOutputStream(outputStream);

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray())) {
            BufferedImage resizedImage = ImageIO.read(inputStream);
            if (resizedImage == null) {
                throw new IOException("无法生成缩放后的图片");
            }
            return resizedImage;
        }
    }

    private ProcessedImage encodeImage(BufferedImage image, boolean hasAlpha, double quality) throws IOException {
        if (canWriteWebP()) {
            try {
                return encodeWebP(image, quality);
            } catch (IOException e) {
                log.warn("Falling back from WebP encoding to legacy format: {}", e.getMessage());
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        if (hasAlpha) {
            ImageIO.write(image, PNG_EXTENSION, outputStream);
            return new ProcessedImage(outputStream.toByteArray(), PNG_EXTENSION, PNG_CONTENT_TYPE);
        }

        Thumbnails.of(image)
            .scale(1.0)
            .outputQuality(quality)
            .outputFormat(JPEG_EXTENSION)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), JPEG_EXTENSION, JPEG_CONTENT_TYPE);
    }

    private boolean canWriteWebP() {
        return ImageIO.getImageWritersByMIMEType(WEBP_CONTENT_TYPE).hasNext();
    }

    private ProcessedImage encodeWebP(BufferedImage image, double quality) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByMIMEType(WEBP_CONTENT_TYPE).next();

        try (ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(outputStream)) {
            writer.setOutput(imageOutputStream);
            ImageWriteParam writeParam = writer.getDefaultWriteParam();

            if (writeParam.canWriteCompressed()) {
                writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                String[] compressionTypes = writeParam.getCompressionTypes();
                if (compressionTypes != null && compressionTypes.length > 0) {
                    writeParam.setCompressionType(compressionTypes[0]);
                }
                writeParam.setCompressionQuality((float) quality);
            }

            writer.write(null, new IIOImage(image, null, null), writeParam);
        } catch (Exception e) {
            throw new IOException("WebP 编码失败: " + e.getMessage(), e);
        } finally {
            writer.dispose();
        }

        return new ProcessedImage(outputStream.toByteArray(), WEBP_EXTENSION, WEBP_CONTENT_TYPE);
    }
}
