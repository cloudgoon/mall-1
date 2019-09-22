
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.dao.ArticleTagDao;
import com.igomall.entity.ArticleTag;
import com.igomall.service.ArticleTagService;

/**
 * Service - 文章标签
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class ArticleTagServiceImpl extends BaseServiceImpl<ArticleTag, Long> implements ArticleTagService {

	@Inject
	private ArticleTagDao articleTagDao;

	@Transactional(readOnly = true)
	@Cacheable(value = "articleTag", condition = "#useCache")
	@Override
	public List<ArticleTag> findList(Integer count, List<Filter> filters, List<Order> orders, boolean useCache) {
		return articleTagDao.findList(null, count, filters, orders);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public ArticleTag save(ArticleTag articleTag) {
		return super.save(articleTag);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public ArticleTag update(ArticleTag articleTag) {
		return super.update(articleTag);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public ArticleTag update(ArticleTag articleTag, String... ignoreProperties) {
		return super.update(articleTag, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "articleTag", allEntries = true)
	public void delete(ArticleTag articleTag) {
		super.delete(articleTag);
	}

}