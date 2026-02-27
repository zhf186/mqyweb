package com.manqiyou.app.cms.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.manqiyou.app.cms.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 管理员用户 Mapper
 */
@Mapper
public interface AdminUserMapper extends BaseMapper<AdminUser> {
}
