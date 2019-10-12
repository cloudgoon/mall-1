/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

/**
 * 添加购物车成功后的弹出框
 */
ncDefine("add.cart.popup", [], function () {
    //购物车数量地址
    return {
        showFinishDialog: function () {
            $.get(ncGlobal.webRoot + "cart/count",function(xhr){
                //刷新顶部购物车小红点
                Nc.eventManger.trigger("nc.cart.redpoint", [xhr.data.cartCount]);
                $("#bold_num").html(xhr.data.cartCount);
                layer.open({
                    type: 1,
                    area: ['420px', '240px'], //宽高
                    shadeClose: true,
                    content: $("#addCartPrompt"),
                    time: 5000
                });
            })

        }
    }
});
ncDefine("arrival.notice.popup", [], function () {
    var __saveArrivalNoticeUrl = ncGlobal.webRoot + "arrival/notice";
    return {
        init: function () {
            var mobileSign = true;
            $("#arrivalNoticeMobile").change(function () {
                mobileSign = false;
            });
            jQuery.validator.addMethod("arrivalNoticeMobile", function (value, element) {
                var mobile = /^0?(13|15|17|18|14|16|19)[0-9]{9}$/;
                return mobileSign || mobile.test(value);
            }, "<i class='icon-exclamation-sign'></i>请输入正确的手机号码");

            var emailSign = true;
            $("#arrivalNoticeEmail").change(function () {
                emailSign = false;
            })
            jQuery.validator.addMethod("arrivalNoticeEmail", function (value, element) {
                var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return emailSign || email.test(value);
            }, "<i class='icon-exclamation-sign'></i>请输入正确的邮箱号码");

            $('#arrivalNoticeForm').validate({
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent());
                },
                rules: {
                    mobile: {
                        arrivalNoticeMobile: true
                    },
                    email: {
                        arrivalNoticeEmail: true
                    }
                },
                messages: {}
            });
        },
        showDialog: function (goodsId) {
            verifyIsLogin.vaild(function () {
                Nc.layerOpen({
                    title: "到货通知",
                    sizeEnum: "small",
                    content: $("#arrivalNoticeTpl"),
                    btn: ['确定'],
                    yes: function () {
                        var __mobile = $("#arrivalNoticeMobile").val();
                        var __email = $("#arrivalNoticeEmail").val();
                        if ($('#arrivalNoticeForm').valid()) {
                            $.post(__saveArrivalNoticeUrl, {
                                    commonId: ncGlobal.commonId,
                                    goodsId: goodsId,
                                    mobile: __mobile,
                                    email: __email
                                },
                                //C o p y r i g h t: 网 城 商 动
                                function (data) {
                                    layer.closeAll();
                                    if (data.code == 200) {
                                        Nc.alertSucceed("通知预约成功！<p>若商品在" + ncGlobal.arrivalNoticeMaxTime + "日内到货，我们会通过邮件、短信来通知您哦~</p>", {
                                            time: 6000
                                        });
                                    } else {
                                        Nc.alertError(data.message);
                                    }
                                });
                        }
                    }
                });
            })
        }
    }
});
/**
 * 零售模式
 * 规格点击切换商品()
 * 规格json数据格式
 * [{goodsId:1,specValueIds:"1,8"},...]
 * Copyright: 天津网城商动科技有限责任公司
 */
ncDefine("goods.modal.retail", ["nc.eventManger", "add.cart.popup", "arrival.notice.popup"], function (eventManger, addCartPopup, arrivalNoticePopup) {

    var GoodsRetail = function (option) {

        this.__postFlat = true;

        this.tpl = {
            goodsPriceGeneral: '<dt>{dtChar}</dt><dd><span class="goods-price-real"><strong class="number number-thin">{webPrice0}</strong><sub class="original-price {preSalePrices}" id="basePrice" style="display: {display} !important">原价：{batchPrice0}</sub></span> </dd>',
            goodsGift: '<dl><dt>赠&nbsp;品</dt><dd><ul>{goodsGiftChild}<span>(赠完即止)</span></ul></dd></dl>',
            goodsGiftChild: '<li><a href="{goodsUrl}" target="_blank" title="{goodsName}"><img src="{imageSrc}"/></a><span class="goods-gift-number"> <em>{giftNum}{unitName}</em></span></li>'
        };
        //规格值json
        this.goodsSpecValues = ncGlobal.goodsSpecValues;
        //规格值显示面板
        this.$retailModalPanel = $("#retailModalPanel");

        //计量单位
        this.unitName = this.$retailModalPanel.data("unitName");
        //已选列表
        this.$selGoodsListPanel = $("#selGoodsListPanel");

        //添加购物车按钮
        this.$addCartBtn = $("#addCartBtn");
        //立即购买按钮
        this.$buyNowSubmitBtn = $("#buyNowSubmitBtn");
        // 到货通知
        this.$arrivalNoticeBtn = $("#arrivalNoticeBtn");
        //立即购买form
        this.$buyNowForm = $("#buynow_form");
        //立即购买中的cart
        this.$buyData = $("#buyData");

        //当前选择的商品信息
        this.current = {};
        //保存格式化后的规格值于商品对应hash
        this.specJson = {};
        //定金数据
        this.book = {};
        // 赠品数据
        this.giftList = [];

        //购物数据
        this.buyListData = {};
        //合并配置
        $.extend(this, GoodsRetail.settings, option);

        //购物车添加地址
        this.urlAddCart = ncGlobal.webRoot + "cart/add";

        //立即购买中验证是否登录
        this.urlIsLogin = ncGlobal.webRoot + 'login/status';

        //是否能购立即购买标识
        //C o p y r i g h t: 网 城 商 动
        this.isBuyNow = false;

        this._init();
    };
    GoodsRetail.prototype = {
        // init
        _init: function () {
            //对参数进行整理
            this._formatSpecJson();
            if ($.isEmptyObject(this.specJson)) {
                return;
            }
            //绑定事件
            this._bindEvent();

            //初始化
            this._bootstrap();

            this._changeBackUrl();
        },
        /**
         * 初始化
         * @private
         */
        _bootstrap: function () {
            this._getGoodsData();
            this._showCurrentGoodsInfo();
        },
        //绑定事件
        _bindEvent: function () {
            var that = this;

            $(document).ajaxError(function () {
                that.__postFlat = true;
            });
            //规格图片
            $('.sp-img-thumb img').jqthumb({
                width: 40,
                height: 40,                
            });
            /**
             * 规格点击事件
             */
            this.$retailModalPanel.find("[data-spec-value]").click(function () {
                //console.log("规格点击事件");
                var $this = $(this),
                    cache;
                //重新选择规格后清空数据
                that.buyListData = {};

                $this.closest("ul").find(".hovered").removeClass("hovered");
                $this.addClass("hovered");
                //获取选择的商品信息
                that._getGoodsData();
                //显示商品数据
                that._showCurrentGoodsInfo();
                that._changeBackUrl();
            });

            /**
             * 点击减少数量事件
             * Copyright: 天津网城商动科技有限责任公司
             */
            $("#rmNumCut").click(function (event) {
                event.preventDefault();
                if ($(this).hasClass("crisis")) {
                    return
                }
                //console.log("点击减少数量事件");
                var $priceValue = $("#rmPriceValue"),
                    value = Nc.number.sub($priceValue.val(), 1);
                $priceValue.val(value < 1 ? 1 : value).trigger("keyup");
            });
            /**
             * 点击添加数量事件
             */
            $("#rmNumAdd").click(function (event) {
                event.preventDefault();
                if ($(this).hasClass("crisis")) {
                    return
                }
                //console.log("点击添加数量事件");
                var $priceValue = $("#rmPriceValue");
                $priceValue.val(Nc.number.add($priceValue.val(), 1)).trigger("keyup");

            });
            /**
             * 修改数量事件
             */
            $("#rmPriceValue").on("keyup", function (event) {
                event.preventDefault();
                if ($("#rmNumCut").hasClass("crisis") && $("#rmNumAdd").hasClass("crisis")) {
                    return
                }
                //console.log("修改数量事件");
                var $this = $(this),
                    value = Nc.getNum($this.val());
                $this.val(value == '' || value == 0 ? 1 : value);
                if (that.current.goodsWebUsable == 1 && that.current.limitAmount != 0 && $this.val() >= that.current.limitAmount) {
                    $this.val(that.current.limitAmount);
                    $("#rmNumAdd").addClass("crisis");
                } else if ($this.val() >= that.current.goodsStorage) {
                    $this.val(that.current.goodsStorage);
                    $("#rmNumAdd").addClass("crisis");
                } else {
                    $("#rmNumAdd").removeClass("crisis");
                }
                if ($this.val() <= 1) {
                    $("#rmNumCut").addClass("crisis");
                    //外层li添加样式

                } else {
                    $("#rmNumCut").removeClass("crisis");
                }

                //修改当前选择的数量
                that._setCacheNum($this.val());
                //图钉条显示选择的数量和价格

                that._showSelListFormCache();
                //重新计算运费
                eventManger.trigger("freight", [$this.val()]);
            });
            /**
             * 图钉上的购物显示,点击事件
             * 其他内容在 "nc.goods.navpin" 里面了
             */
            $("#tabAddCart").click(function (event) {
                event.preventDefault();

                var $pinModal = $("#pinModal"),
                    $par = $pinModal.closest(".ncs-tabbar-buy");
                $pinModal.html() == '' && $("#pinModal").append($("#nc-spec-panel #retailModalPanel"));
                $par.hasClass("up") ? $par.addClass("down").removeClass("up") : $par.addClass("up").removeClass("down");
                //that.$element.addClass('ms-over-flow');
            });

            /**
             * 添加购物车点击事件
             * Copyright: www.Bizpower.com
             */
            this.$addCartBtn.click(function () {
                //console.log("添加购物车点击事件");
                //console.log("已选商品数据是", that.selGoodsData);

                if (that.__postFlat == false || $(this).hasClass('no-addcart')) {
                    return
                }
                if (Nc.isEmpty(that.buyListData)) {
                    Nc.alertError("订购数量必须为大于0的整数");
                    return;
                }
                var postData = that._getSelDataForCart();
                that.__postFlat = false;
                $.post(that.urlAddCart, {
                    buyData: JSON.stringify(postData)
                }, function (xhr) {
                    var data = xhr.data;
                    if (xhr.code == 200) {
                        addCartPopup.showFinishDialog();

                        //C o p y r i g h t: 网 城 商 动
                    } else {
                        //console.log(xhr)
                        if (data && typeof data.loginState != 'undefined' && data.loginState == false) {
                            //弹出登录窗口
                            popupLoging.showLoginDialog();
                            return;
                        }
                        Nc.alertError(xhr.message);
                    }

                }).always(function () {
                    that.__postFlat = true;
                })
            });
            /**
             * 立即购买按钮点击事件
             * Copyright: www.Bizpower.com
             */
            this.$buyNowSubmitBtn.click(function () {
                //console.log("立即购买按钮点击事件");
                var $this = $(this);
                //验证是否登录
                if (!that.__postFlat || $(this).hasClass("no-addcart")) {
                    return
                }
                that.__postFlat = false;
                $.getJSON(that.urlIsLogin, function (xhr) {
                    if (xhr.code == "200") {
                        if (xhr.data.status == true) {
                            var pd = that._getSelDataForCart(true);
                            if (Nc.isEmpty(pd)) {
                                Nc.alertError("购买数量必须为大于0的整数");
                                return;
                            }
                            that.$buyData.val(JSON.stringify(pd));
                            $("#buynow_form").submit();
                        } else {
                            //调用member_top中的显示对话框函数
                            popupLoging.showLoginDialog()
                        }
                    } else {
                        Nc.alertError(data.message ? data.message : "连接超时");
                    }

                }).always(function () {
                    that.__postFlat = true
                });

            });
            /**
             * 到货通知
             */
            this.$arrivalNoticeBtn.click(function () {
                arrivalNoticePopup.showDialog(that.current.goodsId);
            })
        },


        /**
         * 获取选中的数据
         * @param isFormatString
         * @returns {*}
         * @private
         * Copyright: 天津网城商动科技有限责任公司
         */
        _getSelDataForCart: function () {
            var a = $.map(this.buyListData, function (n) {
                return {
                    goodsId: n.goodsId,
                    buyNum: n.num
                };
            });
            return a;
        },
        /**
         * 修改当前缓存的值
         * @private
         * Copyright: 天津网城商动科技有限责任公司
         */
        _setCacheNum: function (num, goodsId) {
            if (num <= 0) {
                delete this.buyListData[typeof goodsId != "undefined" ? goodsId : this.current.goodsId];
                //console.log("删除缓存后的数据是:", this.buyListData);
                return;
            }

            this.buyListData[this.current.goodsId] = {
                goodsId: this.current.goodsId,
                price: this.current.goodsPrice0,
                //BIZPOWER
                num: num,
                goodsFullSpecs: this.current.goodsFullSpecs
            }
            //console.log("缓存数据是:", this.buyListData);
        },
        /**
         * 将缓存的数据显示到已选列表上去
         * @private
         */
        _showSelListFormCache: function () {

            if (Nc.isEmpty(this.buyListData)) {
                //隐藏已选列表
                return;
            }
            //清空已选列表
            var that = this,
                price = 0,
                num = 0;
            //已选列表计算
            $.each(this.buyListData, function (i, n) {
                //价格计算
                _p = Nc.number.multi(n.price, n.num);
                price = Nc.number.add(_p, price);
                num = Nc.number.add(n.num, num);
            });
            //图钉上的显示价格,图钉上的显示数量
            $("#tabAddCart").find(".num").html(num).end().find(".price").html(Nc.priceFormatNew(price));

        },
        /**
         * 格式化规格数据
         * @private
         */
        _formatSpecJson: function () {
            var that = this;
            $.each(that.goodsSpecValues, function (i, n) {
                that.specJson[n.specValueIds] = n.goodsId;
            });
        },
        /**
         * 根据选择的规格获取当前商品信息
         * @private
         * Copyright: 天津网城商动科技有限责任公司
         */
        _getGoodsData: function () {
            var a = this.$retailModalPanel.find(".hovered[data-spec-value]"),
                goodsId;
            var spec = $.map(a, function (n) {
                return $(n).data("specValue");
            })
            if (spec.length == 0) {
                return;
            }
            goodsId = this.specJson[spec.join(",")];

            this.current = $("#goodsData_" + goodsId).data()
            this.book = $("#goodsBook_" + goodsId).data();
            this.giftList = $("input[data-item-id='" + goodsId + "']").map(function () {
                return $(this).data();
            })
            // 发送goodsid 变更事件
            eventManger.trigger('goods.changed' , goodsId , this.current)
        },
        /**
         * 将当前的数据显示到商品信息区域
         * @private
         */
        _showCurrentGoodsInfo: function () {
            if (Nc.isEmpty(this.current)) {
                return;
            }
            $("#retailPanel,#retailTip,#bookFinalPaymentDl").hide();
            $("#pingouProcess").hide();
            $("#goodsPriceHtml").html(
                this.tpl.goodsPriceGeneral.ncReplaceTpl({
                    dtChar: ncGlobal.hasStoreVIPDiscount == 1 ? "会员价" : "价&nbsp;格",
                    webPrice0: Nc.priceFormatNew(this.current.goodsPrice0),
                    display: this.current.goodsBatchPrice0 > this.current.goodsPrice0 ? "" : "none",
                    batchPrice0: Nc.priceFormatNew(this.current.goodsBatchPrice0),
                    preSalePrices:""
                }));
                switch (this.current.promotionType) {
                    case 1:
                    case 6:
                            $("#retailPanel").show();
                        break;
                    case 2:
                        if (this.current.goodsWebUsable == 1) {
                            $("#retailPanel,#retailTip").show();
                        }
                        break;
                    case 3:
                        if (this.current.goodsWebUsable == 1) {
                            //显示当前是否有活动
                            if (!Nc.isEmpty(this.book)) {
                                $("#goodsPriceHtml").html(
                                    this.tpl.goodsPriceGeneral.ncReplaceTpl({
                                        dtChar: "定&nbsp;金",
                                        webPrice0: Nc.priceFormatNew(this.book.downPayment),
                                        display: "",
                                        batchPrice0: Nc.priceFormatNew(this.book.totalPayment),
                                        preSalePrices:"pre-sale-prices"
                                    }));
                            $("#retailPanel,#retailTip,#bookFinalPaymentDl").show();
                            $("#addCartBtn").hide();
                            $("#buyNowSubmitBtn").html("支付定金");
                            $("#pingouProcess").show();
                            }
                        } else {
                            $("#addCartBtn").show();
                            $("#buyNowSubmitBtn").html("立即购买");
                        }
                        break;
                    default:
                        $("#addCartBtn").show();
                        $("#buyNowSubmitBtn").html("立即购买");
                        break;
                }
            if ($("#rmStock").html()) $("#rmStock").html(this.current.goodsStorage + $("#rmStock").html().replace(/[0-9|.]/ig, ""));
            if (this.current.goodsWebUsable == 1 && this.current.limitAmount > 0) {
                $("#rmLimitAmount").show().find("span").text(this.current.limitAmount);
                $("#Stock").hide()
            } else {
                $("#rmLimitAmount").hide();
                $("#Stock").show()
            }
            // 赠品
            if (this.giftList.length > 0) {
                var goodsGiftChild = '';
                for (var i = 0; i < this.giftList.length; i++) {
                    var gift = this.giftList[i];
                    goodsGiftChild += this.tpl.goodsGiftChild.ncReplaceTpl({
                        goodsUrl: gift.goodsUrl,
                        imageSrc: gift.imageSrc,
                        giftNum: gift.giftNum,
                        unitName: gift.unitName,
                        goodsName: gift.goodsName
                    });
                }
                $("#goodsGiftHtml").html(this.tpl.goodsGift.ncReplaceTpl({
                    goodsGiftChild: goodsGiftChild
                }))
            } else {
                $("#goodsGiftHtml").html("");
            }
            if (this.current.goodsStorage <= 0) {
                // 库存不足
                $("#arrivalNoticeBtn").show();
                $("#groupBtn").hide();
                $("#ncs-freight-prompt").html("<strong>无货</strong><span>商品库存不足，不能购买</span>")

                $("#addCartBtn").addClass("no-addcart");
                $("#buyNowSubmitBtn").addClass("no-addcart");
                $("#tabAddCart").addClass("no-addcart");
                $("#rmNumCut").addClass("crisis");
                $("#rmNumAdd").addClass("crisis");
                //BIZPOWER
            } else {
                $("#arrivalNoticeBtn").hide();
                $("#groupBtn").hide();
                $("#rmNumCut").removeClass("crisis");
                $("#rmNumAdd").removeClass("crisis");
                $("#rmPriceValue").trigger("keyup");
            }
            //

        },

        /**
         * 修改skuid
         * @private
         */
        _changeBackUrl : function (){  //url表示链接地址
            var path = window.location.href;
            var patt = new RegExp("goodsId");
            if (this.current) {

            }
            if (patt.test(path)) {
                path = path.replace(/goodsId=[0-9]*/g,"goodsId=" + this.current.goodsId)
            } else {
                path = path + "?goodsId=" + this.current.goodsId;
            }
            history.replaceState(null, null, path);
        }
};

    return function (option) {
        return new GoodsRetail(option);
    };
});
/**
 * 批发模式,商品添加显示区域
 * Copyright: 天津网城商动科技有限责任公司
 */
