
package com.igomall.dao.impl;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.CashDao;
import com.igomall.entity.Business;
import com.igomall.entity.Cash;

/**
 * Dao - 提现
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class CashDaoImpl extends BaseDaoImpl<Cash, Long> implements CashDao {

	@Override
	public Page<Cash> findPage(Business business, Pageable pageable) {
		if (business == null) {
			return Page.emptyPage(pageable);
		}
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Cash> criteriaQuery = criteriaBuilder.createQuery(Cash.class);
		Root<Cash> root = criteriaQuery.from(Cash.class);
		criteriaQuery.select(root);
		criteriaQuery.where(criteriaBuilder.equal(root.get("business"), business));
		return super.findPage(criteriaQuery, pageable);
	}

}