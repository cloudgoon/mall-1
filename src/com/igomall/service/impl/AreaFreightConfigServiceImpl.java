
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.AreaFreightConfigDao;
import com.igomall.entity.Area;
import com.igomall.entity.AreaFreightConfig;
import com.igomall.entity.ShippingMethod;
import com.igomall.entity.Store;
import com.igomall.service.AreaFreightConfigService;

/**
 * Service - 地区运费配置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class AreaFreightConfigServiceImpl extends BaseServiceImpl<AreaFreightConfig, Long> implements AreaFreightConfigService {

	@Inject
	private AreaFreightConfigDao areaFreightConfigDao;

	@Transactional(readOnly = true)
	@Override
	public boolean exists(ShippingMethod shippingMethod, Store store, Area area) {
		return areaFreightConfigDao.exists(shippingMethod, store, area);
	}

	@Transactional(readOnly = true)
	@Override
	public boolean unique(Long id, ShippingMethod shippingMethod, Store store, Area area) {
		return areaFreightConfigDao.unique(id, shippingMethod, store, area);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<AreaFreightConfig> findPage(ShippingMethod shippingMethod, Store store, Pageable pageable) {
		return areaFreightConfigDao.findPage(shippingMethod, store, pageable);
	}

}