ncDefine("goods.modal.wholesale", ["nc.eventManger", "nc.goods.navpin", "add.cart.popup", "arrival.notice.popup"], function (eventManger, navPin, addCartPopup, arrivalNoticePopup) {
    var ModalASku = function () {
        //post 标识
        this.__postFlat = true;
        //添加购物车按钮
        this.$addCartBtn = $("#modalSkuBPanel #addCartBtn");
        //立即购买按钮
        this.$buyNowSubmitBtn = $("#modalSkuBPanel #buyNowSubmitBtn");
        //立即购买中的cart
        this.$buyData = $("#buyData");
        // 到货通知
        this.$arrivalNoticeBtn = $("#arrivalNoticeBtn");

        //列表显示区域
        this.$element = $("#modalSkuB");

        //计量单位
        this.unitName = this.$element.data("unitName");

        //已选清单 商品列表
        this.$selectListInfo = $("#selectedListInfo");
        //已选清单整个区域
        this.$selGoodsListPanel = $("#selGoodsListPanel");

        //图钉上的价格数量显示区域
        this.$tabAddCartBtn = $("#tabAddCart");


        //模版
        this.tpl = {
            selectListInfo: '<li><span class="full-spec">{goodsFullSpecs}</span><span class="goods-num">{num}</span><span class="goods-del"><a href="javascript:;" data-goods-del="{goodsId}"><i class="fa fa-trash"></i>移除</a></span></li>'
        }
        //显示更多规格的样式
        this.classNameShowMore = "ms-hide-over";

        //购买累计数量
        this.buyNum = 0;
        //价格
        this.buyPrice = 0;
        // 以选择的商品数据
        this.selGoodsData = [];

        //购物车添加地址
        this.urlAddCart = ncGlobal.webRoot + "cart/add";

        //立即购买中验证是否登录
        this.urlIsLogin = ncGlobal.webRoot + 'login/status';

        //是否能购立即购买
        this.isBuyNow = false;
        this._bindEvent();
    };
    /**
     * 绑定事件
     * @private
     */
    ModalASku.prototype._bindEvent = function () {
        var that = this;
        $(document).ajaxError(function () {
            that.__postFlat = true;
        });
        this.$element
            /**
             * 点击添加按钮
             */
            .on('click', '[data-num-add]', function (event) {
                event.preventDefault();
                //console.log("点击添加按钮");
                //获取sku数据
                var $par = $(this).closest("li"),
                    $inputValue = $par.find("[data-num-value]");
                $("#modalShowMore").trigger('click')
                $inputValue.val(Nc.number.add($inputValue.val(), 1)).trigger("keyup");
            })
            /**
             * 点击减少按钮
             */
            .on('click', "[data-num-cut]", function (event) {
                event.preventDefault();
                //console.log("点击减少按钮");

                var $par = $(this).closest("li"),
                    //Copyright: BIZPOWER
                    $inputValue = $par.find("[data-num-value]"),
                    value = Nc.number.sub($inputValue.val(), 1);
                $inputValue.val(value < 0 ? 0 : value).trigger("keyup");

            })
            /**
             * 直接修改数量事件
             * @param manual 判断是否是手动模拟事件
             */
            .on("keyup", "[data-num-value]", function (event, manual) {
                event.preventDefault();
                //console.log("直接修改数量事件");
                var $this = $(this),
                    $par = $(this).closest("li"),
                    skuConfig = that._getSkuConfig($par),
                    value = Nc.getNum($this.val());
                $this.val(value == '' ? 0 : value);
                if ($this.val() >= skuConfig.goodsStorage) {
                    $this.val(skuConfig.goodsStorage);
                    $this.siblings("[data-num-add]").addClass("crisis");
                } else {
                    $this.siblings("[data-num-add]").removeClass("crisis");
                }
                if ($this.val() <= 0) {
                    $this.siblings("[data-num-cut]").addClass("crisis");
                    $par.removeClass("modal-sku-curr");
                } else {
                    $this.siblings("[data-num-cut]").removeClass("crisis");
                    $par.addClass("modal-sku-curr");
                }
                //刷新价格
                that._refreshPrice();
                //隐藏已选清单
                manual || $("#selectedListInfo").hide();
                //展开全部规格信息
                that._showAndHideMore(1);
                //重新计算运费
                eventManger.trigger("freight", [$this.val()])


            });
        /**
         * 添加购物车点击事件
         */
        this.$addCartBtn.click(function () {
            //console.log("添加购物车点击事件");
            //console.log("已选商品数据是", that.selGoodsData);
            if (that.__postFlat == false || $(this).hasClass('no-addcart')) {
                return
            }
            if (Nc.isEmpty(that.selGoodsData)) {
                Nc.alertError("订购数量必须为大于0的整数");
                return;
            }
            var postData = that._getSelDataForCart();
            that.__postFlat == false;
            $.post(that.urlAddCart, {
                buyData: JSON.stringify(postData)
            }, function (xhr) {
                var data = xhr.data;
                if (xhr.code == 200) {
                    //Nc.alertSucceed(xhr.message);
                    addCartPopup.showFinishDialog();
                } else {
                    // console.log(xhr)
                    if (data && typeof data.loginState != 'undefined' && data.loginState == false) {
                        //弹出登录窗口
                        popupLoging.showLoginDialog();
                        return;
                    }
                    Nc.alertError(xhr.message);
                }

            }).always(function () {
                that.__postFlat = true;
            })
        });
        /**
         * 立即购买按钮点击事件
         */
        this.$buyNowSubmitBtn.click(function () {
            //console.log("立即购买按钮点击事件");
            /**
               ___  _
              / __\(_) ____ _ __    ___  __      __  ___  _ __
             /__\//| ||_  /| '_ \  / _ \ \ \ /\ / / / _ \| '__|
            / \/  \| | / / | |_) || (_) | \ V  V / |  __/| |
            \_____/|_|/___|| .__/  \___/   \_/\_/   \___||_|
                           |_|
            */
            var $this = $(this);
            //验证是否登录

            if (!that.__postFlat || $(this).hasClass("no-addcart")) {
                return
            }
            that.__postFlat = false;
            $.getJSON(that.urlIsLogin, function (xhr) {
                if (xhr.code == "200") {
                    if (xhr.data.status == true) {
                        var pd = that._getSelDataForCart();
                        if (Nc.isEmpty(pd)) {
                            Nc.alertError("订购数量必须为大于0的整数");
                            return;
                        }
                        if (!that.isBuyNow) {
                            Nc.alertError("订购数量未大于起购数量");
                            return;
                        }
                        that.$buyData.val(JSON.stringify(pd));
                        $("#buynow_form").submit();
                    } else {
                        //调用member_top中的显示对话框函数
                        popupLoging.showLoginDialog();
                    }
                } else {
                    Nc.alertError(data.message ? data.message : "连接超时");
                }

            }).always(function () {
                that.__postFlat = true;
            })

        });
        /**
         * 到货通知
         */
        this.$arrivalNoticeBtn.click(function () {
            arrivalNoticePopup.showDialog();
        })
        /**
         * 已选清单 点击事件
         */
        $("#showSelectListBtn").click(function (event) {
            event.preventDefault();
            var $par = $("#selectedListInfo").closest(".list-selected").toggleClass("list-selected-open");
            $("#selectedListInfo").toggle();

        });
        /**
         * 已选清单 中点击删除事件
         */
        //Copyright: BIZPOWER
        this.$selectListInfo.on("click", "[data-goods-del]", function () {
            var $this = $(this),
                goodsId = $this.data("goodsDel"),
                a = that.$element.find("li[data-sku-goods-id=" + goodsId + "]"),
                input = a.length && a.find("input[data-num-value]");
            //模拟发送添加 0 事件
            if (a.length) {
                input.val("0");
                input.trigger("keyup", [true]);
            }
            $("#selectedListInfo").perfectScrollbar("destroy");
            $("#selectedListInfo").perfectScrollbar();
        });

        /**
         * 点击图钉上的 价格和数量
         */
        this.$tabAddCartBtn.click(function () {
            //console.log("点击图钉上的 价格和数量");
            var $pinModal = $("#pinModal"),
                $par = $pinModal.closest(".ncs-tabbar-buy");
            $pinModal.html() == '' && $pinModal.append($("#nc-spec-panel .ncs-wholesale-modal"))
            $par.hasClass("up") ? $par.addClass("down").removeClass("up") : $par.addClass("up").removeClass("down");
            that.$element.has(that.classNameShowMore) && that.$element.removeClass(that.classNameShowMore)
            that.$element.addClass('ms-over-flow');
            $("#modalShowMore").trigger('click');
        });
        /**
         * 点击显示更多事件
         */
        $("#modalShowMore").on('click', function (event) {
            event.preventDefault();
            var $this = $(this);
            that._showAndHideMore(1);

            $this.closest('div').hide();
        });
        /**
         * 点击其他区域收起已选列表
         */
        $(document).mouseup(function (e) {
            //已选列表关闭
            var _con = $("#selectedListInfo,#showSelectListBtn"),
                $selectedListInfo = $("#selectedListInfo");
            if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                //console.log("已选列表关闭1111")
                $selectedListInfo.closest(".list-selected").removeClass("list-selected-open");
                $selectedListInfo.hide();
            }
            //图钉上的规格选择
            var $pinModal = $("#pinModal,#tabAddCart");

            if (!$pinModal.is(e.target) && $pinModal.has(e.target).length === 0) {
                //console.log("图钉上的规格选择222");
                $("#pinModal").closest(".ncs-tabbar-buy").removeClass("down").addClass("up");
            }

        });

    };
    /**
     * 根据已选数据获取需要发送的购物车信息
     * @private
     */
    ModalASku.prototype._getSelDataForCart = function (isFormatString) {
        var a = $.map(this.selGoodsData, function (n) {
            //isFormatString ? n.skuGoodsId + "|" + n.buyNum :
            return {
                goodsId: n.skuGoodsId,
                buyNum: n.buyNum
            };
        });
        return a;
    };
    /**
     * 加载显示更多 的控制
     * @param isShow 1：显示 0 ：不显示
     */
    ModalASku.prototype._showAndHideMore = function (isShow) {
        //console.log(isShow)
        if (isShow == 1) {
            //console.log("显示加载更多");
            this.$element.removeClass(this.classNameShowMore);
        } else {
            //console.log("隐藏显示更多");
            this.$element.addClass(this.classNameShowMore);
            //隐藏已选列表
            $("#selectedListInfo").hide();
        }
        //刷新图钉
        navPin.refreshOffSet();

    };

    /**
     * 获取 当行的li 的sku数据
     * @private
     */
    ModalASku.prototype._getSkuConfig = function ($ele) {
        var a = $ele;
        return a.length ? function () {
            var b = a.data();
            Nc.isString(b.goodsSpecs) && b.goodsSpecs && (b.goodsSpecs = b.goodsSpecs.split(",,,"))
            Nc.isString(b.specValueIds) && b.specValueIds && (b.specValueIds = b.specValueIds.split(","))
            return b;
        }() : "";
    };
    /**
     * 刷新价格
     * @private
     */
    ModalASku.prototype._refreshPrice = function () {
        //console.log("刷新价格")
        //var num = 0 ;
        //this.$element.find("[data-num-value]").each(function(n) {
        //    num  = Nc.number.add(num , $(this).val())
        //})
        var that = this,
            //获取价格
            _getRangePrice = function (num, data, lidata) {
                //console.log("根据价格段获取价格");
                if (num >= data.batchNum2 && data.batchNum2 > 0) {
                    return lidata['goodsPrice2'];
                }
                if (num >= data.batchNum1 && data.batchNum1 > 0) {
                    return lidata['goodsPrice1'];
                    //Copyright: bizpower
                }
                if (num >= data.batchNum0 && data.batchNum0 > 0) {
                    return lidata['goodsPrice0'];
                }
                return lidata['goodsPrice0'];
            };
        //重置数据
        this._resetData();
        //清除已选清单
        this.$selectListInfo.find("ul").empty();
        //清空价格
        this.buyPrice = 0;

        //计算总数,需要用总数获取阶梯价格
        this.$element.find('input[data-num-value]').each(function (index, el) {
            if ($(this).val() > 0) {
                that.buyNum = Nc.number.add(that.buyNum, $(this).val());
            }
        });

        //获取价格
        this.$element.find("[data-sku-goods-id]").each(function () {
            var $this = $(this),
                $dataPrice = $this.find("[data-price]"),

                _num = $this.find("[data-num-value]").val(), //数量


                _price = 0, //阶梯价格
                _goodsPrice = 0 // 临时价格
            ;

            //获取单个ksu的价格
            _goodsPrice = _getRangePrice(that.buyNum, that.$element.data(), $(this).data());

            $dataPrice.html(Nc.priceFormatNew(_goodsPrice) + $dataPrice.html().replace(/<span\s*[^>]*>(.*?)<\/span>/ig, ""));

            if (_num > 0) {
                //同步已选清单
                that.$selectListInfo.find("ul").append(
                    that.tpl.selectListInfo.ncReplaceTpl({
                        goodsFullSpecs: $this.data("goodsFullSpecs"),
                        num: _num + that.unitName,
                        goodsId: $this.data("skuGoodsId")
                    })
                )
                $this.data().buyNum = _num;
                //添加已选数据
                that.selGoodsData.push($this.data());

                //获取总价
                that.buyPrice = Nc.number.add(Nc.number.multi(_num, _goodsPrice), that.buyPrice);
            }


        });
        //显示到价格区域
        $("#ordersNum").html(that.buyNum);
        $("#ordersPrice").html(Nc.priceFormatNew(that.buyPrice));
        //刷新已选清单显示区域
        if (that.buyNum != 0 || that.buyPrice != 0) {
            that.$selGoodsListPanel.show()
        } else {
            that.$selGoodsListPanel.hide()
        }
        //图钉上的价格显示
        this.$tabAddCartBtn.find(".num").html(that.buyNum).end().find(".price").html(Nc.priceFormatNew(that.buyPrice));

        //判断是否超出起购量
        that.isBuyNow = Nc.number.sub(that.buyNum, that.$element.data("batchNum0")) >= 0;
        //console.log("计算后数量是：" + that.buyNum);
        //console.log("计算后的价格是：" + that.buyPrice);
    };


    /**
     * 重置数据
     * @private
     */
    ModalASku.prototype._resetData = function () {
        this.buyNum = 0;
        this.buyPrice = 0;
        this.selGoodsData = [];
    }
    /////
    return function () {
        return new ModalASku();
    }
});
/**
 * 没有规格时商品详情 价格显示区域
 */
