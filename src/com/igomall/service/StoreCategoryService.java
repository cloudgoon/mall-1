
package com.igomall.service;

import com.igomall.entity.StoreCategory;

/**
 * Service - 店铺分类
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface StoreCategoryService extends BaseService<StoreCategory, Long> {

	/**
	 * 判断名称是否存在
	 * 
	 * @param name
	 *            名称(忽略大小写)
	 * @return 名称是否存在
	 */
	boolean nameExists(String name);

}