
package com.igomall.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.ReviewDao;
import com.igomall.entity.Member;
import com.igomall.entity.Product;
import com.igomall.entity.Review;
import com.igomall.entity.Store;

/**
 * Dao - 评论
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Repository
public class ReviewDaoImpl extends BaseDaoImpl<Review, Long> implements ReviewDao {

	public List<Review> findList(Member member, Product product, Review.Type type, Boolean isShow, Integer count, List<Filter> filters, List<Order> orders) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Review> criteriaQuery = criteriaBuilder.createQuery(Review.class);
		Root<Review> root = criteriaQuery.from(Review.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.isNull(root.get("forReview")));
		if (member != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("member"), member));
		}
		if (product != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("product"), product));
		}
		if (type != null) {
			switch (type) {
			case positive:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.ge(root.<Number>get("score"), 4));
				break;
			case moderate:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.<Number>get("score"), 3));
				break;
			case negative:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.le(root.<Number>get("score"), 2));
				break;
			}
		}
		if (isShow != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isShow"), isShow));
		}
		criteriaQuery.where(restrictions);
		return super.findList(criteriaQuery, null, count, filters, orders);
	}

	public Page<Review> findPage(Member member, Product product, Store store, Review.Type type, Boolean isShow, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Review> criteriaQuery = criteriaBuilder.createQuery(Review.class);
		Root<Review> root = criteriaQuery.from(Review.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.isNull(root.get("forReview")));
		if (member != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("member"), member));
		}
		if (product != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("product"), product));
		}
		if (type != null) {
			switch (type) {
			case positive:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.ge(root.<Number>get("score"), 4));
				break;
			case moderate:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.<Number>get("score"), 3));
				break;
			case negative:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.le(root.<Number>get("score"), 2));
				break;
			}
		}
		if (isShow != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isShow"), isShow));
		}
		if (store != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("store"), store));
		}
		criteriaQuery.where(restrictions);
		return super.findPage(criteriaQuery, pageable);
	}

	public Long count(Member member, Product product, Review.Type type, Boolean isShow) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Review> criteriaQuery = criteriaBuilder.createQuery(Review.class);
		Root<Review> root = criteriaQuery.from(Review.class);
		criteriaQuery.select(root);
		Predicate restrictions = criteriaBuilder.conjunction();
		restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.isNull(root.get("forReview")));
		if (member != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("member"), member));
		}
		if (product != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("product"), product));
		}
		if (type != null) {
			switch (type) {
			case positive:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.ge(root.<Number>get("score"), 4));
				break;
			case moderate:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.<Number>get("score"), 3));
				break;
			case negative:
				restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.le(root.<Number>get("score"), 2));
				break;
			}
		}
		if (isShow != null) {
			restrictions = criteriaBuilder.and(restrictions, criteriaBuilder.equal(root.get("isShow"), isShow));
		}
		criteriaQuery.where(restrictions);
		return super.count(criteriaQuery, null);
	}

	public long calculateTotalScore(Product product) {
		Assert.notNull(product,"");

		String jpql = "select sum(review.score) from Review review where review.product = :product and review.isShow = :isShow and review.forReview is null";
		Long totalScore = entityManager.createQuery(jpql, Long.class).setParameter("product", product).setParameter("isShow", true).getSingleResult();
		return totalScore != null ? totalScore : 0L;
	}

	public long calculateScoreCount(Product product) {
		Assert.notNull(product,"");

		String jpql = "select count(*) from Review review where review.product = :product and review.isShow = :isShow and review.forReview is null";
		return entityManager.createQuery(jpql, Long.class).setParameter("product", product).setParameter("isShow", true).getSingleResult();
	}

}