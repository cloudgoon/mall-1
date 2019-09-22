
package com.igomall.template.directive;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Component;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.entity.ProductFavorite;
import com.igomall.entity.StoreFavorite;
import com.igomall.service.StoreFavoriteService;

import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;

/**
 * 模板指令 - 店铺收藏
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Component
public class StoreFavoriteDirective extends BaseDirective {

	/**
	 * 变量名称
	 */
	private static final String VARIABLE_NAME = "storeFavorites";

	@Inject
	private StoreFavoriteService storeFavoriteService;

	/**
	 * 执行
	 * 
	 * @param env
	 *            环境变量
	 * @param params
	 *            参数
	 * @param loopVars
	 *            循环变量
	 * @param body
	 *            模板内容
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void execute(Environment env, Map params, TemplateModel[] loopVars, TemplateDirectiveBody body) throws TemplateException, IOException {
		Integer count = getCount(params);
		List<Filter> filters = getFilters(params, ProductFavorite.class);
		List<Order> orders = getOrders(params);
		boolean useCache = useCache(params);
		List<StoreFavorite> storeFavorites = storeFavoriteService.findList(count, filters, orders, useCache);
		setLocalVariable(VARIABLE_NAME, storeFavorites, env, body);
	}

}