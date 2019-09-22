
package com.igomall.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.entity.SitemapIndex;
import com.igomall.entity.SitemapUrl;
import com.igomall.service.SitemapIndexService;
import com.igomall.service.SitemapUrlService;

/**
 * Service - Sitemap索引
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SitemapIndexServiceImpl implements SitemapIndexService {

	@Inject
	private SitemapUrlService sitemapUrlService;

	@Transactional(readOnly = true)
	public List<SitemapIndex> generate(SitemapUrl.Type type, int maxSitemapUrlSize) {
		Assert.notNull(type,"");
		Assert.state(maxSitemapUrlSize >= 0,"");

		List<SitemapIndex> sitemapIndexs = new ArrayList<>();
		Long sitemapUrlSize = sitemapUrlService.count(type);
		for (int i = 0; i < Math.ceil((double) sitemapUrlSize / (double) maxSitemapUrlSize); i++) {
			SitemapIndex sitemapIndex = new SitemapIndex();
			sitemapIndex.setType(type);
			sitemapIndex.setIndex(i);
			sitemapIndexs.add(sitemapIndex);
		}
		return sitemapIndexs;
	}

}