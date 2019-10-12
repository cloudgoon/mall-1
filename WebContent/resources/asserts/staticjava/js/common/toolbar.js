/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

/**
 * tbar 会员
 */
ncDefine("toolbar.member", [], function () {
    var
        //toolbar 最外元素
        $panelToolbar = $("#ncGlobalToolbar"),
        $tbar = $panelToolbar.find("[data-nc-tbar-name=member]"),
        CN_PANEL_IN = "toolbar-animate-in",
        CN_PANEL_OUT = "toolbar-animate-out",
        URL_VOUCHER = ncGlobal.webRoot + "member/voucher/unused.json",
        URL_COUPON = ncGlobal.webRoot + "member/coupon/unused.json";

    /**
     * 获取店铺券列表
     * @return {[type]} [description]
     * Copyright: 天津网城商动科技有限责任公司
     */
    function _getVoucherList() {

        var buildVoucherList = function (data) {
            var a = data.map(function (currValue, index) {
                if (index > 1) return '';
                return '<li title="' + currValue.voucherTitle + '">' +
                    '<div class="ticket-value">' +
                    '<em class="number number-28 number-thin number-20">' + Nc.priceFormatNew(currValue.price) + '</em>' +
                    '</div>' +
                    '<div class="ticket-condition">' + currValue.limitAmountText + '</div>' +
                    '<div class="ticket-store">限&nbsp;<a href="' + Nc.getStoreUrl(currValue.storeId) + '" target="_blank">' + currValue.storeName + '</a></div>' +
                    '<div class="ticket-date">有效期：' +
                    '<time>' + getTerm(currValue.startTimeText, currValue.endTimeText) + '</time>' +
                    '</div></li>';
            }).join("");

            $("#voucherListNcTbar").html(a);
            $("#voucher-items").show();
        };

        $.post(URL_VOUCHER, function (xhr) {
            if (xhr.code == 200 && xhr.data && xhr.data.length) {
                buildVoucherList(xhr.data);
            } else {
                $("#voucher-items").hide();
            }
        });
    }

    /**
     * 获取平台券列表
     */
    function _getCoupon() {
        var buildCouponList = function (data) {
            var a = data.map(function (currValue, index) {
                if (index > 1) return '';
                return '<li>' +
                    '<div class="ticket-value">' +
                    '<em class="number number-28 number-thin number-20">' + Nc.priceFormatNew(currValue.couponPrice) + '</em>' +
                    '</div>' +
                    '<div class="ticket-condition">' + currValue.limitAmountText + '</div>' +
                    '<div class="ticket-store">' + currValue.useGoodsRangeExplain + '</div>' +
                    '<div class="ticket-date">有效期：' +
                    '<time>' + getTerm(currValue.useStartTimeText, currValue.useEndTimeText) + '</time>' +
                    '</div></li>';
            }).join("");

            $("#couponListNcTbar").html(a);
            $("#coupon-items").show();
        };

        $.post(URL_COUPON, function (xhr) {
            if (xhr.code == 200 && xhr.data && xhr.data.length) {
                buildCouponList(xhr.data);
            } else {
                $("#coupon-items").hide();
            }
        });
    }

    /**
     * 获取有效期
     * Copyright: 天津网城商动科技有限责任公司
     */
    function getTerm(startTime, endTime) {
        var param = Array.prototype.slice.call(arguments);
        return param.map(function (currValue) {
            return typeof currValue == 'string' ? currValue.replace(/-/g, '.') : "";
        }).join(" 至 ");
    }

    function _bindEvent() {
        console.log("tbar 会员 eventbind is run");
    }

    function _show() {
        console.log("tbar 会员 function show");
        _getVoucherList();
        _getCoupon();
        // body...C o p y r i g h t : B i z p o w e r 多 用 户 商 城 系 统
    }

    return {
        bindEvent: _bindEvent,
        show: _show
    };
});
/**
 * tbar 购物车
 * Copyright: www.Bizpower.com
 */
