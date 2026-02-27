package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.ImportResultDTO;
import com.manqiyou.app.cms.service.ImportExportService;
import com.manqiyou.app.common.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

/**
 * 导入导出控制器
 * Requirements: 16.1, 16.2, 16.3, 16.4
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/import-export")
@RequiredArgsConstructor
public class ImportExportController {

    private final ImportExportService importExportService;

    /**
     * 导出所有内容为JSON
     */
    @GetMapping("/export/json")
    public ResponseEntity<String> exportJson() {
        log.info("Export JSON request");
        
        String json = importExportService.exportAllContentAsJson();
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=content-export.json")
            .contentType(MediaType.APPLICATION_JSON)
            .body(json);
    }

    /**
     * 导出内容为CSV（用于翻译）
     */
    @GetMapping("/export/translation")
    public ResponseEntity<String> exportForTranslation() {
        log.info("Export translation CSV request");
        
        String csv = importExportService.exportContentForTranslation();
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=content-translation.csv")
            .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
            .body(csv);
    }

    /**
     * 从CSV导入翻译
     */
    @PostMapping("/import/translation")
    public Result<ImportResultDTO> importTranslation(@RequestParam("file") MultipartFile file) {
        log.info("Import translation request: {}", file.getOriginalFilename());
        
        if (file.isEmpty()) {
            return Result.error(400, "文件不能为空");
        }
        
        if (!file.getOriginalFilename().endsWith(".csv")) {
            return Result.error(400, "只支持CSV文件");
        }
        
        ImportResultDTO result = importExportService.importTranslations(file);
        
        if (result.isSuccess()) {
            return Result.success(result);
        } else {
            String errorMsg = result.getErrors().isEmpty() ? "导入失败" : String.join(", ", result.getErrors());
            return Result.error(400, "导入部分失败: " + errorMsg);
        }
    }

    /**
     * 从JSON导入内容
     */
    @PostMapping("/import/json")
    public Result<ImportResultDTO> importJson(@RequestParam("file") MultipartFile file) {
        log.info("Import JSON request: {}", file.getOriginalFilename());
        
        if (file.isEmpty()) {
            return Result.error(400, "文件不能为空");
        }
        
        if (!file.getOriginalFilename().endsWith(".json")) {
            return Result.error(400, "只支持JSON文件");
        }
        
        ImportResultDTO result = importExportService.importFromJson(file);
        
        if (result.isSuccess()) {
            return Result.success(result);
        } else {
            String errorMsg = result.getErrors().isEmpty() ? "导入失败" : String.join(", ", result.getErrors());
            return Result.error(400, "导入部分失败: " + errorMsg);
        }
    }
}
