
package com.igomall.controller.admin;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.collections.functors.AndPredicate;
import org.apache.commons.collections.functors.UniquePredicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.igomall.Message;
import com.igomall.Pageable;
import com.igomall.entity.Attribute;
import com.igomall.entity.BaseEntity;
import com.igomall.entity.Product;
import com.igomall.service.AttributeService;
import com.igomall.service.ProductCategoryService;

/**
 * Controller - 属性
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("adminAttributeController")
@RequestMapping("/admin/attribute")
public class AttributeController extends BaseController {

	@Inject
	private AttributeService attributeService;
	@Inject
	private ProductCategoryService productCategoryService;

	/**
	 * 添加
	 */
	@GetMapping("/add")
	public String add(Long sampleId, ModelMap model) {
		model.addAttribute("sample", attributeService.find(sampleId));
		model.addAttribute("productCategoryTree", productCategoryService.findTree());
		return "admin/attribute/add";
	}

	/**
	 * 保存
	 */
	@PostMapping("/save")
	public String save(Attribute attribute, Long productCategoryId, RedirectAttributes redirectAttributes) {
		CollectionUtils.filter(attribute.getOptions(), new AndPredicate(new UniquePredicate(), new Predicate() {
			@Override
			public boolean evaluate(Object object) {
				String option = (String) object;
				return StringUtils.isNotEmpty(option);
			}
		}));
		attribute.setProductCategory(productCategoryService.find(productCategoryId));
		if (!isValid(attribute, BaseEntity.Save.class)) {
			return ERROR_VIEW;
		}
		Integer propertyIndex = attributeService.findUnusedPropertyIndex(attribute.getProductCategory());
		if (propertyIndex == null) {
			addFlashMessage(redirectAttributes, Message.error("admin.attribute.addCountNotAllowed", Product.ATTRIBUTE_VALUE_PROPERTY_COUNT));
		} else {
			attribute.setPropertyIndex(null);
			attributeService.save(attribute);
			addFlashMessage(redirectAttributes, SUCCESS_MESSAGE);
		}
		return "redirect:list";
	}

	/**
	 * 编辑
	 */
	@GetMapping("/edit")
	public String edit(Long id, ModelMap model) {
		model.addAttribute("productCategoryTree", productCategoryService.findTree());
		model.addAttribute("attribute", attributeService.find(id));
		return "admin/attribute/edit";
	}

	/**
	 * 更新
	 */
	@PostMapping("/update")
	public String update(Attribute attribute, RedirectAttributes redirectAttributes) {
		CollectionUtils.filter(attribute.getOptions(), new AndPredicate(new UniquePredicate(), new Predicate() {
			@Override
			public boolean evaluate(Object object) {
				String option = (String) object;
				return StringUtils.isNotEmpty(option);
			}
		}));
		if (!isValid(attribute)) {
			return ERROR_VIEW;
		}
		attributeService.update(attribute, "propertyIndex", "productCategory");
		addFlashMessage(redirectAttributes, SUCCESS_MESSAGE);
		return "redirect:list";
	}

	/**
	 * 列表
	 */
	@GetMapping("/list")
	public String list(Pageable pageable, ModelMap model) {
		model.addAttribute("page", attributeService.findPage(pageable));
		return "admin/attribute/list";
	}

	/**
	 * 删除
	 */
	@PostMapping("/delete")
	public @ResponseBody Message delete(Long[] ids) {
		attributeService.delete(ids);
		return SUCCESS_MESSAGE;
	}

}