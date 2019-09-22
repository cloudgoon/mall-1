
package com.igomall.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.igomall.Filter;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.entity.Member;
import com.igomall.entity.Order;
import com.igomall.entity.Product;
import com.igomall.entity.Store;

/**
 * Dao - 订单
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
public interface OrderDao extends BaseDao<Order, Long> {

	/**
	 * 查找订单
	 * 
	 * @param type
	 *            类型
	 * @param status
	 *            状态
	 * @param store
	 *            店铺
	 * @param member
	 *            会员
	 * @param product
	 *            商品
	 * @param isPendingReceive
	 *            是否等待收款
	 * @param isPendingRefunds
	 *            是否等待退款
	 * @param isUseCouponCode
	 *            是否已使用优惠码
	 * @param isExchangePoint
	 *            是否已兑换积分
	 * @param isAllocatedStock
	 *            是否已分配库存
	 * @param hasExpired
	 *            是否已过期
	 * @param count
	 *            数量
	 * @param filters
	 *            筛选
	 * @param orders
	 *            排序
	 * @return 订单
	 */
	List<Order> findList(Order.Type type, Order.Status status, Store store, Member member, Product product, Boolean isPendingReceive, Boolean isPendingRefunds, Boolean isUseCouponCode, Boolean isExchangePoint, Boolean isAllocatedStock, Boolean hasExpired, Integer count, List<Filter> filters,
			List<com.igomall.Order> orders);

	/**
	 * 查找订单分页
	 * 
	 * @param type
	 *            类型
	 * @param status
	 *            状态
	 * @param store
	 *            店铺
	 * @param member
	 *            会员
	 * @param product
	 *            商品
	 * @param isPendingReceive
	 *            是否等待收款
	 * @param isPendingRefunds
	 *            是否等待退款
	 * @param isUseCouponCode
	 *            是否已使用优惠码
	 * @param isExchangePoint
	 *            是否已兑换积分
	 * @param isAllocatedStock
	 *            是否已分配库存
	 * @param hasExpired
	 *            是否已过期
	 * @param pageable
	 *            分页信息
	 * @return 订单分页
	 */
	Page<Order> findPage(Order.Type type, Order.Status status, Store store, Member member, Product product, Boolean isPendingReceive, Boolean isPendingRefunds, Boolean isUseCouponCode, Boolean isExchangePoint, Boolean isAllocatedStock, Boolean hasExpired, Pageable pageable);

	/**
	 * 查询订单数量
	 * 
	 * @param type
	 *            类型
	 * @param status
	 *            状态
	 * @param store
	 *            店铺
	 * @param member
	 *            会员
	 * @param product
	 *            商品
	 * @param isPendingReceive
	 *            是否等待收款
	 * @param isPendingRefunds
	 *            是否等待退款
	 * @param isUseCouponCode
	 *            是否已使用优惠码
	 * @param isExchangePoint
	 *            是否已兑换积分
	 * @param isAllocatedStock
	 *            是否已分配库存
	 * @param hasExpired
	 *            是否已过期
	 * @return 订单数量
	 */
	Long count(Order.Type type, Order.Status status, Store store, Member member, Product product, Boolean isPendingReceive, Boolean isPendingRefunds, Boolean isUseCouponCode, Boolean isExchangePoint, Boolean isAllocatedStock, Boolean hasExpired);

	/**
	 * 查询订单创建数
	 * 
	 * @param store
	 *            店铺
	 * @param beginDate
	 *            起始日期
	 * @param endDate
	 *            结束日期
	 * @return 订单创建数
	 */
	Long createOrderCount(Store store, Date beginDate, Date endDate);

	/**
	 * 查询订单完成数
	 * 
	 * @param store
	 *            店铺
	 * @param beginDate
	 *            起始日期
	 * @param endDate
	 *            结束日期
	 * @return 订单完成数
	 */
	Long completeOrderCount(Store store, Date beginDate, Date endDate);

	/**
	 * 查询订单创建金额
	 * 
	 * @param store
	 *            店铺
	 * @param beginDate
	 *            起始日期
	 * @param endDate
	 *            结束日期
	 * @return 订单创建金额
	 */
	BigDecimal createOrderAmount(Store store, Date beginDate, Date endDate);

	/**
	 * 查询订单完成金额
	 * 
	 * @param store
	 *            店铺
	 * @param beginDate
	 *            起始日期
	 * @param endDate
	 *            结束日期
	 * @return 订单完成金额
	 */
	BigDecimal completeOrderAmount(Store store, Date beginDate, Date endDate);

}