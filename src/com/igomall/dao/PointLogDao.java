
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Member;
import com.igomall.entity.PointLog;

/**
 * Dao - 积分记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface PointLogDao extends BaseDao<PointLog, Long> {

	/**
	 * 查找积分记录分页
	 * 
	 * @param member
	 *            会员
	 * @param pageable
	 *            分页信息
	 * @return 积分记录分页
	 */
	Page<PointLog> findPage(Member member, Pageable pageable);

}