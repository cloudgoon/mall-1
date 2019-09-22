
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.StoreProductTagDao;
import com.igomall.entity.Store;
import com.igomall.entity.StoreProductTag;
import com.igomall.service.StoreProductTagService;

/**
 * Service - 店铺商品标签
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class StoreProductTagServiceImpl extends BaseServiceImpl<StoreProductTag, Long> implements StoreProductTagService {

	@Inject
	private StoreProductTagDao storeProductTagDao;

	@Transactional(readOnly = true)
	public List<StoreProductTag> findList(Store store, Boolean isEnabled) {
		return storeProductTagDao.findList(store, isEnabled);
	}

	@Transactional(readOnly = true)
	public Page<StoreProductTag> findPage(Store store, Pageable pageable) {
		return storeProductTagDao.findPage(store, pageable);
	}

}