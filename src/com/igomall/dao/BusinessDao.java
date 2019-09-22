
package com.igomall.dao;

import java.util.List;

import com.igomall.entity.Business;

/**
 * Dao - 商家
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface BusinessDao extends BaseDao<Business, Long> {

	/**
	 * 通过名称查找商家
	 * 
	 * @param keyword
	 *            关键词
	 * @param count
	 *            数量
	 * @return 商家
	 */
	List<Business> search(String keyword, Integer count);

}