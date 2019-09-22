
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.SocialUser;
import com.igomall.entity.User;

/**
 * Dao - 社会化用户
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SocialUserDao extends BaseDao<SocialUser, Long> {

	/**
	 * 查找社会化用户
	 * 
	 * @param loginPluginId
	 *            登录插件ID
	 * @param uniqueId
	 *            唯一ID
	 * @return 社会化用户，若不存在则返回null
	 */
	SocialUser find(String loginPluginId, String uniqueId);

	/**
	 * 查找社会化用户分页
	 * 
	 * @param user
	 *            用户
	 * @param pageable
	 *            分页信息
	 * @return 社会化用户分页
	 */
	Page<SocialUser> findPage(User user, Pageable pageable);

}