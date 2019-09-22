
package com.igomall.dao.impl;

import org.springframework.stereotype.Repository;

import com.igomall.dao.AuditLogDao;
import com.igomall.entity.AuditLog;

/**
 * Dao - 审计日志
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class AuditLogDaoImpl extends BaseDaoImpl<AuditLog, Long> implements AuditLogDao {

	@Override
	public void removeAll() {
		String jpql = "delete from AuditLog auditLog";
		entityManager.createQuery(jpql).executeUpdate();
	}

}