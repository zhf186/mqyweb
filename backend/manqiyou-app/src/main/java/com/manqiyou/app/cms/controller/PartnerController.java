package com.manqiyou.app.cms.controller;

import com.manqiyou.app.cms.dto.PartnerDTO;
import com.manqiyou.app.cms.service.PartnerService;
import com.manqiyou.app.common.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 合作伙伴管理Controller
 */
@RestController
@RequestMapping("/api/admin/partners")
public class PartnerController {
    
    private static final Logger log = LoggerFactory.getLogger(PartnerController.class);
    
    @Autowired
    private PartnerService partnerService;
    
    /**
     * 获取合作伙伴列表
     */
    @GetMapping
    public Result<List<PartnerDTO>> listPartners(@RequestParam(required = false) String type) {
        log.info("获取合作伙伴列表: type={}", type);
        List<PartnerDTO> partners = partnerService.listPartners(type);
        return Result.success(partners);
    }
    
    /**
     * 获取合作伙伴详情
     */
    @GetMapping("/{partnerId}")
    public Result<PartnerDTO> getPartner(@PathVariable Long partnerId) {
        log.info("获取合作伙伴详情: partnerId={}", partnerId);
        PartnerDTO partner = partnerService.getPartnerById(partnerId);
        return Result.success(partner);
    }
    
    /**
     * 创建合作伙伴
     */
    @PostMapping
    public Result<PartnerDTO> createPartner(@RequestBody PartnerDTO request) {
        log.info("创建合作伙伴: name={}", request.getName());
        PartnerDTO partner = partnerService.createPartner(request);
        return Result.success(partner);
    }
    
    /**
     * 更新合作伙伴
     */
    @PutMapping("/{partnerId}")
    public Result<PartnerDTO> updatePartner(
            @PathVariable Long partnerId,
            @RequestBody PartnerDTO request) {
        
        log.info("更新合作伙伴: partnerId={}", partnerId);
        PartnerDTO partner = partnerService.updatePartner(partnerId, request);
        return Result.success(partner);
    }
    
    /**
     * 删除合作伙伴
     */
    @DeleteMapping("/{partnerId}")
    public Result<Void> deletePartner(@PathVariable Long partnerId) {
        log.info("删除合作伙伴: partnerId={}", partnerId);
        partnerService.deletePartner(partnerId);
        return Result.success(null);
    }
    
    /**
     * 重新排序合作伙伴
     */
    @PutMapping("/reorder")
    public Result<Void> reorderPartners(@RequestBody List<Long> partnerIds) {
        log.info("重新排序合作伙伴: count={}", partnerIds.size());
        partnerService.reorderPartners(partnerIds);
        return Result.success(null);
    }
}
