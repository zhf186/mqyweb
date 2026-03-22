package com.manqiyou.app.cms;

import com.manqiyou.app.cms.dto.AssetUploadRequest;
import com.manqiyou.app.cms.dto.AssetUploadResponse;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.service.AssetService;
import com.manqiyou.app.cms.service.OssService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AssetUploadIntegrationTest {

    @Autowired
    private AssetService assetService;

    @Autowired
    private OssService ossService;

    private final List<Long> createdAssetIds = new ArrayList<>();

    @AfterEach
    void tearDown() {
        for (Long assetId : createdAssetIds) {
            try {
                assetService.deleteAsset(assetId);
            } catch (Exception ignored) {
                // Best-effort cleanup for local test uploads.
            }
        }
        createdAssetIds.clear();
    }

    @Test
    void uploadImageShouldGenerateOptimizedRenditionsImmediately() throws Exception {
        BufferedImage sourceImage = new BufferedImage(3200, 2400, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = sourceImage.createGraphics();
        graphics.setColor(new Color(34, 112, 184));
        graphics.fillRect(0, 0, 3200, 2400);
        graphics.setColor(new Color(240, 182, 70));
        graphics.fillRoundRect(180, 180, 2840, 2040, 180, 180);
        graphics.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(sourceImage, "jpg", outputStream);

        MockMultipartFile file = new MockMultipartFile(
            "files",
            "hero-upload.jpg",
            "image/jpeg",
            outputStream.toByteArray()
        );

        AssetUploadRequest request = new AssetUploadRequest();
        request.setCategory("test-upload");
        request.setAltTextZh("测试图片");
        request.setAltTextEn("Test image");
        request.setAutoProcess(true);

        AssetUploadResponse response = assetService.uploadImage(file, request, 1L);
        Asset asset = response.getAsset();
        createdAssetIds.add(asset.getId());

        assertNotNull(asset.getId());
        assertEquals("completed", asset.getProcessingStatus());
        assertTrue(Boolean.TRUE.equals(asset.getIsProcessed()));
        assertTrue(Boolean.TRUE.equals(asset.getWebpConverted()));
        assertEquals("image/webp", asset.getMimeType());

        assertNotNull(asset.getFileUrl());
        assertNotNull(asset.getLargeUrl());
        assertNotNull(asset.getMediumUrl());
        assertNotNull(asset.getSmallUrl());
        assertNotNull(asset.getThumbnailUrl());

        assertTrue(asset.getFileUrl().endsWith(".webp"));
        assertTrue(asset.getLargeUrl().endsWith(".webp"));
        assertTrue(asset.getMediumUrl().endsWith(".webp"));
        assertTrue(asset.getSmallUrl().endsWith(".webp"));
        assertTrue(asset.getThumbnailUrl().endsWith(".webp"));

        assertTrue(asset.getFileSize() > 0);
        assertTrue(asset.getFileSize() < file.getSize(), "optimized original should be smaller than the uploaded file");

        assertNotNull(asset.getFileKey());
        assertFalse(asset.getFileKey().isBlank());
        assertNotNull(ossService.extractFileKey(asset.getLargeUrl()));
        assertNotNull(ossService.extractFileKey(asset.getThumbnailUrl()));
    }

    @Test
    void replaceAssetShouldReprocessUploadedImage() throws Exception {
        MockMultipartFile originalFile = new MockMultipartFile(
            "files",
            "route-cover.jpg",
            "image/jpeg",
            createJpegBytes(2800, 1800, new Color(26, 94, 165), new Color(232, 184, 71))
        );

        AssetUploadRequest request = new AssetUploadRequest();
        request.setCategory("test-replace");
        request.setAltTextZh("初始图片");
        request.setAltTextEn("Original image");
        request.setAutoProcess(true);

        AssetUploadResponse uploadResponse = assetService.uploadImage(originalFile, request, 1L);
        Asset uploadedAsset = uploadResponse.getAsset();
        createdAssetIds.add(uploadedAsset.getId());

        String previousFileUrl = uploadedAsset.getFileUrl();
        String previousFileKey = uploadedAsset.getFileKey();

        MockMultipartFile replacementFile = new MockMultipartFile(
            "file",
            "route-cover-replaced.jpg",
            "image/jpeg",
            createJpegBytes(3600, 2400, new Color(88, 42, 134), new Color(239, 116, 54))
        );

        Asset replacedAsset = assetService.replaceAsset(uploadedAsset.getId(), replacementFile, 1L);

        assertEquals(uploadedAsset.getId(), replacedAsset.getId());
        assertEquals("route-cover-replaced.jpg", replacedAsset.getOriginalFilename());
        assertEquals("completed", replacedAsset.getProcessingStatus());
        assertTrue(Boolean.TRUE.equals(replacedAsset.getIsProcessed()));
        assertTrue(Boolean.TRUE.equals(replacedAsset.getWebpConverted()));
        assertEquals("image/webp", replacedAsset.getMimeType());

        assertNotEquals(previousFileUrl, replacedAsset.getFileUrl());
        assertNotEquals(previousFileKey, replacedAsset.getFileKey());
        assertTrue(replacedAsset.getFileUrl().endsWith(".webp"));
        assertTrue(replacedAsset.getThumbnailUrl().endsWith(".webp"));
        assertTrue(replacedAsset.getFileSize() > 0);
        assertTrue(replacedAsset.getWidth() >= 3600);
        assertTrue(replacedAsset.getHeight() >= 2400);
    }

    private byte[] createJpegBytes(int width, int height, Color background, Color accent) throws Exception {
        BufferedImage sourceImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = sourceImage.createGraphics();
        graphics.setColor(background);
        graphics.fillRect(0, 0, width, height);
        graphics.setColor(accent);
        graphics.fillRoundRect(width / 10, height / 10, width * 8 / 10, height * 8 / 10, 180, 180);
        graphics.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(sourceImage, "jpg", outputStream);
        return outputStream.toByteArray();
    }
}
