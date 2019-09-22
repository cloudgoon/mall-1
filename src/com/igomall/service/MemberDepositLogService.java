
package com.igomall.service;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Member;
import com.igomall.entity.MemberDepositLog;

/**
 * Service - 会员预存款记录
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface MemberDepositLogService extends BaseService<MemberDepositLog, Long> {

	/**
	 * 查找会员预存款记录分页
	 * 
	 * @param member
	 *            会员
	 * @param pageable
	 *            分页信息
	 * @return 会员预存款记录分页
	 */
	Page<MemberDepositLog> findPage(Member member, Pageable pageable);

}