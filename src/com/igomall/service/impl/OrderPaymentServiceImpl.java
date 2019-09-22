
package com.igomall.service.impl;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.dao.OrderPaymentDao;
import com.igomall.dao.SnDao;
import com.igomall.entity.OrderPayment;
import com.igomall.entity.Sn;
import com.igomall.service.OrderPaymentService;

/**
 * Service - 订单支付
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class OrderPaymentServiceImpl extends BaseServiceImpl<OrderPayment, Long> implements OrderPaymentService {

	@Inject
	private OrderPaymentDao orderPaymentDao;
	@Inject
	private SnDao snDao;

	@Transactional(readOnly = true)
	public OrderPayment findBySn(String sn) {
		return orderPaymentDao.find("sn", StringUtils.lowerCase(sn));
	}

	@Override
	@Transactional
	public OrderPayment save(OrderPayment orderPayment) {
		Assert.notNull(orderPayment,"");

		orderPayment.setSn(snDao.generate(Sn.Type.orderPayment));

		return super.save(orderPayment);
	}

}