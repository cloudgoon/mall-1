
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.InstantMessage;
import com.igomall.entity.Store;

/**
 * Dao - 即时通讯
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface InstantMessageDao extends BaseDao<InstantMessage, Long> {

	/**
	 * 查找即时通讯分页
	 * 
	 * @param store
	 *            店铺
	 * @param pageable
	 *            分页
	 * @return 即时通讯分页
	 */
	Page<InstantMessage> findPage(Store store, Pageable pageable);

}