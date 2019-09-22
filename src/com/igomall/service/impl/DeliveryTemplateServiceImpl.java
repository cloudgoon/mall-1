
package com.igomall.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.DeliveryTemplateDao;
import com.igomall.entity.DeliveryCenter;
import com.igomall.entity.DeliveryTemplate;
import com.igomall.entity.Order;
import com.igomall.entity.Store;
import com.igomall.service.DeliveryTemplateService;

/**
 * Service - 快递单模板
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class DeliveryTemplateServiceImpl extends BaseServiceImpl<DeliveryTemplate, Long> implements DeliveryTemplateService {

	@Inject
	private DeliveryTemplateDao deliveryTemplateDao;

	@Transactional(readOnly = true)
	public DeliveryTemplate findDefault(Store store) {
		return deliveryTemplateDao.findDefault(store);
	}

	@Transactional(readOnly = true)
	public List<DeliveryTemplate> findList(Store store) {
		return deliveryTemplateDao.findList(store);
	}

	@Transactional(readOnly = true)
	public Page<DeliveryTemplate> findPage(Store store, Pageable pageable) {
		return deliveryTemplateDao.findPage(store, pageable);
	}

	@Transactional(readOnly = true)
	public String resolveContent(DeliveryTemplate deliveryTemplate, Store store, DeliveryCenter deliveryCenter, Order order) {
		Assert.notNull(deliveryTemplate,"");

		List<String> tagNames = new ArrayList<>();
		List<String> values = new ArrayList<>();

		for (DeliveryTemplate.StoreAttribute storeAttribute : DeliveryTemplate.StoreAttribute.values()) {
			tagNames.add(storeAttribute.getTagName());
			values.add(storeAttribute.getValue(store));
		}
		for (DeliveryTemplate.DeliveryCenterAttribute deliveryCenterAttribute : DeliveryTemplate.DeliveryCenterAttribute.values()) {
			tagNames.add(deliveryCenterAttribute.getTagName());
			values.add(deliveryCenterAttribute.getValue(deliveryCenter));
		}
		for (DeliveryTemplate.OrderAttribute orderAttribute : DeliveryTemplate.OrderAttribute.values()) {
			tagNames.add(orderAttribute.getTagName());
			values.add(orderAttribute.getValue(order));
		}

		return StringUtils.replaceEachRepeatedly(deliveryTemplate.getContent(), tagNames.toArray(new String[tagNames.size()]), values.toArray(new String[values.size()]));
	}

	@Transactional
	public DeliveryTemplate save(DeliveryTemplate deliveryTemplate) {
		Assert.notNull(deliveryTemplate,"");

		if (BooleanUtils.isTrue(deliveryTemplate.getIsDefault())) {
			deliveryTemplateDao.clearDefault(deliveryTemplate.getStore());
		}
		return super.save(deliveryTemplate);
	}

	@Transactional
	public DeliveryTemplate update(DeliveryTemplate deliveryTemplate) {
		Assert.notNull(deliveryTemplate,"");

		DeliveryTemplate pDeliveryTemplate = super.update(deliveryTemplate);
		if (BooleanUtils.isTrue(pDeliveryTemplate.getIsDefault())) {
			deliveryTemplateDao.clearDefault(pDeliveryTemplate);
		}
		return pDeliveryTemplate;
	}

}