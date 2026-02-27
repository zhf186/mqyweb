package com.manqiyou.app.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 导入结果DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportResultDTO {
    private int totalRecords;
    private int successCount;
    private int failureCount;
    private List<String> errors = new ArrayList<>();
    private boolean success;
    
    public void addError(String error) {
        this.errors.add(error);
    }
}
