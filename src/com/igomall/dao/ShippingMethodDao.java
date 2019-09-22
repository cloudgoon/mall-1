
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.ShippingMethod;

/**
 * Dao - 配送方式
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface ShippingMethodDao extends BaseDao<ShippingMethod, Long> {

	/**
	 * 查找配送方式分页
	 * 
	 * @param pageable
	 *            分页
	 * @return 配送方式分页
	 */
	Page<ShippingMethod> findPage(Pageable pageable);
}