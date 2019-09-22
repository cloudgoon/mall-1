
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.ProductNotifyDao;
import com.igomall.entity.Member;
import com.igomall.entity.ProductNotify;
import com.igomall.entity.Sku;
import com.igomall.entity.Store;
import com.igomall.service.MailService;
import com.igomall.service.ProductNotifyService;

/**
 * Service - 到货通知
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class ProductNotifyServiceImpl extends BaseServiceImpl<ProductNotify, Long> implements ProductNotifyService {

	@Inject
	private ProductNotifyDao productNotifyDao;
	@Inject
	private MailService mailService;

	@Transactional(readOnly = true)
	public boolean exists(Sku sku, String email) {
		return productNotifyDao.exists(sku, email);
	}

	@Transactional(readOnly = true)
	public Page<ProductNotify> findPage(Store store, Member member, Boolean isMarketable, Boolean isOutOfStock, Boolean hasSent, Pageable pageable) {
		return productNotifyDao.findPage(store, member, isMarketable, isOutOfStock, hasSent, pageable);
	}

	@Transactional(readOnly = true)
	public Long count(Member member, Boolean isMarketable, Boolean isOutOfStock, Boolean hasSent) {
		return productNotifyDao.count(member, isMarketable, isOutOfStock, hasSent);
	}

	public int send(List<ProductNotify> productNotifies) {
		if (CollectionUtils.isEmpty(productNotifies)) {
			return 0;
		}

		int count = 0;
		for (ProductNotify productNotify : productNotifies) {
			if (productNotify != null && StringUtils.isNotEmpty(productNotify.getEmail())) {
				mailService.sendProductNotifyMail(productNotify);
				productNotify.setHasSent(true);
				count++;
			}
		}
		return count;
	}

}