
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import com.igomall.service.CacheService;
import com.igomall.service.ConfigService;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;

/**
 * Service - 缓存
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class CacheServiceImpl implements CacheService {

	@Inject
	private CacheManager cacheManager;
	@Inject
	private FreeMarkerConfigurer freeMarkerConfigurer;
	@Inject
	private ReloadableResourceBundleMessageSource reloadableResourceBundleMessageSource;
	@Inject
	private ConfigService configService;
	@Override

	public String getDiskStorePath() {
		return cacheManager.getConfiguration().getDiskStoreConfiguration().getPath();
	}
	@Override

	public int getCacheSize() {
		int cacheSize = 0;
		String[] cacheNames = cacheManager.getCacheNames();
		if (cacheNames != null) {
			for (String cacheName : cacheNames) {
				Ehcache cache = cacheManager.getEhcache(cacheName);
				if (cache != null) {
					cacheSize += cache.getSize();
				}
			}
		}
		return cacheSize;
	}

	@CacheEvict(value = { "setting", "templateConfig", "pluginConfig", "messageConfig", "area", "seo", "adPosition", "memberAttribute", "navigation", "friendLink", "brand", "attribute", "article", "articleCategory", "articleTag", "product", "productCategory", "productTag", "review", "consultation",
			"promotion", "sitemap", "commonJs", "transitSteps", "authorization", "businessAttribute", "storeProductCategory", "productFavorite", "storeFavorite" }, allEntries = true)
	@Override
	public void clear() {
		freeMarkerConfigurer.getConfiguration().clearTemplateCache();
		reloadableResourceBundleMessageSource.clearCache();
		configService.init();
	}

}