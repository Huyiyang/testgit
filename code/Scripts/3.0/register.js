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
//注册其他单选框判断输入框是否能输入
function checkBoxInput() {
    var checked = $("#step2 .input_div .other_bussiness input[type='checkbox']").is(":checked");
    if (checked) {
        $("#step2 .input_div .other_bussiness input[type='text']").attr('disabled', false);
    } else {
        $("#step2 .input_div .other_bussiness input[type='text']").attr('disabled', true);
        $("#step2 .input_div .other_bussiness input[type='text']").val("");
    }
}
$(function () {
    $("input[type=text],input[type=button],input[type=password],select").popover({ trigger: 'manual', container: '.wrapper_tips2', html: true });
    window.onkeydown = function (e) {
        if (e.keyCode == 13) {
            if ($("#step1").css("display") == "block") {
                $("#btn_reg").click();
            } else if ($("#step2").css("display") == "block") {
                $("#btn_sure").click();
            } else if ($("#step3").css("display") == "block") {
                $("#btn_done").click();
            }
        }
    }

    $("#step1 .input_div input").focus(function () {
        $(this).css("border-color", "#3697d5");
    }).blur(function () {
        $(this).css("border-color", "#cecece");
    });
    $("#register_codebtn a").click(function () {
        $("#register_codeinput").toggleClass("show")
    });

    $(".BgColorHeight").height($(window).height() / 2)


    checkBoxInput();
    /*================================注册：开始===================================*/
    var timeout = true;

    function smsok() {
        timeout = false;
        var btn_code = $("#btn_code");
        btn_code.prop("disabled", true);

        var t = 60;
        function tick() {
            btn_code.val(t + "s后获取");
            if (t > 0) {
                timeout = false;
                setTimeout(tick, 1000);
                t--;
            } else {
                btn_code.val("获取验证码");
                btn_code.prop("disabled", false);
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
            btn_code.prop("disabled", true);

            $.ajax({
                url: "/Account/sendmessage",
                data: { mobile: $("#cellphone").val(), type: 'register', clienttype: "pc", piccode: $("#imgCode").val() },
                type: "post",
                success: function (rst) {
                    if (rst.error) {
                        if (timeout === true) {
                            btn_code.text("获取验证码");
                            btn_code.prop("disabled", false);
                        }
                        showPopupError("#msgCode", rst.error);
                        return;
                    }
                    smsok();
                },
                error: function (err) {
                    if (timeout === true) {
                        btn_code.text("获取验证码");
                        btn_code.prop("disabled", false);
                    }
                    showPopupError("#msgCode", err.responseText);
                }
            });
        }
    });

    /*步骤一：填写验证手机号、密码*/
    $("#btn_reg").click(function () {
        if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else if (!CheckMsgCode()) {//短信验证码是否正确
            return;
        }
        else if (!ValidateMsgCode()) {//后台验证短信
            return;
        } else if (!CheckPassword()) {//登录密码是否正确
            return;
        } else {
            $("#step1").css("display", "none");
            $("#step2").css("display", "block");
        }
    });

    var is_must_companyrealname = false;
    if ($("#is_must_companyrealname").val() != null && $("#is_must_companyrealname").val() == "True") {
        is_must_companyrealname = true;
    }
    var is_must_contact = false;
    if ($("#is_must_contact").val() != null && $("#is_must_contact").val() == "True") {
        is_must_contact = true;
    }
    /*步骤二：填写公司名称、选择行业、业务性质、员工数量、需要管理的业务,点击注册*/

    $("#btn_sure").click(function () {
        $("#btn_sure").popover('hide');
        if (is_must_companyrealname && !CheckCompany()) {//公司名称
            return;
        } else if (is_must_contact && !CheckContact()) {//联系人
            return;
        }
        else if (!CheckIndustry()) {//行业
            return;
        }
        else if (!CheckBusiness()) {//业务性质
            return;
        } else if (!CheckStaffSize()) {//员工数量
            return;
        } else {
            DoRegister("#btn_sure");
        }
    });


    /*第三步：完成注册*/
    $("#btn_done").click(function () {
        DoRegister("#btn_done");
    });

    var span = document.createElement('span');
    span.style.position = 'absolute';
    /*================================注册：结束===================================*/
    var myHref = window.location.search;
    var myurl1 = myHref.split("&");
    if (myurl1[myurl1.length - 1]) {
        var myurl2 = myurl1[myurl1.length - 1].split("=");
        if (/^1[3-9]{1}\d{9}$/gi.test(myurl2[1])) {
            $("#cellphone").val(myurl2[1]);
            setTimeout(function () {
                CheckCellphone();
            }, 100)
        }
    }
    setTimeout(function () {
        //$("#msgCode").val("");
        //$("#password").val("");
        $("#cellphone").blur(function () {
            CheckCellphone();
        });

        $("#imgCode").blur(function () {
            CheckImgCode();
        });

        $("#password").blur(function () {
            CheckPassword();
        });
        if (is_must_companyrealname) {
            $("#companyname").blur(function () {
                CheckCompany();
            });
        }
        if (is_must_contact) {
            $("#contactName").blur(function () {
                CheckContact();
            });
        }
        $("#industry").blur(function () {
            CheckIndustry();
        });

        $("#business").blur(function () {
            CheckBusiness();
        });

        $("#staff_size").blur(function () {
            CheckStaffSize();
        });

    }, 0)
});


