/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 3.0.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */
;
(function ($, window, document, undefined) {

    // our plugin constructor
    var OnePageNav = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('plugin-options');
        this.$win = $(window);
        this.sections = {};
        this.didScroll = false;
        this.$doc = $(document);
        this.docHeight = this.$doc.height();
    };

    // the plugin prototype
    OnePageNav.prototype = {
        defaults: {
            navItems: 'a',
            currentClass: 'current',
            changeHash: false,
            easing: 'swing',
            filter: '',
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            begin: false,
            end: false,
            scrollChange: false
        },

        init: function () {
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this.$nav = this.$elem.find(this.config.navItems);

            //Filter any links out of the nav
            if (this.config.filter !== '') {
                this.$nav = this.$nav.filter(this.config.filter);
            }

            //Handle clicks on the nav
            this.$nav.on('click.onePageNav', $.proxy(this.handleClick, this));

            //Get the section positions
            this.getPositions();

            //Handle scroll changes
            this.bindInterval();

            //Update the positions on resize too
            this.$win.on('resize.onePageNav', $.proxy(this.getPositions, this));

            return this;
        },

        adjustNav: function (self, $parent) {
            self.$elem.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
            $parent.addClass(self.config.currentClass);
        },

        bindInterval: function () {
            var self = this;
            var docHeight;

            self.$win.on('scroll.onePageNav', function () {
                self.didScroll = true;
            });

            self.t = setInterval(function () {
                //Copyright: 天津网城商动科技有限责任公司
                docHeight = self.$doc.height();

                //If it was scrolled
                if (self.didScroll) {
                    self.didScroll = false;
                    self.scrollChange();
                }

                //If the document height changes
                if (docHeight !== self.docHeight) {
                    self.docHeight = docHeight;
                    self.getPositions();
                }
            }, 250);
        },

        getHash: function ($link) {
            return $link.attr('href').split('#')[1];
        },

        getPositions: function () {
            var self = this;
            var linkHref;
            var topPos;
            var $target;

            self.$nav.each(function () {
                linkHref = self.getHash($(this));
                $target = $('#' + linkHref);

                if ($target.length) {
                    topPos = $target.offset().top;
                    self.sections[linkHref] = Math.round(topPos);
                }
            });
        },

        getSection: function (windowPos) {
            var returnValue = null;
            var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);

            for (var section in this.sections) {
                if ((this.sections[section] - windowHeight) < windowPos) {
                    returnValue = section;
                }
            }

            return returnValue;
        },

        handleClick: function (e) {
            var self = this;
            var $link = $(e.currentTarget);
            var $parent = $link.parent();
            var newLoc = '#' + self.getHash($link);

            //Copyright: 天津网城商动科技有限责任公司
            if (!$parent.hasClass(self.config.currentClass)) {
                //Start callback
                if (self.config.begin) {
                    self.config.begin();
                }

                //Change the highlighted nav item
                self.adjustNav(self, $parent);

                //Removing the auto-adjust on scroll
                self.unbindInterval();

                //Scroll to the correct position
                self.scrollTo(newLoc, function () {
                    //Do we need to change the hash?
                    if (self.config.changeHash) {
                        window.location.hash = newLoc;
                    }

                    //Add the auto-adjust on scroll back in
                    self.bindInterval();

                    //End callback
                    if (self.config.end) {
                        self.config.end();
                    }
                });
            }

            e.preventDefault();
        },

        scrollChange: function () {
            var windowTop = this.$win.scrollTop();
            var position = this.getSection(windowTop);
            var $parent;

            //If the position is set
            if (position !== null) {
                $parent = this.$elem.find('a[href$="#' + position + '"]').parent();

                //If it is not already the current section
                if (!$parent.hasClass(this.config.currentClass)) {
                    //Change the highlighted nav item
                    this.adjustNav(this, $parent);

                    //If there is a scrollChange callback
                    if (this.config.scrollChange) {
                        this.config.scrollChange($parent);
                    }
                }
            }
        },

        scrollTo: function (target, callback) {
            var offset = $(target).offset().top;

            $('html, body').animate({
                scrollTop: offset
            }, this.config.scrollSpeed, this.config.easing, callback);
        },

        unbindInterval: function () {
            clearInterval(this.t);
            this.$win.unbind('scroll.onePageNav');
        }
    };

    OnePageNav.defaults = OnePageNav.prototype.defaults;

    $.fn.onePageNav = function (options) {
        return this.each(function () {
            new OnePageNav(this, options).init();
        });
    };

})(jQuery, window, document);