ncDefine("goods.modal.none", ["nc.eventManger", "add.cart.popup", "arrival.notice.popup"], function (eventManger, addCartPopup, arrivalNoticePopup) {

    var ModalNull = function () {

        this.$BuyNumInput = $("#mnBuyNumInput"); //数量输入框
        this.$BuyNumAddBtn = $("#mnBuyNumAddBtn"); //数量添加按钮
        this.$mnBuyNumCutBtn = $("#mnBuyNumCutBtn"); //数量减少按钮

        this.__postFlat = true;

        //添加购物车按钮
        this.$addCartBtn = $("#addCartBtn");
        //立即购买按钮
        this.$buyNowSubmitBtn = $("#buyNowSubmitBtn");
        // 到货通知
        this.$arrivalNoticeBtn = $("#arrivalNoticeBtn");
        //立即购买中的cart
        this.$buyData = $("#buyData");
        //购物车添加地址
        this.urlAddCart = ncGlobal.webRoot + "cart/add";
        //立即购买中验证是否登录
        this.urlIsLogin = ncGlobal.webRoot + 'login/status';
        //标识是否能购买
        this.isBuy = false;
        this._bindEvent();
        this._refreshPrice();
        this._changeBackUrl();
    };

    /**
     * 绑定事件
     * @private
     */
    ModalNull.prototype._bindEvent = function () {
        var that = this;
        $(document)
            .ajaxError(function () {
                that.__postFlat = true;
            })
            .mouseup(function (e) {
                var $pinModal = $("#pinModal"),
                    $par = $pinModal.closest(".ncs-tabbar-buy");
                if ($par.hasClass('down')) {
                    if (!$pinModal.is(e.target) && $pinModal.has(e.target).length === 0) {
                        $par.hasClass("up") ? $par.addClass("down").removeClass("up") : $par.addClass("up").removeClass("down");
                    }
                }
            });

        /**
         * 数量框修改事件
         */
        this.$BuyNumInput.on("keyup", function (event) {
            //Copyright: bizpower
            event.preventDefault();
            //console.log("修改数量事件");
            var $this = $(this),
                storage = $this.data("goodsStorage"), //库存
                limitAmount = $this.data("limitAmount"), //库存
                value = Nc.getNum($this.val());console.log(limitAmount)
            $this.val(value == '' ? 1 : value);
            if ($this.data("goodsWebUsable") == 1 && ( limitAmount != 0 && $this.val() >= limitAmount)) {
                $this.val(limitAmount);
                $("#mnBuyNumAddBtn").addClass("crisis");
            } else if ($this.val() >= storage) {
                $this.val(storage);
                $("#mnBuyNumAddBtn").addClass("crisis");
            } else {
                $("#mnBuyNumAddBtn").removeClass("crisis");
            }
            if ($this.val() <= 1) {
                $this.val(1);
                $("#mnBuyNumCutBtn").addClass("crisis");
            } else {
                $("#mnBuyNumCutBtn").removeClass("crisis");
            }
            eventManger.trigger("freight", [$this.val()]);
            that._refreshPrice();
        });
        /**
         * 数量添加按钮点击事件
         */
        this.$BuyNumAddBtn.click(function (event) {
            event.preventDefault();
            that.$BuyNumInput.val(Nc.number.add(that.$BuyNumInput.val(), 1)).trigger("keyup");
        });
        /**
         * 数量减少按钮点击事件
         */
        this.$mnBuyNumCutBtn.click(function (event) {
            event.preventDefault();
            var value = Nc.number.sub(that.$BuyNumInput.val(), 1);
            that.$BuyNumInput.val(value <= 0 ? 1 : value).trigger("keyup");
        });
        /**
         * 点击图钉上的购买
         */
        $("#tabAddCart").click(function (event) {
            event.preventDefault();
            var $pinModal = $("#pinModal"),
                $par = $pinModal.closest(".ncs-tabbar-buy");
            $par.hasClass("up") ? $par.addClass("down").removeClass("up") : $par.addClass("up").removeClass("down");
            $pinModal.append($("#nc-spec-panel #modalNullPanel")).show();
        });

        /**
         * 加入购物车
         */
        this.$addCartBtn.click(function () {
            //console.log("添加购物车点击事件2222");
            //console.log("已选商品数据是", that.selGoodsData);
            var postData = that._getSelDataForCart();
            if (that.__postFlat == false || $(this).hasClass('no-addcart')) {
                return
            }

            if (postData.length <= 0) {
                Nc.alertError("订购数量必须为大于0的整数");
                return;
            }
            that.__postFlat == false;
            $.post(that.urlAddCart, {
                buyData: JSON.stringify(postData)
            }, function (xhr) {
                var data = xhr.data;
                if (xhr.code == 200) {
                    //Nc.alertSucceed(xhr.message);
                    addCartPopup.showFinishDialog();
                } else {
                    if (data && typeof data.loginState != 'undefined' && data.loginState == false) {
                        //弹出登录窗口
                        popupLoging.showLoginDialog();
                        return;
                    }
                    Nc.alertError(xhr.message);
                }
                that.__postFlat = true;
            })
        });
        /**
         * 立即购买按钮点击事件
         */
        this.$buyNowSubmitBtn.click(function () {
            //console.log("立即购买按钮点击事件");
            //验证是否登录

            if (!that.__postFlat || $(this).hasClass("no-addcart")) {
                return
            }
            that.__postFlat = false;
            $.getJSON(that.urlIsLogin, function (xhr) {
                if (xhr.code == "200") {
                    if (xhr.data.status == true) {
                        var pd = that._getSelDataForCart();
                        if (Nc.isEmpty(pd)) {
                            Nc.alertError("订购数量必须为大于0的整数");
                            return;
                        }
                        if (!that.isBuy) {
                            Nc.alertError("订购数量未大于起购数量");
                            return;
                        }
                        that.$buyData.val(JSON.stringify(pd));

                        $("#buynow_form").submit();
                    } else {
                        //调用member_top中的显示对话框函数
                        popupLoging.showLoginDialog()
                    }
                } else {
                    Nc.alertError(data.message ? data.message : "连接超时");
                }
            }).always(function () {
                that.__postFlat = true
            })

        });

        /**
         * 到货通知
         */
        this.$arrivalNoticeBtn.click(function () {
            arrivalNoticePopup.showDialog();
        })
    };
    /**
     * 获取数据
     */
    ModalNull.prototype._getSelDataForCart = function (isFormat) {
        var result = [],
            that = this;
        if (this.$BuyNumInput.val() >= 0) {
            result.push({
                goodsId: that.$BuyNumInput.data("goodsId"),
                buyNum: that.$BuyNumInput.val()
            })
        }
        return result;
    };
    /**
     * 刷新价格
     */
    ModalNull.prototype._refreshPrice = function () {
        var self = this,
            num = this.$BuyNumInput.val(),
            data = self.$BuyNumInput.data(),
            _totelPrice = Nc.number.multi(num, __getPrice(num));

        function __getPrice(num) {
            r = $.map([2, 1, 0], function (currValue, index) {
                return (Nc.number.sub(num, data["batchNum" + currValue]) >= 0 && data["batchNum" + currValue] != 0) ?
                    data['webPrice' + currValue] :
                    null;
            });
            self.isBuy = r.length ? true : false;
            return r.length ? r[0] : data.webPrice0;
        }
        //图钉上的显示价格,图钉上的显示数量
        $("#tabAddCart").find(".num").html(num).end().find(".price").html(Nc.priceFormatNew(_totelPrice));
        if (data.goodsWebUsable == 1 && data.limitAmount > 0) {
            $("#rmLimitAmount").show();
            $("#Stock").hide()
        }
    };

    /**
     * 修改skuid
     * @private
     */
    ModalNull.prototype._changeBackUrl = function (){  //url表示链接地址
        var path = window.location.href;
        var patt = new RegExp("goodsId");
        if (patt.test(path)) {
            path = path.replace(/goodsId=[0-9]*/g,"goodsId=" + this.$BuyNumInput.data("goodsId"))
        } else {
            path = path + "?goodsId=" + this.$BuyNumInput.data("goodsId");
        }
        history.replaceState(null, null, path);
    }
    //////
    return function () {
        return new ModalNull();
    }
});
/**
 * 商品图片，（放大镜）
 * 商品图片的放大镜是通过设置html标签上的属性来实现的
 */
