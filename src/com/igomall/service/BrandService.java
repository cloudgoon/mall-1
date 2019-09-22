
package com.igomall.service;

import java.util.List;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.entity.Brand;
import com.igomall.entity.ProductCategory;

/**
 * Service - 品牌
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface BrandService extends BaseService<Brand, Long> {

	/**
	 * 查找品牌
	 * 
	 * @param productCategory
	 *            商品分类
	 * @param count
	 *            数量
	 * @param filters
	 *            筛选
	 * @param orders
	 *            排序
	 * @return 品牌
	 */
	List<Brand> findList(ProductCategory productCategory, Integer count, List<Filter> filters, List<Order> orders);

	/**
	 * 查找品牌
	 * 
	 * @param productCategoryId
	 *            商品分类ID
	 * @param count
	 *            数量
	 * @param filters
	 *            筛选
	 * @param orders
	 *            排序
	 * @param useCache
	 *            是否使用缓存
	 * @return 品牌
	 */
	List<Brand> findList(Long productCategoryId, Integer count, List<Filter> filters, List<Order> orders, boolean useCache);

}