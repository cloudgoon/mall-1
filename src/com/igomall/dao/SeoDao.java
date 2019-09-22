
package com.igomall.dao;

import com.igomall.entity.Seo;

/**
 * Dao - SEO设置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SeoDao extends BaseDao<Seo, Long> {

	/**
	 * 查找SEO设置
	 * 
	 * @param type
	 *            类型
	 * @return SEO设置
	 */
	Seo find(Seo.Type type);

}