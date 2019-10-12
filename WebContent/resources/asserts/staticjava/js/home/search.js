/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

(function($, mycart) {
    /**
     * 商品详情
     * @constructor
     */
    var GoodsItem = function(element, option) {

        this.options = _default;
        this.$element = $(element);
        //规格多图相关
        this.goodsPicImg = this.$element.find(".goods-pic img");
        this.goodsPicA = this.$element.find(".goods-pic a");
        this.goodsPicScrollShow = this.$element.find(".goods-pic-scroll-show");
        this.goodsPicScrollShowUl = this.goodsPicScrollShow && this.goodsPicScrollShow.find(".show-box ul")
        this.moveNum = 0;
        this.moveMax = 0;

        //购物车
        this.$goodsInfo = this.$element.find(".goods-info");
        this.$shoppingBox = this.$goodsInfo.find("div[nc-shopping-box]");
        this.$addCartBtn = this.$element.find("[nc-add-cart]");
        //购买数量显示区域
        //goods id
        this.goodsId = this.$addCartBtn.attr("nc-add-cart");
        //Copyright: Bizpower多用户商城系统
        this.commonId = this.$addCartBtn.data("commonId");
        //商品主图
        this.$bigImage = this.$element.find("img[nc-goods-pic]");
        this.init();
    };
    //cn 是className 的简写
    //tpl 是模板的
    _default = {
        cnHandle: "handle",
        //规格对话框上的li 选中样式
        picMax: 7,
        picPx: 25
    }


    GoodsItem.prototype = {
        init: function() {
            this.buildElememt();
            this.bindEvents();
        },
        buildElememt: function() {
            if (this.goodsPicScrollShow.length == 0) return;
            var a = this.goodsPicScrollShow.find("li").length;
            if (a > this.options.picMax) {
                this.moveMax = a - (this.options.picMax - 1);
                this.goodsPicScrollShow.addClass(this.options.cnHandle).find(".cBtn").show();
            }
        },
        bindEvents: function() {
            var that = this;
            //商品规格多图事件
            this.goodsPicScrollShow
                .on("click", "li", function(event) {

                    var $this = $(this),
                        showPicUrl = $this.data("showPic");
                    //显示图片
                    that.goodsPicImg.attr("src", showPicUrl);
                    //修改商品id
                    $(this).siblings("li").removeClass("selected").end().addClass("selected");
                })
                .on("click", ".prev", function(event) {
                    event.preventDefault();
                    if (that.moveNum == 0 || (that.goodsPicScrollShowUl.is(":animated"))) {
                        return;
                    }

                    that.goodsPicScrollShowUl.animate({
                        left: that.goodsPicScrollShowUl.position().left + that.options.picPx
                    }, "fast")
                    that.moveNum--;
                })
                .on("click", ".next", function(event) {
                    event.preventDefault();
                    if ((that.moveNum >= that.moveMax - 1) || (that.goodsPicScrollShowUl.is(":animated"))) {
                        return;
                    }
                    that.goodsPicScrollShowUl.animate({
                        left: that.goodsPicScrollShowUl.position().left - that.options.picPx
                    }, "fast")
                    that.moveNum++;
                });
            //点击添加购物车按钮的事件
            this.$addCartBtn.on("click", function() {

                //Copyright: Bizpower多用户商城系统
                var _commonId = $(this).data("commonId");
                //console.log("点击添加购物车按钮的事件");
                //if (that.__postFlat == true) return;
                //that.__postFlat = false;
                //$.getJSON(ncGlobal.webRoot + 'login/status', function(xhr) {
                //    if (xhr.code == "200") {
                //        if (xhr.data.status == true) {
                            addGoodsPopUpModule.addGoodsPopUp(_commonId);
                //        } else {
                //            //调用member_top中的显示对话框函数
                //            popupLoging.showLoginDialog()
                //        }
                //    } else {
                //        Nc.alertError(data.message ? data.message : "连接超时");
                //    }
                //
                //}).always(function() {
                //    that.__postFlat = true
                //});
            });
            /**
             * 鼠标移入
             * Copyright: www.BIZPOWER.com
             */
            this.$element.on('mouseenter', '.goods-pic,.goods-price-offer', function(event) {
                event.preventDefault();
                var $par = that.$element.closest('li');
                $par.addClass('hover');
                that.$element.on("mouseleave", function(event) {
                    event.preventDefault();
                    $par.removeClass('hover');
                });
            });
        }



    };

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            //Copyright: Bizpower多用户商城系统
            var data = $this.data('nc.item');
            if (!data) $this.data('nc.item', (data = new GoodsItem(this, option)))
        });
    }

    $.fn.GoodsItem = Plugin;
})(jQuery, myCart);

