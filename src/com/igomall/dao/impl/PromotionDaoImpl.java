
package com.igomall.dao.impl;

import java.util.Date;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.PromotionDao;
import com.igomall.entity.MemberRank;
import com.igomall.entity.ProductCategory;
import com.igomall.entity.Promotion;
import com.igomall.entity.Store;
import com.igomall.entity.Promotion.Type;

/**
 * Dao - 促销
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class PromotionDaoImpl extends BaseDaoImpl<Promotion, Long> implements PromotionDao {

	public List<Promotion> findList(Store store, Type type, Boolean isEnabled) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Promotion> criteriaQuery = criteriaBuilder.createQuery(Promotion.class);
		Root<Promotion> root = criteriaQuery.from(Promotion.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("type"), type));
		}
		if (isEnabled != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isEnabled"), isEnabled));
		}
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, null, null, null);
	}

	public List<Promotion> findList(Store store, Promotion.Type type, MemberRank memberRank, ProductCategory productCategory, Boolean hasBegun, Boolean hasEnded, Integer count, List<Filter> filters, List<Order> orders) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Promotion> criteriaQuery = criteriaBuilder.createQuery(Promotion.class);
		Root<Promotion> root = criteriaQuery.from(Promotion.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("type"), type));
		}
		if (memberRank != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.join("memberRanks"), memberRank));
		}
		if (productCategory != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.join("productCategories"), productCategory));
		}
		if (hasBegun != null) {
			if (hasBegun) {
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(root.get("beginDate").isNull(), criteriaBuilder.lessThanOrEqualTo(root.<Date>get("beginDate"), new Date())));
			} else {
				restrictions = criteriaBuilder.and(restrictions, root.get("beginDate").isNotNull(), criteriaBuilder.greaterThan(root.<Date>get("beginDate"), new Date()));
			}
		}
		if (hasEnded != null) {
			if (hasEnded) {
				restrictions = criteriaBuilder.and(restrictions, root.get("endDate").isNotNull(), criteriaBuilder.lessThanOrEqualTo(root.<Date>get("endDate"), new Date()));
			} else {
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(root.get("endDate").isNull(), criteriaBuilder.greaterThan(root.<Date>get("endDate"), new Date())));
			}
		}
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, count, filters, orders);
	}

	public Page<Promotion> findPage(Store store, Promotion.Type type, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Promotion> criteriaQuery = criteriaBuilder.createQuery(Promotion.class);
		Root<Promotion> root = criteriaQuery.from(Promotion.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		if (type != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("type"), type));
		}
		criteriaQuery.where(restrictions);
		return super.findPage(criteriaQuery, pageable);
	}
}