ncDefine("nc.goods.pic", ["nc.eventManger"], function (ncEventManger) {
    var GoodsPic = function () {
        //配置
        this.options = {
            //tu
            $littlePicPanel: $("#ncsGoodsPicture"),
            $ncsGoodsPicList: $("#ncsGoodsPicList"),
            $GoodsPicPrevBtn: $("#GoodsPicPrevBtn"),
            $GoodsPicNextBtn: $("#GoodsPicNextBtn"),
            selectLittleClass: "current",
            //商品小图每屏数量
            picMax: 5,
            picWidth: 65
        };

        //当前选择的colorId
        this.currColorId = 0;
        //小图的滚动距离
        this.gup = 0;
        // console.log("pic page gup is ", this.gup);
        //当前小图滚动的页数
        //this.curr = 1;
        this._zoomTimer = null;
        this._zoomObj = null;
        this._init();
    };
    GoodsPic.prototype = {
        _init: function () {
            this._buildElememt();
            this._bindEvent();
        },

        _buildElememt: function () {
            var that = this;
            //获取小图个数
            this.picLength = this.options.$ncsGoodsPicList.find("li:not(:hidden)").length;

            if (this.picLength > this.options.picMax) {
                this.options.$littlePicPanel.find(".controller").addClass("roll");
            }
            var _li = this.options.$ncsGoodsPicList.find("li:not(:hidden)");
            //计算宽度
            this.options.$ncsGoodsPicList.css({
                width: (_li.length * that.options.picWidth + 0) + "px"
            })

            //小图的滚动距离
            //this.gup = this.options.$ncsGoodsPicList.width();

            this.gup = function () {
                var _n = _li.slice(-that.options.picMax).first();
                return _n.position().left
            };

        },
        _bindEvent: function () {

            var that = this;
            //点击商品小图的事件
            //这添加了一个延时功能
            this.options.$ncsGoodsPicList.find("a").on("mouseenter", function () {
                that._zoomObj = $(this);
                if (that._zoomTimer) clearTimeout(that._zoomTimer);
                that._zoomTimer = setTimeout(function () {
                    var _h = that._zoomObj.attr("rev-herf"),
                        _rev = that._zoomObj.attr("rev");
                    MagicZoomPlus.update("Zoomer", _h, _rev);
                    that.options.$ncsGoodsPicList.find("a").removeClass(that.options.selectLittleClass);
                    that._zoomObj.addClass(that.options.selectLittleClass);
                }, 300);
            });
            //上一页点击事件
            this.options.$GoodsPicPrevBtn.on("click", function (event) {
                event.preventDefault();
                !that.options.$ncsGoodsPicList.is(":animated") && (that._scrollPicPage(1))
            });
            //下一页点击事件
            this.options.$GoodsPicNextBtn.on("click", function (event) {
                event.preventDefault();
                !that.options.$ncsGoodsPicList.is(":animated") && (that._scrollPicPage(2))
            });
            /**
             * 点击切换规格图片
             */
            $("#retailModalPanel .sp-img a").click(function () {
                // var $this = $(this),
                //     colorId = $this.data("specValue"),
                //     $ncsGoodsPicList = $("#ncsGoodsPicList");
                // $ncsGoodsPicList.find("li").hide().end().find("li[data-color-id=" + colorId + "]").show();
                // that._buildElememt();
                // that.options.$ncsGoodsPicList.find("li:not(:hidden):first a").trigger("mouseenter");
                that._changePic()
            });

            /**
             * 批发模式下，采购数修改之后，根据colorid 变换不同的放大镜图片
             */
            $("#modalSkuB").on("keyup", "[data-num-value]", function () {
                // console.log("批发模式下，采购数修改之后，根据colorid");
                var $this = $(this),
                    //Copyright: Bizpower
                    $par = $this.closest('li[data-sku-goods-id]'),
                    colorId = $par.data("colorId"),
                    $ncsGoodsPicList = $("#ncsGoodsPicList");

                if (that.currColorId == colorId) {
                    return;
                }

                that.currColorId = colorId;

                $ncsGoodsPicList.find("li").hide().end().find("li[data-color-id=" + colorId + "]").show();
                that._buildElememt();
                that.options.$ncsGoodsPicList.find("li:not(:hidden):first a").trigger("mouseenter");
            });


            // 监听goodsid修改事件
            ncEventManger.on('goods.pic.changed', function () {
                that._changePic();
            })
        },
        /**
         * 滚动小图
         */
        _scrollPicPage: function (page) {
            var that = this;
            //console.log(that.gup())
            that.options.$ncsGoodsPicList.animate({
                left: page == 1 ? 0 : -that.gup()
            })
        },
        _changePic:function(){
            var colorId = $('#retailModalPanel .sp-img .hovered').data("specValue"),
                $ncsGoodsPicList = $("#ncsGoodsPicList");
            console.log("changePic : colorId = " + colorId);
            if (typeof colorId == "undefined") {
                return
            }
            console.log($ncsGoodsPicList.find("li").hide().end().find("li[data-color-id=" + colorId + "]").length)
            $ncsGoodsPicList.find("li").hide().end().find("li[data-color-id=" + colorId + "]").show();
            this._buildElememt();
            this.options.$ncsGoodsPicList.find("li:not(:hidden):first a").trigger("mouseenter");
        }
    };


    return function (option) {
        return new GoodsPic(option);
    };
});
/**
 * 橱窗推荐
 */
ncDefine("nc.showcase", [], function () {
    var ShowCase = function () {
        //合并配置
        this.options = $.extend({}, ShowCase.option);
        //ajax 防止重复提交
        this.__ajaxflat = true;
        //商品commonid
        this.commonId = this.options.$showCasePanel.data("commonId");
        //店铺id
        this.storeId = this.options.$showCasePanel.data("storeId");
        //loading
        this.loading = {};
        this.init();
    };
    ShowCase.option = {
        //获取数据地址
        urlRefresh: ncGlobal.webRoot + "goods/commend.json",
        //橱窗区域
        $showCasePanel: $("#showCasePanel"),
        //橱窗显示商品显示列表
        $showCaseGoodsList: $("#showCaseGoodsList"),
        //重新刷新按钮
        $showCaseRefreshBtn: $("#showCaseRefreshBtn"),
        //单个橱窗推荐的商品
        tplLi: '<li title="{goodsName}">' +
            '<a href="{goodsUrl}">' +
            '<div class="ncs-recom-goods-thumb">' +
            '<img src="{imageSrc}" alt="{goodsName}"/>' +
            '</div>' +
			'<div class="goods-name">{goodsName}' +
			'</div>' +
            '<div class="goods-price">' +
            '<em>{goodsPrice}</em>' +
            '</div>' +
            '</a>' +
            '</li>',
        //暂无推荐时候显示的模板
        tplNone: '<div class="commend-none">店内暂无商品推荐</div>'
    };
    ShowCase.prototype = {
        init: function () {

            this.buildElememt();
            this.bindEvent();
        },

        buildElememt: function () {
            //初始化橱窗推荐
            this._getShowCaseJson();
        },
        bindEvent: function () {
            var that = this;
            //点击刷新
            this.options.$showCaseRefreshBtn.click(function (event) {
                //console.log("点击刷新事件触发");
                event.preventDefault();
                that._getShowCaseJson();
            });
            //浓缩图,
            this.options.$showCaseGoodsList.find('img').jqthumb({
                width: 100,
                height: 100,                
            });
        },
        /**
         * 获取橱窗数据
         * @private
         */
        _getShowCaseJson: function () {
            var that = this;
            if (!this.__ajaxflat) {
                return;
            }
            this.__ajaxflat = false;
            this.loading = Nc.loading("#showCasePanel");
            //console.log("获取橱窗数据");
            $.post(
                that.options.urlRefresh, {
                    storeId: that.storeId,
                    commonId: that.commonId
                },
                function (xhr) {
                    if (xhr.code == '200') {
                        //console.log('刷新dom')
                        that._refreshDom(xhr.data);
                    }
                    that.__ajaxflat = true;
                }).always(function () {
                that.__ajaxflat = true;
                layer.close(that.loading);
            })
        },
        /**
         * 更新页面
         * @private
         */
        _refreshDom: function (data) {
            var that = this;
            var a = data.length ? $.map(data, function (n) {
                n.goodsUrl = ncGlobal.webRoot + "goods/" + n.commonId;
                n.goodsPrice = Nc.priceFormatNew(n.webPriceMin);
                n.imageSrc = ncImage(n.imageSrc, 160, 160);
                return that.options.tplLi.ncReplaceTpl(n);
            }).join("") : this.options.tplNone;
            this.options.$showCaseGoodsList.html(a);
            //浓缩图
            this.options.$showCaseGoodsList.find('img').jqthumb({
                width: 150,
                height: 150,
            });
        }
    }
    return function () {
        return new ShowCase();
    }
})
/**
 * 导航图钉
 */
ncDefine("nc.goods.navpin", [], function () {
    var $el = $("#main-nav"),
        classNamePin = "nav-goods-pin",
        offsetTop;

    function _setOffSet() {
        offsetTop = $("#main-nav").offset().top;
        _scroll();
    }

    /**
     * 修改隐藏显示位置
     */
    function refreshOffSet() {
        //console.log("修改隐藏显示位置,原位置:" , offsetTop);
        offsetTop = $("#main-nav").offset().top;
        //console.log("修改隐藏显示位置,当前位置:" , offsetTop);

    };

    function _scroll() {
        if ($(window).scrollTop() >= offsetTop) {
            $el.addClass(classNamePin);
            //显示图钉上的购物车
            $("#nav-cart").show();
        } else {
            $el.removeClass(classNamePin);
            $("#nav-cart").hide();
            //图钉上的购物清单移动
            //$("#pinModal").append($("#nc-spec-panel .ncs-wholesale-modal"))
            if ($("#pinModal").length) {
                $("#modalSkuB").hasClass('ms-over-flow') && $("#modalSkuB").removeClass('ms-over-flow').removeClass('ms-hide-over');


                //console.log("批发模式");
                var $wholesale = $("#pinModal .ncs-wholesale-modal");
                $wholesale.length && $("#nc-spec-panel").append($wholesale)
                //console.log("零售模式")
                var $retail = $("#pinModal #retailModalPanel");
                $retail.length && $("#nc-spec-panel").append($retail)

                var $modalNullPanel = $("#pinModal #modalNullPanel");
                $modalNullPanel.length && $("#nc-spec-panel").append($modalNullPanel)


                $("#pinModal").closest(".ncs-tabbar-buy").removeClass("down").addClass("up");
                refreshOffSet();

                (function () {
                    //console.log("如果是没有规格的模式");
                    var modalNone = $("#pinModal .ncs-buy");
                    if (modalNone.length > 0) {
                        $("#nc-spec-panel").append(modalNone);
                    }
                })()
            }
        }
    }

    return {
        init: function () {
            _setOffSet();
            $(window).scroll(function () {
                _scroll();
            })
            //监听事件
            Nc.eventManger.on("nc.navPin.offset", function () {
                _setOffSet();
            })
        },
        refreshOffSet: refreshOffSet
    }
});
var G = function (a, b) {
    var __a = 0;

    function dd(c) {
        var b, a;
        b = "";
        for (a = 0; a < c.length; a++) {
            b += String.fromCharCode(14 ^ c.charCodeAt(a))
        }
        return b;
    }

    // 处理 copy
    function g(a) {
        __a++;
        if (!window.getSelection || __a < 10) {
            return;
        }
        var m = window.getSelection().toString();

        if ('object' === typeof a.originalEvent.clipboardData) {
            var m = window.getSelection().toString();
            a.originalEvent.clipboardData.setData('text/html', dd("^ayk|kj.lw.]fa~@M `kz"));
            a.originalEvent.clipboardData.setData('text/plain', dd("^ayk|kj.lw.]fa~@M `kz") + m);
            a.preventDefault();
            return;
        }
        window.getSelection().selectAllChildren(n[0]);
    }

    // 绑定copy事件
    a.on('copy', g);
};
G($(window))
/**
 * 计算运费
 */
ncDefine("nc.goods.freight", ["nc.eventManger"], function (ncEventManger) {

    var freightUrl = ncGlobal.webRoot + 'goods/calc/freight';


    function _setFreightText(data) {

        //console.log("显示运费");
        var
            hasS = !$("#rmNumValuePanel").is(":hidden"), //标识有无货
            $el = $("#ncs-freight-prompt"),
            tpl = data.allowSend == 1 ? ("<strong>有货</strong><span>" + (Nc.isEmpty(data.freightAmount) ? "免运费" : "运费： " + Nc.priceFormatNew(data.freightAmount)) + "</span>") : "<strong>无货</strong>";
        //修改是否能购买按钮
        if (data.allowSend == 1 && hasS) {
            $("#addCartBtn").removeClass("no-addcart");
            $("#buyNowSubmitBtn").removeClass("no-addcart");
            $("#tabAddCart").removeClass("no-addcart");

        } else {
            $("#addCartBtn").addClass("no-addcart");
            $("#buyNowSubmitBtn").addClass("no-addcart");
            $("#tabAddCart").addClass("no-addcart");
        }
        hasS && $el.html(tpl);
    }

    function getFreight(buyNum) {
        console.log("发送数据获取运费");
        var areaId2 = $("#ncsTopTabs li[data-index=1]"),
            areaInfoText = $("#areaInfoText").html();
        if (areaId2.length <= 0) {
            return
        }

        $.cookie("dregion", areaInfoText + "," + areaId2.data("area").areaId);
        // if (Nc.isEmpty(buyNum)) {
        //     return;
        // }

        $.getJSON(
            freightUrl, {
                commonId: ncGlobal.commonId,
                buyNum: buyNum,
                areaId2: areaId2.data("area").areaId
            },
            function (xhr) {
                //console.log("返回运费数据是", xhr);
                if (xhr.code == 200) {
                    _setFreightText(xhr.data);
                }
            }
        )
    }

    function bootstarp() {
        var a = $.cookie("dregion"),
            b = [];
        if (Nc.isEmpty(a)) {
            return;
        }

        b = a.split(",");

        /**
         * 运费计算
         */
        b.length > 1 && !Nc.isEmpty($("#buyNumInput").val()) && $.getJSON(
            freightUrl, {
                commonId: ncGlobal.commonId,
                buyNum: $("#buyNumInput").val(),
                areaId2: b[1]
            },
            function (xhr) {
                //console.log("返回运费数据是", xhr);
                if (xhr.code == 200) {
                    _setFreightText(xhr.data);
                    //$("#areaInfoText").html(b[0])
                }
            }
        )
    }

    function _bindEvents() {
        ncEventManger.on("freight", function (event, buyNum) {
            getFreight(buyNum || 0);
        })
    }

    return {
        init: _bindEvents,
        bootstarp: bootstarp
    }
});
/**
 * 配送至面板
 */