/**
 * 搜索
 * Copyright: 天津网城商动科技有限责任公司
 */
var homeSearch = function() {
    return {
        init: function() {
            $("div[goods-item]").GoodsItem();
        }
    };
}();

/**
 * 品牌
 */
var brandShow = function() {
    var options = {
        //品牌首字母搜索
        $nchBrandTab: $("#nchBrandTab"),
        //配牌显示区域
        $ncBrandList: $("#ncBrandList"),
        // 显示更多
        $nchBrandMoreBtn: $("#nchBrandMoreBtn"),
        // 多选按钮
        $nchBrandSelectBtn : $("#nchBrandSelectBtn"),
        // 多选已选区域
        $brandSelectedDiv : $("#brandSelectedDiv"),
        // 多选已选品牌区域
        $brandSelectedUl : $("#brandSelectedUl"),

        cnCurrent: "current",

        tplShow: '更多<i class="drop-arrow"></i>',
        //Copyright: Bizpower多用户商城系统
        tplHide: '收起<i class="up-arrow"></i>'

    };
    var moreOpen = false,
        selectOpen = false,
        brandIdArray = [],
        brandSelectedLiHtml = "<li><a class='bg-select' href='javascript:;' data-brand-id='{brandId}' title='{brandName}'><i></i>{brandName}</a></li>";

    /**
     * 事件
     * Copyright: 天津网城商动科技有限责任公司
     */
    var _bindEvents = function() {
        //点击显示更多按钮
        options.$nchBrandMoreBtn.click(function() {
            if (moreOpen == false) {
                options.$nchBrandTab.show();
                options.$ncBrandList.find("li").show();
                if (!selectOpen) {
                    options.$nchBrandMoreBtn.html(options.tplHide)
                }
                    //添加滚动条
                options.$ncBrandList.perfectScrollbar();
                moreOpen = true;
            } else {
                if (selectOpen) {
                    return false;
                }
                goodsAttrItem.attrHide();
                _brandHide();
            }
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });

        options.$nchBrandSelectBtn.click(function(){
            $(this).parents("dl:first").find(".select-btn").show();
            selectOpen = true;
            if (moreOpen == false) {
                options.$nchBrandMoreBtn.click();
            }
            moreOpen = true;
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });

        // 品牌多选，点击品牌事件
        options.$ncBrandList.on("click", "li a", function(event){
            if (brandIdArray.length >= 5) {
                Nc.alertError("最多只能选择5项");
                return false;
            }
            var parentLi = $(this).parent();
            if (selectOpen == true) {
                event.preventDefault();
                if (!parentLi.hasClass("selected")) {
                    if (brandIdArray.length == 0) {
                        options.$brandSelectedDiv.show().next().find(".btn-web").removeClass("disabled");
                    }
                    options.$brandSelectedUl.append(brandSelectedLiHtml.ncReplaceTpl({
                        brandId: $(this).data("brandId"),
                        brandName: $(this).data("brandName")
                    }));
                    brandIdArray.push($(this).data("brandId"));
                    parentLi.addClass("selected");
                }
            }
        });

        // 品牌多选取消选择
        options.$brandSelectedUl.on("click", "a", function(){
            var brandId = $(this).data("brandId");
            brandIdArray = brandIdArray.filter(function(i){
               return i != brandId;
            });
            options.$ncBrandList.find("a[data-brand-id='" + brandId + "']").parent().removeClass("selected");
            $(this).parent().remove();
            if (brandIdArray.length == 0) {
                options.$brandSelectedDiv.hide().next().find(".btn-web").addClass("disabled");
            }
        });

        //大写
        options.$nchBrandTab.on("mouseover", "a[data-letter]", function() {
            var $this = $(this),
                a = $this.data("letter"),
                _list = options.$ncBrandList.find("li");
            //改变样式
            $this.closest("li").siblings("li").removeClass(options.cnCurrent).end().addClass(options.cnCurrent);
            if (a == 'all') {
                _list.show();
                return
            }
            _list.hide().filter("[data-initial='" + a + "']").show();
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });
    }

    /**
     * 取消品牌显示全部、多选
     * @private
     * Copyright: 天津网城商动科技有限责任公司
     */
    var _brandHide = function() {
        //归位
        options.$nchBrandTab.find("li").removeClass(options.cnCurrent).show().first().addClass(options.cnCurrent);
        options.$nchBrandTab.hide();
        options.$ncBrandList.find("li").removeClass("selected").show().filter(":gt(15)").hide();
        options.$ncBrandList.parents("dl:first").find(".select-btn").hide().find(".btn-web").addClass("disabled");
        options.$nchBrandMoreBtn.html(options.tplShow)
        //Copyright: Bizpower多用户商城系统
        options.$brandSelectedDiv.hide();
        options.$brandSelectedUl.html("");
        options.$ncBrandList.perfectScrollbar('destroy');
        brandIdArray = [];
        selectOpen = false;
        moreOpen = false;
    }

    // 品牌多选提交按钮
    var _brandSelectMoreSubmit = function(){
        var urlObj = getUrlObj()
            brandIdStr = brandIdArray.join(",");
        urlObj.brand = brandIdStr;
        Nc.go(ncGlobal.webRoot + "search?" + $.param(urlObj));
    }

    return {
        init: function() {
            _bindEvents();
        },
        brandSelectMoreSubmit : _brandSelectMoreSubmit,
        brandHide : _brandHide
    }
}();

