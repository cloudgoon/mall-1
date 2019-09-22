
package com.igomall.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.StoreProductTagDao;
import com.igomall.entity.Store;
import com.igomall.entity.StoreProductTag;

/**
 * Dao - 店铺商品标签
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class StoreProductTagDaoImpl extends BaseDaoImpl<StoreProductTag, Long> implements StoreProductTagDao {

	public List<StoreProductTag> findList(Store store, Boolean isEnabled) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<StoreProductTag> criteriaQuery = criteriaBuilder.createQuery(StoreProductTag.class);
		Root<StoreProductTag> root = criteriaQuery.from(StoreProductTag.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		if (isEnabled != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isEnabled"), isEnabled));
		}
		criteriaQuery.where(restrictions);
		criteriaQuery.orderBy(criteriaBuilder.asc(root.get("order")));
		return entityManager.createQuery(criteriaQuery).getResultList();
	}

	public Page<StoreProductTag> findPage(Store store, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<StoreProductTag> criteriaQuery = criteriaBuilder.createQuery(StoreProductTag.class);
		Root<StoreProductTag> root = criteriaQuery.from(StoreProductTag.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		criteriaQuery.where(restrictions);
		return super.findPage(criteriaQuery, pageable);
	}

}