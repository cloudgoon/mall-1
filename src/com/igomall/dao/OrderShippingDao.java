
package com.igomall.dao;

import com.igomall.entity.Order;
import com.igomall.entity.OrderShipping;

/**
 * Dao - 订单发货
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface OrderShippingDao extends BaseDao<OrderShipping, Long> {

	/**
	 * 查找最后一条订单发货
	 * 
	 * @param order
	 *            订单
	 * @return 订单发货，若不存在则返回null
	 */
	OrderShipping findLast(Order order);

}