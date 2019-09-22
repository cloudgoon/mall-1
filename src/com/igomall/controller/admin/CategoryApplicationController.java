
package com.igomall.controller.admin;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.igomall.Pageable;
import com.igomall.entity.CategoryApplication;
import com.igomall.service.CategoryApplicationService;

/**
 * Controller - 经营分类申请
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("adminCategoryApplicationController")
@RequestMapping("/admin/category_application")
public class CategoryApplicationController extends BaseController {

	@Inject
	private CategoryApplicationService categoryApplicationService;

	/**
	 * 审核
	 */
	@PostMapping("/review")
	public String review(Long id, Boolean isPassed, RedirectAttributes redirectAttributes) {
		CategoryApplication categoryApplication = categoryApplicationService.find(id);
		if (categoryApplication == null || isPassed == null || !CategoryApplication.Status.pending.equals(categoryApplication.getStatus())) {
			return ERROR_VIEW;
		}
		if (categoryApplicationService.exist(categoryApplication.getStore(), categoryApplication.getProductCategory(), CategoryApplication.Status.approved)) {
			return ERROR_VIEW;
		}

		categoryApplicationService.review(categoryApplication, isPassed);
		addFlashMessage(redirectAttributes, SUCCESS_MESSAGE);
		return "redirect:list";
	}

	/**
	 * 列表
	 */
	@GetMapping("/list")
	public String list(Pageable pageable, ModelMap model) {
		model.addAttribute("page", categoryApplicationService.findPage(pageable));
		return "admin/category_application/list";
	}

}