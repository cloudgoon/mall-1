
package com.igomall.controller.shop;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.igomall.entity.FriendLink;
import com.igomall.service.FriendLinkService;

/**
 * Controller - 友情链接
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("shopFriendLinkController")
@RequestMapping("/friend_link")
public class FriendLinkController extends BaseController {

	@Inject
	private FriendLinkService friendLinkService;

	/**
	 * 首页
	 */
	@GetMapping
	public String index(ModelMap model) {
		model.addAttribute("textFriendLinks", friendLinkService.findList(FriendLink.Type.text));
		model.addAttribute("imageFriendLinks", friendLinkService.findList(FriendLink.Type.image));
		return "shop/friend_link/index";
	}

}