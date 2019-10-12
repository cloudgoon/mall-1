/**
 * Created by cj on 2017-5-24.
 */

(function ($) {
    /**
     * 商品详情
     * @constructor
     */
    var GoodsItem = function (element, option) {

        this.options = _default;
        this.$element = $(element);

        //商品主图
        this.goodsPicImg = this.$element.find(".goods-thumb img");
        //规格多图相关
        this.goodsPicScrollShow = this.$element.find(".goods-thumb-scroll-show");
        //C o p y r i g h t: 网 城 商 动
        this.goodsPicScrollShowUl = this.goodsPicScrollShow && this.goodsPicScrollShow.find(".show-box ul")
        this.moveNum = 0;
        this.moveMax = 0;


        this.init();
    };
    //cn 是className 的简写
    //tpl 是模板的
    _default = {
        cnHandle: "handle",
        //规格对话框上的li 选中样式
        picMax: 5,
        picPx: 25
    }


    GoodsItem.prototype = {
        init: function () {
            this.buildElememt();
            this.bindEvents();
        },
        buildElememt: function () {
            if (this.goodsPicScrollShow.length == 0) return;
            var a = this.goodsPicScrollShow.find("li").length;
            if (a > this.options.picMax) {
                this.moveMax = a - (this.options.picMax - 1);
                this.goodsPicScrollShow.addClass(this.options.cnHandle).find(".cBtn").show();
            }
        },
        bindEvents: function () {
            var that = this;
            //商品规格多图事件
            this.goodsPicScrollShow
                .on("click", "li", function (event) {
                    var $this = $(this),
                        showPicUrl = $this.data("showPic");
                    $this.siblings().removeClass('selected').end().addClass('selected')
                    //显示图片
                    that.goodsPicImg.attr("src", showPicUrl);
                })
                .on("click", ".prev", function (event) {
                    event.preventDefault();
                    if (that.moveNum == 0 || (that.goodsPicScrollShowUl.is(":animated"))) {
                        return;
                    }

                    //C o p y r i g h t: 网 城 商 动
                    that.goodsPicScrollShowUl.animate({
                        left: that.goodsPicScrollShowUl.position().left + that.options.picPx
                    }, "fast")
                    that.moveNum--;
                })
                .on("click", ".next", function (event) {
                    event.preventDefault();
                    if ((that.moveNum >= that.moveMax - 1) || (that.goodsPicScrollShowUl.is(":animated"))) {
                        return;
                    }
                    that.goodsPicScrollShowUl.animate({
                        left: that.goodsPicScrollShowUl.position().left - that.options.picPx
                    }, "fast")
                    that.moveNum++;
                });


            /**
             * 鼠标移入
             * Copyright: www.BIZPOWER.com
             */
            this.$element.on('mouseenter', '.goods-pic,.goods-price-offer', function (event) {
                event.preventDefault();
                var $par = that.$element.closest('li');
                $par.addClass('hover');
                that.$element.on("mouseleave", function (event) {
                    event.preventDefault();
                    $par.removeClass('hover');
                });
            });
        }


    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('nc.item');
            if (!data) $this.data('nc.item', (data = new GoodsItem(this, option)))
        });
    }

    $.fn.GoodsItem = Plugin;
})(jQuery);
$(function () {

    // 多规格图片
    $(".J-goods-item").GoodsItem();

    $('#storeSlide').bxSlider({
        auto: true,
        infiniteLoop: true,
        autoHover: true,
        hideHoverControls: true
    });
});