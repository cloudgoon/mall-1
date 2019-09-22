
package com.igomall.job;

import javax.inject.Inject;

import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.igomall.service.CartService;

/**
 * Job - 购物车
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Lazy(false)
@Component
public class CartJob {

	@Inject
	private CartService cartService;

	/**
	 * 删除过期购物车
	 */
	@Scheduled(cron = "${job.cart_delete_expired.cron}")
	public void deleteExpired() {
		cartService.deleteExpired();
	}

}