//jquery.pin.js
(function ($) {
    "use strict";
    $.fn.pin = function (options) {
        var scrollY = 0, elements = [], disabled = false, $window = $(window);

        options = options || {};

        var recalculateLimits = function () {
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = elements[i];

                if (options.minWidth && $window.width() <= options.minWidth) {
                    if ($this.parent().is(".pin-wrapper")) {
                        $this.unwrap();
                    }
                    $this.css({width: "", left: "", top: "", position: ""});
                    if (options.activeClass) {
                        $this.removeClass(options.activeClass);
                    }
                    disabled = true;
                    continue;
                } else {
                    disabled = false;
                }

                var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
                var offset = $this.offset();
                var containerOffset = $container.offset();
                var parentOffset = $this.offsetParent().offset();

                if (!$this.parent().is(".pin-wrapper")) {
                    $this.wrap("<div class='pin-wrapper'>");
                }

                var pad = $.extend({
                    top: 0,
                    //Copyright: 天津网城商动科技有限责任公司
                    bottom: 0
                }, options.padding || {});

                $this.data("pin", {
                    pad: pad,
                    from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top,
                    to: containerOffset.top + $container.height() - $this.outerHeight() - pad.bottom,
                    end: containerOffset.top + $container.height(),
                    parentTop: parentOffset.top
                });

                $this.css({width: $this.outerWidth()});
                $this.parent().css("height", $this.outerHeight());
            }
        };

        /**
         * Copyright: www.BIZPOWER.com
         */
        var onScroll = function () {
            if (disabled) {
                return;
            }

            scrollY = $window.scrollTop();

            var elmts = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = $(elements[i]),
                    data = $this.data("pin");

                if (!data) { // Removed element
                    continue;
                }

                elmts.push($this);

                var from = data.from - data.pad.bottom,
                    to = data.to - data.pad.top;

                if (from + $this.outerHeight() > data.end) {
                    $this.css('position', '');
                    continue;
                }

                if (from < scrollY && to > scrollY) {
                    !($this.css("position") == "fixed") && $this.css({
                        left: $this.offset().left,
                        top: data.pad.top
                    }).css("position", "fixed");
                    if (options.activeClass) {
                        $this.addClass(options.activeClass);
                    }
                } else if (scrollY >= to) {
                    $this.css({
                        left: "",
                        top: to - data.parentTop + data.pad.top
                    }).css("position", "absolute");
                    if (options.activeClass) {
                        $this.addClass(options.activeClass);
                    }
                } else {
                    $this.css({position: "", top: "", left: ""});
                    if (options.activeClass) {
                        $this.removeClass(options.activeClass);
                    }
                }
            }
            elements = elmts;
        };

        var update = function () {
            recalculateLimits();
            onScroll();
        };

        this.each(function () {
            var $this = $(this),
                data = $(this).data('pin') || {};

            if (data && data.update) {
                return;
            }
            elements.push($this);
            $("img", this).one("load", recalculateLimits);
            data.update = update;
            $(this).data('pin', data);
        });

        $window.scroll(onScroll);
        $window.resize(function () {
            recalculateLimits();
        });
        recalculateLimits();

        $window.load(update);

        return this;
    };
})(jQuery);
// 楼层图片懒加载

$(".J-lazy").lazyload({
    threshold: 300,
    placeholder: ncGlobal.publicRoot + 'img/transparent.gif'
});


var seckillCountDown = function () {

// 秒杀倒计时
    var countDownTime = ncGlobal.seckillTime;
    return {
        init: function () {
            if (typeof ncGlobal.seckillTime == 'undefined') return;
            $("#seckillTimeDown").ncCountDown({
                time: countDownTime,
                cnminutes: "h",
                cnallHours: "m",
                cnhours: "s",
                cnseconds: "s",
                unitDay: "<i>天</i>",
                unitHour: "<em>:</em>",
                unitMinute: "<em>:</em>",
                unitSecond: "",
                warp: "span",
                hideDay: false,
                notEnoughDayHide: false,
                end: function () {
                    Nc.go();
                }
            });
        }
    }
}();

/**
 * 首页弹出广告模块
 *
 */
var indexPopupAdModule = (function () {

    var cookieKey = 'popAdWeb',
        popAdOptsKey = 'popAdWebOpts'

    function init() {
        console.log('首页弹出广告模块')
        var $popupAdPanel = $("#popupAdPanel"), enable = $popupAdPanel.length ? $popupAdPanel.data('enable') : false;
        if (!enable) return
        var enableEveryTime = $popupAdPanel.data('enableEveryTime'),
            $popupAdDialog = $("#popupAdDialog"),
            $popupAdCloseBtn = $("#popupAdCloseBtn"),

            cookieModOpts = $.cookie(popAdOptsKey)
        ;

        if (!cookieModOpts) {
            $.cookie(popAdOptsKey, enableEveryTime)
        } else {
            if (cookieModOpts == enableEveryTime) {
                return
            } else {
                $.cookie(popAdOptsKey, enableEveryTime)
                $.removeCookie(cookieKey)
            }
        }
        var cookieValue = $.cookie(cookieKey)
        if(cookieValue ) return


        $popupAdDialog.show()
        $popupAdPanel.show()
        if (enableEveryTime == 1) {
            var date = new Date();
            date.setTime(date.getTime() + 1 * 3600 * 1000);
            $.cookie(cookieKey, (new Date()).getTime(), {expires: date})
        } else {
            $.cookie(cookieKey, (new Date()).getTime())
            }

        $popupAdCloseBtn.click(function(){
            $popupAdDialog.hide()
            $popupAdPanel.hide()
        })
        $popupAdDialog.click(function () {
            $popupAdDialog.hide()
            $popupAdPanel.hide()
        })
        setTimeout(function () {
            $popupAdDialog.hide()
            $popupAdPanel.hide()
        },1e4)
    }
    return {
        init: init
    }
})();

