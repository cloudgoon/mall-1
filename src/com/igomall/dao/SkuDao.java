
package com.igomall.dao;

import java.util.List;
import java.util.Set;

import com.igomall.entity.Product;
import com.igomall.entity.Sku;
import com.igomall.entity.Store;

/**
 * Dao - SKU
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SkuDao extends BaseDao<Sku, Long> {

	/**
	 * 通过编号、名称查找SKU
	 * 
	 * @param store
	 *            店铺
	 * @param type
	 *            类型
	 * @param keyword
	 *            关键词
	 * @param excludes
	 *            排除SKU
	 * @param count
	 *            数量
	 * @return SKU
	 */
	List<Sku> search(Store store, Product.Type type, String keyword, Set<Sku> excludes, Integer count);

}