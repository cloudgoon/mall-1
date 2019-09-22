
package com.igomall.service;

import com.igomall.entity.OrderPayment;

/**
 * Service - 订单支付
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface OrderPaymentService extends BaseService<OrderPayment, Long> {

	/**
	 * 根据编号查找订单支付
	 * 
	 * @param sn
	 *            编号(忽略大小写)
	 * @return 订单支付，若不存在则返回null
	 */
	OrderPayment findBySn(String sn);

}