
package com.igomall.controller.business;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.igomall.entity.Business;
import com.igomall.security.CurrentUser;
import com.igomall.service.BusinessService;

/**
 * Controller - 密码
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("businessPasswordController")
@RequestMapping("/business/password")
public class PasswordController extends BaseController {

	@Inject
	private BusinessService businessService;

	/**
	 * 验证当前密码
	 */
	@GetMapping("/check_current_password")
	public @ResponseBody boolean checkCurrentPassword(String currentPassword, @CurrentUser Business currentUser) {
		return StringUtils.isNotEmpty(currentPassword) && currentUser.isValidCredentials(currentPassword);
	}

	/**
	 * 编辑
	 */
	@GetMapping("/edit")
	public String edit() {
		return "business/password/edit";
	}

	/**
	 * 更新
	 */
	@PostMapping("/update")
	public String update(String currentPassword, String password, @CurrentUser Business currentUser, RedirectAttributes redirectAttributes) {
		if (StringUtils.isEmpty(currentPassword) || StringUtils.isEmpty(password)) {
			return UNPROCESSABLE_ENTITY_VIEW;
		}
		if (!currentUser.isValidCredentials(currentPassword)) {
			return UNPROCESSABLE_ENTITY_VIEW;
		}
		if (!isValid(Business.class, "password", password)) {
			return UNPROCESSABLE_ENTITY_VIEW;
		}
		currentUser.setPassword(password);
		businessService.update(currentUser);
		addFlashMessage(redirectAttributes, SUCCESS_MESSAGE);
		return "redirect:edit";
	}

}