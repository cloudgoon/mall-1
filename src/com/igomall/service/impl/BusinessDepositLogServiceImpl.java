
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.BusinessDepositLogDao;
import com.igomall.entity.Business;
import com.igomall.entity.BusinessDepositLog;
import com.igomall.service.BusinessDepositLogService;

/**
 * Service - 商家预存款记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class BusinessDepositLogServiceImpl extends BaseServiceImpl<BusinessDepositLog, Long> implements BusinessDepositLogService {

	@Inject
	private BusinessDepositLogDao businessDepositLogDao;

	@Transactional(readOnly = true)
	@Override
	public Page<BusinessDepositLog> findPage(Business business, Pageable pageable) {
		return businessDepositLogDao.findPage(business, pageable);
	}

}