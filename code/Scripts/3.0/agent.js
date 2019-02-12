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

$.fn.getValues = function () {
    var form = this[0]; elements = form && form.elements, values = {};
    for (var i = 0, len = elements.length, field; field = elements[i]; i++) {
        if (!/submit|button/.test(field.type) && field.type && field.name) {
            values[field.name] = field.value;
        }
    }
    return values;
};

var registerform = $("#registerform").submit(function (e) {
    var values = registerform.getValues();
    e.preventDefault();
    return false;
});

//验证手机QQ
function CheckQQ() {
    var qq = $("#qq").val();
    if (!/^[0-9]*$/gi.test(qq)) {
        showPopupError("#qq", "请输入正确的qq号码！");
        return false;
    } else {
        $("#qq").popover('hide');
        return true;
    }
}

//验证手机号码

function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone) || cellphone.length != 11) {//判断格式是否正确
        showPopupError("#cellphone", "请输入正确的手机号码！");
        return false;
    }

    var type = "";
    if ($("#cellphone").attr("notype") == "agentapply") {
        type = "agentapply";
    }

    $.ajax({
        async: false, type: 'POST', url: "/Account/CheckCellphone", data: { cellphone: cellphone, openid: $("openid").val(), type: type },
        success: function (result) {
            if (result.exists) {
                showPopupError("#cellphone", result.msg);
                return false;
            } else {
                $("#cellphone").popover('hide');
                return true;
            }
        }
    });

    return true;
}

//验证图片验证码
function CheckImgCode() {
    var imgcode = $("#imgCode").val();
    var flag = false;

    if ($.trim(imgcode) == "") {
        showPopupError("#imgCode", "请输入图片验证码！");
    } else {//后台判断图片验证码是否正确
        $.ajax({
            async: false, type: 'POST', url: "/Account/CheckPicCode", data: { code: imgcode },
            success: function (result) {
                if (result) {
                    $("#imgCode").popover('hide');
                    flag = true;
                } else {
                    showPopupError("#imgCode", "图片验证码不正确！");
                }
            }
        });
    }

    return flag;
}

/*验证短信验证码*/
function CheckMsgCode() {
    var msgCode = $("#msgCode").val();
    var result = false;

    if ($.trim(msgCode) == "" || msgCode == $("#msgCode").attr("placeholder")) {
        showPopupError("#msgCode", "请输入短信验证码！");
    } else {
        $("#msgCode").popover('hide');
        result = true;
    }
    return result;
}

/*后台验证短信验证码*/
function ValidateMsgCode() {
    var msgCode = $("#msgCode").val();
    var cellphone = $("#cellphone").val();
    var flag = false;
    var type = "";
    if ($("#msgCode").attr("notype") == "agentapply") {
        type = "agentapply";
    }

    $.ajax({
        async: false,
        type: "POST",
        url: "/account/validatemsgcode",
        data: { mobile: cellphone, code: msgCode, type: type },
        success: function (result) {
            if (result.success) {
                $("#msgCode").popover('hide');
                flag = true;
            } else {
                showPopupError("#msgCode", result.message);
            }
        }, error: function () {
            showPopupError("#msgCode", "验证短信验证码失败！");
        }
    });

    return flag;
}

