
package com.igomall.dao;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Store;
import com.igomall.entity.StoreAdImage;

/**
 * Dao - 店铺广告图片
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface StoreAdImageDao extends BaseDao<StoreAdImage, Long> {

	/**
	 * 查找店铺广告图片分页
	 * 
	 * @param store
	 *            店铺
	 * @param pageable
	 *            分页信息
	 * @return 店铺广告图片分页
	 */
	Page<StoreAdImage> findPage(Store store, Pageable pageable);

}