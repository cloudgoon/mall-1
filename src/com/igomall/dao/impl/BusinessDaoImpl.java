
package com.igomall.dao.impl;

import java.util.Collections;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.igomall.dao.BusinessDao;
import com.igomall.entity.Business;

/**
 * Dao - 商家
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class BusinessDaoImpl extends BaseDaoImpl<Business, Long> implements BusinessDao {

	@Override
	public List<Business> search(String keyword, Integer count) {
		if (StringUtils.isEmpty(keyword)) {
			return Collections.emptyList();
		}
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Business> criteriaQuery = criteriaBuilder.createQuery(Business.class);
		Root<Business> root = criteriaQuery.from(Business.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.or(criteriaBuilder.like(root.<String>get("username"), "%" + keyword + "%")));
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, count, null, null);
	}

}