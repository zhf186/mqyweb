package com.manqiyou.app.cms.service;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectRequest;
import com.manqiyou.app.cms.config.OssProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * 阿里云OSS服务
 */
@Slf4j
@Service
public class OssService {

    private static final String LOCAL_UPLOAD_DIR = "uploads";
    private static final String LOCAL_PUBLIC_BASE_URL = "http://localhost:8080";
    
    @Autowired
    private OssProperties ossProperties;
    
    /**
     * 上传文件到OSS
     *
     * @param inputStream 文件输入流
     * @param originalFilename 原始文件名
     * @param contentType MIME类型
     * @return 文件访问URL
     */
    public String uploadFile(InputStream inputStream, String originalFilename, String contentType) {
        // 生成唯一文件名
        String fileKey = generateFileKey(originalFilename);

        if (!isOssConfigured()) {
            return uploadToLocal(inputStream, fileKey);
        }
        
        try {
            // 创建OSS客户端
            OSS ossClient = createOssClient();
            
            try {
                // 设置元数据
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(contentType);
                
                // 上传文件
                PutObjectRequest putObjectRequest = new PutObjectRequest(
                    ossProperties.getBucket(),
                    fileKey,
                    inputStream,
                    metadata
                );
                
                ossClient.putObject(putObjectRequest);
                
                // 返回文件URL
                return getFileUrl(fileKey);
                
            } finally {
                ossClient.shutdown();
            }
            
        } catch (Exception e) {
            log.error("Failed to upload file to OSS: {}", originalFilename, e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    private boolean isOssConfigured() {
        String accessKeyId = ossProperties.getAccessKeyId();
        String accessKeySecret = ossProperties.getAccessKeySecret();
        String bucket = ossProperties.getBucket();
        String endpoint = ossProperties.getEndpoint();

        if (accessKeyId == null || accessKeyId.isBlank() || accessKeyId.contains("your-access-key")) return false;
        if (accessKeySecret == null || accessKeySecret.isBlank() || accessKeySecret.contains("your-access-key")) return false;
        if (bucket == null || bucket.isBlank() || bucket.contains("your-") || bucket.contains("example")) return false;
        if (endpoint == null || endpoint.isBlank()) return false;
        return true;
    }

    private String uploadToLocal(InputStream inputStream, String fileKey) {
        try {
            Path target = Paths.get(LOCAL_UPLOAD_DIR).resolve(fileKey);
            Files.createDirectories(target.getParent());
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            String normalized = fileKey.replace('\\', '/');
            return LOCAL_PUBLIC_BASE_URL + "/uploads/" + normalized;
        } catch (IOException e) {
            log.error("Failed to upload file to local disk: {}", fileKey, e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 上传字节数组到OSS
     *
     * @param bytes 文件字节数组
     * @param filename 文件名
     * @param contentType MIME类型
     * @return 文件访问URL
     */
    public String uploadBytes(byte[] bytes, String filename, String contentType) {
        return uploadFile(new ByteArrayInputStream(bytes), filename, contentType);
    }
    
    /**
     * 删除OSS文件
     *
     * @param fileKey 文件键
     */
    public void deleteFile(String fileKey) {
        if (!isOssConfigured()) {
            deleteLocalFile(fileKey);
            return;
        }

        try {
            OSS ossClient = createOssClient();
            
            try {
                ossClient.deleteObject(ossProperties.getBucket(), fileKey);
                log.info("Deleted file from OSS: {}", fileKey);
            } finally {
                ossClient.shutdown();
            }
            
        } catch (Exception e) {
            log.error("Failed to delete file from OSS: {}", fileKey, e);
            throw new RuntimeException("文件删除失败: " + e.getMessage());
        }
    }
    
    /**
     * 检查文件是否存在
     *
     * @param fileKey 文件键
     * @return 是否存在
     */
    public boolean exists(String fileKey) {
        if (!isOssConfigured()) {
            return localFileExists(fileKey);
        }

        try {
            OSS ossClient = createOssClient();
            
            try {
                return ossClient.doesObjectExist(ossProperties.getBucket(), fileKey);
            } finally {
                ossClient.shutdown();
            }
            
        } catch (Exception e) {
            log.error("Failed to check file existence: {}", fileKey, e);
            return false;
        }
    }

    /**
     * 鑾峰彇鏂囦欢澶у皬锛堝瓧鑺傦級
     *
     * @param fileKey 鏂囦欢閿?
     * @return 鏂囦欢澶у皬锛岃嫢鏃犳硶鑾峰彇鍒欒繑鍥?null
     */
    public Long getFileSize(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return null;
        }

        if (!isOssConfigured()) {
            return getLocalFileSize(fileKey);
        }

        try {
            OSS ossClient = createOssClient();
            try {
                ObjectMetadata metadata = ossClient.getObjectMetadata(ossProperties.getBucket(), fileKey);
                return metadata != null ? metadata.getContentLength() : null;
            } finally {
                ossClient.shutdown();
            }
        } catch (Exception e) {
            log.warn("Failed to get file size from OSS: {}", fileKey, e);
            return null;
        }
    }
    
    /**
     * 从URL提取文件键
     *
     * @param url 文件URL
     * @return 文件键
     */
    public String extractFileKey(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }

        String uploadsPrefix = "/uploads/";
        int uploadsIndex = url.indexOf(uploadsPrefix);
        if (uploadsIndex >= 0) {
            return url.substring(uploadsIndex + uploadsPrefix.length());
        }

        if (ossProperties.getCustomDomain() != null
            && !ossProperties.getCustomDomain().isBlank()
            && url.contains(ossProperties.getCustomDomain())) {
            return url.substring(url.indexOf(ossProperties.getCustomDomain()) + ossProperties.getCustomDomain().length() + 1);
        }

        if (ossProperties.getBucket() != null
            && !ossProperties.getBucket().isBlank()
            && ossProperties.getEndpoint() != null
            && !ossProperties.getEndpoint().isBlank()) {
            String bucketDomain = ossProperties.getBucket() + "." + ossProperties.getEndpoint();
            if (url.contains(bucketDomain)) {
                return url.substring(url.indexOf(bucketDomain) + bucketDomain.length() + 1);
            }
        }

        return url;
    }

    private OSS createOssClient() {
        return new OSSClientBuilder().build(
            ossProperties.getEndpoint(),
            ossProperties.getAccessKeyId(),
            ossProperties.getAccessKeySecret()
        );
    }
    
    /**
     * 生成唯一文件键
     */
    private String generateFileKey(String originalFilename) {
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }
        
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String datePath = java.time.LocalDate.now().toString().replace("-", "/");
        
        return "cms/" + datePath + "/" + uuid + extension;
    }
    
    /**
     * 获取文件访问URL
     */
    private String getFileUrl(String fileKey) {
        // 如果配置了自定义域名，使用自定义域名
        if (ossProperties.getCustomDomain() != null && !ossProperties.getCustomDomain().isEmpty()) {
            return "https://" + ossProperties.getCustomDomain() + "/" + fileKey;
        }
        
        // 否则使用OSS默认域名
        return "https://" + ossProperties.getBucket() + "." + ossProperties.getEndpoint() + "/" + fileKey;
    }

    private Path resolveLocalPath(String fileKey) {
        return Paths.get(LOCAL_UPLOAD_DIR).resolve(fileKey);
    }

    private void deleteLocalFile(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(resolveLocalPath(fileKey));
        } catch (IOException e) {
            log.warn("Failed to delete local file: {}", fileKey, e);
        }
    }

    private boolean localFileExists(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return false;
        }
        try {
            return Files.exists(resolveLocalPath(fileKey));
        } catch (Exception e) {
            log.warn("Failed to check local file existence: {}", fileKey, e);
            return false;
        }
    }

    private Long getLocalFileSize(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return null;
        }
        try {
            Path path = resolveLocalPath(fileKey);
            if (!Files.exists(path)) {
                return null;
            }
            return Files.size(path);
        } catch (Exception e) {
            log.warn("Failed to get local file size: {}", fileKey, e);
            return null;
        }
    }
}
