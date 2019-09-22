
package com.igomall.dao;

import java.math.BigDecimal;

import com.igomall.entity.MemberRank;

/**
 * Dao - 会员等级
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface MemberRankDao extends BaseDao<MemberRank, Long> {

	/**
	 * 查找默认会员等级
	 * 
	 * @return 默认会员等级，若不存在则返回null
	 */
	MemberRank findDefault();

	/**
	 * 根据消费金额查找符合此条件的最高会员等级
	 * 
	 * @param amount
	 *            消费金额
	 * @return 会员等级，不包含特殊会员等级，若不存在则返回null
	 */
	MemberRank findByAmount(BigDecimal amount);

	/**
	 * 清除默认
	 */
	void clearDefault();

	/**
	 * 清除默认
	 * 
	 * @param exclude
	 *            排除会员等级
	 */
	void clearDefault(MemberRank exclude);

}