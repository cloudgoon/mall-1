
package com.igomall.service;

import java.util.List;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.entity.StoreRank;

/**
 * Service - 店铺等级
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface StoreRankService extends BaseService<StoreRank, Long> {

	/**
	 * 判断名称是否存在
	 * 
	 * @param name
	 *            名称
	 * @return 名称是否存在
	 */
	boolean nameExists(String name);

	/**
	 * 判断名称是否唯一
	 * 
	 * @param id
	 *            ID
	 * @param name
	 *            名称
	 * @return 名称是否唯一
	 */
	boolean nameUnique(Long id, String name);

	/**
	 * 查找店铺等级
	 * 
	 * @param isAllowRegister
	 *            是否允许注册
	 * @param filters
	 *            筛选
	 * @param orders
	 *            排序
	 * @return 店铺等级
	 */
	List<StoreRank> findList(Boolean isAllowRegister, List<Filter> filters, List<Order> orders);
}