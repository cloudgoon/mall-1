
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.dao.SnDao;
import com.igomall.entity.OrderRefunds;
import com.igomall.entity.Sn;
import com.igomall.service.OrderRefundsService;

/**
 * Service - 订单退款
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class OrderRefundsServiceImpl extends BaseServiceImpl<OrderRefunds, Long> implements OrderRefundsService {

	@Inject
	private SnDao snDao;

	@Override
	@Transactional
	public OrderRefunds save(OrderRefunds orderRefunds) {
		Assert.notNull(orderRefunds,"");

		orderRefunds.setSn(snDao.generate(Sn.Type.orderRefunds));

		return super.save(orderRefunds);
	}

}