
package com.igomall.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.dao.MemberAttributeDao;
import com.igomall.entity.Member;
import com.igomall.entity.MemberAttribute;

/**
 * Dao - 会员注册项
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class MemberAttributeDaoImpl extends BaseDaoImpl<MemberAttribute, Long> implements MemberAttributeDao {

	public Integer findUnusedPropertyIndex() {
		for (int i = 0; i < Member.ATTRIBUTE_VALUE_PROPERTY_COUNT; i++) {
			String jpql = "select count(*) from MemberAttribute memberAttribute where memberAttribute.propertyIndex = :propertyIndex";
			Long count = entityManager.createQuery(jpql, Long.class).setParameter("propertyIndex", i).getSingleResult();
			if (count == 0) {
				return i;
			}
		}
		return null;
	}

	public List<MemberAttribute> findList(Boolean isEnabled, Integer count, List<Filter> filters, List<Order> orders) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<MemberAttribute> criteriaQuery = criteriaBuilder.createQuery(MemberAttribute.class);
		Root<MemberAttribute> root = criteriaQuery.from(MemberAttribute.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		if (isEnabled != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isEnabled"), isEnabled));
		}
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, count, filters, orders);
	}

}