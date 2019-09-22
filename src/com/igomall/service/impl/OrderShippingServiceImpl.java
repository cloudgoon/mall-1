
package com.igomall.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.fasterxml.jackson.core.type.TypeReference;
import com.igomall.Setting;
import com.igomall.dao.OrderShippingDao;
import com.igomall.dao.SnDao;
import com.igomall.entity.OrderShipping;
import com.igomall.entity.Sn;
import com.igomall.service.OrderShippingService;
import com.igomall.util.JsonUtils;
import com.igomall.util.SystemUtils;
import com.igomall.util.WebUtils;

/**
 * Service - 订单发货
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class OrderShippingServiceImpl extends BaseServiceImpl<OrderShipping, Long> implements OrderShippingService {

	@Inject
	private OrderShippingDao orderShippingDao;
	@Inject
	private SnDao snDao;

	@Transactional(readOnly = true)
	public OrderShipping findBySn(String sn) {
		return orderShippingDao.find("sn", StringUtils.lowerCase(sn));
	}

	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	@Cacheable("transitSteps")
	public List<Map<String, String>> getTransitSteps(OrderShipping orderShipping) {
		Assert.notNull(orderShipping,"");

		Setting setting = SystemUtils.getSetting();
		if (StringUtils.isEmpty(setting.getKuaidi100Key()) || StringUtils.isEmpty(orderShipping.getDeliveryCorpCode()) || StringUtils.isEmpty(orderShipping.getTrackingNo())) {
			return Collections.emptyList();
		}
		Map<String, Object> parameterMap = new HashMap<>();
		parameterMap.put("id", setting.getKuaidi100Key());
		parameterMap.put("com", orderShipping.getDeliveryCorpCode());
		parameterMap.put("nu", orderShipping.getTrackingNo());
		parameterMap.put("show", "0");
		parameterMap.put("muti", "1");
		parameterMap.put("order", "asc");
		String content = WebUtils.get("http://api.kuaidi100.com/api", parameterMap);
		Map<String, Object> data = JsonUtils.toObject(content, new TypeReference<Map<String, Object>>() {
		});
		if (!StringUtils.equals(String.valueOf(data.get("status")), "1")) {
			return Collections.emptyList();
		}
		return (List<Map<String, String>>) data.get("data");
	}

	@Override
	@Transactional
	public OrderShipping save(OrderShipping orderShipping) {
		Assert.notNull(orderShipping,"");

		orderShipping.setSn(snDao.generate(Sn.Type.orderShipping));

		return super.save(orderShipping);
	}

}