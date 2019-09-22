
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.dao.SnDao;
import com.igomall.entity.OrderReturns;
import com.igomall.entity.Sn;
import com.igomall.service.OrderReturnsService;

/**
 * Service - 订单退货
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class OrderReturnsServiceImpl extends BaseServiceImpl<OrderReturns, Long> implements OrderReturnsService {

	@Inject
	private SnDao snDao;

	@Override
	@Transactional
	public OrderReturns save(OrderReturns orderReturns) {
		Assert.notNull(orderReturns,"");

		orderReturns.setSn(snDao.generate(Sn.Type.orderReturns));

		return super.save(orderReturns);
	}

}