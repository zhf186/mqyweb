package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.dto.PartnerDTO;
import com.manqiyou.app.cms.entity.Asset;
import com.manqiyou.app.cms.entity.Partner;
import com.manqiyou.app.cms.mapper.AssetMapper;
import com.manqiyou.app.cms.mapper.PartnerMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 合作伙伴管理服务
 */
@Service
public class PartnerService {
    
    private static final Logger log = LoggerFactory.getLogger(PartnerService.class);
    
    @Autowired
    private PartnerMapper partnerMapper;
    
    @Autowired
    private AssetMapper assetMapper;
    
    /**
     * 获取合作伙伴列表
     */
    public List<PartnerDTO> listPartners(String type) {
        LambdaQueryWrapper<Partner> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(type)) {
            wrapper.eq(Partner::getType, type);
        }
        
        wrapper.orderByAsc(Partner::getDisplayOrder);
        
        return partnerMapper.selectList(wrapper).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * 根据ID获取合作伙伴详情
     */
    public PartnerDTO getPartnerById(Long partnerId) {
        Partner partner = partnerMapper.selectById(partnerId);
        if (partner == null) {
            throw new RuntimeException("合作伙伴不存在: " + partnerId);
        }
        return convertToDTO(partner);
    }
    
    /**
     * 创建合作伙伴
     */
    @Transactional(rollbackFor = Exception.class)
    public PartnerDTO createPartner(PartnerDTO request) {
        log.info("创建合作伙伴: name={}", request.getName());
        
        Partner partner = new Partner();
        BeanUtils.copyProperties(request, partner);
        partner.setIsActive(true);
        
        // 设置显示顺序为最后
        if (partner.getDisplayOrder() == null) {
            Integer maxOrder = getMaxDisplayOrder();
            partner.setDisplayOrder(maxOrder + 1);
        }
        
        partnerMapper.insert(partner);
        log.info("合作伙伴创建成功: partnerId={}", partner.getId());
        
        return getPartnerById(partner.getId());
    }
    
    /**
     * 更新合作伙伴
     */
    @Transactional(rollbackFor = Exception.class)
    public PartnerDTO updatePartner(Long partnerId, PartnerDTO request) {
        log.info("更新合作伙伴: partnerId={}", partnerId);
        
        Partner partner = partnerMapper.selectById(partnerId);
        if (partner == null) {
            throw new RuntimeException("合作伙伴不存在: " + partnerId);
        }
        
        if (request.getVersion() != null && !partner.getVersion().equals(request.getVersion())) {
            throw new RuntimeException("合作伙伴已被其他用户修改，请刷新后重试");
        }
        
        BeanUtils.copyProperties(request, partner, "id", "createdAt", "version");
        
        int updated = partnerMapper.updateById(partner);
        if (updated == 0) {
            throw new RuntimeException("更新失败，合作伙伴可能已被其他用户修改");
        }
        
        log.info("合作伙伴更新成功: partnerId={}", partnerId);
        return getPartnerById(partnerId);
    }
    
    /**
     * 删除合作伙伴
     */
    @Transactional(rollbackFor = Exception.class)
    public void deletePartner(Long partnerId) {
        log.info("删除合作伙伴: partnerId={}", partnerId);
        
        Partner partner = partnerMapper.selectById(partnerId);
        if (partner == null) {
            throw new RuntimeException("合作伙伴不存在: " + partnerId);
        }
        
        partnerMapper.deleteById(partnerId);
        log.info("合作伙伴删除成功: partnerId={}", partnerId);
    }
    
    /**
     * 重新排序合作伙伴
     */
    @Transactional(rollbackFor = Exception.class)
    public void reorderPartners(List<Long> partnerIds) {
        log.info("重新排序合作伙伴: count={}", partnerIds.size());
        
        for (int i = 0; i < partnerIds.size(); i++) {
            Partner partner = partnerMapper.selectById(partnerIds.get(i));
            if (partner != null) {
                partner.setDisplayOrder(i);
                partnerMapper.updateById(partner);
            }
        }
        
        log.info("合作伙伴排序成功");
    }
    
    // ========== 私有辅助方法 ==========
    
    private Integer getMaxDisplayOrder() {
        LambdaQueryWrapper<Partner> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Partner::getDisplayOrder)
               .last("LIMIT 1");
        Partner partner = partnerMapper.selectOne(wrapper);
        return (partner != null && partner.getDisplayOrder() != null) ? partner.getDisplayOrder() : 0;
    }
    
    private PartnerDTO convertToDTO(Partner partner) {
        PartnerDTO dto = new PartnerDTO();
        BeanUtils.copyProperties(partner, dto);
        
        // Populate logo URL
        if (partner.getLogoId() != null) {
            Asset asset = assetMapper.selectById(partner.getLogoId());
            if (asset != null) {
                dto.setLogoUrl(asset.getFileUrl());
            }
        }
        
        return dto;
    }
}
