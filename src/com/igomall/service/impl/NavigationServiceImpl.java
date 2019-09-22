
package com.igomall.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.dao.NavigationDao;
import com.igomall.entity.Navigation;
import com.igomall.service.NavigationService;

/**
 * Service - 导航
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class NavigationServiceImpl extends BaseServiceImpl<Navigation, Long> implements NavigationService {

	@Inject
	private NavigationDao navigationDao;

	@Transactional(readOnly = true)
	public List<Navigation> findList(Navigation.Position position) {
		return navigationDao.findList(position);
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "navigation", condition = "#useCache")
	public List<Navigation> findList(Integer count, List<Filter> filters, List<Order> orders, boolean useCache) {
		return navigationDao.findList(null, count, filters, orders);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public Navigation save(Navigation navigation) {
		return super.save(navigation);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public Navigation update(Navigation navigation) {
		return super.update(navigation);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public Navigation update(Navigation navigation, String... ignoreProperties) {
		return super.update(navigation, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "navigation", allEntries = true)
	public void delete(Navigation navigation) {
		super.delete(navigation);
	}

}