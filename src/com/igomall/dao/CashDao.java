
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Business;
import com.igomall.entity.Cash;

/**
 * Dao - 提现
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface CashDao extends BaseDao<Cash, Long> {

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

}