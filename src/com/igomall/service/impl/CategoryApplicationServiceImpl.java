
package com.igomall.service.impl;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.CategoryApplicationDao;
import com.igomall.dao.ProductDao;
import com.igomall.entity.CategoryApplication;
import com.igomall.entity.ProductCategory;
import com.igomall.entity.Store;
import com.igomall.service.CategoryApplicationService;

/**
 * Service - 经营分类申请
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class CategoryApplicationServiceImpl extends BaseServiceImpl<CategoryApplication, Long> implements CategoryApplicationService {

	@Inject
	private CategoryApplicationDao categoryApplicationDao;
	@Inject
	private ProductDao productDao;

	@Transactional(readOnly = true)
	public boolean exist(Store store, ProductCategory productCategory, CategoryApplication.Status status) {
		Assert.notNull(status,"");
		Assert.notNull(store,"");
		Assert.notNull(productCategory,"");

		return categoryApplicationDao.findList(store, productCategory, status).size() > 0;
	}

	@Transactional(readOnly = true)
	public Page<CategoryApplication> findPage(Store store, Pageable pageable) {
		return categoryApplicationDao.findPage(store, pageable);
	}

	@CacheEvict(value = { "product", "productCategory" }, allEntries = true)
	public void review(CategoryApplication categoryApplication, boolean isPassed) {
		Assert.notNull(categoryApplication,"");

		if (isPassed) {
			Store store = categoryApplication.getStore();
			ProductCategory productCategory = categoryApplication.getProductCategory();

			categoryApplication.setStatus(CategoryApplication.Status.approved);
			store.getProductCategories().add(productCategory);
			Set<ProductCategory> productCategories = new HashSet<>();
			productCategories.add(productCategory);
			productDao.refreshActive(store);
		} else {
			categoryApplication.setStatus(CategoryApplication.Status.failed);
		}
	}

}