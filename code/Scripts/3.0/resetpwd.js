/// <reference path="../jquery-1.11.0.min.js" />

function getErrorHTML(msg) {
    return "<span class='glyphicon glyphicon-remove-sign' style='font-size:15px;width:15px;color:red'></span> <span style='color:red'>" + msg + "<span>"
}

function getInfoHTML(msg) {
    return "<span class='' style='font-size:15px;width:15px;color:green'></span> <span style='color:green'>" + msg + "<span>"
}

function showPopupError(selector, msg) {
    $(selector).attr("data-content", getErrorHTML(msg));
    $(selector).popover('show');
}

function showPopupInfo(selector, msg) {
    $(selector).attr("data-content", getInfoHTML(msg));
    $(selector).popover('show');
}


$(function () {
    $("input[type=text],input[type=button],input[type=password],select").popover({ trigger: 'manual', container: '.wrapper_tips2', html: true });
    window.onkeydown = function(e) {
        if (e.keyCode == 13) {
            $("#btn_reset").click();
        }
    }
    $(".input_div input").focus(function () {
        $(this).css("border-color", "#47b3db");
    }).blur(function () {
        $(this).css("border-color", "#dcdcdc");
    })
    /*================================重置密码：开始===================================*/

    var timeout = true;

    function smsok() {
        timeout = false;
        var btn_code = $("#btn_code");
        btn_code.attr("disabled", true);
        btn_code.addClass('btn_code_normal_clicked');

        var t = 60;
        function tick() {
            btn_code.val(t + "s后再获取");
            if (t > 0) {
                timeout = false;
                setTimeout(tick, 1000);
                t--;
            } else {
                btn_code.val("获取验证码");
                btn_code.attr("disabled", false);
                btn_code.removeClass("btn_code_normal_clicked");
                timeout = true;
            }
        }
        tick();
    }

    $("#btn_code").click(function () {//获取短信验证码
        if (!CheckCellphone) {//手机号码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else if (timeout === false) {//检查能否发送短信
            return;
        } else {
            var btn_code = $("#btn_code");
            btn_code.attr("disabled", true);

            $.ajax({
                url: "/Account/sendmessage",
                data: { mobile: $("#cellphone").val(), type: 'resetpwd', clienttype: "pc", piccode: $("#imgCode").val() },
                type: "post",
                success: function (rst) {
                    if (rst.error) {
                        if (timeout === true) {
                            btn_code.text("获取验证码");
                            btn_code.attr("disabled", false);
                        }
                        showPopupError("#msgCode", rst.error);
                        return;
                    }
                    smsok();
                },
                error: function (err) {
                    if (timeout === true) {
                        btn_code.text("获取验证码");
                        btn_code.attr("disabled", false);
                    }
                    showPopupError("#msgCode", err.responseText);
                }
            });
        }
    });

    $("#btn_reset").click(function () {
        if (!CheckCellphone()) {
            return;
        } else if (!CheckImgCode()) {
            return;
        } else if (!CheckPassword()) {
            return;
        } else {
            $("#btn_reset").attr("disabled", "disabled");
            $.ajax({
                url: "/account/resetpwd",
                data: { cellphone: $("#cellphone").val(), smscode: $("#msgCode").val(), password: $("#password").val() },
                type: "post",
                success: function (result) {
                    if (result.error) {
                        showPopupError("#btn_reset", result.error);
                    } else {
                        alert("重置成功，即将跳转到登录界面！");
                        location.href = "logon";
                    }
                }, error: function (result) {
                    showPopupError("#btn_reset", result.responseText);
                    $("#btn_reset").removeAttr("disabled");
                }
            });
        }
    });
    /*================================重置密码：结束===================================*/

    setTimeout(function () {
        $("#cellphone").blur(function () {
            CheckCellphone();
        });

        $("#imgCode").blur(function () {
            CheckImgCode();
        });

        $("#password").blur(function () {
            CheckPassword();
        });
    }, 0);    
});

/*================================公共调用：开始===================================*/

/*检查手机号码*/
function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    var result = false;

    if ($.trim(cellphone) == "" || cellphone == $("#cellphone").attr("placeholder")) {
        showPopupError("#cellphone", "请填写手机号码！");
    } else if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone)) {
        showPopupError("#cellphone", "手机号码不正确！");
    } else {
        $("#cellphone").popover('hide');
        result = true;
    }

    return result;
}

/*检查图片验证码*/
function CheckImgCode() {
    var imgcode = $("#imgCode").val();
    var flag = false;

    if ($.trim(imgcode) == "" || imgcode == $("#imgcode").attr("placeholder")) {
        showPopupError("#imgCode", "请填写图片验证码！");
    } else {//后台判断图片验证码是否正确
        $.ajax({
            async: false, type: 'POST', url: "/Account/CheckPicCode", data: { code: imgcode },
            success: function (result) {
                if (result) {
                    $("#imgCode").popover('hide');
                    flag = true;
                } else {
                    showPopupError("#imgCode", "图片验证码错误！");
                }
            }
        });
    }

    return flag;
}

//图片验证码错误后点击错误图片，则清空验证码内容，隐藏错误提示图片
$("#pic_validate").click(function () {
    $("#imgCode").val("");
    $("#imgCode").focus();
    $("#pic_validate").css("display", "none");
});

/*检查密码*/
function CheckPassword() {
    var password = $("#password").val();
    var result = false;

    if (password == null || password.length < 6 || password == $("#password").attr("placeholder")) {
        showPopupError("#password", "请输入6位以上密码！");
    } else {
        var pattern = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];

        var times = 0;
        for (var i = 0; i < pattern.length; i++) {
            times += (pattern[i].test(password) ? 1 : 0);
        }
        if (times < 1 && password.length != 0) {
            showPopupError("#password", "密码必须由数字和字母组成！");
        } else {
            result = true;
            $("#password").popover('hide');
        }
    }

    return result;
}

/*================================公共调用：结束===================================*/