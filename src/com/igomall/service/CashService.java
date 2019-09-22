
package com.igomall.service;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Business;
import com.igomall.entity.Cash;

/**
 * Service - 提现
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface CashService extends BaseService<Cash, Long> {

	/**
	 * 申请提现
	 * 
	 * @param cash
	 *            提现
	 * @param business
	 *            商家
	 */
	void applyCash(Cash cash, Business business);

	/**
	 * 查找提现记录分页
	 * 
	 * @param business
	 *            商家
	 * @param pageable
	 *            分页信息
	 * @return 提现记录分页
	 */
	Page<Cash> findPage(Business business, Pageable pageable);

	/**
	 * 审核提现
	 * 
	 * @param cash
	 *            提现
	 * @param isPassed
	 *            是否审核通过
	 */
	void review(Cash cash, Boolean isPassed);
}