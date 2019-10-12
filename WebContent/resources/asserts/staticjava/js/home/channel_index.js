/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

/**
 * 频道左侧分类菜单
 */
var channelCategoryMenu = function ($) {
    "use strict";

    function _showMenu($menu, $item, top) {
        var a = $("#topCategoryMenuChannel").offset(),
            b = $(window).scrollTop(),
            c = $item.offset().top;

        if (b >= a.top) {
            $menu.css({
                top: b - a.top
            });
        } else {
            $menu.css({
                top: 0
            });
        }
    }

    function _bindEvents() {
        $("#topCategoryMenuChannel ul.menu").find("li").each(function () {
                $(this).hover(function () {
                        var cat_id = $(this).data("ncCategoryId");
                        var menu = $(this).find("div[data-cat-menu-id='" + cat_id + "']");
                        menu.show();
                        $(this).addClass("hover");
                        var menu_height = menu.height();
                        if (menu_height < 60) menu.height(80);
                        //Copyright: 天津网城商动科技有限责任公司
                        menu_height = menu.height();
                        var li_top = $(this).position().top;
                        //bycj
                        //_showMenu($(menu), $(this), li_top);
                    },
                    function () {
                        $(this).removeClass("hover");
                        var cat_id = $(this).data("ncCategoryId");
                        $(this).find("div[data-cat-menu-id='" + cat_id + "']").hide();
                    }
                );
            }
        );


    }

    return {
        init: function () {
            _bindEvents();
        }
    };
}(jQuery);
/**
 * 频道轮播
 * Copyright: 天津网城商动科技有限责任公司
 */
var channelSlider = function ($) {

    var
        _bindEvents = function () {
            //大轮播图
            $('#fullScreenSlides').bxSlider({
                auto: true,
                infiniteLoop: true,
                hideHoverControls: true
            });
            //三张连滚
            $("#panelTopFocus").bxSlider({
                slideWidth: 329,
                minSlides: 1,
                maxSlides: 3,
                moveSlides: 1,
                //slideMargin: 10,
                auto: false ,
                pager :false,
                hideHoverControls: true
            });

        };
    return {
        init: function () {
            _bindEvents();
        }
    }
}(jQuery);
/**
 * 频道楼层
 * Copyright: bizpower
 */
var channelFloor = function ($) {
    var _bindEvents = function () {
        //楼层tab
        $("ul[data-nc-floor-tab] >li").bind('mouseover', (function (e) {
            console.log("首页楼层tab")
            var tabs = $(this).closest("ul").find("li"),
                panels = $(this).closest("[data-nc-floor-panel]").find(".main"),
                index = $.inArray(this, tabs),
                slider = panels.eq(index).find("ul[data-nc-floor-slider]"),
                sliderData = slider.length && slider.data("nc.slider")
                ;
            if (panels.eq(index)[0]) {
                tabs.removeClass("tab-selected").eq(index).addClass("tab-selected");
                panels.addClass("tab-hide").eq(index).removeClass("tab-hide");
            }
            sliderData && sliderData.reloadSlider();
        }));
        //楼层轮播图
        var a = $("ul[data-nc-floor-slider]");
        a.length && $.each(a, function (i, n) {
            var $this = $(n), $li = $this.find("li");
            if ($li.length > 1){
                $this.data ("nc.slider" ,$this.bxSlider({
                        auto: true,
                        infiniteLoop: true,
                        autoHover: true,
                        hideHoverControls: true
                    })
                )
            }
        })

    };
    return {
        init: function () {
            _bindEvents();
        }
    }
}(jQuery);
$(".J-lazy").lazyload({
    threshold: 300,
    placeholder: ncGlobal.publicRoot + 'img/transparent.gif'
});
$(function () {
    //页内导航条位置
    //$('#nav').onePageNav({
    //    filter: ':not(.exception)'
    //});
    ////滚动固定分类导航条
    //$(".pinned").pin({
    //    containerSelector: ".main-layout"
    //});

    channelCategoryMenu.init();
    channelSlider.init();
    channelFloor.init();


});