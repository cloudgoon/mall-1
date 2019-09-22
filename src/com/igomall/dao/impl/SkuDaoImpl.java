
package com.igomall.dao.impl;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.igomall.dao.SkuDao;
import com.igomall.entity.Product;
import com.igomall.entity.Sku;
import com.igomall.entity.Store;

/**
 * Dao - SKU
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class SkuDaoImpl extends BaseDaoImpl<Sku, Long> implements SkuDao {

	public List<Sku> search(Store store, Product.Type type, String keyword, Set<Sku> excludes, Integer count) {
		if (StringUtils.isEmpty(keyword)) {
			return Collections.emptyList();
		}

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Sku> criteriaQuery = criteriaBuilder.createQuery(Sku.class);
		Root<Sku> root = criteriaQuery.from(Sku.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("product").get("store"), store));
		}
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("product").get("type"), type));
		}
		restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(criteriaBuilder.like(root.<String>get("sn"), "%" + keyword + "%"), criteriaBuilder.like(root.get("product").<String>get("name"), "%" + keyword + "%")));
		if (CollectionUtils.isNotEmpty(excludes)) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.not(root.in(excludes)));
		}
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, count, null, null);
	}

}