
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.dao.StoreCategoryDao;
import com.igomall.entity.StoreCategory;
import com.igomall.service.StoreCategoryService;

/**
 * Service - 店铺分类
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class StoreCategoryServiceImpl extends BaseServiceImpl<StoreCategory, Long> implements StoreCategoryService {

	@Inject
	private StoreCategoryDao storeCategoryDao;

	@Transactional(readOnly = true)
	public boolean nameExists(String name) {
		return storeCategoryDao.exists("name", name, true);
	}

}