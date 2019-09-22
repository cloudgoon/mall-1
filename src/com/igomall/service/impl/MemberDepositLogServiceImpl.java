
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.MemberDepositLogDao;
import com.igomall.entity.Member;
import com.igomall.entity.MemberDepositLog;
import com.igomall.service.MemberDepositLogService;

/**
 * Service - 会员预存款记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class MemberDepositLogServiceImpl extends BaseServiceImpl<MemberDepositLog, Long> implements MemberDepositLogService {

	@Inject
	private MemberDepositLogDao memberDepositLogDao;

	@Transactional(readOnly = true)
	public Page<MemberDepositLog> findPage(Member member, Pageable pageable) {
		return memberDepositLogDao.findPage(member, pageable);
	}

}