ncDefine("toolbar.cart", [], function () {
    var

        postFlat = true,
        //toolbar 最外元素
        $panelToolbar = $("#ncGlobalToolbar"),


        $tbar = $panelToolbar.find("[data-nc-tbar-name=cart]"),
        //购物车数量显示区域
        $tbarCartCount = $("#tbarCartNum"),
        //购物车中的商品显示区域
        $panelGoodsList = $("#tbarCartGoodsList"),

        NC_PANEL_IN = "toolbar-animate-in",
        NC_PANEL_OUT = "toolbar-animate-out",
        //添加购物车地址
        URL_ADD = ncGlobal.webRoot + "cart/add",
        //删除购物车地址
        URL_DEL = ncGlobal.webRoot + "cart/del/sku",
        //获取购物车列表地址
        URL_GET = ncGlobal.webRoot + "cart/json",

        TPL_NO_GOODS = '<div class="nc-tbar-tipbox2">' +
            '<div class="tip-inner"> <i class="i-face-fd"></i>' +
            '<div class="tip-text">' +
            '购物车空空的，赶快去挑选心仪的商品吧~' +
            '<br>' +
            '<a href="' + ncGlobal.webRoot + '">去首页看看</a>' +
            '</div>' +
            '</div>' +
            '</div>',
        TPL_GOODS_ITEM = '<div class="nc-tbar-cart-item">' +
            '<div class="nctb-item-goods">' +
            '<div class="goods-pic">' +
            '<a href="' + ncGlobal.webRoot + 'goods/<%=chainId > 0 ? realCommonId : commonId%>" target="_blank" >' +
            '<img src="<%=imageSrc%>" alt="<%=goodsName%>"></a>' +
            '</div>' +
            '<dl class="goods-name">' +
            '<a href="' + ncGlobal.webRoot + 'goods/<%=chainId > 0 ? realCommonId : commonId%>" title="<%=goodsName%> <%=goodsFullSpecs ? goodsFullSpecs :""%>" target="_blank"><dt><%=goodsName%></dt><dd><%=goodsFullSpecs ? goodsFullSpecs :""%></dd></a>' +
            '</dl>' +
            '<div class="goods-price"> <strong><%=goodsPrice%></strong>' +
            '×<%=buyNum%>' +
            '</div>' +
            '<a href="javascript:;" class="cart-del" data-del-cart="<%=cartId%>" ><i class="fa fa-trash-o" aria-hidden="true"></i>删除</a>' +
            '</div>' +
            '</div>'


    ;


    /**
     * 创建购物车元素
     * Copyright: www.Bizpower.com
     */
    function _buildElement() {

        if (postFlat == false) {
            return;
        }
        $.getJSON(URL_GET, function (json) {

            if (json.code == '200') {
                var a = json.data.cartStoreList;
                if (a.length) {
                    a.length && _buildGoodsList(_getGoodsListByJson(a));
                } else {
                    _buildNoneGoods();
                }
            } else {
                _buildNoneGoods();

            }
        })
            .fail(function () {
                _buildNoneGoods();
            })
            .always(function () {
                postFlat = true;
            });
    }

    /**
     * post获取购物车数据
     */
    function _getGoodsListByJson(json) {
        var amount = 0,
            goodsList = [];
        $.each(json, function (i, n) {
            amount = Nc.number.add(n.cartAmount, amount);
            goodsList = goodsList.concat($.map(n.cartItemVoList, function (n) {
                return n;
            }));
        });

        return {
            amount: amount,
            goodsCount: goodsList.length,
            goodsList: goodsList
        };
    }

    /**
     * 创建购物车列表元素
     */
    function _buildGoodsList(data) {
        var that = this,
            a = '';
        a = data.goodsList.map(function (n) {
            //如果没有cartid就换成goods id
            n.cartId = (n.cartId == 0) ? n.goodsId : n.cartId;
            n.imageSrc = ncImage(n.imageSrc, 60, 60);
            n.goodsPrice = Nc.priceFormatNew(n.goodsPrice);
            return ncTemplate(TPL_GOODS_ITEM)(n);
        });
        //商品列表
        $panelGoodsList.html(a.join(""));
        //价格区域
        $("#tbarCartotal").html(Nc.priceFormatNew(data.amount));
        $("#tbarCartCount").html(data.goodsCount);
        Nc.eventManger.trigger("nc.cart.redpoint", [data.goodsCount]);
    }


    /**
     * 如果购物车为空的时候创建的元素
     * Copyright: www.Bizpower.com
     */
    function _buildNoneGoods() {
        $panelGoodsList.html(TPL_NO_GOODS);
        $("#tbarCartotal").html(Nc.priceFormatNew(0));
        $("#tbarCartCount").html(0);
        Nc.eventManger.trigger("nc.cart.redpoint", [0]);
        Nc.eventManger.trigger("nc.cart.build.empty");
    }


    /**
     * 购物车删除事件
     */
    function _delCartById(id) {
        if (postFlat == false) {
            return;
        }
        postFlat = false;
        $.post(URL_DEL, {
            cartId: id
        })
            .done(function (data) {
                postFlat = true;
                if (data.code == "200") {
                    _buildElement();
                } else {
                    Nc.alertError(data.message);
                }

            }).always(function () {
            postFlat = true;
        });
    }

    /**
     * 刷新高度
     */
    function _refreshHeight() {
        var panelH = $tbar.height(),
            headH = 40,
            footH = 50,
            contentH = panelH - headH - footH;
        $tbar.find(".nc-tbar-panel-content").height(contentH);
    }

    //================================================================3
    function _bindEvent() {
        console.log("tbar 购物车 eventbind is run");
        Nc.eventManger.on("nc.cart.redpoint", function (event, num) {
            //event.stopImmediatePropagation();
            if (num > 0) {
                $tbarCartCount.show().html(num);
            } else {
                $tbarCartCount.hide();
            }
        });
        Nc.eventManger.on("add.cart.succeed", function (event) {
            _buildElement();
        });
        //删除
        $panelToolbar.on('click', '[data-del-cart]', function () {
            console.log("删除购物车中的商品");
            var cartId = $(this).data("delCart");
            _delCartById(cartId);
        });
        //窗口调整后自动刷新高度
        $(window).resize(function () {
            _refreshHeight();
        });
    }

    function _show() {
        console.log("tbar 购物车 function show");
        //创建元素
        _buildElement();
        //刷新高度
        _refreshHeight();
    }

    return {
        bindEvent: _bindEvent,
        show: _show
    };
});
/**
 * tbar 收藏
 * Copyright: www.Bizpower.com
 */
