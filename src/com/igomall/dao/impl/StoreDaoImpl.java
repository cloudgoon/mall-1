
package com.igomall.dao.impl;

import java.util.Date;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.StoreDao;
import com.igomall.entity.CategoryApplication;
import com.igomall.entity.ProductCategory;
import com.igomall.entity.Store;
import com.igomall.entity.Store.Status;
import com.igomall.entity.Store.Type;

/**
 * Dao - 店铺
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class StoreDaoImpl extends BaseDaoImpl<Store, Long> implements StoreDao {

	public List<Store> findList(Type type, Status status, Boolean isEnabled, Boolean hasExpired, Integer first, Integer count) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Store> criteriaQuery = criteriaBuilder.createQuery(Store.class);
		Root<Store> root = criteriaQuery.from(Store.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("type"), type));
		}
		if (status != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("status"), status));
		}
		if (isEnabled != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isEnabled"), isEnabled));
		}
		if (hasExpired != null) {
			if (hasExpired) {
				restrictions = criteriaBuilder.and(restrictions, root.get("endDate").isNotNull(), criteriaBuilder.lessThanOrEqualTo(root.<Date>get("endDate"), new Date()));
			} else {
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(root.get("endDate").isNull(), criteriaBuilder.greaterThan(root.<Date>get("endDate"), new Date())));
			}
		}
		criteriaQuery.where(restrictions);
		return findList(criteriaQuery, first, count);
	}

	public List<ProductCategory> findProductCategoryList(Store store, CategoryApplication.Status status) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<ProductCategory> criteriaQuery = criteriaBuilder.createQuery(ProductCategory.class);
		Root<ProductCategory> root = criteriaQuery.from(ProductCategory.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.join("categoryApplications").get("store"), store));
		}
		if (status != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.join("categoryApplications").get("status"), status));
		}
		criteriaQuery.where(restrictions);
		return entityManager.createQuery(criteriaQuery).getResultList();
	}

	public Page<Store> findPage(Store.Type type, Store.Status status, Boolean isEnabled, Boolean hasExpired, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Store> criteriaQuery = criteriaBuilder.createQuery(Store.class);
		Root<Store> root = criteriaQuery.from(Store.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("type"), type));
		}
		if (status != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("status"), status));
		}
		if (isEnabled != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isEnabled"), isEnabled));
		}
		if (hasExpired != null) {
			if (hasExpired) {
				restrictions = criteriaBuilder.and(restrictions, root.get("endDate").isNotNull(), criteriaBuilder.lessThanOrEqualTo(root.<Date>get("endDate"), new Date()));
			} else {
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(root.get("endDate").isNull(), criteriaBuilder.greaterThan(root.<Date>get("endDate"), new Date())));
			}
		}
		criteriaQuery.where(restrictions);
		return super.findPage(criteriaQuery, pageable);
	}

}