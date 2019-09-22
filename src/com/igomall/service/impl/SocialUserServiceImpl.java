
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.SocialUserDao;
import com.igomall.entity.SocialUser;
import com.igomall.entity.User;
import com.igomall.service.SocialUserService;

/**
 * Service - 社会化用户
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SocialUserServiceImpl extends BaseServiceImpl<SocialUser, Long> implements SocialUserService {

	@Inject
	private SocialUserDao socialUserDao;

	@Transactional(readOnly = true)
	public SocialUser find(String loginPluginId, String uniqueId) {
		return socialUserDao.find(loginPluginId, uniqueId);
	}

	@Transactional(readOnly = true)
	public Page<SocialUser> findPage(User user, Pageable pageable) {
		return socialUserDao.findPage(user, pageable);
	}

	public void bindUser(User user, SocialUser socialUser, String uniqueId) {
		Assert.notNull(socialUser,"");
		Assert.hasText(uniqueId,"");

		if (!socialUser.getUniqueId().equals(uniqueId) || socialUser.getUser() != null) {
			return;
		}

		socialUser.setUser(user);
	}

}