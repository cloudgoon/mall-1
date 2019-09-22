
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.StockLog;
import com.igomall.entity.Store;

/**
 * Dao - 库存记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface StockLogDao extends BaseDao<StockLog, Long> {

	/**
	 * 查找库存记录分页
	 * 
	 * @param store
	 *            店铺
	 * @param pageable
	 *            分页
	 * @return 库存记录分页
	 */
	Page<StockLog> findPage(Store store, Pageable pageable);

}