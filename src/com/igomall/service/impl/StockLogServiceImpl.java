
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.StockLogDao;
import com.igomall.entity.StockLog;
import com.igomall.entity.Store;
import com.igomall.service.StockLogService;

/**
 * Service - 库存记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class StockLogServiceImpl extends BaseServiceImpl<StockLog, Long> implements StockLogService {

	@Inject
	private StockLogDao stockLogDao;

	@Transactional(readOnly = true)
	public Page<StockLog> findPage(Store store, Pageable pageable) {
		return stockLogDao.findPage(store, pageable);
	}

}