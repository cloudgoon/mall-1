/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.shopnc.net
 * Copyright: 天津网城商动科技有限责任公司
 *
 * @author shopnc.feng
 * Created 2019/3/5 上午 10:52
 */
/**
 * 导航滚动固定特效
 */
var navPin = function() {

    var $mainNav = $("#categoryUl"),
        //最开始的坐标
        offsetTop = 0;

    var classNamePin = "fixed";

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

                $("[id^=categoryAnchor]").each(function() {
                    if ($(window).scrollTop() >= $(this).offset().top) {
                        $("#categoryUl").find("a[href=#"+ $(this).attr("id") +"]").parent().addClass("selected").siblings().removeClass("selected")
                    }
                })
            })
        },
        /**
         * 修改位置
         * Copyright: 天津网城商动科技有限责任公司
         */
        setOffSet: _setOffSet
    }
}();

var category = function(){
    var _bindEvent = function() {
        $("#categoryUl li").on("click", function(){
            $(this).addClass("selected").siblings().removeClass("selected");
        })
    }
    return {
        init : function() {
            _bindEvent();
        }
    }
}();
category.init();
navPin.init()