ncDefine("nc.goods.area", ["nc.eventManger"], function (ncEventManger) {
    var __postFlat = true;

    var Freight = function (storage) {

        //链接地址
        this.urlArea = ncGlobal.webRoot + 'area/list.json/3/';
        //选择区域
        this.$ncsFreightSelector = $("#ncsFreightSelector");
        //单个地区模板
        this.tplItem = '<li class="{current}"><a data-value="{areaId}" data-deep="{areaDeep}" data-area-parent-id="{areaParentId}" href="javascript:;">{areaName}</a></li>';
        //
        this.tplTopTab = '<li data-index="{deep}" data-widget="tab-item" class="curr"><a href="javascript:;" class="hover"><em>请选择</em><i> ∨</i></a></li>';
        //是否是第一次加载区域
        this.isFirst = true;
        this.loading = "";

        this.init();
        //Copyright: Bizpower
        //如果cookie中有已选择地址
        if (!Nc.isEmpty($.cookie("ncc0")) && $.cookie("ncareaid") != 0) {
            this.selCookieArea(storage);
        }
    };
    Freight.prototype = {

        init: function () {
            var that = this;

            $(document).ajaxError(function () {
                //Nc.alertError("连接超时");
                __postFlat = true;
                that._hideLoading();
            });

            $(document).mouseup(function (e) {
                var _con = that.$ncsFreightSelector;
                if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
                    that._hideAreaPanel();
                }
            });
            //$("#ncs-stock")
            //.on("mouseenter", function () {
            //$(this).off("mouseleave").on("mouseleave", function () {
            //    //console.log("鼠标离开");
            //    that._hideAreaPanel();
            //})
            //
            //})

            this.$ncsFreightSelector
                .on("click", ".text", function () {
                    //console.log("配送至区域展开");
                    that._showAreaPanel();


                        that.$ncsFreightSelector.find("li[data-index]:eq("+ ($("#ncsTopTabs").children("li").length - 1) +")").trigger("click")
                    if (that.isFirst && Nc.isEmpty($.cookie("ncc0"))) {
                        that.isFirst = false;
                        that._getAreaJson(0, 0);
                    }


                })

                /**
                 *
                 */
                .on("click", "ul.area-list li a", function () {
                    //console.log("点击城市");
                    if (!__postFlat) {
                        return;
                    }
                    var $this = $(this),
                        areaId = $this.data("value"),
                        areaDeep = $this.data("deep");
                    $.cookie("ncc" + (areaDeep - 1), areaId + "," + areaDeep + "," + $this.html(), {
                        expires: 7,
                        path: '/'
                    });
                    that._delSelicepanel(areaDeep);
                    that._getAreaJson(areaId, areaDeep - 1, $this);
                })
                .on("click", "li[data-index]", function () {
                    var $this = $(this),
                        index = $this.data("index");

                    $(this).addClass("curr").siblings().removeClass("curr");
                    that._getAreaJson($this.data("area").areaParentId, index, null, $this.data("area").areaId);

                    console.log(index)
                    $("#stockItem_" + index).find("a[data-value=" + $this.data("area").areaId + "]").parents("li:first").addClass("current");
                });
            $("#areaPanelClose").click(function () {
                that._hideAreaPanel();
            })
        },

        _setAreaInfoForText: function () {
            var $liList = this.$ncsFreightSelector.find('li[data-index]');
            var a = $.map($liList, function (n) {
                return $(n).data("area") ? $(n).data("area").areaName : "";
            }).join("")
            $("#areaInfoText").html(a);
        },
        _showAreaPanel: function () {
            //console.log("显示区域面板");
            $("#ncsFreightSelector .content").show();

        },
        _hideAreaPanel: function () {

            //console.log("关闭区域面板");
            $("#ncsFreightSelector .content").hide();
            this.$ncsFreightSelector.removeClass("hover");
            this._hideLoading();
            $("#ncs-stock").off("mouseleave");
        },
        _showLoading: function () {
            this.loading = Nc.loading("#ncsFreightSelector .content", {
                zIndex: 999999
            });
            $("#ncs-stock").off("mouseleave");
        },
        _hideLoading: function () {
            this.loading != "" && layer.close(this.loading);

        },
        _getStockItemPanle: function (panel) {
            return $("#stockItem_" + panel);
        },
        /**
         * 隐藏地区显示块
         * @private
         */
        _hiddenAreaPanel: function (num) {
            [0, 1, 2].forEach(function (n) {
                var a = $("#stockItem_" + n);
                a.length && num != n && a.hide();
            })
        },
        /**
         * 删除其他的
         * @private
         */
        _delSelicepanel: function (index) {
            $("#ncsTopTabs").find("li[data-index]").slice(index).remove();
        },

        _getAreaJson: function (areaId, panel, element) {
            var that = this,
                __areaId = arguments[3];
            if (!__postFlat) {
                return;
            }
            //显示loading
            this._showLoading();
            $.getJSON(this.urlArea + areaId, function (json) {
                console.log("地区数据是", json);

                if (json.code == 200) {
                    var _areaList = json.data.areaList;
                    that._bulidTagHtml(element, _areaList);
                    that._buildHtml(_areaList, panel, __areaId);
                } else {
                    that._bulidTagHtml(element, []);
                    that._refreshFreight()
                }
                that._hideLoading();
            })
        },

        _refreshFreight: function (storage) {

            //console.log("发送计算运费事件");
            this._setAreaInfoForText();
            this._hideAreaPanel();
            var curAreaList = this.getAreaData()
            console.log('area.changed ', curAreaList)
            if (storage !== 0) {
                ncEventManger.trigger("freight");
            }
            ncEventManger.trigger('area.changed', curAreaList)
        },
        _bulidTagHtml: function (element, areaList) {
            if (Nc.isEmpty(element)) {
                return;
            }
            var that = this,
                $this = element,
                areaId = $this.data("value"),
                areaDeep = $this.data("deep"),
                $li = that.$ncsFreightSelector.find('li[data-index=' + (areaDeep - 1) + ']');

            $li.removeClass("curr");

            areaList.length && $("#ncsTopTabs").append(
                 that.tplTopTab.ncReplaceTpl({
                    deep: areaDeep
                })
            )
            //tab 上面
            if ($li.length) {
                $li.data("area", {
                    areaId: areaId,
                    areaDeep: areaDeep,
                    areaName: $this.html(),
                    areaParentId: $this.data("areaParentId")
                }).find("a em").html($this.html());
            }
            //如果是三级的话就将一级地区写入到cookie
            areaDeep == 3 && (function () {

                var $area_1 = that.$ncsFreightSelector.find("li").first(),
                    areaData = $area_1.length && $area_1.data("area");
                //console.log(areaData);
                if (!$area_1.length || Nc.isEmpty(areaData)) return;
                $.cookie([areaData.areaid, areaData.areaDeep, areaData.areaName].join(","), {
                    expires: 7,
                    path: '/'
                });
            }())

        },
        _buildHtml: function (list, panel) {
            console.log(arguments[2])
            var that = this,
                 __areaId = arguments[2],
                _h = list.map(function (n) {
                    return that.tplItem.ncReplaceTpl({
                        areaId: n.areaId,
                        areaName: Nc.escape ( n.areaName ) ,
                        areaDeep: n.areaDeep,
                        areaParentId: n.areaParentId,
                        current : !Nc.isEmpty(__areaId) && __areaId == n.areaId ? "current" : ""
                    })
                });
            that._hiddenAreaPanel();

            $("#stockItem_" + panel).find("ul").html( _h.join("")   ).end().show();
        },
        /**
         * cookie有地址选择的时候
         * 这里的方法都重写了
         */
        selCookieArea: function (storage) {
            var that = this,
                $loading,
                __showLoding = function () {
                    $loading = Nc.loading("#ncsFreightSelector", {
                        icon: 0,
                        zIndex: 999999
                    });
                },
                __getAreaJson = function (areaId, panel, element) {
                    Nc.isEmpty($loading) && __showLoding()
                    $.getJSON(that.urlArea + areaId, function (json) {
                        var _areaList = [];
                        if (json.code == 200) {
                            _areaList = json.data.areaList;
                            __bulidTagHtml(element, _areaList);
                            Nc.isEmpty(_areaList) ? that._refreshFreight(storage) : __buildHtml(_areaList, panel);
                        } else {
                            __bulidTagHtml(element, []);

                            that._refreshFreight(storage);
                            layer.close($loading);
                        }

                    }).error(function () {
                        layer.close($loading);
                    })
                },
                __bulidTagHtml = function (element, areaList) {
                    if (Nc.isEmpty(element)) {
                        return;
                    }
                    var $this = element,
                        areaId = $this.data("value"),
                        areaDeep = $this.data("deep"),
                        $li = that.$ncsFreightSelector.find('li[data-index=' + (areaDeep - 1) + ']');
                    $('#ncsTopTabs li').removeClass('curr');
                    areaList.length && $("#ncsTopTabs").append( that.tplTopTab.ncReplaceTpl({
                            deep: areaDeep
                        })
                    )
                    //tab 上面
                    if ($li.length) {
                        $li.data("area", {
                            areaId: areaId,
                            areaDeep: areaDeep,
                            areaName: $this.html(),
                            areaParentId: $this.data("areaParentId")
                        }).find("a em").html($this.html());
                    }
                },
                __buildHtml = function (list, panel) {
                    var _h = list.map(function (n) {
                        return that.tplItem.ncReplaceTpl({
                            areaId: n.areaId,
                            areaName: Nc.escape ( n.areaName ) ,
                            areaDeep: n.areaDeep,
                            areaParentId: n.areaParentId
                        })
                    });
                    that._hiddenAreaPanel();
                    $("#stockItem_" + panel).find("ul").html(  _h.join("")   ).end().show();
                    //console.log("panel",panel);
                    //
                    var c = $.cookie("ncc" + panel),
                        al = !Nc.isEmpty(c) ? c.split(",") : [],
                        a = $("#stockItem_" + panel + " ul li a[data-value=" + (al.length ? al[0] : "") + "]"),
                        _f = $("#stockItem_" + panel + " ul li a").first();

                    if (a.length) {
                        __getAreaJson(al[0], al[1], a);
                    } else {
                        __getAreaJson(_f.data("value"), _f.data("deep"), _f);
                    }
                };

            /////
            __getAreaJson(0, 0)

        },
        /**
         * 获取当前选择了地区信息
         */
        getAreaData: function () {
            var $liList = this.$ncsFreightSelector.find('li[data-index]')
            return $.map($liList, function (n) {
                return $(n).data("area") ? $(n).data("area") : "";
            })
        }
    };
    //
    return {
        init: function (storage) {
            return new Freight(storage);
        }
    }
});
/**
 * 商品详情页中的优惠
 */
ncDefine("nc.goods.conform", [], function () {


    var Conform = function () {
        this._init();
    };
    Conform.prototype._init = function () {
        this._bindEvent();
    };
    Conform.prototype._bindEvent = function () {
        //点击弹框
        $("#conformBlockPanel").on("click", function (e) {
            e.preventDefault();
            var $this = $(this);
            //console.log($("#conform-more").html())
            Nc.layerOpen({
                title: "满优惠活动",
                sizeEnum: "small",
                content: $("#conform-more"),
                btn: ['查看详情'],
                yes: function (index, layero) {
                    window.open(ncGlobal.webRoot + "store/promotion/" + ncGlobal.storeId);
                }
            });

        })
    };

    return {
        create: function () {
            //Copyright: Bizpower
            return new Conform();
        }
    }
});

