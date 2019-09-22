
package com.igomall.dao.impl;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.InstantMessageDao;
import com.igomall.entity.InstantMessage;
import com.igomall.entity.Store;

/**
 * Dao - 即时通讯
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class InstantMessageDaoImpl extends BaseDaoImpl<InstantMessage, Long> implements InstantMessageDao {

	public Page<InstantMessage> findPage(Store store, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<InstantMessage> criteriaQuery = criteriaBuilder.createQuery(InstantMessage.class);
		Root<InstantMessage> root = criteriaQuery.from(InstantMessage.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		criteriaQuery.where(restrictions);
		return super.findPage(criteriaQuery, pageable);
	}

}