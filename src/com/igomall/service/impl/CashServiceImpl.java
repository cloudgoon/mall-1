
package com.igomall.service.impl;

import java.math.BigDecimal;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.CashDao;
import com.igomall.entity.Business;
import com.igomall.entity.BusinessDepositLog;
import com.igomall.entity.Cash;
import com.igomall.service.BusinessService;
import com.igomall.service.CashService;

/**
 * Service - 提现
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class CashServiceImpl extends BaseServiceImpl<Cash, Long> implements CashService {

	@Inject
	private CashDao cashDao;
	@Inject
	private BusinessService businessService;

	@Transactional(readOnly = true)
	public Page<Cash> findPage(Business business, Pageable pageable) {
		return cashDao.findPage(business, pageable);
	}

	public void applyCash(Cash cash, Business business) {
		Assert.notNull(cash,"");
		Assert.notNull(business,"");
		Assert.isTrue(cash.getAmount().compareTo(BigDecimal.ZERO) > 0,"");

		cash.setStatus(Cash.Status.pending);
		cash.setBusiness(business);
		cashDao.persist(cash);

		businessService.addBalance(cash.getBusiness(), cash.getAmount().negate(), BusinessDepositLog.Type.cash, null);
		businessService.addFrozenFund(business, cash.getAmount());

	}

	public void review(Cash cash, Boolean isPassed) {
		Assert.notNull(cash,"");
		Assert.notNull(isPassed,"");

		Business business = cash.getBusiness();
		if (isPassed) {
			Assert.notNull(cash.getAmount(),"");
			Assert.notNull(cash.getBusiness(),"");
			Assert.notNull(cash.getBusiness(),"");
			cash.setStatus(Cash.Status.approved);
		} else {
			cash.setStatus(Cash.Status.failed);
			businessService.addBalance(cash.getBusiness(), cash.getAmount(), BusinessDepositLog.Type.unfrozen, null);
		}
		businessService.addFrozenFund(business, cash.getAmount().negate());
	}

}