/**
 * 导航滚动固定特效
 */
var navPin = function() {

    var $mainNav = $("#main-nav"),
        //最开始的坐标
        offsetTop = 0;

    var classNamePin = "nav-pin";

    /**
     * 修改位置
     * @private
     */
    function _setOffSet() {
        offsetTop = $mainNav.offset().top;
        _scroll();
    }

    function _scroll() {
        if ($(window).scrollTop() >= offsetTop) {
            $mainNav.addClass(classNamePin);            
        } else {
            $mainNav.removeClass(classNamePin);
        }
    }
    return {
        init: function() {
            _setOffSet();
            $(window).scroll(function() {
                    _scroll();
                })
                //监听事件
            Nc.eventManger.on("nc.navPin.offset", function() {
                _setOffSet();
            })
        },
        /**
         * 修改位置
         * Copyright: 天津网城商动科技有限责任公司
         */
        setOffSet: _setOffSet
    }
}();

/**
 * 属性相关
 */
var goodsAttrItem = function(navPin) {
    var options = {
        //显示更多属性按钮
        $showAttrMoreBtn: $("#showAttrMoreBtn"),
        //属性item
        $goodsAttrList: $("dl[goods-attr-item]"),
        //收起、放下的样式
        cnExpand: "expand",
        //属性更多按钮显示样式
        cnExtMore: "ext-more",
        //属性更多按钮 不显示样式
        cnAttrItem: "attr-item",
        //多选按钮显示样式
        cnExtSelect: "ext-select",
        //多选按钮不显示样式
        cnAttrSelect: "attr-select",
    };
    var __showFlat = true;

    function _buildElement() {
        //是否显示属性右侧的更多按钮
        _showExtMore();
    }

    function _bindEvents() {
        //点击显示更多属性按钮事件
        options.$showAttrMoreBtn.click(function(event) {
            event.preventDefault();
            //console.log("点击显示更多属性按钮事件");
            if (__showFlat == true) {
                options.$goodsAttrList.show();
                options.$showAttrMoreBtn.addClass(options.cnExpand).find("span").html("收起")
            } else {
                options.$goodsAttrList.slice(3).hide();
                options.$showAttrMoreBtn.removeClass(options.cnExpand).find("span").html("更多选项");
            }
            __showFlat = !__showFlat;
            _showExtMore();
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });
        //属性值右边点击更多的事件
        options.$goodsAttrList.find("dd[data-ext-more]").click(function() {
            var _dd = $(this).siblings("dd"),
                $this = $(this);
            if($this.siblings('.list').hasClass('ext-select')){
                $this.siblings('.list').addClass('special');
            }
            if (_dd.hasClass(options.cnAttrItem)) {
                _dd.removeClass(options.cnAttrItem).addClass(options.cnExtMore);
                $this.find("span").html("收起");
            } else {
                 _dd.removeClass(options.cnExtMore).addClass(options.cnAttrItem);
                $this.find("span").html("更多");
            }
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });
        // 属性值右侧的多选按钮
        options.$goodsAttrList.find(".select-more").click(function(){
            brandShow.brandHide();
            var _dd = $(this).siblings("dd"),
                $this = $(this);
                _attrHide();
                _dd.removeClass(options.cnAttrSelect).removeClass(options.cnAttrItem).addClass(options.cnExtSelect);
                $this.siblings('.list').children('.select-btn').show();
                $this.siblings('.list').children('ul').find('i').show();
            //动态修改触发位置
            Nc.eventManger.trigger("nc.navPin.offset");
        });
        //规格右侧的多选内部选择
        options.$goodsAttrList.on("click", '.ext-select ul li a', function(event){
            event.preventDefault();
            if ($(this).parents("dd:first").find("ul li a.bg-select").length >= 5) {
                Nc.alertError("最多只能选择5项");
                return false;
            }
            var _select = $(this).parents('.list').find('ul li a');
            if($(this).hasClass('bg-select')){
                $(this).removeClass('bg-select');
            }else{
                $(this).addClass('bg-select');
            };
            if(_select.hasClass('bg-select')){
                 _select.parents('.list').find('.btn-web').removeClass('disabled');
            }else{
                 _select.parents('.list').find('.btn-web').addClass('disabled');
            };
        });
        // 规格右侧的多选内部按钮
        options.$goodsAttrList.find(".btn-white").click(function(event) {
            event.preventDefault();
            _attrHide();
        });
        options.$goodsAttrList.find(".btn-web").click(function (event) {
            event.preventDefault();
            var valueIdStr = $(this).parents("dd:first").find("ul li a.bg-select").map(function(){
                return $(this).data("attributeValueId");
            }).get().join(":");
            var attr = $(this).parents("dd:first").find("ul").data("attributeId") + "-" + valueIdStr;
            var urlObj = getUrlObj();
            console.log(urlObj);
            if (Nc.isEmpty(urlObj.attr)) {
                urlObj.attr = attr;
            } else {
                urlObj.attr += "," + attr;
            }
            Nc.go(ncGlobal.webRoot + "search?" + $.param(urlObj));
        });
        //窗体改变之后是否显示属性右侧的更多按钮
        $(window).resize(function() {
            _showExtMore();
        });
    }

    /**
     * 是否显示属性右侧的更多按钮
     * @private
     * Copyright: 天津网城商动科技有限责任公司
     */
    function _showExtMore() {
        //属性值列表是否显示更多
        $.each(options.$goodsAttrList, function(i, n) {
            var $n = $(n),
                _ul = $n.find(".list ul"),
                _li = _ul.find("li"),
                maxWidth = 0;
            $.each(_li, function(ii, nn) {
                maxWidth += ($(nn).outerWidth(true) + 0)
            })
            if (maxWidth > _ul.width()) {
                $n.find("dd[data-ext-more]").show();
            } else {
                $n.find("dd[data-ext-more]").hide();
            }

        });
    }

    var _attrHide = function() {
        $("dl[goods-attr-item]").each(function(){
            var $this = $(this);
            $this.find("dd").removeClass("ext-more");
            $this.find('.btn-web').addClass('disabled');
            //Copyright: Bizpower多用户商城系统
            $this.find('.list ul li a').removeClass('bg-select').find('.select-btn,i').hide();
            $this.find('.list').addClass(options.cnAttrItem).removeClass(options.cnExtSelect).removeClass('special');
            $this.find('.list').siblings('.all').find("span").html("更多");
        });
        //动态修改触发位置
        Nc.eventManger.trigger("nc.navPin.offset");
    }

    return {
        init: function() {
            _buildElement();
            _bindEvents();
        },
        attrHide : _attrHide
    };
}(navPin);