//绑定失去焦点验证文本内容事件
$(function () {
    $(".BgColorHeight").height($(window).height() / 2)
    $("input[type=text],input[type=button],input[type=password],select").popover({ trigger: 'manual', container: '.wrapper_tips', html: true });

    $("li").click(function (e) {
        var id = $(this).parent().attr("id");

        if (id == "version_value") {
            $("#version_value").find("li").removeClass("selected_li");
            $(this).addClass("selected_li");
            $("#version").val($(this).attr("version_value"));
        } else if ($(this).attr("industy_value") > 0) {
            $("#industy_value").find("li").removeClass("selected_li");
            $(this).addClass("selected_li");
            $("#industry").val($(this).attr("industy_value"));
        }
    });
    $(".input_div input").focus(function () {
        $(this).css("border-color", "#1cc6a3");
    }).blur(function () {
        $(this).css("border-color", "#cecece");
    })

    var timeout = true;

    function smsok() {
        timeout = false;
        var btnSMSCode = $("#btn_code");
        btnSMSCode.prop("disabled", true);

        var t = 60;
        function tick() {
            btnSMSCode.val(t + "s后获取");
            if (t > 0) {
                timeout = false;
                setTimeout(tick, 1000);
                t--;
            } else {
                var smscode = $("#msgCode").val();

                if (smscode == '') {
                    alert("可能是由于移动运营商的短信延迟，您暂时没有收到短信,我们已经将验证码进行自动填写");
                    $("#cellphone").attr("readonly", true);
                    $("#msgCode").val($("#t_code").val());
                }

                btnSMSCode.val("获取验证码");
                btnSMSCode.prop("disabled", false);
            }
        }

        tick();
    }

    //发送短信
    $("#btn_code").click(function () {
        if (!CheckImgCode()) {
            return;
        }

        if (timeout === false) {
            return;
        }

        var btnSMSCode = $("#btn_code");
        var type = "register";

        if (btnSMSCode.attr("codetype") == "agentapply") {
            type = "agentapply";
        }
        btnSMSCode.prop("disabled", true);

        $.ajax({
            url: "/Account/sendmessage",
            data: { mobile: $("#cellphone").val(), type: type, clienttype: "mobile", piccode: $("#imgCode").val() },
            type: "post",
            success: function (rst) {
                if (rst.error) {
                    if (timeout === true) {
                        btnSMSCode.prop("disabled", false);
                    }
                    showPopupError("#btn_code", rst.error);
                    return;
                }
                $("#btn_code").popover('hide');
                $("#t_captchamd5").val(rst.md5n);
                $("#t_mobile").val(rst.mobile);
                $("#t_code").val(rst.code);
                smsok();
            },
            error: function (err) {
                if (timeout === true) {
                    btnSMSCode.prop("disabled", false)
                }
                showPopupError("#btn_code", err.responseText);
            }
        });
    });

    //代理商申请
    $("#btn_apply").click(function () {
        if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else if (!CheckMsgCode()) {//短信验证码是否正确
            return;
        } else if (!ValidateMsgCode()) {//后台验证短信
            return;
        } else {
            $("#btn_apply").val("请稍候...");
            $("#btn_apply").prop("disabled", true);

            $.ajax({
                url: "/mobile/agentapply",
                data: $("#registerform").serialize(),
                type: "post",
                success: function (result) {
                    if (result.success) {
                        $("#btn_apply").popover('hide');
                        $("#step1").css("display", "none");
                        $("#step2").css("display", "block");
                        $("#title").text("完善资料");
                        $("#applyid").val(result.applyid);
                    } else {
                        showPopupError("#btn_apply", result.msg);
                        $("#btn_apply").prop("disabled", false);
                        $("#btn_apply").val("立即申请");
                    }
                }
            });
        }
    });

    //代理商申请完后点击确定
    $("#btn_sure").click(function () {  
        if (!CheckQQ()) {
            return;
        } else {
            $("#btn_sure").val("请稍候...");
            $("#btn_sure").prop("disabled", true);

            $.ajax({
                url: "/mobile/AgentExtendSave",
                data: $("#registerform").serialize(),
                type: "post",
                success: function (result) {
                    if (result.success) {
                        $("#btn_sure").popover('hide');
                        $("#step2").css("display", "none");
                        $("#step3").css("display", "block");
                    } else {
                        showPopupError("#btn_sure", result.msg);
                        $("#btn_sure").prop("disabled", false);
                    }
                }
            });
        }     
    });


    setTimeout(function () {
        $("#cellphone").blur(function () {
            CheckCellphone();
        });

        $("#imgCode").blur(function () {
            CheckImgCode();
        });
        $("#qq").blur(function () {
            CheckQQ();
        })

    }, 3000)
})