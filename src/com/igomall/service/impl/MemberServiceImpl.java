
package com.igomall.service.impl;

import java.math.BigDecimal;
import java.util.Set;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.persistence.LockModeType;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.MemberDao;
import com.igomall.dao.MemberDepositLogDao;
import com.igomall.dao.MemberRankDao;
import com.igomall.dao.PointLogDao;
import com.igomall.entity.Member;
import com.igomall.entity.MemberDepositLog;
import com.igomall.entity.MemberRank;
import com.igomall.entity.PointLog;
import com.igomall.entity.User;
import com.igomall.service.MailService;
import com.igomall.service.MemberService;
import com.igomall.service.SmsService;

/**
 * Service - 会员
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class MemberServiceImpl extends BaseServiceImpl<Member, Long> implements MemberService {

	/**
	 * E-mail身份配比
	 */
	private static final Pattern EMAIL_PRINCIPAL_PATTERN = Pattern.compile(".*@.*");

	/**
	 * 手机身份配比
	 */
	private static final Pattern MOBILE_PRINCIPAL_PATTERN = Pattern.compile("\\d+");

	@Inject
	private MemberDao memberDao;
	@Inject
	private MemberRankDao memberRankDao;
	@Inject
	private MemberDepositLogDao memberDepositLogDao;
	@Inject
	private PointLogDao pointLogDao;
	@Inject
	private MailService mailService;
	@Inject
	private SmsService smsService;

	@Transactional(readOnly = true)
	public Member getUser(Object principal) {
		Assert.notNull(principal,"");
		Assert.isInstanceOf(String.class, principal);

		String value = (String) principal;
		if (EMAIL_PRINCIPAL_PATTERN.matcher(value).matches()) {
			return findByEmail(value);
		} else if (MOBILE_PRINCIPAL_PATTERN.matcher(value).matches()) {
			return findByMobile(value);
		} else {
			return findByUsername(value);
		}
	}

	@Transactional(readOnly = true)
	public Set<String> getPermissions(User user) {
		Assert.notNull(user,"");
		Assert.isInstanceOf(Member.class, user);

		return Member.PERMISSIONS;
	}

	@Transactional(readOnly = true)
	public boolean supports(Class<?> userClass) {
		return userClass != null && Member.class.isAssignableFrom(userClass);
	}

	@Transactional(readOnly = true)
	public boolean usernameExists(String username) {
		return memberDao.exists("username", StringUtils.lowerCase(username));
	}

	@Transactional(readOnly = true)
	public Member findByUsername(String username) {
		return memberDao.find("username", StringUtils.lowerCase(username));
	}

	@Transactional(readOnly = true)
	public boolean emailExists(String email) {
		return memberDao.exists("email", StringUtils.lowerCase(email));
	}

	@Transactional(readOnly = true)
	public boolean emailUnique(Long id, String email) {
		return memberDao.unique(id, "email", StringUtils.lowerCase(email));
	}

	@Transactional(readOnly = true)
	public Member findByEmail(String email) {
		return memberDao.find("email", StringUtils.lowerCase(email));
	}

	@Transactional(readOnly = true)
	public boolean mobileExists(String mobile) {
		return memberDao.exists("mobile", StringUtils.lowerCase(mobile));
	}

	@Transactional(readOnly = true)
	public boolean mobileUnique(Long id, String mobile) {
		return memberDao.unique(id, "mobile", StringUtils.lowerCase(mobile));
	}

	@Transactional(readOnly = true)
	public Member findByMobile(String mobile) {
		return memberDao.find("mobile", StringUtils.lowerCase(mobile));
	}

	@Transactional(readOnly = true)
	public Page<Member> findPage(Member.RankingType rankingType, Pageable pageable) {
		return memberDao.findPage(rankingType, pageable);
	}

	public void addBalance(Member member, BigDecimal amount, MemberDepositLog.Type type, String memo) {
		Assert.notNull(member,"");
		Assert.notNull(amount,"");
		Assert.notNull(type,"");

		if (amount.compareTo(BigDecimal.ZERO) == 0) {
			return;
		}

		if (!LockModeType.PESSIMISTIC_WRITE.equals(memberDao.getLockMode(member))) {
			memberDao.flush();
			memberDao.refresh(member, LockModeType.PESSIMISTIC_WRITE);
		}

		Assert.notNull(member.getBalance(),"");
		Assert.state(member.getBalance().add(amount).compareTo(BigDecimal.ZERO) >= 0,"");

		member.setBalance(member.getBalance().add(amount));
		memberDao.flush();

		MemberDepositLog memberDepositLog = new MemberDepositLog();
		memberDepositLog.setType(type);
		memberDepositLog.setCredit(amount.compareTo(BigDecimal.ZERO) > 0 ? amount : BigDecimal.ZERO);
		memberDepositLog.setDebit(amount.compareTo(BigDecimal.ZERO) < 0 ? amount.abs() : BigDecimal.ZERO);
		memberDepositLog.setBalance(member.getBalance());
		memberDepositLog.setMemo(memo);
		memberDepositLog.setMember(member);
		memberDepositLogDao.persist(memberDepositLog);
	}

	public void addPoint(Member member, long amount, PointLog.Type type, String memo) {
		Assert.notNull(member,"");
		Assert.notNull(type,"");

		if (amount == 0) {
			return;
		}

		if (!LockModeType.PESSIMISTIC_WRITE.equals(memberDao.getLockMode(member))) {
			memberDao.flush();
			memberDao.refresh(member, LockModeType.PESSIMISTIC_WRITE);
		}

		Assert.notNull(member.getPoint(),"");
		Assert.state(member.getPoint() + amount >= 0,"");

		member.setPoint(member.getPoint() + amount);
		memberDao.flush();

		PointLog pointLog = new PointLog();
		pointLog.setType(type);
		pointLog.setCredit(amount > 0 ? amount : 0L);
		pointLog.setDebit(amount < 0 ? Math.abs(amount) : 0L);
		pointLog.setBalance(member.getPoint());
		pointLog.setMemo(memo);
		pointLog.setMember(member);
		pointLogDao.persist(pointLog);
	}

	public void addAmount(Member member, BigDecimal amount) {
		Assert.notNull(member,"");
		Assert.notNull(amount,"");

		if (amount.compareTo(BigDecimal.ZERO) == 0) {
			return;
		}

		if (!LockModeType.PESSIMISTIC_WRITE.equals(memberDao.getLockMode(member))) {
			memberDao.flush();
			memberDao.refresh(member, LockModeType.PESSIMISTIC_WRITE);
		}

		Assert.notNull(member.getAmount(),"");
		Assert.state(member.getAmount().add(amount).compareTo(BigDecimal.ZERO) >= 0,"");

		member.setAmount(member.getAmount().add(amount));
		MemberRank memberRank = member.getMemberRank();
		if (memberRank != null && BooleanUtils.isFalse(memberRank.getIsSpecial())) {
			MemberRank newMemberRank = memberRankDao.findByAmount(member.getAmount());
			if (newMemberRank != null && newMemberRank.getAmount() != null && newMemberRank.getAmount().compareTo(memberRank.getAmount()) > 0) {
				member.setMemberRank(newMemberRank);
			}
		}
		memberDao.flush();
	}

	@Override
	@Transactional
	public Member save(Member member) {
		Assert.notNull(member,"");

		Member pMember = super.save(member);
		mailService.sendRegisterMemberMail(pMember);
		smsService.sendRegisterMemberSms(pMember);
		return pMember;
	}

}