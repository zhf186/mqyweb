package com.manqiyou.app.cms.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.manqiyou.app.cms.dto.ContentItemDTO;
import com.manqiyou.app.cms.dto.PageWithContentDTO;
import com.manqiyou.app.cms.dto.UpdateContentRequest;
import com.manqiyou.app.cms.entity.ContentItem;
import com.manqiyou.app.cms.entity.ContentVersion;
import com.manqiyou.app.cms.entity.Page;
import com.manqiyou.app.cms.exception.ConcurrentModificationException;
import com.manqiyou.app.cms.mapper.ContentItemMapper;
import com.manqiyou.app.cms.mapper.ContentVersionMapper;
import com.manqiyou.app.cms.mapper.PageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 内容管理服务
 */
@Service
public class ContentService {
    
    private static final Logger log = LoggerFactory.getLogger(ContentService.class);
    
    @Autowired
    private PageMapper pageMapper;
    
    @Autowired
    private ContentItemMapper contentItemMapper;
    
    @Autowired
    private ContentVersionMapper contentVersionMapper;
    
    /**
     * 获取所有页面列表
     */
    public List<Page> getAllPages() {
        LambdaQueryWrapper<Page> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Page::getIsActive, true)
               .orderByAsc(Page::getId);
        return pageMapper.selectList(wrapper);
    }
    
    /**
     * 根据ID获取页面
     */
    public Page getPageById(Long pageId) {
        Page page = pageMapper.selectById(pageId);
        if (page == null) {
            throw new RuntimeException("页面不存在: " + pageId);
        }
        return page;
    }
    
    /**
     * 根据slug获取页面
     */
    public Page getPageBySlug(String slug) {
        LambdaQueryWrapper<Page> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Page::getSlug, slug)
               .eq(Page::getIsActive, true);
        return pageMapper.selectOne(wrapper);
    }
    
    /**
     * 获取页面及其所有内容项
     */
    public PageWithContentDTO getPageWithContent(Long pageId) {
        // 获取页面信息
        Page page = getPageById(pageId);
        
        // 获取内容项
        LambdaQueryWrapper<ContentItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentItem::getPageId, pageId)
               .orderByAsc(ContentItem::getDisplayOrder);
        List<ContentItem> contentItems = contentItemMapper.selectList(wrapper);
        
        // 转换为DTO
        PageWithContentDTO dto = new PageWithContentDTO();
        BeanUtils.copyProperties(page, dto);
        dto.setContentItems(contentItems.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList()));
        
        return dto;
    }
    
    /**
     * 根据ID获取内容项
     */
    public ContentItem getContentItemById(Long itemId) {
        ContentItem item = contentItemMapper.selectById(itemId);
        if (item == null) {
            throw new RuntimeException("内容项不存在: " + itemId);
        }
        return item;
    }
    
    /**
     * 更新内容项
     * 自动创建版本记录
     */
    @Transactional(rollbackFor = Exception.class)
    public ContentItemDTO updateContentItem(Long itemId, UpdateContentRequest request, Long userId) {
        log.info("更新内容项: itemId={}, userId={}", itemId, userId);
        
        // 获取当前内容项
        ContentItem currentItem = getContentItemById(itemId);
        
        // 验证版本号(乐观锁)
        if (!currentItem.getVersion().equals(request.getVersion())) {
            throw new ConcurrentModificationException("内容已被其他用户修改，请刷新后重试");
        }
        
        // 创建版本记录(保存修改前的内容)
        createVersionRecord(currentItem, userId, request.getChangeSummary());
        
        // 更新内容 - 使用updateById以触发乐观锁
        currentItem.setContentZh(request.getContentZh());
        currentItem.setContentEn(request.getContentEn());
        
        int updated = contentItemMapper.updateById(currentItem);
        if (updated == 0) {
            throw new ConcurrentModificationException("更新失败，内容可能已被其他用户修改");
        }
        
        // 返回更新后的内容
        ContentItem updatedItem = getContentItemById(itemId);
        log.info("内容项更新成功: itemId={}, newVersion={}", itemId, updatedItem.getVersion());
        
        return convertToDTO(updatedItem);
    }
    
    /**
     * 创建版本记录
     */
    private void createVersionRecord(ContentItem item, Long userId, String changeSummary) {
        // 获取当前最大版本号
        LambdaQueryWrapper<ContentVersion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentVersion::getContentItemId, item.getId())
               .orderByDesc(ContentVersion::getVersionNumber)
               .last("LIMIT 1");
        ContentVersion latestVersion = contentVersionMapper.selectOne(wrapper);
        
        int nextVersionNumber = (latestVersion != null) ? latestVersion.getVersionNumber() + 1 : 1;
        
        // 创建新版本记录
        ContentVersion version = new ContentVersion();
        version.setContentItemId(item.getId());
        version.setVersionNumber(nextVersionNumber);
        version.setContentZh(item.getContentZh());
        version.setContentEn(item.getContentEn());
        version.setChangedBy(userId);
        version.setChangeSummary(changeSummary != null ? changeSummary : "内容更新");
        
        contentVersionMapper.insert(version);
        log.info("创建版本记录: itemId={}, versionNumber={}", item.getId(), nextVersionNumber);
    }
    
    /**
     * 获取内容项的版本历史
     */
    public List<ContentVersion> getVersionHistory(Long itemId) {
        LambdaQueryWrapper<ContentVersion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentVersion::getContentItemId, itemId)
               .orderByDesc(ContentVersion::getVersionNumber);
        return contentVersionMapper.selectList(wrapper);
    }
    
    /**
     * 恢复到指定版本
     */
    @Transactional(rollbackFor = Exception.class)
    public ContentItemDTO restoreVersion(Long itemId, Long versionId, Long userId) {
        log.info("恢复版本: itemId={}, versionId={}, userId={}", itemId, versionId, userId);
        
        // 获取目标版本
        ContentVersion targetVersion = contentVersionMapper.selectById(versionId);
        if (targetVersion == null || !targetVersion.getContentItemId().equals(itemId)) {
            throw new RuntimeException("版本不存在");
        }
        
        // 获取当前内容项
        ContentItem currentItem = getContentItemById(itemId);
        
        // 创建版本记录(保存当前内容)
        createVersionRecord(currentItem, userId, "恢复到版本 " + targetVersion.getVersionNumber());
        
        // 恢复内容
        currentItem.setContentZh(targetVersion.getContentZh());
        currentItem.setContentEn(targetVersion.getContentEn());
        contentItemMapper.updateById(currentItem);
        
        log.info("版本恢复成功: itemId={}, restoredVersion={}", itemId, targetVersion.getVersionNumber());
        
        // 返回更新后的内容
        ContentItem updatedItem = getContentItemById(itemId);
        return convertToDTO(updatedItem);
    }
    
    /**
     * 转换为DTO
     */
    private ContentItemDTO convertToDTO(ContentItem item) {
        ContentItemDTO dto = new ContentItemDTO();
        BeanUtils.copyProperties(item, dto);
        return dto;
    }
}
