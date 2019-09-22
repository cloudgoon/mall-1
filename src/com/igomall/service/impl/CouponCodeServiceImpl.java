
package com.igomall.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.CouponCodeDao;
import com.igomall.entity.Coupon;
import com.igomall.entity.CouponCode;
import com.igomall.entity.Member;
import com.igomall.entity.PointLog;
import com.igomall.service.CouponCodeService;
import com.igomall.service.MemberService;

/**
 * Service - 优惠码
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class CouponCodeServiceImpl extends BaseServiceImpl<CouponCode, Long> implements CouponCodeService {

	@Inject
	private CouponCodeDao couponCodeDao;
	@Inject
	private MemberService memberService;

	@Transactional(readOnly = true)
	public boolean codeExists(String code) {
		return couponCodeDao.exists("code", StringUtils.lowerCase(code));
	}

	@Transactional(readOnly = true)
	public CouponCode findByCode(String code) {
		return couponCodeDao.find("code", StringUtils.lowerCase(code));
	}

	public CouponCode generate(Coupon coupon, Member member) {
		Assert.notNull(coupon,"");

		CouponCode couponCode = new CouponCode();
		couponCode.setCode(coupon.getPrefix() + DigestUtils.md5Hex(UUID.randomUUID() + RandomStringUtils.randomAlphabetic(30)).toUpperCase());
		couponCode.setIsUsed(false);
		couponCode.setCoupon(coupon);
		couponCode.setMember(member);
		return super.save(couponCode);
	}

	public List<CouponCode> generate(Coupon coupon, Member member, Integer count) {
		Assert.notNull(coupon,"");
		Assert.notNull(count,"");

		List<CouponCode> couponCodes = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			CouponCode couponCode = generate(coupon, member);
			couponCodes.add(couponCode);
			if (i % 50 == 0) {
				couponCodeDao.flush();
				couponCodeDao.clear();
			}
		}
		return couponCodes;
	}

	public CouponCode exchange(Coupon coupon, Member member) {
		Assert.notNull(coupon,"");
		Assert.notNull(coupon.getPoint(),"");
		Assert.state(coupon.getIsEnabled() && coupon.getIsExchange() && !coupon.hasExpired(),"");
		Assert.notNull(member,"");
		Assert.notNull(member.getPoint(),"");
		Assert.state(member.getPoint() >= coupon.getPoint(),"");

		if (coupon.getPoint() > 0) {
			memberService.addPoint(member, -coupon.getPoint(), PointLog.Type.exchange, null);
		}

		return generate(coupon, member);
	}

	@Transactional(readOnly = true)
	public Page<CouponCode> findPage(Member member, Pageable pageable) {
		return couponCodeDao.findPage(member, pageable);
	}

	@Transactional(readOnly = true)
	public Long count(Coupon coupon, Member member, Boolean hasBegun, Boolean hasExpired, Boolean isUsed) {
		return couponCodeDao.count(coupon, member, hasBegun, hasExpired, isUsed);
	}

}