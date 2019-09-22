
package com.igomall.service.impl;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.igomall.dao.PluginConfigDao;
import com.igomall.entity.PluginConfig;
import com.igomall.service.PluginConfigService;

/**
 * Service - 插件配置
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class PluginConfigServiceImpl extends BaseServiceImpl<PluginConfig, Long> implements PluginConfigService {

	@Inject
	private PluginConfigDao pluginConfigDao;

	@Transactional(readOnly = true)
	public boolean pluginIdExists(String pluginId) {
		return pluginConfigDao.exists("pluginId", pluginId);
	}

	@Transactional(readOnly = true)
	@Cacheable("pluginConfig")
	public PluginConfig findByPluginId(String pluginId) {
		return pluginConfigDao.find("pluginId", pluginId);
	}

	@CacheEvict(value = "pluginConfig", allEntries = true)
	public void deleteByPluginId(String pluginId) {
		PluginConfig pluginConfig = findByPluginId(pluginId);
		pluginConfigDao.remove(pluginConfig);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public PluginConfig save(PluginConfig pluginConfig) {
		return super.save(pluginConfig);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public PluginConfig update(PluginConfig pluginConfig) {
		return super.update(pluginConfig);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public PluginConfig update(PluginConfig pluginConfig, String... ignoreProperties) {
		return super.update(pluginConfig, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "pluginConfig", allEntries = true)
	public void delete(PluginConfig pluginConfig) {
		super.delete(pluginConfig);
	}

}