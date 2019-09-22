
package com.igomall.service.impl;

import java.math.BigDecimal;

import javax.inject.Inject;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.dao.MemberRankDao;
import com.igomall.entity.MemberRank;
import com.igomall.service.MemberRankService;

/**
 * Service - 会员等级
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class MemberRankServiceImpl extends BaseServiceImpl<MemberRank, Long> implements MemberRankService {

	@Inject
	private MemberRankDao memberRankDao;

	@Transactional(readOnly = true)
	public boolean amountExists(BigDecimal amount) {
		return memberRankDao.exists("amount", amount);
	}

	@Transactional(readOnly = true)
	public boolean amountUnique(Long id, BigDecimal amount) {
		return memberRankDao.unique(id, "amount", amount);
	}

	@Transactional(readOnly = true)
	public MemberRank findDefault() {
		return memberRankDao.findDefault();
	}

	@Transactional(readOnly = true)
	public MemberRank findByAmount(BigDecimal amount) {
		return memberRankDao.findByAmount(amount);
	}

	@Override
	@Transactional
	public MemberRank save(MemberRank memberRank) {
		Assert.notNull(memberRank,"");

		if (BooleanUtils.isTrue(memberRank.getIsDefault())) {
			memberRankDao.clearDefault();
		}
		return super.save(memberRank);
	}

	@Override
	@Transactional
	public MemberRank update(MemberRank memberRank) {
		Assert.notNull(memberRank,"");

		MemberRank pMemberRank = super.update(memberRank);
		if (BooleanUtils.isTrue(pMemberRank.getIsDefault())) {
			memberRankDao.clearDefault(pMemberRank);
		}
		return pMemberRank;
	}

}