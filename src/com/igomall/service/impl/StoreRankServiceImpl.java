
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.dao.StoreRankDao;
import com.igomall.entity.StoreRank;
import com.igomall.service.StoreRankService;

/**
 * Service - 店铺等级
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class StoreRankServiceImpl extends BaseServiceImpl<StoreRank, Long> implements StoreRankService {

	@Inject
	private StoreRankDao storeRankDao;

	@Transactional(readOnly = true)
	public boolean nameExists(String name) {
		return storeRankDao.exists("name", name);
	}

	@Transactional(readOnly = true)
	public boolean nameUnique(Long id, String name) {
		return storeRankDao.unique(id, "name", name);
	}

	@Transactional(readOnly = true)
	public List<StoreRank> findList(Boolean isAllowRegister, List<Filter> filters, List<Order> orders) {
		return storeRankDao.findList(isAllowRegister, filters, orders);
	}

}