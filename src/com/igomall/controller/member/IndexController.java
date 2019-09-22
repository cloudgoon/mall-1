
package com.igomall.controller.member;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.igomall.controller.shop.BaseController;
import com.igomall.entity.Member;
import com.igomall.entity.Order;
import com.igomall.security.CurrentUser;
import com.igomall.service.ConsultationService;
import com.igomall.service.CouponCodeService;
import com.igomall.service.MessageService;
import com.igomall.service.OrderService;
import com.igomall.service.ProductFavoriteService;
import com.igomall.service.ProductNotifyService;
import com.igomall.service.ReviewService;

/**
 * Controller - 首页
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Controller("memberIndexController")
@RequestMapping("/member/index")
public class IndexController extends BaseController {

	/**
	 * 最新订单数量
	 */
	private static final int NEW_ORDER_SIZE = 3;

	@Inject
	private OrderService orderService;
	@Inject
	private CouponCodeService couponCodeService;
	@Inject
	private MessageService messageService;
	@Inject
	private ProductFavoriteService productFavoriteService;
	@Inject
	private ProductNotifyService productNotifyService;
	@Inject
	private ReviewService reviewService;
	@Inject
	private ConsultationService consultationService;

	/**
	 * 首页
	 */
	@GetMapping
	public String index(@CurrentUser Member currentUser, ModelMap model) {
		model.addAttribute("pendingPaymentOrderCount", orderService.count(null, Order.Status.pendingPayment, null, currentUser, null, null, null, null, null, null, false));
		model.addAttribute("pendingShipmentOrderCount", orderService.count(null, Order.Status.pendingShipment, null, currentUser, null, null, null, null, null, null, null));
		model.addAttribute("shippedOrderCount", orderService.count(null, Order.Status.shipped, null, currentUser, null, null, null, null, null, null, null));
		model.addAttribute("messageCount", messageService.count(currentUser, false));
		model.addAttribute("couponCodeCount", couponCodeService.count(null, currentUser, null, false, false));
		model.addAttribute("productFavoriteCount", productFavoriteService.count(currentUser));
		model.addAttribute("productNotifyCount", productNotifyService.count(currentUser, null, null, null));
		model.addAttribute("reviewCount", reviewService.count(currentUser, null, null, null));
		model.addAttribute("consultationCount", consultationService.count(currentUser, null, null));
		model.addAttribute("newOrders", orderService.findList(null, null, null, currentUser, null, null, null, null, null, null, null, NEW_ORDER_SIZE, null, null));
		return "member/index";
	}

}