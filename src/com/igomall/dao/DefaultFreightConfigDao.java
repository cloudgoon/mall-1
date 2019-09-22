
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Area;
import com.igomall.entity.DefaultFreightConfig;
import com.igomall.entity.ShippingMethod;
import com.igomall.entity.Store;

/**
 * Dao - 默认运费配置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface DefaultFreightConfigDao extends BaseDao<DefaultFreightConfig, Long> {

	/**
	 * 判断运费配置是否存在
	 * 
	 * @param shippingMethod
	 *            配送方式
	 * @param area
	 *            地区
	 * @return 运费配置是否存在
	 */
	boolean exists(ShippingMethod shippingMethod, Area area);

	/**
	 * 查找默认运费配置分页
	 * 
	 * @param store
	 *            店铺
	 * @param pageable
	 *            分页信息
	 * @return 运费配置分页
	 */
	Page<DefaultFreightConfig> findPage(Store store, Pageable pageable);

	/**
	 * 查找默认运费配置
	 * 
	 * @param shippingMethod
	 *            配送方式
	 * @param store
	 *            店铺
	 * @return 默认运费配置
	 */
	DefaultFreightConfig find(ShippingMethod shippingMethod, Store store);

}