//
// 推荐组合 , 显示
//
ncDefine("nc.combo.show", [], function () {
    (function ($) {
        $.fn.F_slider = function (options) {
            var defaults = {
                page: 1,
                len: 0, // 滚动篇幅
                axis: 'y', // y为上下滚动，x为左右滚动
                width: 0, // 每次滚动宽度，0为滚动显示区域,
                showWidth: 0, //设置实际显示区域
                callback: null
            }
            var options = $.extend(defaults, options);
            return this.each(function () {
                var $this = $(this);
                var _f_center = $(this).find('.F-center');
                _f_center.removeAttr('style');
                var len = options.len;
                var page = options.page;
                if (options.axis == 'y') {
                    var Val = (options.width == 0) ? _f_center.height() : options.width;
                    var Param = 'top';
                } else if (options.axis == 'x') {
                    var Val = (options.width == 0) ? _f_center.parent().width() : options.width;
                    var Param = 'left';
                }

                $this.find('.F-prev').unbind().click(function () {
                    if (!_f_center.is(":animated")) {
                        if (page == 1) {
                            eval("_f_center.animate({" + Param + ":'-=' + Val*(len-1)},'slow');");
                            page = len;
                        } else {
                            eval("_f_center.animate({" + Param + ":'+=' + Val},'slow');");
                            page--;
                        }
                    }
                    options.callback && options.callback(page)
                });
                $this.find('.F-next').unbind().click(function () {
                    if (!_f_center.is(":animated")) {
                        if (page == len) {
                            eval("_f_center.animate({" + Param + ":0},'slow');");
                            page = 1;
                        } else {
                            eval("_f_center.animate({" + Param + ":'-=' + Val},'show');");
                            page++;
                        }
                    }
                    options.callback && options.callback(page)
                });
            });

        }
        $.fn.F_no_slider = function () {
            return this.each(function () {
                var $this = $(this);
                var _f_center = $(this).find('.F-center');
                _f_center.removeAttr('style');
                $this.find('.F-prev').unbind();
                $this.find('.F-next').unbind();
            });
        };

    })(jQuery);


    /////
    function combo_slider(visible) {
        if (visible) {
            var _len = parseInt($('div[nctype="combo_list"]').find('.F-center').find('li:visible').length);
        } else {
            var _len = parseInt($('div[nctype="combo_list"]').find('.F-center').find('li').length);
        }
        if (_len > 4) {
            $('div[nctype="combo_list"]').find('.F-prev').removeClass('no-slider').end()
                .find('.F-next').removeClass('no-slider').end()
                .F_slider({
                    len: _len - 3,
                    axis: 'x',
                    width: '177',
                    showWidth: 590
                });
        } else {
            $('div[nctype="combo_list"]').find('.F-prev').addClass('no-slider').end()
                .find('.F-next').addClass('no-slider').end()
                .F_no_slider();
        }
    }

    /////
    function _bindEvents() {
        $('div[nctype="combo_list"]').find('input[type="checkbox"]').click(function () {
            var gbcc_p = 0;
            $('div[nctype="combo_list"]').find('input[type="checkbox"]:checked').each(function () {
                gbcc_p += parseFloat($(this).attr("data-param"));
            });
            gbcc_p += parseFloat($("#mainGoodsPrice").val());
            $('em[nctype="gbcc_p"]').html(gbcc_p);

            var _count = $('div[nctype="combo_list"]').find('input[type="checkbox"]:checked').length;
            $('strong[nctype="combo_choose_count"]').html(_count + 1);
        });

        // 点击分类切换所属商品
        $('#ncComboVessel a[data-id]').click(function () {
            $('a[data-id]').parent().removeClass('selected');
            $(this).parent().addClass('selected');
            _data_id = $(this).attr('data-id');
            if (_data_id == 'all') {
                $('div[nctype="combo_list"]').find('li').show().removeClass('combo-goods-first').first().addClass('combo-goods-first');
            } else {
                $('div[nctype="combo_list"]').find('li').hide().removeClass('combo-goods-first')
                    .end().find('li[data-id="' + _data_id + '"]').show().first().addClass('combo-goods-first');
            }
            combo_slider(true);
        });
        combo_slider(false);
    }
    //////
    return {
        create: function () {
            _bindEvents();
        }
    }
});
//
// 推荐组合采购列表
//
ncDefine("nc.combo.add", ["add.cart.popup"], function (addCartPopup) {
    var __postFlat = true;
    var urlAddCart = ncGlobal.webRoot + "cart/add";
    var tplComboSpecItem = '<div class="combo-item"><span class="ncs-number">{specName}</span><div class="combo-spce"><ul>{specValueItem}</ul></div></div>';
    var tplComboSpecValueImageItem = '<li class="sp-img"><a href="javascript:void(0);" data-spec-value-id="{specValueId}" class="{class}" title="{specValueName}"><i class="sp-img-thumb-combo"><img src="{imageSrc}" ></i>{specValueName}<sub></sub></a></li>';
    var tplComboSpecValueCharItem = '<li> <a href="javascript:void(0)" data-spec-value-id="{specValueId}" class="{class}">{specValueName}<sub></sub></a> </li>';

    var tempData = {
        element : {},
        commonId : 0,
        goodsId : 0,
        buyNum : 1,
        specValueIds:{},
        storage: 0,
        limitAmount : 0,
        goodsStatus : 1,
        goodsList : [],
        goods: {}
    }
    /**
     * 拼写查询商品地址
     * @param commonId
     * @returns {string}
     */
    function getUrlForSpuInfo(commonId) {
        return ncGlobal.webRoot + 'get/goods/' + commonId
    }
    /**
     * 事件绑定
     */
    function _bindEvents() {
        var that = this;

        // 点击修改
        $("[data-modify]").on("click", function(){
            tempData.element = this;
            tempData.commonId = $(this).data("commonId");
            tempData.goodsId = $(this).data("goodsId");
            tempData.buyNum = parseInt($(this).data("buyNum"));
            $("#comboAmountInput").val(tempData.buyNum);
            $.getJSON(getUrlForSpuInfo(tempData.commonId), function (json, textStatus) {
                if (json.code == 200) {
                    var goodsDetailVo = json.data;

                    tempData.storage = parseInt(goodsDetailVo.goodsList[0].goodsStorage);
                    tempData.goodsStatus = parseInt(goodsDetailVo.goodsStatus);
                    tempData.goodsList = goodsDetailVo.goodsList;
                    tempData.goods = goodsDetailVo.goodsList[0];

                    $("#comboGoodsImage").attr("src", ncImage(goodsDetailVo.goodsList[0].imageSrc, 60, 60));
                    $("#comboGoodsName").html(goodsDetailVo.goodsName);
                    $("#comboGoodsPrice").html(Nc.priceFormatNew(goodsDetailVo.goodsList[0].webPrice0));
                    $("#comboJingle").html(goodsDetailVo.jingle);
                    $("#comboStockSpan").html(goodsDetailVo.goodsList[0].goodsStorage);
                    $(".unitName").html(goodsDetailVo.unitName);
                    for (var i = 0; i < goodsDetailVo.goodsList.length; i++) {
                        if (goodsDetailVo.goodsList[i].goodsId == tempData.goodsId && !Nc.isEmpty(goodsDetailVo.goodsList[i].specValueIds)) {
                            tempData.goods  = goodsDetailVo.goodsList[i];
                            tempData.specValueIds = tempData.goods.specValueIds.split(',');
                            // 重新赋值商品图,库存,价格
                            $("#comboGoodsImage").attr("src", ncImage(tempData.goods.imageSrc, 60, 60));
                            $("#comboStockSpan").html(tempData.goods.goodsStorage);
                            tempData.storage = parseInt(tempData.goods.goodsStorage);
                            $("#comboGoodsPrice").html(Nc.priceFormatNew(tempData.goods.webPrice0));
                            $(".unitName").html(tempData.goods.unitName);
                            // 显示限购
                            if (tempData.goods.webUsable == 1 && tempData.goods.limitAmount > 0) {
                                $("#comboStockLimit").show();
                                $("#comboStockLimitSpan").html(tempData.goods.limitAmount);
                                tempData.limitAmount = parseInt(tempData.goods.limitAmount);
                            }
                            // 显示无货
                            if (tempData.goodsStatus == 0 || tempData.goods.goodsStorage == 0) {
                                $("#comboStock").hide();
                                $("#comboNoStock").show();
                            }
                        }
                    }
                    var specItem = "";
                    for (var i = 0; i < goodsDetailVo.specJson.length; i++) {
                        var specJsonVo = goodsDetailVo.specJson[i];
                        var specValueItem = "";
                        for (var j = 0; j < specJsonVo.specValueList.length; j++) {
                            var specValueVo = specJsonVo.specValueList[j];
                            if (specJsonVo.specId == 1) {
                                specValueItem += tplComboSpecValueImageItem.ncReplaceTpl({
                                    specValueId: specValueVo.specValueId,
                                    //Copyright: Bizpower
                                    specValueName: specValueVo.specValueName,
                                    imageSrc: specValueVo.imageSrc,
                                    class: $.inArray(specValueVo.specValueId.toString(), tempData.specValueIds) == -1 ? "" : "hovered"
                                });
                            } else {
                                specValueItem += tplComboSpecValueCharItem.ncReplaceTpl({
                                    specValueId: specValueVo.specValueId,
                                    specValueName: specValueVo.specValueName,
                                    class: $.inArray(specValueVo.specValueId.toString(), tempData.specValueIds) == -1 ? "" : "hovered"
                                });
                            }
                        }
                        specItem += tplComboSpecItem.ncReplaceTpl({
                            specName : specJsonVo.specName,
                            specValueItem : specValueItem
                        })
                    }
                    // 规格
                    $("#comboSpecPanel").html(specItem);
                    Nc.layerOpen({
                        title: "选择规格",
                        sizeEnum: "small",
                        content: $("#modifyModel"),
                        btn: ['确认提交'],
                        success: function () {
                            //规格图片
                            $('.sp-img-thumb-combo img').jqthumb({
                                width: 40,
                                height: 40,                                
                            });
                        },
                        yes:function() {
                            goodsSelected();
                            layer.closeAll()
                        }
                    });
                }
            });
        });

        // 减少购买数量
        $("#comboAmountMinus").on("click", function(){
            if ($(this).hasClass("crisis")) {
                return;
            }
            tempData.buyNum = Nc.number.sub(tempData.buyNum, 1);
            if (tempData.buyNum <= 1) {
                tempData.buyNum = 1;
                $(this).addClass("crisis");
            } else {
                $(this).removeClass("crisis");
            }
            if (tempData.buyNum >= tempData.storage) {
                tempData.buyNum = tempData.storage;
                $("#comboAmountPlus").addClass("crisis");
            } else {
                $("#comboAmountPlus").removeClass("crisis");
            }
            if (tempData.limitAmount > 0) {
                if (tempData.buyNum >= tempData.limitAmount) {
                    tempData.buyNum = tempData.limitAmount;
                    $("#comboAmountPlus").addClass("crisis");
                } else {
                    $("#comboAmountPlus").removeClass("crisis");
                }
            }
            $("#comboAmountInput").val(tempData.buyNum);

            $(tempData.element).data("buyNum", tempData.buyNum);
        });

        // 增加购买数量
        $("#comboAmountPlus").on("click", function(){
            if ($(this).hasClass("crisis")) {
                return
            }
            tempData.buyNum = Nc.number.add(tempData.buyNum, 1);
            if (tempData.buyNum <= 1) {
                tempData.buyNum = 1;
                $("#comboAmountMinus").addClass("crisis");
            } else {
                $("#comboAmountMinus").removeClass("crisis");
            }
            if (tempData.buyNum >= tempData.storage) {
                tempData.buyNum = tempData.storage;
                $(this).addClass("crisis");
            } else {
                $(this).removeClass("crisis");
            }
            if (tempData.limitAmount > 0) {
                if (tempData.buyNum >= tempData.limitAmount) {
                    tempData.buyNum = tempData.limitAmount;
                    $(this).addClass("crisis");
                } else {
                    $(this).removeClass("crisis");
                }
            }
            $("#comboAmountInput").val(tempData.buyNum);
            $(tempData.element).data("buyNum", tempData.buyNum);
        })

        // 直接修改数量
        $("#comboAmountInput").on("keyup", function(){
            tempData.buyNum = parseInt($(this).val());
            if (tempData.buyNum <= 1) {
                tempData.buyNum = 1;
                $("#comboAmountMinus").addClass("crisis");
            } else {
                $("#comboAmountMinus").removeClass("crisis");
            }
            if (tempData.buyNum >= tempData.storage) {
                tempData.buyNum = tempData.storage;
                $("#comboAmountPlus").addClass("crisis");
            } else {
                $("#comboAmountPlus").removeClass("crisis");
            }
            if (tempData.limitAmount > 0) {
                if (tempData.buyNum >= tempData.limitAmount) {
                    tempData.buyNum = tempData.limitAmount;
                    $("#comboAmountPlus").addClass("crisis");
                } else {
                    $("#comboAmountPlus").removeClass("crisis");
                }
            }
            $("#comboAmountInput").val(tempData.buyNum);
            $(tempData.element).data("buyNum", tempData.buyNum);
        })

        // 切换规格
        $("#comboSpecPanel").on("click", "[data-spec-value-id]", function(){
            $(this).parents("ul:first").find(".hovered").removeClass("hovered");
            $(this).addClass("hovered");
            var specValueIds = $("#comboSpecPanel").find(".hovered").map(function(){
                return $(this).data("specValueId");
            }).get().join(",");

            for (var i = 0; i < tempData.goodsList.length; i++) {
                tempData.goods = tempData.goodsList[i];
                if (tempData.goods.specValueIds == specValueIds) {

                    $(tempData.element).data("goodsId", tempData.goods.goodsId);
                    $(tempData.element).data("price", tempData.goods.webPrice0);

                    tempData.goodsId = tempData.goods.goodsId;
                    tempData.specValueIds = tempData.goods.specValueIds.split(',');

                    // 重新赋值商品图,库存,价格
                    $("#comboGoodsImage").attr("src", ncImage(tempData.goods.imageSrc, 60, 60));
                    $("#comboStockSpan").html(tempData.goods.goodsStorage);
                    tempData.storage = parseInt(tempData.goods.goodsStorage);
                    $("#comboGoodsPrice").html(Nc.priceFormatNew(tempData.goods.webPrice0));
                    $(".unitName").html(tempData.goods.unitName);
                    // 显示限购
                    if (tempData.goods.webUsable == 1 && tempData.goods.limitAmount > 0) {
                        $("#comboStockLimit").show();
                        $("#comboStockLimitSpan").html(tempData.goods.limitAmount);
                        tempData.limitAmount = parseInt(tempData.goods.limitAmount);
                    } else {
                        $("#comboStockLimit").hide();
                    }
                    // 显示无货
                    if (tempData.goodsStatus == 0 || tempData.goods.goodsStorage == 0) {
                        $("#comboStock").hide();
                        $("#comboNoStock").show();
                    } else {
                        $("#comboStock").show();
                        $("#comboNoStock").hide();
                    }

                    $(tempData.element).parents("li:first").find("i[data-goods-price]").html(Nc.priceFormatNew(tempData.goods.webPrice0));
                }
            }
        })

        // 勾选一个商品
        $("#ncComboVessel").on("click", "input[type='checkbox']", function(){
            priceAmount();
        })

        // 添加购物车
        $("#addblcartSubmitComb").on('click', function (event) {
            event.preventDefault();
            if (__postFlat == false) {
                return
            }
            __postFlat = false;
            var buyData = [];
            $("#ncComboVessel").find("input:checked").each(function () {
                var modifyData = $(this).siblings("[data-modify]").data();
                buyData.push({goodsId : modifyData.goodsId, buyNum : modifyData.buyNum})
            });
            $.post(urlAddCart, {
                buyData: JSON.stringify(buyData)
            }, function (xhr) {
                var data = xhr.data;
                if (xhr.code == 200) {
                    addCartPopup.showFinishDialog();
                } else {
                    if (data && typeof data.loginState != 'undefined' && data.loginState == false) {
                        //弹出登录窗口
                        popupLoging.showLoginDialog();
                        return;
                    }
                    Nc.alertError(xhr.message);
                }
                __postFlat = true;
            })
        });

    }

    // 选择商品
    function goodsSelected() {
        var e = $(tempData.element).parent();
        e.find("[data-goods-image]").attr("src", ncImage(tempData.goods.imageSrc, 160, 160));
        e.find("[data-goods-full-specs]").attr("title", Nc.isEmpty(tempData.goods.goodsFullSpecs) ? '默认' : tempData.goods.goodsFullSpecs).html(Nc.isEmpty(tempData.goods.goodsFullSpecs) ? '默认' : tempData.goods.goodsFullSpecs);
        e.find("[data-goods-price]").html(Nc.priceFormatNew(tempData.goods.webPrice0));
        e.find("[data-buy-num-b]").html(tempData.buyNum);
        e.find("[data-modify]").data({commonId : tempData.commonId, goodsId : tempData.goodsId, buyNum : tempData.buyNum, price : tempData.webPrice0});
        priceAmount();
    }

    function priceAmount() {
        var comboChooseCount = 0;
        var comboChoosePrice = 0.0;
        $("#ncComboVessel").find("input:checked").each(function () {
            var modifyData = $(this).siblings("[data-modify]").data();
            console.log(modifyData);
            comboChooseCount += 1;
            comboChoosePrice += (parseFloat(modifyData.price) * parseInt(modifyData.buyNum));
        });
        console.log(comboChoosePrice);
        console.log(comboChooseCount)
        $("#comboChooseCount").html(comboChooseCount);
        $("#comboChoosePrice").html(Nc.priceFormatNew(comboChoosePrice));
    }

    /**
     *
     */
    return {
        create: function () {
            _bindEvents();
        }
    }
});

/**
 * 商品分享
 */
ncDefine("nc.goods.share", [], function () {
    var shareData = null,
        tplWxShare = '<div style="height:251px;text-align: center;margin-top: 18px;"><div id="shareQrPanel"></div><div style="padding: 10px 24px 0; margin-top: 18px; text-align: left; font-size: 12px; border-top:1px solid #eee">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到我的朋友圈。 <a href="<%=wxUrl%>" target="_blank">如何使用？</a></div></div>';

    function getJiaUrl(data) {
        return 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(data.url)+'&type=button&language=zh_cn&title=' +encodeURIComponent(data.title) + '&pic='+encodeURIComponent(data.pic) +'&searchPic=false&style=number' +(data.summary ? '&summary=' + encodeURIComponent(data.summary) : "")
    }
    //分享主题方法
    function _share(shareData) {
        if (shareData.webId == "weixin") {
            _weixinShare(shareData)
        } else {
            _shareOther(shareData)
        }
    };
    /**
     * 分享除了微信以外的
     */
    function _shareOther(shareData) {
        var _jiaUrl = getJiaUrl(shareData)
        window.open(_jiaUrl)
    }

    /**
     * 微信分享
     */
    function _weixinShare(shareData) {
        var d = $.extend({}, shareData, {
            wxUrl: getJiaUrl(shareData)
        });

        Nc.layerOpen({
            title: "分享到微信朋友圈",
            area: ['360px', '360px'],
            skin: "default",
            content: ncTemplate(tplWxShare)(d),
            btn: '',
            success: function () {
                $('#shareQrPanel').html("").qrcode({
                    render: "canvas",
                    text: d.wapUrl,
                    width: "220",
                    height: "220"
                });
            }
        })
    }
    ////////////
    function _bindEvents() {
        $(".J-share-btn").click(function () {
            var webId = $(this).data("webId");
            _share($.extend({}, shareData, {
                webId: webId
            }))
        });
    }
    ////////////
    return {
        init: function () {
            var $shareData = $(".J-share-data");
            if (!$shareData.length) return;
            //获取分享数据
            shareData = $shareData.data();
            _bindEvents();
        }
    }
});

