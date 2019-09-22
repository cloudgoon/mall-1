
package com.igomall.service;

import com.igomall.entity.Seo;

/**
 * Service - SEO设置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SeoService extends BaseService<Seo, Long> {

	/**
	 * 查找SEO设置
	 * 
	 * @param type
	 *            类型
	 * @return SEO设置
	 */
	Seo find(Seo.Type type);

	/**
	 * 查找SEO设置
	 * 
	 * @param type
	 *            类型
	 * @param useCache
	 *            是否使用缓存
	 * @return SEO设置
	 */
	Seo find(Seo.Type type, boolean useCache);

}