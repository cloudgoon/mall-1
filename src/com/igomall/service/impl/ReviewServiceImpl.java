
package com.igomall.service.impl;

import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.MemberDao;
import com.igomall.dao.OrderDao;
import com.igomall.dao.ProductDao;
import com.igomall.dao.ReviewDao;
import com.igomall.entity.Member;
import com.igomall.entity.Product;
import com.igomall.entity.Review;
import com.igomall.entity.Store;
import com.igomall.service.ReviewService;

/**
 * Service - 评论
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Service
public class ReviewServiceImpl extends BaseServiceImpl<Review, Long> implements ReviewService {

	@Inject
	private ReviewDao reviewDao;
	@Inject
	private MemberDao memberDao;
	@Inject
	private ProductDao productDao;
	@Inject
	private OrderDao orderDao;

	@Transactional(readOnly = true)
	public List<Review> findList(Member member, Product product, Review.Type type, Boolean isShow, Integer count, List<Filter> filters, List<Order> orders) {
		return reviewDao.findList(member, product, type, isShow, count, filters, orders);
	}

	@Transactional(readOnly = true)
	@Cacheable(value = "review", condition = "#useCache")
	public List<Review> findList(Long memberId, Long productId, Review.Type type, Boolean isShow, Integer count, List<Filter> filters, List<Order> orders, boolean useCache) {
		Member member = memberDao.find(memberId);
		if (memberId != null && member == null) {
			return Collections.emptyList();
		}
		Product product = productDao.find(productId);
		if (productId != null && product == null) {
			return Collections.emptyList();
		}
		return reviewDao.findList(member, product, type, isShow, count, filters, orders);
	}

	@Transactional(readOnly = true)
	public Page<Review> findPage(Member member, Product product, Store store, Review.Type type, Boolean isShow, Pageable pageable) {
		return reviewDao.findPage(member, product, store, type, isShow, pageable);
	}

	@Transactional(readOnly = true)
	public Long count(Member member, Product product, Review.Type type, Boolean isShow) {
		return reviewDao.count(member, product, type, isShow);
	}

	@Transactional(readOnly = true)
	public boolean hasPermission(Member member, Product product) {
		Assert.notNull(member,"");
		Assert.notNull(product,"");

		long reviewCount = reviewDao.count(member, product, null, null);
		long orderCount = orderDao.count(null, com.igomall.entity.Order.Status.completed, null, member, product, null, null, null, null, null, null);
		return orderCount > reviewCount;
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public Review save(Review review) {
		Assert.notNull(review,"");

		Review pReview = super.save(review);
		Product product = pReview.getProduct();
		if (product != null) {
			reviewDao.flush();
			long totalScore = reviewDao.calculateTotalScore(product);
			long scoreCount = reviewDao.calculateScoreCount(product);
			product.setTotalScore(totalScore);
			product.setScoreCount(scoreCount);
		}
		return pReview;
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public Review update(Review review) {
		Assert.notNull(review,"");

		Review pReview = super.update(review);
		Product product = pReview.getProduct();
		if (product != null) {
			reviewDao.flush();
			long totalScore = reviewDao.calculateTotalScore(product);
			long scoreCount = reviewDao.calculateScoreCount(product);
			product.setTotalScore(totalScore);
			product.setScoreCount(scoreCount);
		}
		return pReview;
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public Review update(Review review, String... ignoreProperties) {
		return super.update(review, ignoreProperties);
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public void delete(Long id) {
		super.delete(id);
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public void delete(Long... ids) {
		super.delete(ids);
	}

	@Override
	@Transactional
	@CacheEvict(value = "review", allEntries = true)
	public void delete(Review review) {
		if (review != null) {
			super.delete(review);
			Product product = review.getProduct();
			if (product != null) {
				reviewDao.flush();
				long totalScore = reviewDao.calculateTotalScore(product);
				long scoreCount = reviewDao.calculateScoreCount(product);
				product.setTotalScore(totalScore);
				product.setScoreCount(scoreCount);
			}
		}
	}

	@CacheEvict(value = "review", allEntries = true)
	public void reply(Review review, Review replyReview) {
		if (review == null || replyReview == null) {
			return;
		}

		replyReview.setIsShow(true);
		replyReview.setProduct(review.getProduct());
		replyReview.setForReview(review);
		replyReview.setStore(review.getStore());
		replyReview.setScore(review.getScore());
		replyReview.setMember(review.getMember());
		reviewDao.persist(replyReview);
	}

}