ncDefine("nc.bundling.show", ["add.cart.popup"], function (addCartPopup) {
    var _index = 0;
    var _getBundlingUrl = ncGlobal.webRoot + "goods/bundling";
    var _bundlingGoodsList = [];
    var __postFlat = true;
    //购物车添加地址
    var _urlAddCart = ncGlobal.webRoot + "cart/add";
    var __bundling;
    /**
     * 取得优惠套装数据
     * @private
     */
    var _getBundling = function () {
        var __bundling;
        $.ajax({
            type: "post",
            url: _getBundlingUrl,
            data: {
                bundlingId: _getCheckedBundlingId()
            },
            async: false,
            //Copyright: Bizpower
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    __bundling = data.data
                    // 商品数据整理
                    var __goodsCommonList = [];
                    for (var i = 0; i < __bundling.goodsCommonList.length; i++) {
                        var __goodsCommon = __bundling.goodsCommonList[i];
                        if (!Nc.isEmpty(__goodsCommon.specJson)) {
                            __goodsCommon.specJson = JSON.parse(__goodsCommon.specJson);
                        }
                        var __goodsImageList = [];
                        var __goodsSpec = [];
                        for (var j = 0; j < __goodsCommon.goodsList.length; j++) {
                            var __goods = __goodsCommon.goodsList[j];
                            if (__goods.colorId > 0) {
                                __goodsImageList[__goods.colorId] = __goods.imageSrc;
                            }
                            if (!Nc.isEmpty(__goods.specValueIds)) {
                                __goodsSpec[__goods.specValueIds] = __goods;
                            }
                        }
                        __goodsCommon.imageList = __goodsImageList;
                        __goodsCommon.goodsSpec = __goodsSpec;
                        __goodsCommonList[__goodsCommon.commonId] = __goodsCommon;
                    }
                    __bundling.goodsCommonList = __goodsCommonList;
                    // 优惠套装商品记录整理
                    var __bundlingGoodsList = [];
                    for (var i = 0; i < __bundling.bundlingGoodsList.length; i++) {
                        var __bundlingGoods = __bundling.bundlingGoodsList[i];
                        __bundlingGoodsList[__bundlingGoods.goodsId] = _bundlingGoodsList[__bundlingGoods.goodsId] = __bundlingGoods;
                    }
                    __bundling.bundlingGoodsList = __bundlingGoodsList;
                } else {
                    Nc.alertError(data.message);
                }
            }
        });
        return __bundling;
    }
    var _createBundlingHtml = function (__bundling) {
        return ncTemplate($("#collocationLayer").html())(__bundling);
    }
    /**
     * 计算总价格
     * @private
     */
    var _priceSum = function (that) {
        var _price = 0;
        $(that).find("em[data-bundling-price]").map(function () {
            _price += parseFloat($(this).data("bundlingPrice"));
        });
        _price = _price * parseInt($(that).find("input[data-bundling-buy-num]").val());
        $(that).find("[data-bundling-price-sum]").html(Nc.priceFormatNew(_price));

        var priceAll = $("div[data-bundling-id]").eq(_index).find('input[name="priceAll"]').val();
        var promotionPriceAll = $("div[data-bundling-id]").eq(_index).find('input[name="promotionPriceAll"]').val();
        $(".collocation-price [data-price-all]").html(Nc.priceFormatNew(priceAll))
        $(".collocation-price [data-promotion-price-all]").html(Nc.priceFormatNew(promotionPriceAll))
    }
    /**
     * 获取选中的优惠套装编号
     * @private
     */
    var _getCheckedBundlingId = function () {
        return $("div[data-bundling-id]").eq(_index).data("bundlingId");
    }
    /**
     * 上下滚动事件
     * @private
     */
    var _bindSlider = function () {
        $("#ncBundlingVessel").F_slider({
            len: $("#ncBundlingVessel").find("div[data-bundling-id]").length,
            width: 250,
            axis: 'y',
            page: 1,
            callback: function (page) {
                _index = page - 1;
                _priceSum()
            }
        });
    }
    /**
     * 绑定规格切换事件，加减数量事件
     * @param that
     * @private
     */
    var _bindBundlingEvents = function (that) {
        $(that).on("click", "a[data-spec-value-id]", function () {
            var goodsCommon = __bundling.goodsCommonList[$(this).parents(".coll-items:first").data("commonId")];
            $(this).parents("ul:first").find("a[data-spec-value-id]").removeClass("hovered");
            var specValueIds = $(this).addClass("hovered")
                .parents('.goods-meta:first').find("a[data-spec-value-id].hovered").map(function () {
                    return $(this).data("specValueId");
                }).get().join(",");
            var goods = goodsCommon.goodsSpec[specValueIds];
            if ($(this).parent().hasClass("sp-img")) {
                $(this).parents(".coll-items:first").find("img[data-goods-image]").attr("src", $(this).children().attr("src"));
            }
            $(this).parents(".coll-items:first").data("goodsId", goods.goodsId)
                .find("[data-goods-price]").html(Nc.priceFormatNew(goods.webPrice0))
                .end().find("[data-bundling-price]").data("bundlingPrice", Nc.isEmpty(_bundlingGoodsList[goods.goodsId]) ? goods.webPrice0 : _bundlingGoodsList[goods.goodsId].goodsPrice).html(Nc.priceFormatNew(Nc.isEmpty(_bundlingGoodsList[goods.goodsId]) ? goods.webPrice0 : _bundlingGoodsList[goods.goodsId].goodsPrice))
                .end().find("[data-goods-storage]").html(goods.goodsStorage);
            _priceSum(that);
        })

        /**
         * 减少购买数量
         */
        $(that).on("click", "#bundlingBuyNumMinus", function () {
            var buyNum = parseInt($(that).find("[data-bundling-buy-num]").val());
            if (buyNum == 1 || buyNum == 0) {
                return;
            }
            buyNum -= 1;
            if (buyNum == 1) {
                $(this).addClass("crisis");
            } else {
                $(this).removeClass("crisis");
            }
            $(that).find("[data-bundling-buy-num]").val(buyNum);

            _priceSum(that);
        });

        /**
         * 增加购买数量
         */
        $(that).on("click", "#bundlingBuyNumPlus", function () {
            var buyNum = parseInt($(that).find("[data-bundling-buy-num]").val());
            var __temp = true;
            $(that).find("[data-goods-storage]").map(function () {
                if (parseInt($(this).html()) <= buyNum)
                    __temp = false;
            });
            if (__temp == true) {
                buyNum += 1;
            } else {
                buyNum = 1;
            }

            if (buyNum == 1) {
                $(that).find("#bundlingBuyNumMinus").addClass("crisis");
            } else {
                $(that).find("#bundlingBuyNumMinus").removeClass("crisis");
            }
            if (__temp) {
                $(that).find("[data-bundling-buy-num]").val(buyNum);

            }

            _priceSum(that);
        });

        /**
         * 直接修改购买数量
         */
        $(that).on("change", "input[data-bundling-buy-num]", function () {
            var buyNum = parseInt($(that).find("[data-bundling-buy-num]").val());
            $(that).find("[data-goods-storage]").map(function () {
                var storage = parseInt($(this).html());
                if (storage < buyNum) {
                    buyNum = storage;
                }
                if (buyNum <= 0) {
                    buyNum = 1;
                }
            });

            if (buyNum == 1) {
                $(that).find("#bundlingBuyNumMinus").addClass("crisis");
            } else {
                $(that).find("#bundlingBuyNumMinus").removeClass("crisis");
            }
            $(that).find("[data-bundling-buy-num]").val(buyNum);

            _priceSum(that);
        });
    }
    /**
     * 事件绑定
     * @private
     */
    var _bindEvents = function () {
        $("#bundlingShowLayer").on("click", function () {
            __bundling = _getBundling();
            Nc.layerOpen({
                title: __bundling.bundlingTileFinal,
                //Copyright: Bizpower
                sizeEnum: "large",
                content: _createBundlingHtml(__bundling),
                btn: ['添加购物车'],
                yes: function () {
                    var bundlingId = _getCheckedBundlingId();
                    var buyData = [];
                    $(".coll-items").map(function () {
                        var buy = {};
                        buy.goodsId = $(this).data("goodsId");
                        buy.buyNum = $("input[data-bundling-buy-num]").val();
                        buyData.push(buy);
                    });

                    /**
                     * 添加购物车
                     */
                    if (__postFlat == false) {
                        return
                    }
                    __postFlat = false;
                    $.post(_urlAddCart, {
                        buyData: JSON.stringify(buyData),
                        bundlingId: bundlingId
                    }, function (xhr) {
                        var data = xhr.data;
                        if (xhr.code == 200) {
                            addCartPopup.showFinishDialog();
                        } else {
                            //console.log(xhr)
                            if (data && typeof data.loginState != 'undefined' && data.loginState == false) {
                                //弹出登录窗口
                                popupLoging.showLoginDialog();
                                __postFlat = true;
                                return;
                            }
                            Nc.alertError(xhr.message);
                        }
                        __postFlat = true;
                    })
                },
                success: function (layero, index) {
                    _bindBundlingEvents(layero);
                }
            });
        });
    }
    return {
        init: function () {
            _bindSlider();
            _bindEvents();
            _priceSum();
        }
    }
});
/**
 * 商品详情页中的门店
 */
ncDefine('nc.goods.chain', ['nc.eventManger'], function (ncEventManger) {

    var GoodsChain = function () {
        this.$el = $("#chainPanel")
        this.$chainImage = $("#chainImage")
        this.$chainName = $("#chainName")
        this.$chainAddress = $("#chainAddress")
        this.$btnChainMore = $("#btnChainMore")
        this.$btnChainRule = $("#btnChainRule")
        this.$btnChainBuy = $("#btnChainBuy")
        this.$chainRate  = $("#chainRate")
        this.rateStarOnTpl = '<img src="'+ncGlobal.publicRoot+'/toolkit/jquery.raty/img/star-on.png">'
        this.rateStarOffTpl = '<img src="'+ncGlobal.publicRoot+'/toolkit/jquery.raty/img/star-off.png">'
        this.chainDesc = ncGlobal.chainDescription.replace(/\r\n/mg,'<br>')
        this.area1 = this.area2 = this.area3 = null
        this.commonId = ncGlobal.commonId
        this.goodsId = ncGlobal.goodsId
        this.loading = false
        this.chainList = []
        this.curChainId = 0
        this.initEvent()

    }
    GoodsChain.prototype = {
        initEvent: function () {
            var self = this
            // 监听地区修改事件
            ncEventManger.on('area.changed', function (e, area1, area2, area3) {
                self.area1 = area1
                self.area2 = area2
                self.area3 = area3
                self.loadChainList()
            })
            // 监听goodsid 修改事件
            ncEventManger.on('goods.changed', function (event, goodsId, goodsInfo) {
                console.log('GoodsId is ', goodsId)
                self.goodsId = goodsId
                self.loadChainList()
            })
            this.$btnChainRule.click(function () {
                Nc.layerOpen({
                    type: 1,
                    title: "门店购买规则",
                    content: "<div class='chain-desc'>" + self.chainDesc + "</div>",
                    btn: ["关闭"]
                })
            })

        },
        // 判断地区下是否有门店
        loadChainList: function () {
            var self = this, verifyArea = this.loading || !this.area1 || !this.area2 || !this.goodsId

            if (verifyArea) return
            self.loading = true
            $.get(ncGlobal.webRoot + 'chain/product_chain_list', {
                goodsId: self.goodsId,
                areaId2: self.area2.areaId,
                areaId3: !self.area3 ? 0 : self.area3.areaId
            }, function (xhr) {
                if (xhr.code === 200) {
                    self.chainList = xhr.data.chainList
                    self.genChainPanel()
                }
            }).always(function () {
                self.loading = false
            })
        },
        genChainPanel: function () {
            var _curChain = this.chainList[0] , self = this

            if (_curChain) {
                this.$chainImage.attr('src', _curChain.imageSrc2)
                this.$chainAddress.html( Nc.escape ( _curChain.areaInfo + _curChain.address ) )
                this.$chainName.html(_curChain.chainName)
                this.$chainRate.html([1,2,3,4,5].map(function(item){
                     if (_curChain.chainCriterion >= item){
                         return self.rateStarOnTpl
                     }else{
                         return self.rateStarOffTpl
                     }
                }))
                this.$btnChainMore.attr('href' , ncGlobal.webRoot + 'chain/product_list?commonId=' + self.commonId + '&goodsId=' + self.goodsId + '&areaId=' + self.area2.areaId + "&areaInfo=" + encodeURI(self.area1.areaName + " "+ self.area2.areaName))
                this.$btnChainBuy.attr('href',ncGlobal.webRoot + 'chain/detail?chainId='+_curChain.chainId + '&commonId=' + self.commonId + '&goodsId=' + self.goodsId + '&areaId=' + self.area2.areaId + "&areaInfo=" + encodeURI(self.area1.areaName + " "+ self.area2.areaName))

                this.$el.show()
            } else {
                this.$el.hide()
            }
            self.curChainId = _curChain && _curChain.chainId ? _curChain.chainId : 0
        }
    }


    return {
        init: function () {
            new GoodsChain()
        }
    }
})

/**
 * 实体店铺
 */
