
package com.igomall.service;

import com.igomall.entity.AdPosition;

/**
 * Service - 广告位
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface AdPositionService extends BaseService<AdPosition, Long> {

	/**
	 * 查找广告位
	 * 
	 * @param id
	 *            ID
	 * @param useCache
	 *            是否使用缓存
	 * @return 广告位
	 */
	AdPosition find(Long id, boolean useCache);

}