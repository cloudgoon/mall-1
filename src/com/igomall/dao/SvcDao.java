
package com.igomall.dao;

import java.util.List;

import com.igomall.Order;
import com.igomall.entity.Store;
import com.igomall.entity.StoreRank;
import com.igomall.entity.Svc;

/**
 * Dao - 服务
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SvcDao extends BaseDao<Svc, Long> {

	/**
	 * 查找服务
	 * 
	 * @param store
	 *            店铺
	 * @param promotionPluginId
	 *            促销插件Id
	 * @param storeRank
	 *            店铺等级
	 * @param orders
	 *            排序
	 * @return 服务
	 */
	List<Svc> find(Store store, String promotionPluginId, StoreRank storeRank, List<Order> orders);

}