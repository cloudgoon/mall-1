
package com.igomall.dao.impl;

import javax.persistence.NoResultException;

import org.springframework.stereotype.Repository;

import com.igomall.dao.MessageConfigDao;
import com.igomall.entity.MessageConfig;

/**
 * Dao - 消息配置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class MessageConfigDaoImpl extends BaseDaoImpl<MessageConfig, Long> implements MessageConfigDao {

	public MessageConfig find(MessageConfig.Type type) {
		if (type == null) {
			return null;
		}
		try {
			String jpql = "select messageConfig from MessageConfig messageConfig where messageConfig.type = :type";
			return entityManager.createQuery(jpql, MessageConfig.class).setParameter("type", type).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

}