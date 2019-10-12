/**
 * Created by ADKi on 2017/7/4 0004.
 */
function nc_login_new() {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: 'reveal-modal',
        area: ['440px', '404px'],
        content: $('#nc-login-new')
    });
}

function nc_login_submit() {
    $(".nc-login-form-new").validate({
        errorPlacement: function(error, element){
            var error_td = element.parent('dd');
            error_td.append(error);
            element.parents('dl:first').addClass('error');
        },
        success: function(label) {
            label.parents('dl:first').removeClass('error').find('label').remove();
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
                required: true
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
                required: '<i class="fa fa-times-circle-o" title="验证码不能为空"></i>'
            }
        },
        invalidHandler : function(){
            return false;
        },
        submitHandler : function(form) {  //验证通过后的执行方法
            var username = $('#loginName').val();
            var password = $('#memberPwd').val();
            var captcha = $('#captcha').val();

            $.ajax({
                url: 'index.php?act=login&op=login',
                type : "post",
                data: {
                    ajax: 1,
                    user_name: username,
                    password: password,
                    captcha: captcha,
                },
                dataType : "json",
                success : function(result) {
                    if (result.state == 0) {
                        layer.msg(result.msg);
                        javascript:document.getElementById('codeimage').src='index.php?act=seccode&op=makecode&type=shopnc&t=' + Math.random();
                    } else {
                        layer.msg('登录成功正在跳转');
                        window.location.reload();
                    }
                }
            });
            return false;
        }
    });
    // 勾选自动登录显示隐藏文字
    $('input[name="autoLogin"]').click(function(){
        if ($(this).attr('checked')){
            $(this).attr('checked', true).next().show();
        } else {
            $(this).attr('checked', false).next().hide();
        }
    });
}