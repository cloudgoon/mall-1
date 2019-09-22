
package com.igomall.dao.impl;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.PointLogDao;
import com.igomall.entity.Member;
import com.igomall.entity.PointLog;

/**
 * Dao - 积分记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class PointLogDaoImpl extends BaseDaoImpl<PointLog, Long> implements PointLogDao {

	public Page<PointLog> findPage(Member member, Pageable pageable) {
		if (member == null) {
			return Page.emptyPage(pageable);
		}
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<PointLog> criteriaQuery = criteriaBuilder.createQuery(PointLog.class);
		Root<PointLog> root = criteriaQuery.from(PointLog.class);
		criteriaQuery.select(root);
		criteriaQuery.where(criteriaBuilder.equal(root.get("member"), member));
		return super.findPage(criteriaQuery, pageable);
	}

}