/**
 * main-nav 上的搜索
 * Copyright: www.Bizpower.com
 */
var mainNavSearch = function() {

    /**
     * 获取价格区间
     * @return {[type]} [description]
     */
    function _getPirceRange() {
        var _arrayPrice = [],
            _arrTemp = 'X19wb3dlciBieSBTaG9wTmNfXw==',
            priceStart = $("#priceStart").val(),
            priceEnd = $("#priceEnd").val();
        _arrayPrice.push(priceStart === '' ? 0 : parseFloat(priceStart));
        _arrayPrice.push(priceEnd === '' ? 0 : parseFloat(priceEnd));
        _arrayPrice.sort();
        return _arrayPrice;
    }

    /**
     * 
     * 
     */
    function _bindEvents() {
        /**
         * 最低价和最高价，input获取焦点的时候
         * Copyright: www.Bizpower.com
         */
        $("#nchSortbarPrice")
            .on('focus', 'input', function(event) {
                event.preventDefault();
                console.log("最低价和最高价，input获取焦点的时候");
                var $par = $("#nchSortbarPrice");
                if ($par.hasClass('unfold')) {
                    return;
                } else {
                    $par.removeClass('fold').addClass('unfold');
                }
            })
            .on('keyup', 'input', function(event) {
                event.preventDefault();
                var $this = $(this),
                    newPrice = /^\d+[.]?\d*/.exec($this.val());

                if (!/^\d+[.]?\d*$/.test($this.val())) {
                    $this.val(newPrice);
                }

            }).on('focusout', 'input', function(event) {
                event.preventDefault();
                /* Act on the event */
                var $this = $(this);
                if ($this.val() !== '') {
                    $this.val($this.val());
                }
            });
        ////////
        //起购量 //
        ////////
        $("#minBuyNumPanel")
            .on('focus', '#minBuyNum', function(event) {
                event.preventDefault();
                /* Act on the event */
                var $par = $("#minBuyNumPanel");
                if ($par.hasClass('unfold')) {
                    return;
                } else {
                    $par.removeClass('fold').addClass('unfold');
                }
            })
            .on('focusout', '#minBuyNum', function(event) {
                event.preventDefault();
                $(this).val(Nc.getNum($(this).val()));
            })
            .on('click', '#minBuyNumBtn', function(event) {
                event.preventDefault();
                /* Act on the event */
                var newUrl,
                    oldUrlObj = getUrlObj(),
                    oldUrl = ncGlobal.webRoot + 'search?',
                    buyNum = $("#minBuyNum").val();
                oldUrlObj.batch = Nc.isEmpty(buyNum) ? 0 : buyNum;
                delete oldUrlObj.page;
                newUrl = oldUrl + Nc.urlEncode(oldUrlObj);
                Nc.go(newUrl);
            });


        /**
         * 商品价格搜索按钮
         */
        $("#nchSortbarPriceBtn").click(function(event) {
            event.preventDefault();
            var newUrl,
                oldUrlObj = getUrlObj(),
                priceSortList = _getPirceRange(),
                oldUrl = ncGlobal.webRoot + 'search?';
            delete oldUrlObj.price;
            if (priceSortList[0] != priceSortList[1]) {
                oldUrlObj.price = priceSortList.join("-");
            }
            delete oldUrlObj.page;
            newUrl = oldUrl + Nc.urlEncode(oldUrlObj);
            Nc.go(newUrl);
        });
    }
    //////
    return {
        init: function() {
            _bindEvents();
        }
    };
}();

