
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.ProductFavoriteDao;
import com.igomall.entity.Member;
import com.igomall.entity.Product;
import com.igomall.entity.ProductFavorite;
import com.igomall.service.ProductFavoriteService;

/**
 * Service - 商品收藏
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class ProductFavoriteServiceImpl extends BaseServiceImpl<ProductFavorite, Long> implements ProductFavoriteService {

	@Inject
	private ProductFavoriteDao productFavoriteDao;

	@Transactional(readOnly = true)
	public boolean exists(Member member, Product product) {
		return productFavoriteDao.exists(member, product);
	}

	@Transactional(readOnly = true)
	public List<ProductFavorite> findList(Member member, Integer count, List<Filter> filters, List<Order> orders) {
		return productFavoriteDao.findList(member, count, filters, orders);
	}

	@Transactional(readOnly = true)
	public Page<ProductFavorite> findPage(Member member, Pageable pageable) {
		return productFavoriteDao.findPage(member, pageable);
	}

	@Transactional(readOnly = true)
	public Long count(Member member) {
		return productFavoriteDao.count(member);
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "productFavorite", condition = "#useCache")
	public List<ProductFavorite> findList(Integer count, List<Filter> filters, List<Order> orders, boolean useCache) {
		return productFavoriteDao.findList((Integer) null, count, filters, orders);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public ProductFavorite save(ProductFavorite productFavorite) {
		return super.save(productFavorite);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public ProductFavorite update(ProductFavorite productFavorite) {
		return super.update(productFavorite);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public ProductFavorite update(ProductFavorite productFavorite, String... ignoreProperties) {
		return super.update(productFavorite, ignoreProperties);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@CacheEvict(value = "productFavorite", allEntries = true)
	public void delete(ProductFavorite productFavorite) {
		super.delete(productFavorite);
	}

}