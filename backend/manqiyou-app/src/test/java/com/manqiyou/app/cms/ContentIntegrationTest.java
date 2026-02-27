package com.manqiyou.app.cms;

import com.manqiyou.app.cms.dto.ContentItemDTO;
import com.manqiyou.app.cms.dto.PageWithContentDTO;
import com.manqiyou.app.cms.dto.UpdateContentRequest;
import com.manqiyou.app.cms.entity.ContentVersion;
import com.manqiyou.app.cms.entity.Page;
import com.manqiyou.app.cms.service.ContentService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 内容管理集成测试
 * 
 * 测试内容管理系统的核心功能：
 * - 内容CRUD操作
 * - 版本创建和恢复
 * - 乐观锁并发控制
 * 
 * Requirements: 2.2, 6.1, 6.7
 */
@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ContentIntegrationTest {
    
    @Autowired
    private ContentService contentService;
    
    // 测试数据
    private static Long testPageId;
    private static Long testContentItemId;
    
    /**
     * 测试1: 获取所有页面列表
     * 验证：系统应该返回所有激活的页面
     * Requirements: 2.2
     */
    @Test
    @Order(1)
    void testGetAllPages() {
        // When: 获取所有页面
        List<Page> pages = contentService.getAllPages();
        
        // Then: 应该返回页面列表
        assertNotNull(pages, "页面列表不应为空");
        assertFalse(pages.isEmpty(), "应该至少有一个页面");
        
        // 验证页面数据完整性
        Page firstPage = pages.get(0);
        assertNotNull(firstPage.getId(), "页面ID不应为空");
        assertNotNull(firstPage.getSlug(), "页面slug不应为空");
        assertNotNull(firstPage.getNameZh(), "页面中文名不应为空");
        assertNotNull(firstPage.getNameEn(), "页面英文名不应为空");
        assertTrue(firstPage.getIsActive(), "返回的页面应该是激活状态");
        
        // 保存第一个页面ID用于后续测试
        testPageId = firstPage.getId();
        System.out.println("测试页面ID: " + testPageId);
    }
    
    /**
     * 测试2: 获取页面及其内容项
     * 验证：应该返回页面信息和所有关联的内容项
     * Requirements: 2.2
     */
    @Test
    @Order(2)
    void testGetPageWithContent() {
        // Given: 使用测试1中获取的页面ID
        assertNotNull(testPageId, "测试页面ID不应为空");
        
        // When: 获取页面及其内容
        PageWithContentDTO page = contentService.getPageWithContent(testPageId);
        
        // Then: 应该返回完整的页面数据
        assertNotNull(page, "页面数据不应为空");
        assertEquals(testPageId, page.getId(), "页面ID应该匹配");
        assertNotNull(page.getSlug(), "页面slug不应为空");
        assertNotNull(page.getNameZh(), "页面中文名不应为空");
        assertNotNull(page.getNameEn(), "页面英文名不应为空");
        
        // 验证内容项列表
        assertNotNull(page.getContentItems(), "内容项列表不应为空");
        assertFalse(page.getContentItems().isEmpty(), "应该至少有一个内容项");
        
        // 验证内容项数据完整性
        ContentItemDTO firstItem = page.getContentItems().get(0);
        assertNotNull(firstItem.getId(), "内容项ID不应为空");
        assertNotNull(firstItem.getFieldKey(), "字段键不应为空");
        assertNotNull(firstItem.getFieldType(), "字段类型不应为空");
        assertEquals(testPageId, firstItem.getPageId(), "内容项应该属于当前页面");
        assertNotNull(firstItem.getVersion(), "版本号不应为空");
        
        // 保存第一个内容项ID用于后续测试
        testContentItemId = firstItem.getId();
        System.out.println("测试内容项ID: " + testContentItemId);
    }
    
    /**
     * 测试3: 更新内容项
     * 验证：更新内容应该成功，并且版本号应该递增
     * Requirements: 2.2, 2.6
     */
    @Test
    @Order(3)
    void testUpdateContentItem() {
        // Given: 使用测试2中获取的内容项ID
        assertNotNull(testContentItemId, "测试内容项ID不应为空");
        
        // 先获取当前内容
        PageWithContentDTO page = contentService.getPageWithContent(testPageId);
        ContentItemDTO originalItem = page.getContentItems().stream()
            .filter(item -> item.getId().equals(testContentItemId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("找不到测试内容项"));
        
        Integer originalVersion = originalItem.getVersion();
        String originalContentZh = originalItem.getContentZh();
        
        // 准备更新请求
        UpdateContentRequest request = new UpdateContentRequest();
        request.setContentZh("更新后的中文内容 - 测试");
        request.setContentEn("Updated English Content - Test");
        request.setVersion(originalVersion);
        request.setChangeSummary("集成测试更新");
        
        // When: 更新内容
        ContentItemDTO updated = contentService.updateContentItem(testContentItemId, request, 1L);
        
        // Then: 验证更新结果
        assertNotNull(updated, "更新后的内容不应为空");
        assertEquals(testContentItemId, updated.getId(), "内容项ID应该保持不变");
        assertEquals("更新后的中文内容 - 测试", updated.getContentZh(), "中文内容应该已更新");
        assertEquals("Updated English Content - Test", updated.getContentEn(), "英文内容应该已更新");
        assertEquals(originalVersion + 1, updated.getVersion(), "版本号应该递增");
        
        System.out.println("内容更新成功: 版本 " + originalVersion + " -> " + updated.getVersion());
    }
    
    /**
     * 测试4: 版本自动创建
     * 验证：更新内容后应该自动创建版本记录
     * Requirements: 6.1
     */
    @Test
    @Order(4)
    void testVersionAutoCreation() {
        // Given: 使用之前更新过的内容项
        assertNotNull(testContentItemId, "测试内容项ID不应为空");
        
        // When: 获取版本历史
        List<ContentVersion> versions = contentService.getVersionHistory(testContentItemId);
        
        // Then: 应该至少有一个版本记录（测试3创建的）
        assertNotNull(versions, "版本列表不应为空");
        assertFalse(versions.isEmpty(), "应该至少有一个版本记录");
        
        // 验证版本记录的完整性
        ContentVersion latestVersion = versions.get(0); // 按版本号降序，第一个是最新的
        assertNotNull(latestVersion.getId(), "版本ID不应为空");
        assertEquals(testContentItemId, latestVersion.getContentItemId(), "版本应该属于当前内容项");
        assertNotNull(latestVersion.getVersionNumber(), "版本号不应为空");
        assertNotNull(latestVersion.getContentZh(), "版本中文内容不应为空");
        assertNotNull(latestVersion.getChangedBy(), "修改人不应为空");
        assertNotNull(latestVersion.getChangeSummary(), "修改摘要不应为空");
        assertNotNull(latestVersion.getCreatedAt(), "创建时间不应为空");
        
        System.out.println("版本历史记录数: " + versions.size());
        System.out.println("最新版本号: " + latestVersion.getVersionNumber());
    }
    
    /**
     * 测试5: 再次更新内容以创建更多版本
     * 验证：多次更新应该创建多个版本记录
     * Requirements: 6.1
     */
    @Test
    @Order(5)
    void testMultipleUpdatesCreateMultipleVersions() {
        // Given: 获取当前内容和版本
        PageWithContentDTO page = contentService.getPageWithContent(testPageId);
        ContentItemDTO currentItem = page.getContentItems().stream()
            .filter(item -> item.getId().equals(testContentItemId))
            .findFirst()
            .orElseThrow();
        
        List<ContentVersion> versionsBefore = contentService.getVersionHistory(testContentItemId);
        int versionCountBefore = versionsBefore.size();
        
        // When: 再次更新内容
        UpdateContentRequest request = new UpdateContentRequest();
        request.setContentZh("第二次更新的中文内容");
        request.setContentEn("Second Update English Content");
        request.setVersion(currentItem.getVersion());
        request.setChangeSummary("第二次更新");
        
        contentService.updateContentItem(testContentItemId, request, 1L);
        
        // Then: 版本记录应该增加
        List<ContentVersion> versionsAfter = contentService.getVersionHistory(testContentItemId);
        assertEquals(versionCountBefore + 1, versionsAfter.size(), 
            "版本记录数应该增加1");
        
        System.out.println("更新前版本数: " + versionCountBefore + ", 更新后版本数: " + versionsAfter.size());
    }
    
    /**
     * 测试6: 恢复到历史版本
     * 验证：应该能够恢复到指定的历史版本
     * Requirements: 6.7
     */
    @Test
    @Order(6)
    void testRestoreVersion() {
        // Given: 获取版本历史
        List<ContentVersion> versions = contentService.getVersionHistory(testContentItemId);
        assertTrue(versions.size() >= 2, "应该至少有2个版本记录");
        
        // 选择倒数第二个版本（不是最新的）
        ContentVersion targetVersion = versions.get(1);
        Long targetVersionId = targetVersion.getId();
        String targetContentZh = targetVersion.getContentZh();
        String targetContentEn = targetVersion.getContentEn();
        
        System.out.println("准备恢复到版本: " + targetVersion.getVersionNumber());
        System.out.println("目标版本中文内容: " + targetContentZh);
        
        // When: 恢复到目标版本
        ContentItemDTO restored = contentService.restoreVersion(
            testContentItemId, targetVersionId, 1L);
        
        // Then: 内容应该恢复到目标版本
        assertNotNull(restored, "恢复后的内容不应为空");
        assertEquals(testContentItemId, restored.getId(), "内容项ID应该保持不变");
        assertEquals(targetContentZh, restored.getContentZh(), 
            "中文内容应该恢复到目标版本");
        assertEquals(targetContentEn, restored.getContentEn(), 
            "英文内容应该恢复到目标版本");
        
        // 验证恢复操作也创建了新的版本记录
        List<ContentVersion> versionsAfterRestore = contentService.getVersionHistory(testContentItemId);
        assertTrue(versionsAfterRestore.size() > versions.size(), 
            "恢复操作应该创建新的版本记录");
        
        System.out.println("版本恢复成功，当前版本号: " + restored.getVersion());
    }
    
    /**
     * 测试7: 乐观锁并发控制
     * 验证：使用过期的版本号更新应该失败
     * Requirements: 15.6
     */
    @Test
    @Order(7)
    void testOptimisticLockingPreventsStaleUpdates() {
        // Given: 获取当前内容
        PageWithContentDTO page = contentService.getPageWithContent(testPageId);
        ContentItemDTO currentItem = page.getContentItems().stream()
            .filter(item -> item.getId().equals(testContentItemId))
            .findFirst()
            .orElseThrow();
        
        Integer currentVersion = currentItem.getVersion();
        
        // 先进行一次成功的更新
        UpdateContentRequest firstUpdate = new UpdateContentRequest();
        firstUpdate.setContentZh("第一次并发更新");
        firstUpdate.setContentEn("First Concurrent Update");
        firstUpdate.setVersion(currentVersion);
        firstUpdate.setChangeSummary("第一次更新");
        
        contentService.updateContentItem(testContentItemId, firstUpdate, 1L);
        
        // When & Then: 使用旧版本号尝试更新应该失败
        UpdateContentRequest secondUpdate = new UpdateContentRequest();
        secondUpdate.setContentZh("第二次并发更新（应该失败）");
        secondUpdate.setContentEn("Second Concurrent Update (Should Fail)");
        secondUpdate.setVersion(currentVersion); // 使用旧版本号
        secondUpdate.setChangeSummary("第二次更新");
        
        Exception exception = assertThrows(RuntimeException.class, () -> {
            contentService.updateContentItem(testContentItemId, secondUpdate, 1L);
        });
        
        assertTrue(exception.getMessage().contains("已被其他用户修改"), 
            "错误消息应该提示内容已被修改");
        
        System.out.println("乐观锁测试通过: " + exception.getMessage());
    }
    
    /**
     * 测试8: 获取不存在的页面应该抛出异常
     * 验证：错误处理
     */
    @Test
    @Order(8)
    void testGetNonExistentPageThrowsException() {
        // Given: 一个不存在的页面ID
        Long nonExistentPageId = 99999L;
        
        // When & Then: 应该抛出异常
        Exception exception = assertThrows(RuntimeException.class, () -> {
            contentService.getPageWithContent(nonExistentPageId);
        });
        
        assertTrue(exception.getMessage().contains("页面不存在"), 
            "错误消息应该提示页面不存在");
    }
    
    /**
     * 测试9: 更新不存在的内容项应该抛出异常
     * 验证：错误处理
     */
    @Test
    @Order(9)
    void testUpdateNonExistentContentItemThrowsException() {
        // Given: 一个不存在的内容项ID
        Long nonExistentItemId = 99999L;
        
        UpdateContentRequest request = new UpdateContentRequest();
        request.setContentZh("测试内容");
        request.setContentEn("Test Content");
        request.setVersion(1);
        
        // When & Then: 应该抛出异常
        Exception exception = assertThrows(RuntimeException.class, () -> {
            contentService.updateContentItem(nonExistentItemId, request, 1L);
        });
        
        assertTrue(exception.getMessage().contains("内容项不存在"), 
            "错误消息应该提示内容项不存在");
    }
    
    /**
     * 测试10: 恢复不存在的版本应该抛出异常
     * 验证：错误处理
     */
    @Test
    @Order(10)
    void testRestoreNonExistentVersionThrowsException() {
        // Given: 一个不存在的版本ID
        Long nonExistentVersionId = 99999L;
        
        // When & Then: 应该抛出异常
        Exception exception = assertThrows(RuntimeException.class, () -> {
            contentService.restoreVersion(testContentItemId, nonExistentVersionId, 1L);
        });
        
        assertTrue(exception.getMessage().contains("版本不存在"), 
            "错误消息应该提示版本不存在");
    }
    
    /**
     * 测试11: 内容往返一致性
     * 验证：保存的内容应该能够完整地检索回来
     * Requirements: 2.6, 3.6
     */
    @Test
    @Order(11)
    void testContentRoundTripConsistency() {
        // Given: 准备测试数据
        String testContentZh = "测试往返一致性的中文内容 - 包含特殊字符：《》、引号";
        String testContentEn = "Test round-trip consistency - Special chars: <>&\"\'";
        
        // 获取当前内容
        PageWithContentDTO page = contentService.getPageWithContent(testPageId);
        ContentItemDTO currentItem = page.getContentItems().stream()
            .filter(item -> item.getId().equals(testContentItemId))
            .findFirst()
            .orElseThrow();
        
        // When: 保存内容
        UpdateContentRequest request = new UpdateContentRequest();
        request.setContentZh(testContentZh);
        request.setContentEn(testContentEn);
        request.setVersion(currentItem.getVersion());
        request.setChangeSummary("往返一致性测试");
        
        ContentItemDTO saved = contentService.updateContentItem(testContentItemId, request, 1L);
        
        // Then: 检索的内容应该与保存的完全一致
        assertEquals(testContentZh, saved.getContentZh(), 
            "检索的中文内容应该与保存的完全一致");
        assertEquals(testContentEn, saved.getContentEn(), 
            "检索的英文内容应该与保存的完全一致");
        
        // 再次从数据库检索验证
        PageWithContentDTO pageAfter = contentService.getPageWithContent(testPageId);
        ContentItemDTO retrieved = pageAfter.getContentItems().stream()
            .filter(item -> item.getId().equals(testContentItemId))
            .findFirst()
            .orElseThrow();
        
        assertEquals(testContentZh, retrieved.getContentZh(), 
            "重新检索的中文内容应该与保存的完全一致");
        assertEquals(testContentEn, retrieved.getContentEn(), 
            "重新检索的英文内容应该与保存的完全一致");
        
        System.out.println("往返一致性测试通过");
    }
}
