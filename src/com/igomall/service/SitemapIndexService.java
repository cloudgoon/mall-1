
package com.igomall.service;

import java.util.List;

import com.igomall.entity.SitemapIndex;
import com.igomall.entity.SitemapUrl;

/**
 * Service - Sitemap索引
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SitemapIndexService {

	/**
	 * 生成Sitemap索引
	 * 
	 * @param type
	 *            类型
	 * @param maxSitemapUrlSize
	 *            最大Sitemap URL数量
	 * @return Sitemap索引
	 */
	List<SitemapIndex> generate(SitemapUrl.Type type, int maxSitemapUrlSize);

}