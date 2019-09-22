
package com.igomall.service.impl;

import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.dao.AttributeDao;
import com.igomall.dao.ProductCategoryDao;
import com.igomall.dao.ProductDao;
import com.igomall.entity.Attribute;
import com.igomall.entity.ProductCategory;
import com.igomall.service.AttributeService;

/**
 * Service - 属性
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class AttributeServiceImpl extends BaseServiceImpl<Attribute, Long> implements AttributeService {

	@Inject
	private AttributeDao attributeDao;
	@Inject
	private ProductCategoryDao productCategoryDao;
	@Inject
	private ProductDao productDao;

	@Transactional(readOnly = true)
	@Override
	public Integer findUnusedPropertyIndex(ProductCategory productCategory) {
		return attributeDao.findUnusedPropertyIndex(productCategory);
	}

	@Transactional(readOnly = true)
	@Override
	public List<Attribute> findList(ProductCategory productCategory, Integer count, List<Filter> filters, List<Order> orders) {
		return attributeDao.findList(productCategory, count, filters, orders);
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "attribute", condition = "#useCache")
	@Override
	public List<Attribute> findList(Long productCategoryId, Integer count, List<Filter> filters, List<Order> orders, boolean useCache) {
		ProductCategory productCategory = productCategoryDao.find(productCategoryId);
		if (productCategoryId != null && productCategory == null) {
			return Collections.emptyList();
		}
		return attributeDao.findList(productCategory, count, filters, orders);
	}

	@Transactional(readOnly = true)
	@Override
	public String toAttributeValue(Attribute attribute, String value) {
		Assert.notNull(attribute,"");

		if (StringUtils.isEmpty(value) || CollectionUtils.isEmpty(attribute.getOptions()) || !attribute.getOptions().contains(value)) {
			return null;
		}
		return value;
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public Attribute save(Attribute attribute) {
		Assert.notNull(attribute,"");

		Integer unusedPropertyIndex = attributeDao.findUnusedPropertyIndex(attribute.getProductCategory());
		Assert.notNull(unusedPropertyIndex,"");

		attribute.setPropertyIndex(unusedPropertyIndex);
		return super.save(attribute);
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public Attribute update(Attribute attribute) {
		return super.update(attribute);
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public Attribute update(Attribute attribute, String... ignoreProperties) {
		return super.update(attribute, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "attribute", allEntries = true)
	public void delete(Attribute attribute) {
		if (attribute != null) {
			productDao.clearAttributeValue(attribute);
		}

		super.delete(attribute);
	}

}