/*================================公共调用方法：开始===================================*/

/*检查手机号码*/
function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    var flag = false;
    if ($.trim(cellphone) == "") {
        showPopupError("#cellphone", "请填写手机号码！");
        $("#cellphone").focus();
        $("#cellphone").css("border-color", "#ed6c00 ");
    } else if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone)) {
        showPopupError("#cellphone", "手机号码不正确！");
        $("#cellphone").css("border-color", "#ed6c00 ");
    } else {//后台验证手机号码，成功后将提示信息改为空
        $.ajax({
            async: false, type: 'POST', url: "/Account/CheckCellphone", data: { cellphone: cellphone },
            success: function (result) {
                if (result.exists) {
                    showPopupError("#cellphone", "手机号已被注册！");
                    $("#cellphone").css("border-color", "#ed6c00 ");
                } else {
                    $("#cellphone").popover('hide');
                    flag = true;
                    $("#cellphone").css("border-color", "#e5e5e5 ")
                }
            }
        });
    }

    return flag;
}

/*检查图片验证码*/
function CheckImgCode() {
    var imgcode = $("#imgCode").val();
    var flag = false;

    if ($.trim(imgcode) == "") {
        showPopupError("#imgCode", "请输入图片验证码！");
        $("#imgCode").css("border-color", "#ed6c00 ");
    } else {//后台判断图片验证码是否正确
        $.ajax({
            async: false, type: 'POST', url: "/Account/CheckPicCode", data: { code: imgcode },
            success: function (result) {
                if (result) {
                    $("#imgCode").popover('hide');
                    flag = true;
                    $("#imgCode").css("border-color", "#e5e5e5 ");
                } else {
                    showPopupError("#imgCode", "图片验证码不正确！");
                    $("#imgCode").css("border-color", "#ed6c00 ");
                }
            }
        });
    }

    return flag;
}

/*检查短信验证码*/
function CheckMsgCode() {
    var msgCode = $("#msgCode").val();
    var result = false;

    if ($.trim(msgCode) == "" || msgCode == $("#msgCode").attr("placeholder")) {
        showPopupError("#msgCode", "请输入短信验证码！");
        $("#msgCode").css("border-color", "#ed6c00 ");
    } else {
        $("#msgCode").popover('hide');
        result = true;
        $("#msgCode").css("border-color", "#e5e5e5 ");
    }
    return result;
}

/*后台验证短信验证码*/
function ValidateMsgCode() {
    var msgCode = $("#msgCode").val();
    var cellphone = $("#cellphone").val();
    var flag = false;

    $.ajax({
        async: false,
        type: "POST",
        url: "/account/validatemsgcode",
        data: { mobile: cellphone, code: msgCode },
        success: function (result) {
            if (result.success) {
                flag = true;
                $("#msgCode").popover('hide');
            } else {
                showPopupError("#msgCode", result.message);
            }
        }, error: function () {
            showPopupError("#msgCode", "验证短信验证码失败！");
        }
    });

    return flag;
}

/*检查是否同意来肯协议*/
function ValidateAgree() {
    if (!$("#agree").is(':checked')) {
        showPopupError("#btn_reg", "同意来肯云商服务协议才可以注册！");
        return false;
    } else {
        $("#btn_reg").popover('hide');
        return true;
    }
}