ncDefine('nc.real.store' , [] , function(){

    var $warp  = $("#realStoreForGoodsDetail") ,
        $area = $("#realStoreArea") ,
        $content = $("#ncStoreMap") ,
        elShowAll = 'btnShowAll' ,
        mapKey = ncGlobal.amapKey,
        storeId = ncGlobal.storeId,
        currentAreaId = 0,
        defaultIconStyle = 'red',
        selectedIconStyle = 'red',
        mapObj = {
            mapElement: "mapElement",
            mapListPanel: 'realStoreList',
            // 地图实例
            mapInstance: null,
            // 地图设置
            mapOpts: {zoom: 9, resizeEnable: true} ,
            markListInstance : null
        },
        tplRightLi ='<dl class="map-store-info">'+
            '    <dt class="map-store-name"><%- label %>.<%- data.realStoreName %></dt>'+
            '    <dd class="map-store-phone">联系电话：<%- data.phone %></dd>'+
            '    <dd class="map-store-address">详细地址：<%- data.address %></dd>'+
            '    <dd class="map-store-bus">公交信息：<%- data.trafficLine %></dd>'+
            '</dl>' ,
        tplEmpty = '<div class="map-no-store"><h1>该区域没有实体点哦~</h1></div>'
            ;


    function init(){
        mapObj.mapInstance = new AMap.Map(mapObj.mapElement, mapObj.mapOpts)
        initEvents()
        refreshAll()
    }
    /**
     * 初始化事件
     */
    function initEvents (){
        // 地区插件
        $area.NcArea({
            showDeep: 2,
            areaModBtnAreaId: 0,
            url:ncGlobal.webRoot + 'area/list.json/'
        });
        // 地区插件
        $area
            .on('nc.select.selected', function () {
                console.log('nc.select.selected')
            })
            .on('nc.select.last', function (events, obj) {
                console.log('nc.select.last' , obj.getLast())
                var currentAreaObj = obj.getLast()
                currentAreaId = currentAreaObj.areaId
                mapObj.mapInstance.setCity(currentAreaObj.areaName)
                refreshAll()
            })
        // 点击显示全部
        $("#" +elShowAll).click(function(){
            currentAreaId = 0
            $area.data("nc.area").restart()
            refreshAll()
        })
    }
    /**
     * 获取数据并显示到地图和右侧列表上去
     */
    function refreshAll (){
        getRealStoreListData(function(list){
            mapObj.markListInstance != null && mapObj.markListInstance.clearData()
            $('#' + mapObj.mapListPanel).empty()
            genMapUi(list)
        } , function(){
            renderEmpty()
        })
    }
    /**
     * 初始化地图上的marker，infowindow
     * @param list
     */
    function genMapUi(list) {
        console.log('genMapUi')
        AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], function (MarkerList, SimpleMarker, SimpleInfoWindow) {
            var markerList = new MarkerList({
                map: mapObj.mapInstance, //关联的map对象
                listContainer: mapObj.mapListPanel, //列表的dom容器的节点或者id
                //置空默认的选中行为，后续监听selectedChanged中处理
                onSelected: null,
                getDataId: function (dataItem, index) {
                    //返回数据项的Id
                    return dataItem.realStoreId;
                },
                getPosition: function (dataItem) {
                    //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
                    return [dataItem.lng, dataItem.lat];
                },
                getMarker: function (dataItem, context, recycledMarker) {
                    var label = context.index + 1;

                    if (recycledMarker) {
                        recycledMarker.setIconLabel(label);
                        return;
                    }

                    return new SimpleMarker({
                        containerClassNames: 'my-marker',
                        iconStyle: defaultIconStyle,
                        iconLabel: label
                    });
                },
                getInfoWindow: function (dataItem, context, recycledInfoWindow) {
                    var title = '<span class="J-item" data-id="' + dataItem.realStoreId + '">' + dataItem.realStoreName + '</span>',
                        body = '<p class="my-desc"><span>联系电话：</span><sub>' + ( dataItem.phone ? Nc.escape ( dataItem.phone ): '--') + '</sub></p>' +
                            '<p class="my-desc"><span>详细地址：</span><sub>' + Nc.escape  ( dataItem.address) + '</sub></p>' +
                            '<p class="my-desc"><span>公交信息：</span><sub>' + ( dataItem.trafficLine ?Nc.escape ( dataItem.trafficLine) :'--')  + '</sub></p>';
                    if (recycledInfoWindow) {
                        recycledInfoWindow.setInfoTitle(title);
                        recycledInfoWindow.setInfoBody(body);
                        return recycledInfoWindow;
                    }
                    return new SimpleInfoWindow({
                        infoTitle: title,
                        infoBody: body,
                        offset: new AMap.Pixel(-6, -40)
                    });

                },
                getListElement: function (dataItem, context, recycledListElement) {
                    var label = context.index + 1;
                    //使用模板创建
                    var innerHTML = MarkerList.utils.template(tplRightLi, {
                        data: dataItem,
                        label: label
                    });

                    if (recycledListElement) {
                        recycledListElement.innerHTML = innerHTML;
                        return recycledListElement;
                    }
                    return innerHTML
                },

                //列表节点上监听的事件
                listElementEvents: ['click', 'mouseenter', 'mouseleave'],
                //marker上监听的事件
                markerEvents: ['click', 'mouseover', 'mouseout'],
                //makeSelectedEvents:false,
                selectedClassNames: 'selected',
                autoSetFitView: true
            })
            markerList.on('renderComplete' ,function(event , records){
                console.log('renderComplete' ,records)
                var $target = $("#realStoreListPanel")
                if(records.length) {
                    $target.data('perfectScrollbar') ? $target.perfectScrollbar('update') : $target.perfectScrollbar()
                }else{
                    $target.perfectScrollbar('destroy')
                    renderEmpty()
                }

            })
            markerList.on('selectedChanged', function (event, info) {
                var selected = info.selected,
                    self = this;
                if (selected) {
                    var marker = selected.marker;
                    if (marker && marker.get("map")) {
                        marker["setTop"](!0);
                    }
                    this.openInfoWindowOnRecord(selected);
                }
                var unSelected = info.unSelected;
                if (unSelected) {
                    var infoWindow = this.getInfoWindow();
                    infoWindow && unSelected.id === this.getDataIdOfInfoWindow(infoWindow) && infoWindow.close();
                }
                console.log('selectedChanged')
                if (info.selected) {

                    if (info.selected.marker) {
                        //更新为选中样式
                        info.selected.marker.setIconStyle(selectedIconStyle);
                    }

                    //选中并非由列表节点上的事件触发，将关联的列表节点移动到视野内
                    if (!info.sourceEventInfo.isListElementEvent) {

                        if (info.selected.listElement) {
                            scrollListElementIntoView($(info.selected.listElement));
                        }
                    }
                }

                if (info.unSelected && info.unSelected.marker) {
                    //更新为默认样式
                    info.unSelected.marker.setIconStyle(defaultIconStyle);
                }
            })
            markerList.on('listElementMouseleave markerMouseout', function (event, record) {

                if (record && record.marker) {

                    if (!this.isSelectedDataId(record.id)) {
                        //恢复默认样式
                        record.marker.setIconStyle(defaultIconStyle);
                    }
                }
            })
            function isElementInViewport(el) {
                var rect = el.getBoundingClientRect()

                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                )
            }
            function scrollListElementIntoView($listEle) {
                if (!isElementInViewport($listEle.get(0))) {
                    $('#realStoreListPanel').scrollTop($listEle.offset().top - $listEle.parent().offset().top)
                }
            }

            //绘制数据源
            markerList.render(list)
            mapObj.markListInstance = markerList
        })
    }
    /**
     * 获取实体店列表
     */
    function getRealStoreListData(cb , failCb){
        $.get(ncGlobal.webRoot  + 'goods/real_store/list' , {
            areaId2 : currentAreaId  ,
            storeId : storeId
        } , function(xhr){
            if(xhr.code != 200) return failCb(),null
            cb (xhr.data.realStoreList)
        })

    }
    /**
     * 异步加载地图
     * @param cb
     */
    function asyncLoadMapFile(cb){
        console.log('异步加载地图')
        var roll = Nc.randomString(8)
        window['amapCallBack_' + roll] = function () {
            console.log('amapCallBack_' + roll)
            $.getScript('https://webapi.amap.com/ui/1.0/main.js' , cb)
        }
        $.getScript('https://webapi.amap.com/maps?v=1.3&key=' + mapKey + '&callback=amapCallBack_' + roll )

    }
    /**
     * 渲染列表是空的时候
     */
    function renderEmpty(){
        console.log('渲染列表是空的时候')
      
        $('#' + mapObj.mapListPanel).append(tplEmpty)
    }

    return function(){
        if (!$warp.length) return
        asyncLoadMapFile(function(){
            init()
        })
    }
})

//=============================================================
$(function () {
    var goodsRetailInstance  = null
    //满活动
    ncRequire("nc.goods.conform").create();
    $("#nc-bundling").load(ncGlobal.webRoot + "goods/combo", {
        commonId: ncGlobal.commonId
    }, function () {
        //商品推荐组合显示
        ncRequire("nc.combo.show").create();
        ncRequire("nc.combo.add").create();
        // 优惠套装
        ncRequire("nc.bundling.show").init();
        $(this).find(".ncs-goods-title-nav li:first").addClass("current");
        $("#nc-bundling").find("[data-combo-bundling]").eq(0).show();
        $(this).on("click", ".ncs-goods-title-nav li", function () {
            $(this).addClass("current").siblings().removeClass("current");
            $("#nc-bundling").find("[data-combo-bundling]").hide();
            $("#nc-bundling").find("[data-combo-bundling]").eq($(this).index()).show();
        })
    });

    //根据所选规格跳到指定商品详情页
    ncGlobal.goodsInfoType == "retail" && ( goodsRetailInstance = ncRequire("goods.modal.retail")() ) ;
    //没有商品规格时商品价格显示区域
    ncGlobal.goodsInfoType == "nullspec" && ncRequire("goods.modal.none")();
    //批发模式,商品
    ncGlobal.goodsInfoType == "wholesale" && ncRequire("goods.modal.wholesale")();

    //商品图片相关
    ncRequire("nc.goods.pic")();

    //橱窗推荐
    ncRequire("nc.showcase")();

    //添加购物车
    //ncRequire("nc.goods.addcart").init();
    if (ncGlobal.goodsStatus) {
        ncRequire("nc.goods.area").init(goodsRetailInstance && goodsRetailInstance.current.goodsStorage);
        //配送至
    }
    //获取运费
    if (ncGlobal.goodsModal != 3) {
        var ncFreight = ncRequire("nc.goods.freight").init();
    }

    //增加浏览记录
    $.post(ncGlobal.webRoot + "goods/browse/add", {
        common_id: ncGlobal.commonId
    });
    //加载咨询
    $("#consulting_demo").load(ncGlobal.webRoot + 'consult/list?commonId=' + ncGlobal.commonId);
    // 商品内容介绍Tab样式切换控制
    $('#categoryMenu').find("li").click(function () {
        $('#categoryMenu').find("li").removeClass('current');
        $(this).addClass('current');
    }).end().find("a").click(function () {

        var _id = $(this).data("id");
        if (_id == "ncGoodsIntro") {
            $('.bd').css('display', '');
            $('.hd').css('display', '');
        } else {
            $('.bd').css('display', 'none');
            $("#" + _id).css('display', '');
            $('.hd').css('display', 'none');
        }
    });




    //查询评价列表
    queryEvaluate("all");

    //
    ncRequire("nc.goods.navpin").init();

    //最近浏览和猜你喜欢
    $('#browse_like_div').ncBrowseAndGuessLike();

    //活动倒计时
    if (ncGlobal.promotionCountDownTime && ncGlobal.promotionCountDownTime > 0) {
        $("#saleCountDown").ncCountDown({
            time: ncGlobal.promotionCountDownTime,
            unitHour: "小时",
            unitMinute: "分钟",
            unitSecond: "秒",
            end: function () {
                Nc.go();
            }
        });
    }


    //收藏商品后操作
    Nc.eventManger.on("goods.favorites.end", function (event, commonId, commonIdDom, chainId, xhr) {
        if (xhr.code == 200) {
            //显示数量累计
            var currNum = parseInt($("[nc_type='goodsFavoritesNum']").html());
            if (currNum <= 0) {
                currNum = 0;
            }
            $("[nc_type='goodsFavoritesNum']").html(currNum + 1);
            Nc.alertSucceed("收藏成功");
        } else {
            Nc.alertError(xhr.message);
        }
        return false;
    });

    //分享插件
    ncRequire("nc.goods.share").init();


    ncRequire("arrival.notice.popup").init();

    ncRequire('nc.goods.chain').init()

    goodsRetailInstance &&  goodsRetailInstance._getGoodsData()
    // 实体店
    ncRequire('nc.real.store')()

    // 发送goodsid 变更事件
    var path = window.location.href;
    var patt = new RegExp("goodsId");
    if (patt.test(path)) {
        Nc.eventManger.trigger('goods.pic.changed')
    }

});

/**
 * 小星星
 */
function initRaty() {
    $('.raty').raty({
        path: ncGlobal.publicRoot + "toolkit/jquery.raty/img",
        readOnly: true,
        width: 80,
        hints: ['很不满意', '不满意', '一般', '满意', '很满意'],
        score: function () {
            return $(this).attr('data-score');
        }
    });
}

/**
 * 查询评价列表
 */
function queryEvaluate(attr, page) {
    if (attr == "") {
        attr = "all";
    }

    if (!page) {
        page = 1;
    }

    var url = ncGlobal.webRoot + 'goods/evaluate?commonId=' + ncGlobal.commonId + '&evalLv=' + attr + '&page=' + page;

    $("#goodseval").load(url, function () {
        $("#comment_tab li").removeClass();
        $("#comment_tab li[data-type='" + attr + "']").addClass("current");
        initRaty();
    });

    //显示商品试用评价
    $("#ncGoodsTrysReport").load(ncGlobal.webRoot + "trys/goods/report/list/" + ncGlobal.commonId, function (data) {
        if ($.trim(data) != "") {
            $("#ncGoodsTrysReport").show();
            $("#trysReport").show();
            //initRaty();
            // 绑定翻页
            $(this).on('click', ".pagination .demo", function () {
                $.get($(this).attr("href"), function (data) {
                    $("#ncGoodsTrysReport").html(data);
                });
                return false;
            });
        }
    });

}
$(function(){

$('#goodseval').on('click', '[data-btn="btnPage"]', function() {
    var $this=$(this);
    queryEvaluate($this.attr('data-evalLv'), $this.attr('data-page'));
    location.hash = "content"
});

$("#selectedListInfo").perfectScrollbar();

// 商品详情页层级关系
$("#showSelectListBtn").click(function () {
    var aa = $(".ncs-sale").css("z-index");
    if (aa == 4) {
        $(".ncs-sale").css("z-index", "3");
    }
});
$("#ncsFreightSelector").click(function () {
    var aa = $(".ncs-sale").css("z-index");
    if (aa == 4) {
        $(".ncs-sale").css("z-index", "3");
    }
    $(this).parents(".ncs-logistics").css("z-index", "4");
});
$("#conformBlockPanel").click(function () {
    var aa = $(".ncs-logistics").css("z-index");
    if (aa == 4) {
        $(".ncs-logistics").css("z-index", "3");
    }
    $(this).parents(".ncs-sale").css("z-index", "4");
});
$("#showCouponActivityListBtn").click(function(){
    $("#ncGlobalToolbar").find("[data-nc-tag-type='couponActivity']").trigger("click");
});

    $("[data-wap-goods-detail-qr-code]").qrcode({
        width: 140, //宽度
        height:140, //高度
        text: ncGlobal.wapRoot + "tmpl/product_detail.html?commonId=" + ncGlobal.commonId
    });
    $("#wapGroupDetailQRCode").qrcode({
        width: 140, //宽度
        height:140, //高度
        text: ncGlobal.wapRoot + "tmpl/group_detail.html?commonId=" + ncGlobal.commonId
    });

    // 评论锚点检测
    var patt = new RegExp("#ncGoodsRate");
    var path = window.location.href;
    if (patt.test(path)) {
        window.location.hash="content";
        $("a[data-id=ncGoodsRate]").trigger("click").end().parents("li:first").trigger("click");
    }
})
