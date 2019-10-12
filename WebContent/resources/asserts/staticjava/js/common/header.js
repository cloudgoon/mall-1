/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

/**
 * Created by shopnc.feng on 2016/12/19.
 */
$(function(){
    var hotValue = "";
    var hotName = "";
    var randHotNum = Math.floor(Math.random() * $("a[hotSearch]").size());
    $("a[hotSearch]").each(function(n){
        if (n == randHotNum) {
            hotName = $(this).html();
            hotValue = $(this).data("hotValue");
            if ($("#searchTab").find(".selected").data("sign") == "goods") {
                $("#keyword").attr("placeholder",hotName);
            }
            return false;
        }
    });

    /**
     * Copyright: BIZPOWER
     */
    $("#keyword").focus(function() {
        if ($("#searchTab").find(".selected").data("sign") == "goods") {
            $('#search-tip').show();
        }
    });

    $("#searchTab").find("a").click(function(){
        $(this).addClass("selected").parent().siblings().find("a").removeClass("selected");

        switch ($(this).data("sign")) {
            case "goods":
                var randHotNum = Math.floor(Math.random() * $("a[hotSearch]").size());
                $("a[hotSearch]").each(function(n){
                    if (n == randHotNum) {
                        hotName = $(this).html();
                        hotValue = $(this).data("hotValue");
                        $("#keyword").attr("placeholder",hotName);
                        return false;
                    }
                });
                $("#headerSearchForm").attr("action", ncGlobal.webRoot + "search");
                break;
            case "store":
                $("#keyword").attr("placeholder","请输入您要搜索的店铺关键字");
                $('#search-tip').hide();
                $("#headerSearchForm").attr("action", ncGlobal.webRoot + "search/store");
                break;
            case "distribution":
                $("#keyword").attr("placeholder","请输入您要搜索的推广商品关键字");
                $('#search-tip').hide();
                $("#headerSearchForm").attr("action", ncGlobal.webRoot + "distribution/search");
                break;
            case "purchase":
                $("#keyword").attr("placeholder","请输入您要搜索的供求订单关键字");
                $('#search-tip').hide();
                $("#headerSearchForm").attr("action", ncGlobal.webRoot + "purchase/list");
                break;
        }
    });

    /**
     * Copyright: Bizpower多用户商城系统
     */
    $("#headerSearchForm").submit(function(){
        switch ($("#searchTab").find("a.selected").data("sign")) {
            case "goods":
                var keyword = !$("#keyword").val() && hotValue ? hotValue : $("#keyword").val();
                keyword = encodeURI(keyword);
                Nc.go(ncGlobal.webRoot + "search?keyword=" + keyword);
                break;
            case "store":
                var keyword = $("#keyword").val();
                keyword = encodeURI(keyword);
                Nc.go(ncGlobal.webRoot + "search/store?keyword=" + keyword);
                break;
            case "distribution":
                var keyword = $("#keyword").val();
                keyword = encodeURI(keyword);
                Nc.go(ncGlobal.webRoot + "distribution/search?keyword=" + keyword);
                break;
            case "purchase":
                var keyword = $("#keyword").val();
                keyword = encodeURI(keyword);
                Nc.go(ncGlobal.webRoot + "purchase/list?keyword=" + keyword);
                break;
        }
        return false;
    });

    /**
     * 商品搜索提示
     * Copyright: Bizpower多用户商城系统
     */
    $("#keyword").autocomplete({
        source: function (request, response) {
            if ($("#searchTab").find(".selected").data("sign") != "goods") {
                return false;
            }
            $.getJSON(ncGlobal.webRoot + "search/suggest.json", request, function (data, status, xhr) {
                if (status == 'success' && $.isArray(data) && !Nc.isEmpty(data)) {
                    response(data);
                    $('#search-tip').hide();
                }
            });
        },
        select: function(ev, ui) {
            $("#keywordGoods").val(ui.item.label);
            $("#top_search_form").submit();
        },
        delay: 500
    });
    $('#search-his-del').on('click',function(){
        $.getJSON(ncGlobal.webRoot + "search/history/clean",function(){
            $('#search-his-list').empty();
        });
    });
    $("#keyword").on('blur',function(){
        $('#search-tip').hide();
    });
    $('#search-tip').hover(function(){
        $("#keyword").off('blur');
    },function(){
        $("#keyword").on('blur',function(){
            $('#search-tip').hide();
        });
    });

});