/*检查密码*/
function CheckPassword() {
    var password = $("#password").val();
    var result = false;

    if (password == null || password.length < 6 || password == $("#password").attr("placeholder")) {
        showPopupError("#password", "请输入6位以上密码！");
        $("#password").css("border-color", "#ed6c00 ");
    } else {
        var pattern = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];

        var times = 0;
        for (var i = 0; i < pattern.length; i++) {
            times += (pattern[i].test(password) ? 1 : 0);
        }
        if (times < 1 && password.length != 0) {
            showPopupError("#password", "密码必须由数字和字母组成！");
            $("#password").css("border-color", "#ed6c00 ");
        } else {
            result = true;
            $("#password").popover('hide');
            $("#password").css("border-color", "#e5e5e5 ");
        }
    }

    return result;
}

/*检查验证秘密*/
function CheckConfirmPassword() {
    var confirmpwd = $("#confirmpwd").val();
    var password = $("#password").val();
    var result = false;

    if (confirmpwd == "") {
        showPopupError("#confirmpwd", "请输入确认密码！");
        $("#confirmpwd").css("border-color", "#ed6c00 ");
    } else if (confirmpwd != password) {
        showPopupError("#confirmpwd", "两次输入的密码不一致！");
        $("#confirmpwd").css("border-color", "#ed6c00 ");
    } else {
        result = true;
        $("#confirmpwd").popover('hide');
        $("#confirmpwd").css("border-color", "#e5e5e5 ");
    }

    return result;
}

/*检查公司名称*/
function CheckCompany() {
    var companyname = $("#companyname").val();
    var result = false;
    if ($.trim(companyname) == "" && is_must_companyrealname) {
        showPopupError("#companyname", "请填写公司名称！");
        $("#companyname").css("border-color", "#ed6c00 ");
    } else {
        $("#companyname").popover('hide');
        result = true;
        $("#companyname").css("border-color", "#e5e5e5 ");
    }

    return result;
}
/*检查联系人*/
function CheckContact() {
    var contactName = $("#contactName").val();
    var result = false;
    if ($.trim(contactName) == "" && is_must_contact) {
        showPopupError("#contactName", "请填写联系人姓名！");
        $("#contactName").css("border-color", "#ed6c00 ");
    } else {
        $("#contactName").popover('hide');
        result = true;
        $("#contactName").css("border-color", "#e5e5e5 ");
    }

    return result;
}
/*检查行业*/
function CheckIndustry() {
    var industry = $("#industry").val();
    var result = false;
    if (industry == "") {
        showPopupError("#industry", "请选择行业！");
        $("#industry").css("border-color", "#ed6c00 ");
    } else {
        $("#industry").popover('hide');
        result = true;
        $("#industry").css("border-color", "#e5e5e5 ");
    }

    return result;
}

/*检查业务性质*/
function CheckBusiness() {
    var business = $("#business").val();
    var result = false;
    if (business == "") {
        showPopupError("#business", "请选择业务性质！");
        $("#business").css("border-color", "#ed6c00 ");
    } else {
        $("#business").popover('hide');
        result = true;
        $("#business").css("border-color", "#e5e5e5 ");
    }

    return result;
}

/*检查员工数量*/
function CheckStaffSize() {
    var staff_size = $("#staff_size").val();
    var result = false;

    if (staff_size == "") {
        showPopupError("#staff_size", "请选择员工数量！");
        $("#staff_size").css("border-color", "#ed6c00 ");
    } else {
        $("#staff_size").popover('hide');
        result = true;
        $("#staff_size").css("border-color", "#e5e5e5 ");
    }

    return result;
}

/*注册*/
function DoRegister(btn) {
    var data = $("#registerForm").serialize();
    $(btn).val("正在为您注册...");
    $(btn).prop("disabled", true);
    $.ajax({
        async: true,
        url: "/account/pcregister",
        type: "POST",
        data: data,
        success: function (result) {
            if (result.success) {
                $(btn).val("正在登录系统...");
                //判断域名
                if ($("#domain").val() != "") {
                    var href = location.href.indexOf("https") >= 0 ? "https://" : "http://";
                    //跨域写入cookie
                    $.getJSON(href + $("#domain").val() + "/service/WriteLoginInfoTo?tok=" + result.token + "&s=" + result.sign + "&jsoncallback=?",
                          function (json) {
                          });
                }
                window.location.href = "/account/RegisterSuc?companyid=" + result.msg;
            } else {
                showPopupError(btn, result.msg);
                $(btn).val("开始使用");
                $(btn).prop("disabled", false);
            }
        }, error: function (result) {
            showPopupError("#btn_sure", result.responseText);
            $(btn).val("开始使用");
            $(btn).prop("disabled", false);
        }
    });
}
/*================================公共调用方法：结束===================================*/