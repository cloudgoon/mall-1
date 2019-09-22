
package com.igomall.service;

import com.igomall.entity.Sn;

/**
 * Service - 序列号
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SnService {

	/**
	 * 生成序列号
	 * 
	 * @param type
	 *            类型
	 * @return 序列号
	 */
	String generate(Sn.Type type);

}