
package com.igomall.service;

import java.util.List;

import com.igomall.entity.ParameterValue;

/**
 * Service - 参数值
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface ParameterValueService {

	/**
	 * 参数值过滤
	 * 
	 * @param parameterValues
	 *            参数值
	 */
	void filter(List<ParameterValue> parameterValues);

}