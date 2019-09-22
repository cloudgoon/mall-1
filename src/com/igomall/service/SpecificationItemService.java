
package com.igomall.service;

import java.util.List;

import com.igomall.entity.SpecificationItem;

/**
 * Service - 规格项
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface SpecificationItemService {

	/**
	 * 规格项过滤
	 * 
	 * @param specificationItems
	 *            规格项
	 */
	void filter(List<SpecificationItem> specificationItems);

}