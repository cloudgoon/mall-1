
package com.igomall.dao;

import java.util.List;

import com.igomall.entity.Navigation;

/**
 * Dao - 导航
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface NavigationDao extends BaseDao<Navigation, Long> {

	/**
	 * 查找导航
	 * 
	 * @param position
	 *            位置
	 * @return 导航
	 */
	List<Navigation> findList(Navigation.Position position);

}