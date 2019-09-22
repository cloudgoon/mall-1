
package com.igomall.dao.impl;

import javax.persistence.NoResultException;

import org.springframework.stereotype.Repository;

import com.igomall.dao.SeoDao;
import com.igomall.entity.Seo;

/**
 * Dao - SEO设置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class SeoDaoImpl extends BaseDaoImpl<Seo, Long> implements SeoDao {

	public Seo find(Seo.Type type) {
		if (type == null) {
			return null;
		}
		try {
			String jpql = "select seo from Seo seo where seo.type = :type";
			return entityManager.createQuery(jpql, Seo.class).setParameter("type", type).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

}