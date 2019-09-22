
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Business;
import com.igomall.entity.BusinessDepositLog;

/**
 * Dao - 商家预存款记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface BusinessDepositLogDao extends BaseDao<BusinessDepositLog, Long> {

	/**
	 * 查找商家预存款记录分页
	 * 
	 * @param business
	 *            商家
	 * @param pageable
	 *            分页信息
	 * @return 商家预存款记录分页
	 */
	Page<BusinessDepositLog> findPage(Business business, Pageable pageable);

}