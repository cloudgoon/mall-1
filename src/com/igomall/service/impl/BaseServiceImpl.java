
package com.igomall.service.impl;

import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.igomall.Filter;
import com.igomall.Order;
import com.igomall.Page;
import com.igomall.Pageable;
import com.igomall.dao.BaseDao;
import com.igomall.entity.BaseEntity;
import com.igomall.service.BaseService;

/**
 * Service - 基类
 * 
 * @author IGOMALL  Team
 * @version 1.0
 */
@Transactional
public abstract class BaseServiceImpl<T extends BaseEntity<ID>, ID extends Serializable> implements BaseService<T, ID> {

	/**
	 * 更新忽略属性
	 */
	private static final String[] UPDATE_IGNORE_PROPERTIES = new String[] { BaseEntity.CREATED_DATE_PROPERTY_NAME, BaseEntity.LAST_MODIFIED_DATE_PROPERTY_NAME, BaseEntity.VERSION_PROPERTY_NAME };

	/**
	 * BaseDao
	 */
	private BaseDao<T, ID> baseDao;

	@Inject
	protected void setBaseDao(BaseDao<T, ID> baseDao) {
		this.baseDao = baseDao;
	}

	@Transactional(readOnly = true)
	@Override
	public T find(ID id) {
		return baseDao.find(id);
	}

	@Transactional(readOnly = true)
	@Override
	public List<T> findAll() {
		return findList(null, null, null, null);
	}

	@Override
	@Transactional(readOnly = true)
	public List<T> findList(ID... ids) {
		List<T> result = new ArrayList<>();
		if (ids != null) {
			for (ID id : ids) {
				T entity = find(id);
				if (entity != null) {
					result.add(entity);
				}
			}
		}
		return result;
	}

	@Transactional(readOnly = true)
	@Override
	public List<T> findList(Integer count, List<Filter> filters, List<Order> orders) {
		return findList(null, count, filters, orders);
	}

	@Transactional(readOnly = true)
	@Override
	public List<T> findList(Integer first, Integer count, List<Filter> filters, List<Order> orders) {
		return baseDao.findList(first, count, filters, orders);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<T> findPage(Pageable pageable) {
		return baseDao.findPage(pageable);
	}

	@Transactional(readOnly = true)
	@Override
	public long count() {
		return count(new Filter[] {});
	}

	@Transactional(readOnly = true)
	@Override
	public long count(Filter... filters) {
		return baseDao.count(filters);
	}

	@Transactional(readOnly = true)
	@Override
	public boolean exists(ID id) {
		return baseDao.find(id) != null;
	}

	@Transactional(readOnly = true)
	public boolean exists(Filter... filters) {
		return baseDao.count(filters) > 0;
	}

	@Transactional
	@Override
	public T save(T entity) {
		Assert.notNull(entity,"");
		Assert.isTrue(entity.isNew(),"");

		baseDao.persist(entity);
		return entity;
	}

	@Transactional
	@Override
	public T update(T entity) {
		Assert.notNull(entity,"");
		Assert.isTrue(!entity.isNew(),"");

		if (!baseDao.isManaged(entity)) {
			T persistant = baseDao.find(baseDao.getIdentifier(entity));
			if (persistant != null) {
				copyProperties(entity, persistant, UPDATE_IGNORE_PROPERTIES);
			}
			return persistant;
		}
		return entity;
	}

	@Transactional
	@Override
	public T update(T entity, String... ignoreProperties) {
		Assert.notNull(entity,"");
		Assert.isTrue(!entity.isNew(),"");
		Assert.isTrue(!baseDao.isManaged(entity),"");

		T persistant = baseDao.find(baseDao.getIdentifier(entity));
		if (persistant != null) {
			copyProperties(entity, persistant, (String[]) ArrayUtils.addAll(ignoreProperties, UPDATE_IGNORE_PROPERTIES));
		}
		return update(persistant);
	}

	@Transactional
	@Override
	public void delete(ID id) {
		delete(baseDao.find(id));
	}

	@Override
	@Transactional
	public void delete(ID... ids) {
		if (ids != null) {
			for (ID id : ids) {
				delete(baseDao.find(id));
			}
		}
	}

	@Transactional
	@Override
	public void delete(T entity) {
		if (entity != null) {
			baseDao.remove(baseDao.isManaged(entity) ? entity : baseDao.merge(entity));
		}
	}

	/**
	 * 拷贝对象属性
	 * 
	 * @param source
	 *            源
	 * @param target
	 *            目标
	 * @param ignoreProperties
	 *            忽略属性
	 */
	protected void copyProperties(T source, T target, String... ignoreProperties) {
		Assert.notNull(source,"");
		Assert.notNull(target,"");

		PropertyDescriptor[] propertyDescriptors = PropertyUtils.getPropertyDescriptors(target);
		for (PropertyDescriptor propertyDescriptor : propertyDescriptors) {
			String propertyName = propertyDescriptor.getName();
			Method readMethod = propertyDescriptor.getReadMethod();
			Method writeMethod = propertyDescriptor.getWriteMethod();
			if (ArrayUtils.contains(ignoreProperties, propertyName) || readMethod == null || writeMethod == null || !baseDao.isLoaded(source, propertyName)) {
				continue;
			}
			try {
				Object sourceValue = readMethod.invoke(source);
				writeMethod.invoke(target, sourceValue);
			} catch (IllegalAccessException e) {
				throw new RuntimeException(e.getMessage(), e);
			} catch (IllegalArgumentException e) {
				throw new RuntimeException(e.getMessage(), e);
			} catch (InvocationTargetException e) {
				throw new RuntimeException(e.getMessage(), e);
			}
		}
	}

}