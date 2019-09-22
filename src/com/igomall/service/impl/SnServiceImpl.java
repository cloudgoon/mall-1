
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.dao.SnDao;
import com.igomall.entity.Sn;
import com.igomall.service.SnService;

/**
 * Service - 序列号
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SnServiceImpl implements SnService {

	@Inject
	private SnDao snDao;

	@Transactional
	public String generate(Sn.Type type) {
		return snDao.generate(type);
	}

}