ncDefine("toolbar.follow", [], function () {
    var

        first = true,
        bxSlider,
        //toolbar 最外元素
        $panelToolbar = $("#ncGlobalToolbar"),
        $tbar = $panelToolbar.find("[data-nc-tbar-name=follow]"),

        URL_F_GOODS = ncGlobal.webRoot + 'member/favorite/goods/list',
        URL_F_STORE = ncGlobal.webRoot + 'member/favorite/store/list',
        URL_F_DEL_GOODS = ncGlobal.webRoot + "member/favorites/goods/del",
        MAX_show = 10;


    /**
     * 构建商品收藏页
     */
    function _getFavGoods(cb) {
        var _buildFavGoods = function (data) {
            var a = $.isArray(data) ?
                data.map(function (currValue) {
                    var goodsCommon = currValue.goodsCommon;
                    return '<li class="fpl-item">' +
                        '<a href="' + ncGlobal.webRoot + "goods/" + goodsCommon.commonId + '" class="img-wrap" target="_blank" title="' + goodsCommon.goodsName + '">' +
                        '<img src="' + ncImage(ncGlobal.uploadRoot + goodsCommon.imageName, 100, 100) + '" width="100" height="100"></a>' +
                        '<a class="add-cart-button" data-add-cart="' + goodsCommon.commonId + '" href="javascript:;" target="_blank">加入购物车</a>' +
                        '<a href="' + ncGlobal.webRoot + "web/goods/" + goodsCommon.commonId + '" target="_blank" class="price">' +
                        Nc.priceFormatNew(goodsCommon.webPriceMin) +
                        '</a>' + '<a href="javascript:;" class="fpl-remove" data-nc-del="' + currValue.commonId + '"></a>' +
                        '</li>';
                }).join("") :
                "";
            $("#goodsFavListTbarFollow").html(a);
            $("#followTabContent_goods .follow-bottom-more").show();
        };

        $.post(URL_F_GOODS, {
            pageSize: MAX_show
        }, function (xhr) {
            if (xhr.code != 200 || !xhr.data || !xhr.data.length) {
                _buildNoneFavGoods();
            } else {
                _buildFavGoods(xhr.data);
            }
            cb();
        });
    }

    /**
     * 创建空的商品收藏
     */
    function _buildNoneFavGoods() {
        $(".follow-bottom-more").hide();
        $("#goodsFavListTbarFollow").html('<div style="height:500px">' +
            '<div class="nc-tbar-tipbox2">' +
            '<div class="tip-inner"> <i class="i-face-fd"></i>' +
            '<div class="tip-text">' +
            '还没有收藏的商品哦~' +
            '<br>' +
            '收藏后，可了解商品降价、促销等信息~' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        $("#followTabContent_goods .follow-bottom-more").hide();
    }

    /**
     *获取收藏的店铺
     */
    function _getFavStore(cb) {
        var _buildFavStore = function (data) {
            var a = $.isArray(data) ?
                data.map(function (currValue) {
                    var storeInfo = currValue.store;

                    return '<li class="fsl-item">' +
                        '<div class="shop-logo">' +
                        '<a href="' + ncGlobal.webRoot + "store/" + storeInfo.storeId + '" target="_blank"></a>' +
                        '<img class=" " src="' + storeInfo.storeLogoUrl + '"></div>' +
                        '<div class="shop-info">' +
                        '<div class="si-name">' +
                        '<a target="_blank" href="' + ncGlobal.webRoot + "store/" + storeInfo.storeId + '">' + storeInfo.storeName + '</a>' +
                        '</div>' +
                        '<a href="' + ncGlobal.webRoot + "store/" + storeInfo.storeId + '" class="si-button" target="_blank">进入店铺 &gt;</a>' +
                        '</div>' +
                        '</li>';
                }).join("") :
                "";
            $("#storeFavListTbarFollow").html(a);
            $("#followTabContent_store .follow-bottom-more").show();
        };
        $.post(URL_F_STORE, {
            pageSize: MAX_show
        }, function (xhr) {
            if (xhr.code != 200 || !xhr.data || !xhr.data.length) {
                _buildNoneStore();
            } else {
                _buildFavStore(xhr.data);
            }
            cb();
        });
    }

    /**
     * 创建一个空的店铺收藏
     * Copyright: www.Bizpower.com
     */
    function _buildNoneStore() {
        $("#storeFavListTbarFollow").html('<div style="height:500px">' +
            '<div class="nc-tbar-tipbox2">' +
            '<div class="tip-inner"> <i class="i-face-fd"></i>' +
            '<div class="tip-text">' +
            '还没有收藏的店铺哦~~' +
            '<br/>' +
            '收藏后，可了解店铺促销、上新信息~' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        $("#followTabContent_store .follow-bottom-more").hide();
    }

    /**
     * 刷新高度
     */
    function _refreshHeight() {
        var panelH = $tbar.height(),
            headH = 40,
            navH = 40,
            footH = 0,
            contentH = panelH - headH - footH;
        // $("#followTabContent_goods").height(contentH);
        // $("#followTabContent_store").height(contentH);
        $("#tbarFollowTab").parent().height(contentH);
    }

    ////////////////
    function _bindEvent() {
        console.log("tbar 会员 eventbind is run");
        $panelToolbar.on("mouseenter", ".ui-switchable-item", function () {
            console.log("tbar follow is hover ")
            var $this = $(this),
                _index = $this.data("ncIndex"),
                target = $("#followTabContent_" + _index);
            setTimeout(function () {
                if (_index == "goods") {
                    _getFavGoods(function () {
                        $this.siblings("li").removeClass('curr').end().addClass('curr');
                        $("#tbarFollowTabPanel").animate({
                            "left": "0"
                        });
                    });
                } else {
                    _getFavStore(function () {
                        $this.siblings("li").removeClass('curr').end().addClass('curr');
                        $("#tbarFollowTabPanel").animate({
                            "left": "-270px"
                        });

                    });
                }

            }, 300);
        });
        //设置初始值
        // _getFavGoods(function() {});
        //显示商品收藏的删除按钮
        $("#goodsFavListTbarFollow")
            .on('mouseenter', 'li', function (event) {
                event.preventDefault();
                var $this = $(this);
                $this.addClass('fpl-item-hover');
            })
            .on('mouseleave', 'li', function (event) {
                event.preventDefault();
                $(this).removeClass('fpl-item-hover');
            })
            .on("click", "[data-nc-del]", function () {
                var $this = $(this),
                    commonId = $(this).data("ncDel");
                $.post(URL_F_DEL_GOODS, {
                    commonId: commonId
                }, function (xhr) {
                    if (xhr.code == 200) {
                        $this.closest('li').remove();
                        !$("#goodsFavListTbarFollow li").length && _buildNoneFavGoods();
                        _refreshHeight();
                    }

                });
            }).on('click', '.add-cart-button', function (event) {
            event.preventDefault();
            var commonId = $(this).data("addCart");
            addGoodsPopUpModule.addGoodsPopUp(commonId);
        })

        ;

        //窗口调整后自动刷新高度
        $(window).resize(function () {
            _refreshHeight();
        });

    }

    function _show() {
        console.log("tbar 会员 function show");
        $panelToolbar.find('.ui-switchable-item:first').trigger('mouseenter');
        _refreshHeight();
    }

    return {
        bindEvent: _bindEvent,
        show: _show
    };
});
/**
 * 足迹
 */
ncDefine("toolbar.history", [], function () {
    var
        //toolbar 最外元素
        $panelToolbar = $("#ncGlobalToolbar"),
        $tbar = $panelToolbar.find("[data-nc-tbar-name=member]"),
        URL_F_HIS = ncGlobal.webRoot + 'goods/browse/list';


    function _getHis() {

        var _buildElement = function (data) {
                var a = $.isArray(data) ?
                    data.map(function (currIndex) {
                        var goodsCommon = currIndex.goodsCommon;
                        return '<li class="jth-item" title="' + goodsCommon.goodsName + '">' +
                            '<a href="' + ncGlobal.webRoot + 'goods/' + goodsCommon.commonId + '" class="img-wrap">' +
                            '<img src="' + ncImage(ncGlobal.uploadRoot + goodsCommon.imageName, 100, 100) + '" height="100" width="100"></a>' +
                            '<a class="add-cart-button" href="javascript:;" target="_blank" style="display: none;" data-nc-add-cart="' + goodsCommon.commonId + '">加入购物车</a>' +
                            '<a href="javascript:;" target="_blank" class="price">' + Nc.priceFormatNew(goodsCommon.webPriceMin) + '</a>' +
                            '</li>';
                    }).join("") :
                    "";
                $("#histbarPanelContent").html('<div class="jt-history-wrap"><ul>' + a + '</ul><a href="' + ncGlobal.memberRoot + 'goodsbrowse" class="history-bottom-more" target="_blank">查看更多足迹 &gt;&gt;</a></div>');
            },
            _buildNone = function () {
                $("#histbarPanelContent").html('<div>' +
                    '<div class="nc-tbar-tipbox2">' +
                    '<div class="tip-inner"> <i class="i-face-fd"></i>' +
                    '<div class="tip-text">' +
                    '还没有浏览历史哦~~' +
                    '<br>' +
                    '<a href="' + ncGlobal.webRoot + '">去首页看看</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
            };


        $.post(URL_F_HIS, function (xhr) {
            (xhr.code == 200 && xhr.data && xhr.data.length) ? _buildElement(xhr.data) : _buildNone();
            _refreshHeight();
        });
    }

    /**
     * 刷新高度
     */
    function _refreshHeight() {
        var panelH = $tbar.height(),
            headH = 40,
            contentH = panelH - headH;
        $("#histbarPanelContent").height(contentH);
    }

    /////
    function _bindEvent() {
        console.log("tbar 会员 eventbind is run");
        //添加购物车
        $("#histbarPanelContent")
            .on('click', '[data-nc-add-cart]', function (event) {
                event.preventDefault();
                var commonId = $(this).data("ncAddCart");
                console.log("添加购物车", commonId);
                addGoodsPopUpModule.addGoodsPopUp(commonId);
            })
            .on('mouseenter', 'li', function (event) {
                event.preventDefault();
                $(this).find(".add-cart-button").show();
            })
            .on('mouseleave', 'li', function (event) {
                event.preventDefault();
                $(this).find(".add-cart-button").hide();
            });
        //窗口调整后自动刷新高度
        $(window).resize(function () {
            _refreshHeight();
        });
    }

    function _show() {
        console.log("tbar 会员 function show");
        _getHis();

    }

    return {
        bindEvent: _bindEvent,
        show: _show
    };
});
/**
 * im 相关
 */
ncDefine("toolbar.im", [], function () {

    var token = ncGlobal.tid,
        url_im_list = ncGlobal.imRoot + 'member/list?token={token}',
        // url_is_online = ncGlobal.imRoot + "api/is_online",
        url_is_online = 'http://192.168.1.217/api/is_online',
        scope,
        newWindow;


    function _openImWindow() {
        newWindow.location = url_im_list.ncReplaceTpl({
            token: token
        });
        newWindow.resizeTo(850, 550);
    }

    //////
    function _show() {
        window.open(url_im_list.ncReplaceTpl({token: token}), '_blank', "top=" + (window.screen.height - 550) / 2 + ",left=" + (window.screen.width - 850) / 2 + ",width=850,height=550,menubar=no,scrollbars=no,toolbar=no,status=no,location=no");
    }

    /////
    return {
        bindEvent: function () {
            $('[data-nc-tag-type="message"]').click(function (event) {
                if (!ncGlobal.tid) return popupLoging.showLoginDialog(), null;
                scope = this;
                _show.call(this);
            });
        }
    };
});
/**
 * 二维码
 */
ncDefine("toolbar.qrcode", [], function () {

    function _show() {
        console.log("toobar qrcode show ")
    }

    return {
        bindEvent: function () {

        },
        show: _show
    };
})
/**
 * tbar 优惠券活动
 */
ncDefine("toolbar.couponActivity", [], function () {
    //toolbar 最外元素
    var $panelToolbar = $("#ncGlobalToolbar");
    var $tbar = $panelToolbar.find("[data-nc-tbar-name=couponActivity]");
    //优惠券活动中的商品显示区域
    var $panelCouponActivityList = $("#tbarCouponActivityList");
    var NC_PANEL_IN = "toolbar-animate-in";
    var NC_PANEL_OUT = "toolbar-animate-out";
    //领取优惠券地址
    var RECEIVE_URL = ncGlobal.webRoot + "cart/add";
    //获取优惠券活动列表地址
    var LIST_URL = ncGlobal.webRoot + "goods/coupon/activity/list";
    //页码
    var couponActivityPage = 1;
    //是否有下一页
    var couponActivityHasMore = true;
    //列表加载中
    var couponActivityListLoading = false;
    //正在提交
    var submiting = false;
    //优惠券活动模板
    var ITEM_TPL_NAME = "couponActivityItemModel";
    //暂无优惠券活动模板
    var NO_DATA_TPL_NAME = "couponActivityNoDataModel";
    //
    var tbarCouponActivityListPs = document.getElementById('tbarCouponActivityList');
    var ps = null;

    //创建优惠券活动元素
    function _buildElement() {
        if (couponActivityHasMore == false || couponActivityListLoading == true) {
            return false;
        }
        couponActivityListLoading = true;
        var params = {};
        params.commonId = ncGlobal.commonId;
        params.page = couponActivityPage;
        $.getJSON(LIST_URL, params, function (xhr) {
            if (xhr.code == '200') {
                _buildCouponActivityList(xhr.data.list);
                if (xhr.data.list.length > 0) {
                    if (couponActivityPage == 1) {
                        ps = new PerfectScrollbar(tbarCouponActivityListPs);
                    } else {
                        ps.update();
                    }
                    couponActivityPage += 1;
                } else {
                    if (couponActivityPage == 1) {
                        _buildNoneGoods();
                    }
                }
                couponActivityHasMore = xhr.data.pageEntity.hasMore;
            } else {
                _buildNoneGoods();

            }
        }).fail(function () {
            if (couponActivityPage == 1) {
                _buildNoneGoods();
            }
        }).always(function () {
            couponActivityListLoading = false;
        });
    }

    //构造优惠券活动列表项
    function _buildCouponActivityList(couponActivityList) {
        if (couponActivityList.length <= 0) {
            return false;
        }
        var html = couponActivityList.map(function (item) {
            return ncTemplate($("#" + ITEM_TPL_NAME).html())(item);
        });
        $panelCouponActivityList.append(html);
    }

    //构造暂无优惠券活动内容
    function _buildNoneGoods() {
        $panelCouponActivityList.html($("#" + NO_DATA_TPL_NAME).html());
    }

    //刷新高度
    function _refreshHeight() {
        var panelH = $tbar.height(),
            headH = 40,
            navH = 0,
            footH = 0,
            contentH = panelH - headH - footH;
        $(tbarCouponActivityListPs).height(contentH);
    }

    function _bindEvent() {
        //窗口调整后自动刷新高度
        $(window).resize(function () {
            _refreshHeight();
        });

        //立即领取优惠券
        $panelCouponActivityList.on('click', "[nc-type='receiveBlock']", function () {
            if (submiting == true) {
                return;
            }
            submiting = true;

            var $this = $(this);
            var searchSn = $this.data('searchSn');
            var params = {};
            params.searchSn = searchSn;
            $.post(ncGlobal.webRoot + 'vouchercenter/coupon/activity/receive', params, function (xhr) {
                if (xhr.code === 200) {
                    //处理内容显示与隐藏
                    var itemObj = $("#couponActivityItem_" + searchSn);
                    var receiveBlock = $(itemObj).find("[nc-type='receiveBlock']");
                    var completeBlock = $(itemObj).find("[nc-type='completeBlock']");
                    var toGoodsListBlock = $(itemObj).find("[nc-type='toGoodsListBlock']");
                    var stateBlock = $(itemObj).find("[nc-type='stateBlock']");
                    $(receiveBlock).hide();
                    if (xhr.data.isComplete == 1) {
                        $(completeBlock).show();
                    } else {
                        $(toGoodsListBlock).show();
                    }
                    $(stateBlock).addClass("btn-geted");
                    //Nc.alertSucceed("恭喜您，领取成功");
                    submiting = false;
                } else {
                    submiting = false;
                    if (xhr.data && xhr.data.errorType && xhr.data.errorType == "noLogin") {
                        popupLoging.showLoginDialog();
                    } else {
                        Nc.alertError(xhr.message);
                    }
                }
                return;
            });
        });
        //立即使用
        $panelCouponActivityList.on('click', "[nc-type='toGoodsListBlock'],[nc-type='notBeginBlock'],[nc-type='completeBlock']", function () {
            var searchDataSource = $(this).data("searchDataSource");
            var activityId = $(this).data("activityId");
            var storeId = $(this).data("storeId");
            if (searchDataSource == "coupon") {
                Nc.go(ncGlobal.webRoot + "search?couponActivityId=" + activityId);
            }
            if (searchDataSource == "voucher") {
                Nc.go(ncGlobal.webRoot + "store/search?storeId=" + storeId + "&templateId=" + activityId);
            }
        });
    }

    function _show() {
        //创建元素
        _buildElement();
        //滚动到最底部事件
        tbarCouponActivityListPs.addEventListener('ps-y-reach-end', function () {
            _buildElement();
        });
        //刷新高度
        _refreshHeight();
    }

    return {
        bindEvent: _bindEvent,
        show: _show
    };
});

/**
 * 总体拼装
 */
ncDefine("toolbar.main", ['toolbar.member', 'toolbar.cart', 'toolbar.follow', 'toolbar.history', 'toolbar.im', 'toolbar.qrcode', 'toolbar.couponActivity'], function (tbarMember, tbarCart, tbarFollow, tbarHistory, tbarIm, tbarQrcode, tbarCouponActivity) {

    var
        //btn hover 切换的class
        CN_BTN_HOVER = "z-nc-tbar-tab-hover",
        //展开区域样式
        CN_TOOLBAR_OPEN = "z-nc-toolbar-open",
        //按钮点击后加的样式
        CN_BTN_SELECTED = "z-nc-tbar-tab-selected",
        //
        CN_PANEL_IN = "toolbar-animate-in",

        CN_PANEL_OUT = "toolbar-animate-out",
        //toolbar 最外元素
        $panelToolbar = $("#ncGlobalToolbar"),
        //上一个元素f
        $prePanel = [],
        //不需要显示的panel 标识 ， 比如message
        excludeShowPanelArray = ['message']


    ;

    /**
     * [_bindEvents description]
     * @return {[type]} [description]
     */
    function _bindEvents() {
        //鼠标划过btn小图显示文字
        _btnHoverEvent();

        $panelToolbar
        //鼠标点击展开和关闭toolbar内容区域
            .on("click", "[data-nc-tag-type]", function () {
                var
                    $this = $(this),
                    type = $this.data('ncTagType');
                if (type == 'message') return;
                if (type === 'qrcode') {
                    _showTbarPanel(!$this.hasClass(CN_BTN_SELECTED), $this);
                    return
                }
                if (type == "couponActivity") {
                    _showTbarPanel(!$this.hasClass(CN_BTN_SELECTED), $this);
                    return;
                }

                _verifyIsLogin(function () {
                    _showTbarPanel(!$this.hasClass(CN_BTN_SELECTED), $this);
                });
            })
            //点击tbar 上的关闭按钮事件
            .on('click', '.close-panel', function (event) {
                event.preventDefault();
                _showTbarPanel(false);
            });

        //点及其他地区关闭侧边栏
        $(document).mouseup(function (e) {
            if (!$panelToolbar.is(e.target) && $panelToolbar.has(e.target).length === 0 && !$("#showCouponActivityListBtn").is(e.target) && $("#showCouponActivityListBtn").has(e.target).length === 0) {
                _showTbarPanel(false);
            }
        });

        //返回顶部
        $("#tbarGoTop").click(function () {
            Nc.simpleGoTop();
        });
    }

    /**
     * 展开或者关闭tbar 具体内容区域
     */
    function _showTbarPanel(isShow, element) {
        var
            showType,
            $panelTbar,
            showHandleClass = function () {
                $panelToolbar.find("[data-nc-tag-type]").removeClass(CN_BTN_SELECTED);
                $panelToolbar.addClass(CN_TOOLBAR_OPEN);
                element.addClass(CN_BTN_SELECTED);
                //解绑btn hover事件
                _btnHoverEvent("解绑hover事件");
                //根据类型显示具体的panel
                //
                $panelTbar = $panelToolbar.find("[data-nc-tbar-name=" + showType + "]");
                if ($prePanel.length) {
                    $prePanel.removeClass(CN_PANEL_IN).addClass(CN_PANEL_OUT).css({
                        "z-index": "1",
                        "visibility": "hidden"
                    });
                } else {
                    $panelToolbar.find("[data-nc-tbar-name]").css({
                        "z-index": "1",
                        "visibility": "hidden"
                    });
                }
                $panelTbar.removeClass(CN_PANEL_OUT).addClass(CN_PANEL_IN).css({
                    "z-index": "2",
                    "visibility": "visible"
                });
                $prePanel = $panelTbar;
            };

        if (isShow) {
            showType = element.data("ncTagType");
            //如果不需要显示panel
            excludeShowPanelArray.indexOf(showType) < 0 && showHandleClass()
            //根据显示类型调用不同的显示方法
            _showPanelByType(showType);

        } else {
            $panelToolbar.find("[data-nc-tag-type]").removeClass(CN_BTN_SELECTED);
            $panelToolbar.removeClass(CN_TOOLBAR_OPEN);
            _btnHoverEvent();
        }
    }

    /**
     * 添加按钮hover事件
     */
    function _btnHoverEvent(handle) {
        if (handle) {
            //解绑hover事件(取出hover强加的class)
            $panelToolbar
                .find("[data-nc-tag-type]").removeClass(CN_BTN_HOVER);
        } else {
            //添加hover事件
            $panelToolbar.on("mouseenter", "[data-nc-tag-type]", function (event) {
                event.preventDefault();
                $(this).addClass(CN_BTN_HOVER);
            }).on('mouseleave', "[data-nc-tag-type]", function (event) {
                event.preventDefault();
                $(this).removeClass(CN_BTN_HOVER);
            });
        }
    }

    /**
     * 根据不同的显示类型 显示不同的panel
     */
    function _showPanelByType(type) {
        switch (type) {
            case "cart":
                tbarCart.show();
                break;
            case "member":
                tbarMember.show();
                break;
            case "follow":
                tbarFollow.show();
                break;
            case "history":
                tbarHistory.show();
                break;
            case 'qrcode':
                tbarQrcode.show();
                break;
            case 'couponActivity':
                tbarCouponActivity.show();
                break;
        }
    }

    /**
     * 检验登录状态
     */

    function _verifyIsLogin(cb) {
        verifyIsLogin.vaild(cb);
    }

    ////////
    return function () {
        console.log("toolbar bootstrap");
        //tbar 上的购物车事件
        tbarCart.bindEvent();
        tbarMember.bindEvent();
        tbarFollow.bindEvent();
        tbarHistory.bindEvent();
        tbarIm.bindEvent();
        tbarCouponActivity.bindEvent();
        _bindEvents();
    };
});

$(function () {
    if (ncGlobal.showToolBarCouponActivity == true) {
        $("#ncGlobalToolbar").find("[data-nc-tag-type='couponActivity']").show();
    }
    ncRequire("toolbar.main")();
});