
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.StoreAdImageDao;
import com.igomall.entity.Store;
import com.igomall.entity.StoreAdImage;
import com.igomall.service.StoreAdImageService;

/**
 * Service - 店铺广告图片
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class StoreAdImageServiceImpl extends BaseServiceImpl<StoreAdImage, Long> implements StoreAdImageService {

	@Inject
	private StoreAdImageDao storeAdImageDao;

	@Transactional(readOnly = true)
	public Page<StoreAdImage> findPage(Store store, Pageable pageable) {
		return storeAdImageDao.findPage(store, pageable);
	}

}