var seckillSlider = (function(){
    function init() {
        //秒杀 轮播
        $('#homeSeckill').bxSlider({
            auto: false,
            //captions: true,
            infiniteLoop: true,
            autoHover: true,
            //responsive:true,
            hideHoverControls: true,
            pager: false,
            minSlides: 0,
            maxSlides: 6,
            slideWidth: 201,
            slideMargin: 0
        });
    }
    return {
        init: init
    }
})();

/**
 * 顶部固定
 */
var navBarFixed = (function () {
    var opts = {
        wrap: {
            el: $('#headerWrap'),
            cl: 'header-wrap-fixed'
        },
        nav: {
            el: $('#publicNavLayout'),
            cl: 'public-nav-layout-fixed'
        },
        home:{
            el:$('#homeFocusLayout'),
            top : $('#homeFocusLayout').position().top,
            gap:440
        },
        indexFixedBar:$('#indexFixedBar'),
        category :  $('#publicNavLayout .all-category'),
        topCategoryMenu:$('#topCategoryMenu'),
        lastValue:null
    }

    function init() {
        $(window).scroll(function () {
            _scroll()
        })
    }

    function _scroll() {

        var _fixed = $('html').scrollTop() > opts.home.top + opts.home.gap
        if (opts.lastValue == _fixed) return
        opts.lastValue = _fixed
        _unbindCategory()
        if(_fixed){
            opts.wrap.el.addClass(opts.wrap.cl)
            opts.nav.el.addClass(opts.nav.cl)
            opts.indexFixedBar.show()
            opts.topCategoryMenu.hide()
            opts.category.on('mouseenter' , _mEnter).on('mouseleave',_mLeave)
        }else{
            opts.wrap.el.removeClass(opts.wrap.cl)
            opts.nav.el.removeClass(opts.nav.cl)
            opts.indexFixedBar.hide()
            opts.topCategoryMenu.show()
        }

    }
    function _unbindCategory() {
        opts.category.off('mouseenter' , _mEnter).off('mouseleave',_mLeave)
    }

    function _mEnter() {
        opts.topCategoryMenu.show()
    }
    function _mLeave(){
        opts.topCategoryMenu.hide()
    }

    return {
        init: init
    }
})();

$(function () {

    //页内导航条位置
    $('#nav').onePageNav({
        filter: ':not(.exception)'
    });
    //滚动固定分类导航条
    $(".pinned").pin({
        containerSelector: ".main-layout"
    });
    //顶部banner 轮播
    $('#homeTopBanner').bxSlider({
        auto: true,
        //captions: true,
        infiniteLoop: true,
        autoHover: true,
        //responsive:true,
        hideHoverControls: true
    });

    /**
     * Copyright: www.BIZPOWER.com
     */
        //楼层轮播图
    var a = $("ul[data-nc-floor-slider]");
    a.length && $.each(a, function (i, n) {
        var $this = $(n), $li = $this.find("li"), _slider;
        if ($li.length > 1) {
            $this.data("nc.slider", $this.bxSlider({
                    auto: true,
                    //captions: true,
                    infiniteLoop: true,
                    autoHover: true,
                    //responsive:true,
                    hideHoverControls: true
                })
            )
        }
    })

    //首页tab
    $("ul[data-tabs-nav] > li a").bind('mouseover', (function (e) {
        if (e.target == this) {
            var tabs = $(this).closest("ul").find("li a");
            var panels = $(this).closest(".home-standard-layout").find(".tabs-panel");
            var index = $.inArray(this, tabs);
            if (panels.eq(index)[0]) {
                tabs.removeClass("tabs-selected").eq(index).addClass("tabs-selected");
                panels.addClass("tabs-hide").eq(index).removeClass("tabs-hide");
            }
        }
    }));

    //首页楼层tab
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
    //$('.floor .slider-main').bxSlider({
    //    auto: true,
    //    //captions: true,
    //    infiniteLoop: true,
    //    autoHover: true,
    //    //responsive:true,
    //    hideHoverControls: true
    //});


    //首页楼层定位
    if ($("div[data-nc-floor-panel]").length) {
        var navShowPostion = $("div[data-nc-floor-panel]:first").offset().top;
        $(window).scroll(function () {
            var b = $(this).scrollTop(),
                $nav = $("#nav");
            b > navShowPostion
                ? $nav.addClass("show")
                : $nav.removeClass("show")
        });
        $(window).triggerHandler("scroll");
    }

    // 秒杀倒计时
    seckillCountDown.init();

    // 秒杀轮播
    if (ncGlobal.seckillSliderSwitch)
        seckillSlider.init();

    // 弹出广告
    indexPopupAdModule.init()

    // 首页顶部固定
    navBarFixed.init()
});

