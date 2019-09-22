
package com.igomall.service;

import java.util.List;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.entity.Navigation;

/**
 * Service - 导航
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface NavigationService extends BaseService<Navigation, Long> {

	/**
	 * 查找导航
	 * 
	 * @param position
	 *            位置
	 * @return 导航
	 */
	List<Navigation> findList(Navigation.Position position);

	/**
	 * 查找导航
	 * 
	 * @param count
	 *            数量
	 * @param filters
	 *            筛选
	 * @param orders
	 *            排序
	 * @param useCache
	 *            是否使用缓存
	 * @return 导航
	 */
	List<Navigation> findList(Integer count, List<Filter> filters, List<Order> orders, boolean useCache);

}