/**
 * im
 */
var searchImModule = function() {
    return {

        init: function() {
        	if (!ncGlobal.imRoot) return;
            $("a[data-nc-im]").ncChat({
               verifyOnline:false,
               tid:ncGlobal.tid
            });
        }
    };
}();

/**
 * 取得url参数对象
 * @returns {{}}
 */
var getUrlObj = function () {
    var result = {};
    if (!Nc.isEmpty(location.search)) {
        var searchUrl = location.search.replace('?', '').split("&");
        searchUrl.forEach(function(currentValue, index) {
            if (!Nc.isEmpty(currentValue)) {
                var _aa = currentValue.split("=");
                result[_aa[0]] = decodeURIComponent(_aa[1]);
            }
        });
    }
    return result;
}

$(function() {

    mainNavSearch.init();
    homeSearch.init();
    // ncRequire("goods.items").init();
    brandShow.init();
    goodsAttrItem.init();
    //加载滚动固定特效
    navPin.init();

    //购物车插件
    $("#nav-cart").ncCart();
    //推荐商品
    if (searchGlobal.categoryId) {
        $('#goodsRecommond').ncGoodsRecommond({categoryId:searchGlobal.categoryId});
    }

    //最近浏览和猜你喜欢
    $('#browse_like_div').ncBrowseAndGuessLike();


    searchImModule.init();

    //收藏商品后操作
    Nc.eventManger.on("goods.favorites.end", function(event, commonId,commonIdDom,chainId, xhr) {
        if (xhr.code == 200) {
            Nc.alertSucceed("收藏成功");
            $("#favoriteBtn"+commonId).find("[nc_type='goodsFavoritesBtn']").hide();
            $("#favoriteBtn"+commonId).find("[nc_type='favorited']").show();
        }else{
            Nc.alertError(xhr.message);
        }
        return false;
    });
});