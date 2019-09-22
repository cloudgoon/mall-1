
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.InstantMessageDao;
import com.igomall.entity.InstantMessage;
import com.igomall.entity.Store;
import com.igomall.service.InstantMessageService;

/**
 * Service - 即时通讯
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class InstantMessageServiceImpl extends BaseServiceImpl<InstantMessage, Long> implements InstantMessageService {

	@Inject
	private InstantMessageDao instantMessageDao;

	@Transactional(readOnly = true)
	public Page<InstantMessage> findPage(Store store, Pageable pageable) {
		return instantMessageDao.findPage(store, pageable);
	}

}