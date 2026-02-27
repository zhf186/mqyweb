package com.manqiyou.app.cms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.manqiyou.app.cms.dto.ImportResultDTO;
import com.manqiyou.app.cms.entity.*;
import com.manqiyou.app.cms.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

/**
 * 导入导出服务
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.6
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImportExportService {

    private final ContentItemMapper contentItemMapper;
    private final CmsRouteMapper routeMapper;
    private final ProductMapper productMapper;
    private final ObjectMapper objectMapper;

    /**
     * 导出所有内容为JSON
     * 
     * @return JSON字符串
     */
    public String exportAllContentAsJson() {
        log.info("Exporting all content as JSON");
        
        Map<String, Object> exportData = new HashMap<>();
        
        // 导出内容项
        List<ContentItem> contentItems = contentItemMapper.selectList(null);
        exportData.put("contentItems", contentItems);
        
        // 导出路线
        List<Route> routes = routeMapper.selectList(null);
        exportData.put("routes", routes);
        
        // 导出商品
        List<Product> products = productMapper.selectList(null);
        exportData.put("products", products);
        
        exportData.put("exportDate", new Date());
        exportData.put("version", "1.0");
        
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(exportData);
            log.info("Export completed: {} content items, {} routes, {} products", 
                contentItems.size(), routes.size(), products.size());
            return json;
        } catch (Exception e) {
            log.error("Failed to export content as JSON", e);
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    /**
     * 导出内容为Excel格式（用于翻译）
     * 
     * @return CSV格式的字符串
     */
    public String exportContentForTranslation() {
        log.info("Exporting content for translation");
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Type,Field Key,Chinese,English,Max Length\n");
        
        // 导出内容项
        List<ContentItem> contentItems = contentItemMapper.selectList(null);
        for (ContentItem item : contentItems) {
            csv.append(String.format("\"%s\",\"content\",\"%s\",\"%s\",\"%s\",%d\n",
                item.getId(),
                item.getFieldKey(),
                escapeCSV(item.getContentZh()),
                escapeCSV(item.getContentEn()),
                item.getMaxLength() != null ? item.getMaxLength() : 0
            ));
        }
        
        // 导出路线
        List<Route> routes = routeMapper.selectList(null);
        for (Route route : routes) {
            csv.append(String.format("\"%s\",\"route\",\"name\",\"%s\",\"%s\",200\n",
                route.getId(),
                escapeCSV(route.getNameZh()),
                escapeCSV(route.getNameEn())
            ));
            csv.append(String.format("\"%s\",\"route\",\"short_desc\",\"%s\",\"%s\",500\n",
                route.getId(),
                escapeCSV(route.getShortDescZh()),
                escapeCSV(route.getShortDescEn())
            ));
        }
        
        // 导出商品
        List<Product> products = productMapper.selectList(null);
        for (Product product : products) {
            csv.append(String.format("\"%s\",\"product\",\"name\",\"%s\",\"%s\",200\n",
                product.getId(),
                escapeCSV(product.getNameZh()),
                escapeCSV(product.getNameEn())
            ));
            csv.append(String.format("\"%s\",\"product\",\"short_desc\",\"%s\",\"%s\",500\n",
                product.getId(),
                escapeCSV(product.getShortDescZh()),
                escapeCSV(product.getShortDescEn())
            ));
        }
        
        log.info("Translation export completed");
        return csv.toString();
    }

    /**
     * 从Excel导入翻译后的内容
     * 
     * @param file CSV文件
     * @return 导入结果
     */
    @Transactional(rollbackFor = Exception.class)
    public ImportResultDTO importTranslations(MultipartFile file) {
        log.info("Importing translations from file: {}", file.getOriginalFilename());
        
        ImportResultDTO result = new ImportResultDTO();
        result.setSuccess(false);
        
        try {
            String content = new String(file.getBytes());
            String[] lines = content.split("\n");
            
            result.setTotalRecords(lines.length - 1); // 减去标题行
            
            // 跳过标题行
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i].trim();
                if (line.isEmpty()) {
                    continue;
                }
                
                try {
                    processTranslationLine(line);
                    result.setSuccessCount(result.getSuccessCount() + 1);
                } catch (Exception e) {
                    log.error("Failed to process line {}: {}", i, line, e);
                    result.addError("第" + i + "行导入失败: " + e.getMessage());
                    result.setFailureCount(result.getFailureCount() + 1);
                }
            }
            
            result.setSuccess(result.getFailureCount() == 0);
            log.info("Import completed: {} success, {} failures", 
                result.getSuccessCount(), result.getFailureCount());
            
            return result;
            
        } catch (IOException e) {
            log.error("Failed to read import file", e);
            result.addError("文件读取失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 从JSON导入内容
     * 
     * @param file JSON文件
     * @return 导入结果
     */
    @Transactional(rollbackFor = Exception.class)
    public ImportResultDTO importFromJson(MultipartFile file) {
        log.info("Importing from JSON file: {}", file.getOriginalFilename());
        
        ImportResultDTO result = new ImportResultDTO();
        result.setSuccess(false);
        
        try {
            String content = new String(file.getBytes());
            Map<String, Object> importData = objectMapper.readValue(content, Map.class);
            
            int totalCount = 0;
            int successCount = 0;
            
            // 导入内容项
            if (importData.containsKey("contentItems")) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) importData.get("contentItems");
                totalCount += items.size();
                for (Map<String, Object> itemData : items) {
                    try {
                        ContentItem item = objectMapper.convertValue(itemData, ContentItem.class);
                        contentItemMapper.insert(item);
                        successCount++;
                    } catch (Exception e) {
                        log.error("Failed to import content item", e);
                        result.addError("内容项导入失败: " + e.getMessage());
                    }
                }
            }
            
            // 导入路线
            if (importData.containsKey("routes")) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) importData.get("routes");
                totalCount += items.size();
                for (Map<String, Object> itemData : items) {
                    try {
                        Route route = objectMapper.convertValue(itemData, Route.class);
                        routeMapper.insert(route);
                        successCount++;
                    } catch (Exception e) {
                        log.error("Failed to import route", e);
                        result.addError("路线导入失败: " + e.getMessage());
                    }
                }
            }
            
            // 导入商品
            if (importData.containsKey("products")) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) importData.get("products");
                totalCount += items.size();
                for (Map<String, Object> itemData : items) {
                    try {
                        Product product = objectMapper.convertValue(itemData, Product.class);
                        productMapper.insert(product);
                        successCount++;
                    } catch (Exception e) {
                        log.error("Failed to import product", e);
                        result.addError("商品导入失败: " + e.getMessage());
                    }
                }
            }
            
            result.setTotalRecords(totalCount);
            result.setSuccessCount(successCount);
            result.setFailureCount(totalCount - successCount);
            result.setSuccess(result.getFailureCount() == 0);
            
            log.info("JSON import completed: {} success, {} failures", 
                successCount, result.getFailureCount());
            
            return result;
            
        } catch (IOException e) {
            log.error("Failed to read JSON file", e);
            result.addError("JSON文件读取失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 处理翻译行
     */
    private void processTranslationLine(String line) {
        // 解析CSV行
        String[] parts = parseCSVLine(line);
        if (parts.length < 5) {
            throw new IllegalArgumentException("CSV格式错误");
        }
        
        String id = parts[0];
        String type = parts[1];
        String fieldKey = parts[2];
        String chinese = parts[3];
        String english = parts[4];
        
        // 根据类型更新对应的记录
        switch (type) {
            case "content":
                ContentItem contentItem = contentItemMapper.selectById(id);
                if (contentItem != null) {
                    contentItem.setContentZh(chinese);
                    contentItem.setContentEn(english);
                    contentItemMapper.updateById(contentItem);
                }
                break;
                
            case "route":
                Route route = routeMapper.selectById(id);
                if (route != null) {
                    if ("name".equals(fieldKey)) {
                        route.setNameZh(chinese);
                        route.setNameEn(english);
                    } else if ("short_desc".equals(fieldKey)) {
                        route.setShortDescZh(chinese);
                        route.setShortDescEn(english);
                    }
                    routeMapper.updateById(route);
                }
                break;
                
            case "product":
                Product product = productMapper.selectById(id);
                if (product != null) {
                    if ("name".equals(fieldKey)) {
                        product.setNameZh(chinese);
                        product.setNameEn(english);
                    } else if ("short_desc".equals(fieldKey)) {
                        product.setShortDescZh(chinese);
                        product.setShortDescEn(english);
                    }
                    productMapper.updateById(product);
                }
                break;
                
            default:
                throw new IllegalArgumentException("未知的类型: " + type);
        }
    }

    /**
     * 转义CSV字段
     */
    private String escapeCSV(String value) {
        if (value == null) {
            return "";
        }
        // 转义双引号
        return value.replace("\"", "\"\"");
    }

    /**
     * 解析CSV行
     */
    private String[] parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    // 转义的双引号
                    current.append('"');
                    i++;
                } else {
                    // 切换引号状态
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                // 字段分隔符
                result.add(current.toString());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        result.add(current.toString());
        return result.toArray(new String[0]);
    }
}
