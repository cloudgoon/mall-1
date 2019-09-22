
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.dao.SeoDao;
import com.igomall.entity.Seo;
import com.igomall.service.SeoService;

/**
 * Service - SEO设置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SeoServiceImpl extends BaseServiceImpl<Seo, Long> implements SeoService {

	@Inject
	private SeoDao seoDao;

	@Transactional(readOnly = true)
	public Seo find(Seo.Type type) {
		return seoDao.find("type", type);
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "seo", condition = "#useCache")
	public Seo find(Seo.Type type, boolean useCache) {
		return seoDao.find("type", type);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public Seo save(Seo seo) {
		return super.save(seo);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public Seo update(Seo seo) {
		return super.update(seo);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public Seo update(Seo seo, String... ignoreProperties) {
		return super.update(seo, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "seo", allEntries = true)
	public void delete(Seo seo) {
		super.delete(seo);
	}

}