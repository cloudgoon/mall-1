
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.PointLogDao;
import com.igomall.entity.Member;
import com.igomall.entity.PointLog;
import com.igomall.service.PointLogService;

/**
 * Service - 积分记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class PointLogServiceImpl extends BaseServiceImpl<PointLog, Long> implements PointLogService {

	@Inject
	private PointLogDao pointLogDao;

	@Transactional(readOnly = true)
	public Page<PointLog> findPage(Member member, Pageable pageable) {
		return pointLogDao.findPage(member, pageable);
	}

}