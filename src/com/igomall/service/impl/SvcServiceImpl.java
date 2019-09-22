
package com.igomall.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Order;
import com.igomall.dao.SnDao;
import com.igomall.dao.SvcDao;
import com.igomall.entity.Sn;
import com.igomall.entity.Store;
import com.igomall.entity.StoreRank;
import com.igomall.entity.Svc;
import com.igomall.service.SvcService;

/**
 * Service - 服务
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SvcServiceImpl extends BaseServiceImpl<Svc, Long> implements SvcService {

	@Inject
	private SvcDao svcDao;
	@Inject
	private SnDao snDao;

	@Transactional(readOnly = true)
	public Svc findBySn(String sn) {
		return svcDao.find("sn", StringUtils.lowerCase(sn));
	}

	@Transactional(readOnly = true)
	public Svc findTheLatest(Store store, String promotionPluginId, StoreRank storeRank) {

		List<Order> orderList = new ArrayList<>();
		orderList.add(new Order("createdDate", Order.Direction.desc));
		List<Svc> serviceOrders = svcDao.find(store, promotionPluginId, storeRank, orderList);

		return CollectionUtils.isNotEmpty(serviceOrders) ? serviceOrders.get(0) : null;
	}

	@Override
	@Transactional
	public Svc save(Svc svc) {
		Assert.notNull(svc,"");

		svc.setSn(snDao.generate(Sn.Type.platformService));

		return super.save(svc);
	}

}