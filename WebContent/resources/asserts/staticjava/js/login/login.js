/**
 * Copyright: Bizpower多用户商城系统
 * Copyright: www.bizpower.com
 * Copyright: 天津网城商动科技有限责任公司
 */

$(function () {
    //注册方式切换
    $('#loginModule').tabulous({
        effect: 'slideLeft'
    });

    $("#loginModule .login-tabs-nav li a").click(function () {
        var div_form = $(this).attr('href');
        $(div_form).find("[nc_type='changeCaptcha']").trigger("click");
        $("#mobileModule").show();
        return false;
    });

    /**
     * Copyright: 天津网城商动科技有限责任公司
     */
    // 勾选自动登录显示隐藏文字
    $('input[name="autoLogin"]').click(function () {
        if ($(this).attr('checked')) {
            $(this).attr('checked', true).next().show();
        } else {
            $(this).attr('checked', false).next().hide();
        }
    });

    $("#loginSubmit").click(function () {
        if ($("#loginForm").valid()) {
            var autoLogin = 0;
            if ($("#autoLogin").attr("checked") == "checked") {
                autoLogin = 1;
            }
            var params = {
                "loginName": $("#loginName").val(),
                "memberPwd": $("#memberPwd").val(),
                "captcha": $("#captcha").val(),
                "autoLogin": autoLogin
            };
            $.post(ncGlobal.webRoot + "login/common", params, function (xhr) {
                if (xhr.code == 200) {
                    window.location.href = ncGlobal.memberRoot;
                } else {
                    $("#codeimage").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
                    Nc.alertError(xhr.message);
                }
            });
        } else {
            //w w w . b i z p o w e r . c o m
            $("#codeimage").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
        }
        return false;
    });

    $("#mobileSubmit").click(function () {
        if ($("#mobileForm").valid()) {
            var params = {"mobile": $("#mobile").val(), "authCode": $("#authCode").val()};
            $.post(ncGlobal.webRoot + "login/mobile", params, function (xhr) {
                if (xhr.code == 200) {
                    window.location.href = ncGlobal.memberRoot;
                } else {
                    Nc.alertError(xhr.message);
                }
            });
        }
        return false;
    });

    $("#loginForm").validate({
        errorPlacement: function (error, element) {
            var error_item = element.parent('.item');
            error_item.append(error);
        },
        //w w w . b i z p o w e r . c o m
        highlight: function (element, errorClass, validClass) {
            $(element).parent('.item').addClass('item-error').removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parent('.item').removeClass('item-error').addClass(validClass);
        },
        onfocusin: function (element, event) {
            this.lastActive = element;
            if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                if (this.settings.unhighlight) {
                    this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                }
                this.addWrapper(this.errorsFor(element)).hide();
            }
            $(element).parent('.item').addClass('item-focus')
        },
        onfocusout: function (element, event) {
            if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                this.element(element);
            }
            $(element).parent('.item').removeClass('item-focus')
        },
        onkeyup: false,
        rules: {
            loginName: {
                required: true
            },
            memberPwd: {
                required: true
            },
            captcha: {
                required: true,
                //w w w . b i z p o w e r . c o m
                remote: {
                    url: ncGlobal.webRoot + 'captcha/check',
                    type: 'get',
                    data: {
                        captcha: function () {
                            return $('#captcha').val();
                        }
                    },
                    complete: function (data) {
                        if (data.responseText == 'false') {
                            $("#codeimage").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
                        }
                    }
                }
            }
        },
        messages: {
            loginName: {
                required: '<i class="fa fa-exclamation-circle"></i>用户名不能为空'
            },
            memberPwd: {
                required: '<i class="fa fa-exclamation-circle"></i>密码不能为空'
            },
            captcha: {
                required: '<i class="fa fa-exclamation-circle"></i>验证码不能为空',
                remote: '<i class="fa fa-times-circle-o"></i>验证码错误'
            }
        }
    });

    $("#mobileForm").validate({
        errorPlacement: function (error, element) {
            var error_item = element.parent('.item');
            error_item.append(error);
        },

        highlight: function (element, errorClass, validClass) {
            $(element).parent('.item').addClass('item-error').removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parent('.item').removeClass('item-error').addClass(validClass);
        },
        //w w w . b i z p o w e r . c o m
        onfocusin: function (element, event) {
            this.lastActive = element;
            if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                if (this.settings.unhighlight) {
                    this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                }
                this.addWrapper(this.errorsFor(element)).hide();
            }
            $(element).parent('.item').addClass('item-focus')
        },
        onfocusout: function (element, event) {
            if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                this.element(element);
            }
            $(element).parent('.item').removeClass('item-focus')
        },
        onkeyup: false,
        rules: {
            mobile: {
                required: true,
                mobile: true
            },
            authCode: {
                required: true,
                rangelength: [6, 6]
            }
        },
        messages: {
            mobile: {
                required: '<i class="fa fa-exclamation-circle"></i>手机号不能为空',
                mobile: '<i class="fa fa-exclamation-circle"></i>请输入正确的手机号'
            },
            authCode: {
                required: '<i class="fa fa-exclamation-circle"></i>短信动态码不能为空',
                rangelength: '<i class="fa fa-exclamation-circle"></i>短信动态码错误',
            }
        }
    });

    /**
     * Copyright: 天津网城商动科技有限责任公司
     */
    //发送手机验证码
    $("#sendSmsCode").click(function () {
        if ($("#mobile").val().length != 11) {
            $("#codeimageMobile").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
            Nc.alertError("请输入正确的手机号");
            return false;
        }
        //验证码验证
        var captchaMobile = $("#captchaMobile").val();
        if (!captchaMobile) {
            $("#codeimageMobile").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
            Nc.alertError("请输入验证码");
            return false;
        }
        //发送动态码
        var ajaxurl = ncGlobal.webRoot + 'login/sendsmscode';
        var params = {};
        params.mobile = $('#mobile').val();
        params.captcha = captchaMobile;
        $.ajax({
            type: "post",
            url: ajaxurl,
            data: params,
            async: false,
            success: function (xhr) {
                if (xhr.code == 200) {
                    Nc.alertSucceed("短信动态码已发出");
                    $("#authCode").val(xhr.data.authCode);
                    $("#captchaMobile").val("");
                    $("#codeimageMobile").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
                    return;
                } else {
                    $("#codeimageMobile").attr("src", ncGlobal.webRoot + 'captcha/getcaptcha?t=' + Math.random());
                    Nc.alertError(xhr.message);
                    return;
                }
            }
        });
        return false;
    });

    //微信登录
    var __showFlat;
    $("#weixinLogin").click(function () {
        if (__showFlat) {
            return;
        }
        //是否开启微信登录测试
        var openTest = false;
        if (openTest == false) {
            __showFlat = Nc.layerOpen({
                type: 2,
                title: '微信登录',
                content: ncGlobal.webRoot + "api/login/weixin",
                skin: "default",
                area: ['360px', '450px'],
                btn: '',
                success: function () {
                    __showFlat = null;
                }
            });
        } else {
            Nc.go(ncGlobal.webRoot + "api/login/weixin");
        }
    });

});