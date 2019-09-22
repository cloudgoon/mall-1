
package com.igomall.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.igomall.entity.SpecificationItem;
import com.igomall.entity.SpecificationValue;
import com.igomall.service.SpecificationValueService;

/**
 * Service - 规格值
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class SpecificationValueServiceImpl implements SpecificationValueService {

	public boolean isValid(List<SpecificationItem> specificationItems, List<SpecificationValue> specificationValues) {
		Assert.notEmpty(specificationItems,"");
		Assert.notEmpty(specificationValues,"");

		if (specificationValues.size() != specificationValues.size()) {
			return false;
		}
		for (int i = 0; i < specificationValues.size(); i++) {
			SpecificationItem specificationItem = specificationItems.get(i);
			SpecificationValue specificationValue = specificationValues.get(i);
			if (specificationItem == null || specificationValue == null || !specificationItem.isValid(specificationValue)) {
				return false;
			}
		}
		return true;
	}

}