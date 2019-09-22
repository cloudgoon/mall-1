
package com.igomall.controller.admin;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.igomall.Message;
import com.igomall.Pageable;
import com.igomall.service.AuditLogService;

/**
 * Controller - 审计日志
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("adminAuditLogController")
@RequestMapping("/admin/audit_log")
public class AuditLogController extends BaseController {

	@Inject
	private AuditLogService auditLogService;

	/**
	 * 列表
	 */
	@GetMapping("/list")
	public String list(Pageable pageable, ModelMap model) {
		model.addAttribute("page", auditLogService.findPage(pageable));
		return "admin/audit_log/list";
	}

	/**
	 * 查看
	 */
	@GetMapping("/view")
	public String view(Long id, ModelMap model) {
		model.addAttribute("auditLog", auditLogService.find(id));
		return "admin/audit_log/view";
	}

	/**
	 * 删除
	 */
	@PostMapping("/delete")
	public @ResponseBody Message delete(Long[] ids) {
		auditLogService.delete(ids);
		return SUCCESS_MESSAGE;
	}

	/**
	 * 清空
	 */
	@PostMapping("/clear")
	public @ResponseBody Message clear() {
		auditLogService.clear();
		return SUCCESS_MESSAGE;
	}

}