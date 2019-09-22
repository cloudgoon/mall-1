
package com.igomall.dao.impl;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.BusinessDepositLogDao;
import com.igomall.entity.Business;
import com.igomall.entity.BusinessDepositLog;

/**
 * Dao - 商家预存款记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class BusinessDepositLogDaoImpl extends BaseDaoImpl<BusinessDepositLog, Long> implements BusinessDepositLogDao {

	@Override
	public Page<BusinessDepositLog> findPage(Business business, Pageable pageable) {
		if (business == null) {
			return Page.emptyPage(pageable);
		}
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<BusinessDepositLog> criteriaQuery = criteriaBuilder.createQuery(BusinessDepositLog.class);
		Root<BusinessDepositLog> root = criteriaQuery.from(BusinessDepositLog.class);
		criteriaQuery.select(root);
		criteriaQuery.where(criteriaBuilder.equal(root.get("business"), business));
		return super.findPage(criteriaQuery, pageable);
	}
}