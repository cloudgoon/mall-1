
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.ReceiverDao;
import com.igomall.entity.Member;
import com.igomall.entity.Receiver;
import com.igomall.service.ReceiverService;

/**
 * Service - 收货地址
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class ReceiverServiceImpl extends BaseServiceImpl<Receiver, Long> implements ReceiverService {

	@Inject
	private ReceiverDao receiverDao;

	@Transactional(readOnly = true)
	public Receiver findDefault(Member member) {
		return receiverDao.findDefault(member);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Receiver> findList(Member member) {
		return receiverDao.findList(member);
	}

	@Transactional(readOnly = true)
	public Page<Receiver> findPage(Member member, Pageable pageable) {
		return receiverDao.findPage(member, pageable);
	}

	@Override
	@Transactional
	public Receiver save(Receiver receiver) {
		Assert.notNull(receiver,"");

		if (BooleanUtils.isTrue(receiver.getIsDefault()) && receiver.getMember() != null) {
			receiverDao.clearDefault(receiver.getMember());
		}
		return super.save(receiver);
	}

	@Override
	@Transactional
	public Receiver update(Receiver receiver) {
		Assert.notNull(receiver,"");

		Receiver pReceiver = super.update(receiver);
		if (BooleanUtils.isTrue(pReceiver.getIsDefault()) && pReceiver.getMember() != null) {
			receiverDao.clearDefault(pReceiver.getMember(), pReceiver);
		}
		return pReceiver;
	}

}