$(function () {
    //控制显示
    var toStep = function (id, pre) {
        pre && history.pushState({ id: id, pre: pre }, "");
        $("#" + id).removeClass("hidden").siblings().addClass("hidden");
    }

    var timeout = true;

    function smsok() {
        timeout = false;
        var btn_code = $("#btnMsgCode");
        btn_code.prop("disabled", true);

        var t = 60;
        function tick() {
            btn_code.html(t + "s后获取");
            if (t > 0) {
                timeout = false;
                setTimeout(tick, 1000);
                t--;
            } else {
                btn_code.html("获取验证码");
                btn_code.prop("disabled", false);
                timeout = true;
            }
        }
        tick();
    }

    $("#btnMsgCode").click(function () {//获取短信验证码
        if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (timeout === false) {//检查能否发送短信
            return;
        } else {
            var btn_code = $("#btnMsgCode");
            btn_code.prop("disabled", true);

            $.ajax({
                url: "/Account/sendmessage",
                type: "POST",
                async: false,
                dataType:"json",
                data: { mobile: $("#cellphone").val(), type: "customizedapply" },
                success: function (rst) {
                    if (rst.error) {
                        if (timeout === true) {
                            btn_code.html("获取验证码");
                            btn_code.prop("disabled", false);
                        }
                        showMessage(rst.error);
                        return;
                    } else {
                        removeMessage();
                    }
                    $("#t_code").val(rst.code);
                    smsok();
                },
                error: function (err) {
                    if (timeout === true) {
                        btn_code.html("获取验证码");
                        btn_code.prop("disabled", false);
                    }
                    showMessage("验证码获取失败！");
                }
            });
        }
    });

    //获取方案
    $("#btnNext").click(function () {
        if (!CheckCellphone()) {
            return;
        } else if (!CheckMsgCode()) {
            return;
        } else {
            removeMessage();
            toStep("step2", "step1");
        }
    });

    //提交
    $("#btnSubmit").click(function () {
        if (!CheckContactor()) {
            return;
        } else {
            $("#btnSubmit").attr("disabled", "disabled");
            $.ajax({
                url: "/Account/CustomizedApply",
                type: "POST",
                async: false,
                dataType: "json",
                data: { cellphone: $("#cellphone").val(), msgCode: $("#msgcode").val(), contactor: $("#contactor").val(), companyname: $("#companyname").val(), requirement: $("#requirement").val() },
                success: function (rst) {
                    if (rst.success) {
                        removeMessage();
                        toStep("step3", "step2");
                    } else {
                        showMessage(rst.message);
                        $("#btnSubmit").removeAttr("disabled");
                    }
                },
                error: function (err) {
                    showMessage("信息提交错误，请联系客服！");
                    $("#btnSubmit").removeAttr("disabled");
                }
            });
        }
    });

    window.addEventListener("popstate", function (e) {
        toStep(e.state && e.state.id || "step1")
    }, false)
});

//提示信息
function showMessage(message) {
    $("#registerTips").fadeIn(200);
    $("#registerTips span").text(message);
}

//去掉提示信息
function removeMessage() {
    $("#registerTips").fadeOut(200);
}

//检查手机号码
function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    var flag = false;
    if ($.trim(cellphone) == "") {
        showMessage("请填写手机号码！");
    } else if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone)) {
        showMessage("手机号码不正确！");
    } else {//后台验证手机号码，成功后将提示信息改为空
        $.ajax({
            url: "/Account/CustomizedMobileValidate",
            type: "POST",
            async:false,
            dataType:"json",
            data: { mobile: cellphone },
            success: function (result) {
                if (!result.success) {
                    showMessage(result.message);
                } else {
                    flag = true;
                    removeMessage();
                }
            }, error: function (result) {
            }
        });
    }

    return flag;
}

//检查验证码
function CheckMsgCode() {
    var msgcode = $("#msgcode").val();
    var flag = false;
    if ($.trim(msgcode) == "") {
       showMessage("请填写短信验证码！");
    } else {
        $.ajax({
            async: false,
            type: "POST",
            url: "/account/validatemsgcode",
            data: { mobile: $("#cellphone").val(), code: msgcode, type: "customizedapply" },
            success: function (result) {
                if (result.success) {
                    flag = true;
                    removeMessage();
                } else {
                    showMessage(result.message)
                }
            }, error: function () {
                showMessage("验证短信验证码失败！");
            }
        });
    }

    return flag;
}

//检查联系人
function CheckContactor() {
    var contactor = $("#contactor").val();
    var flag = false;
    if ($.trim(contactor) == "") {
        showMessage("请填写联系人！");
    } else {
        flag = true;
        removeMessage();
    }

    return flag;
}