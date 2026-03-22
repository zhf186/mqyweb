package com.manqiyou.app.cms;

import com.manqiyou.app.cms.service.ImageProcessingService;
import org.junit.jupiter.api.Test;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ImageProcessingServiceTest {

    private final ImageProcessingService imageProcessingService = new ImageProcessingService();

    @Test
    void processImageShouldCapOriginalSizeAndGenerateRenditions() throws Exception {
        BufferedImage sourceImage = new BufferedImage(4000, 3000, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = sourceImage.createGraphics();
        graphics.setColor(new Color(12, 88, 144));
        graphics.fillRect(0, 0, 4000, 3000);
        graphics.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(sourceImage, "jpg", outputStream);

        Map<String, ImageProcessingService.ProcessedImage> renditions = imageProcessingService.processImage(
            new ByteArrayInputStream(outputStream.toByteArray()),
            "hero.jpg"
        );

        assertTrue(renditions.containsKey("original"));
        assertTrue(renditions.containsKey("large"));
        assertTrue(renditions.containsKey("medium"));
        assertTrue(renditions.containsKey("small"));
        assertTrue(renditions.containsKey("thumbnail"));

        BufferedImage optimizedOriginal = ImageIO.read(new ByteArrayInputStream(renditions.get("original").getBytes()));
        assertNotNull(optimizedOriginal);
        assertTrue(Math.max(optimizedOriginal.getWidth(), optimizedOriginal.getHeight()) <= 2560);
        assertEquals("image/webp", renditions.get("original").getContentType());
        assertEquals("webp", renditions.get("original").getExtension());
    }

    @Test
    void processImageShouldPreserveAlphaImagesAsPng() throws Exception {
        BufferedImage sourceImage = new BufferedImage(1200, 800, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics = sourceImage.createGraphics();
        graphics.setComposite(AlphaComposite.Clear);
        graphics.fillRect(0, 0, 1200, 800);
        graphics.setComposite(AlphaComposite.Src);
        graphics.setColor(new Color(255, 128, 0, 180));
        graphics.fillRoundRect(80, 80, 1040, 640, 120, 120);
        graphics.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(sourceImage, "png", outputStream);

        Map<String, ImageProcessingService.ProcessedImage> renditions = imageProcessingService.processImage(
            new ByteArrayInputStream(outputStream.toByteArray()),
            "logo.png"
        );

        assertTrue(
            "image/webp".equals(renditions.get("original").getContentType())
                || "image/png".equals(renditions.get("original").getContentType())
        );
        assertTrue(
            "webp".equals(renditions.get("original").getExtension())
                || "png".equals(renditions.get("original").getExtension())
        );
        assertFalse(renditions.containsKey("large"));
        assertFalse(renditions.containsKey("medium"));
        assertTrue(renditions.containsKey("small"));
        assertTrue(renditions.containsKey("thumbnail"));

        BufferedImage optimizedOriginal = ImageIO.read(new ByteArrayInputStream(renditions.get("original").getBytes()));
        assertNotNull(optimizedOriginal);
        assertEquals(1200, optimizedOriginal.getWidth());
        assertEquals(800, optimizedOriginal.getHeight());
    }
}
