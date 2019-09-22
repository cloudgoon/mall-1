
package com.igomall.service;

import java.math.BigDecimal;

import com.igomall.entity.Area;
import com.igomall.entity.Receiver;
import com.igomall.entity.ShippingMethod;
import com.igomall.entity.Store;

/**
 * Service - 配送方式
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface ShippingMethodService extends BaseService<ShippingMethod, Long> {

	/**
	 * 计算运费
	 * 
	 * @param shippingMethod
	 *            配送方式
	 * @param store
	 *            店铺
	 * @param area
	 *            地区
	 * @param weight
	 *            重量
	 * @return 运费
	 */
	BigDecimal calculateFreight(ShippingMethod shippingMethod, Store store, Area area, Integer weight);

	/**
	 * 计算运费
	 * 
	 * @param shippingMethod
	 *            配送方式
	 * @param store
	 *            店铺
	 * @param receiver
	 *            收货地址
	 * @param weight
	 *            重量
	 * @return 运费
	 */
	BigDecimal calculateFreight(ShippingMethod shippingMethod, Store store, Receiver receiver, Integer weight);
}