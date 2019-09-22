
package com.igomall.dao.impl;

import javax.persistence.NoResultException;

import org.springframework.stereotype.Repository;

import com.igomall.dao.OrderShippingDao;
import com.igomall.entity.Order;
import com.igomall.entity.OrderShipping;

/**
 * Dao - 订单发货
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class OrderShippingDaoImpl extends BaseDaoImpl<OrderShipping, Long> implements OrderShippingDao {

	public OrderShipping findLast(Order order) {
		if (order == null) {
			return null;
		}
		String jpql = "select orderShipping from OrderShipping shipping where lower(orderShipping.order) = lower(:order) order by orderShipping.createdDate desc";
		try {
			return entityManager.createQuery(jpql, OrderShipping.class).setParameter("order", order.getId()).setMaxResults(1).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

}