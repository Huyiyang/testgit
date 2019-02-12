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

//提示信息
function showMessage(message) {
    $("#registerTips").fadeIn(200);
    $("#registerTips span").text(message);
}

//去掉提示信息
function removeMessage() {
    $("#registerTips").fadeOut(200);
}

//验证用户昵称
function CheckUserRealName() {
    var userrealname = $("#userrealname").val();

    if (userrealname == null || userrealname == "") {
        showMessage("请输入用户昵称！");
        return false;
    } else {
        removeMessage();
    }

    return true;
}

//验证手机号码
function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    if (cellphone.length === 0) {
        showMessage("手机号不能为空");
        return false;
    }
    if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone) || cellphone.length != 11) {//判断格式是否正确
        showMessage("请输入正确的手机号码！");
        return false;
    } else {
        var type = $("#cellphone").attr("notype");
        if (type == null || type == "") {
            type = "";
        }

        $.ajax({
            async: false, type: 'POST', url: "/Account/CheckCellphone", data: { cellphone: cellphone, openid: $("openid").val(), type: type },
            success: function (result) {
                if (result.exists) {
                    showMessage(result.msg);
                    return false;
                } else {
                    removeMessage();
                }
            }
        });
        return true;
    }


}

//验证图片验证码
function CheckImgCode() {
    var imgcode = $("#imgCode").val();
    var flag = false;

    if ($.trim(imgcode) == "") {
        showMessage("请输入图片验证码！");
    } else {//后台判断图片验证码是否正确
        $.ajax({
            url: "/Account/CheckPicCode",
            type: 'POST',
            async: false,
            data: { code: imgcode },
            success: function (result) {
                if (result) {
                    flag = true;
                    removeMessage();
                } else {
                    showMessage("图片验证码不正确！");
                }
            }
        });

    }

    return flag;
}
//“看不清，换一张”点击事件
$(function () {
    $("#registerform #changePicCode").on("click", function () {
        $("#picCode")[0].src = '/account/GetValidateCode?r=' + Math.random();
    });
})


/*验证短信验证码*/
function CheckMsgCode() {
    var msgCode = $("#msgCode").val();
    var result = false;

    if ($.trim(msgCode) == "" || msgCode == $("#msgCode").attr("placeholder")) {
        showMessage("请输入短信验证码！");
    } else {
        result = true;
        removeMessage();
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
                flag = true;
            } else {
                showMessage(result.message)
            }
        }, error: function () {
            showMessage("验证短信验证码失败！");
        }
    });

    return flag;
}

//验证密码
function CheckePassword() {
    var password = $("#password").val();
    if (password == null || password.length < 6) {
        showMessage("请输入6位以上密码！")
        return false;
    }

    var pattern = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];

    var times = 0;
    for (var i = 0; i < pattern.length; i++) {
        times += (pattern[i].test(password) ? 1 : 0);
    }
    if (times < 1 && password.length != 0) {
        showMessage("密码由字母和数字组成");
        return false;
    } else {
        removeMessage();
    }

    return true;
}

/*验证公司名称*/
function CheckCompany() {
    var companyname = $("#companyname").val();
    var result = false;

    if ($.trim(companyname) == "" && is_must_companyrealname) {
        showMessage("请填写公司名称！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}
/*验证联系人姓名*/
function CheckContact() {
    var contactName = $("#contactName").val();
    var result = false;

    if ($.trim(contactName) == "" && is_must_contact) {
        showMessage("请填写联系人姓名！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}

/*检查行业*/
function CheckIndustry() {
    var industry = $("#industry").val();
    var result = false;
    if (industry == "") {
        showMessage("请选择行业！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}

/*检查业务性质*/
function CheckBusiness() {
    var business = $("#business").val();

    if (business == "") {
        showMessage("请选择业务性质！")

    } else {
        result = true;
        removeMessage();
    }

    return result;
}

/*检查员工数量*/
function CheckStaffSize() {
    var staff_size = $("#staff_size").val();
    var result = false;

    if (staff_size == "") {
        showMessage("请选择员工数量！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}


/*验证代理商公司名称*/
function CheckAgent() {
    var agent = $("#agent").val();
    var result = false;

    if ($.trim(agent) == "" || agent == $("#agent").attr("placeholder")) {
        showMessage("请填写代理商名称！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}

/*验证登录名*/
function CheckUserName() {
    var username = $("#username").val();
    var result = false;

    if ($.trim(username) == "" || username == $("#username").attr("placeholder")) {
        showMessage("请填写登录名！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}

/*验证登录密码*/
function CheckAgentPwd() {
    var agentpwd = $("#agentpwd").val();
    var result = false;

    if ($.trim(agentpwd) == "" || agentpwd == $("#agentpwd").attr("placeholder")) {
        showMessage("请填写代登录密码！");
    } else {
        result = true;
        removeMessage();
    }

    return result;
}
//验证手机QQ
function CheckQQ() {
    var qq = $("#qq").val();
    if (!/^[0-9]*$/gi.test(qq) && qq != "") {
        showMessage("请输入正确的qq号码！")
        return false;
    } else {
        return true;
        removeMessage();
    }
}

//绑定失去焦点验证文本内容事件
$(function () {
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
                btnSMSCode.val("获取验证码");
                btnSMSCode.prop("disabled", false);
                timeout = true;
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
        var type = btnSMSCode.attr("codetype");

        if (type == null || type == "") {
            type = "register";
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
                    showMessage(rst.error);
                    return;
                } else {
                    removeMessage();
                }
                smsok();
            },
            error: function (err) {
                if (timeout === true) {
                    btnSMSCode.prop("disabled", false)
                }
                showMessage(err.responseText);
            }
        });
    });

    //点击立即注册
    setTimeout(function () {
        $("#cellphone").blur(function () {
            CheckCellphone();
        });
        $("#imgCode").blur(function () {
            CheckImgCode();
        });
        $("#msgCode").blur(function () {
            CheckMsgCode();
        });
        if (is_must_companyrealname) {
            $("#companyname").blur(function () {
                CheckCompany();
            })
        }
        if (is_must_contact) {
            $("#contactName").blur(function () {
                CheckContact();
            });
        }
    }, 0)

    $("#btn_register").click(function () {
        if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else if (!CheckMsgCode()) {//短信验证码是否正确
            return;
        } else if (!ValidateMsgCode()) {//后台验证短信
            return;
        } else if (!CheckePassword()) {
            return;
        } else {
            $("#btn_register").val("请稍候...");
            $("#btn_register").prop("disabled", true);
            $("#step1").css("display", "none");
            $("#step2").css("display", "block");
            $("#title").text("信息设置");
            removeMessage();
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
    //点击开始使用
    $("#btn_begin").click(function () {

        if ($("#foractive").val() == "1") {
            if (!CheckCellphone()) {//手机号码是否正确
                return;
            } else if (!CheckImgCode()) {//图片验证码是否正确
                return;
            } else if (!CheckMsgCode()) {//短信验证码是否正确
                return;
            } else if (!ValidateMsgCode()) {//后台验证短信
                return;
            } else if (!CheckePassword()) {
                return;
            }
        }
        if (is_must_companyrealname && !CheckCompany()) {//公司名称
            return;
        } else if (is_must_contact && !CheckContact()) {//联系人
            return;
        }
        else if (!CheckIndustry()) {//所属行业
            return;
        } else if (!CheckBusiness()) {//业务性质
            return;
        } else if (!CheckStaffSize()) {//员工数量
            return;
        } else {
            $("#btn_begin").val("请稍候...");
            $("#btn_begin").prop("disabled", true);

            $.ajax({
                url: "/Account/mobileregister",
                data: $("#registerform").serialize(),
                type: "post",
                success: function (result) {
                    if (result.success) {
                        if ($("#foractive").val() == "1") {
                            location.href = "/mobile/successforactive?companyid=" + result.msg;
                        } else {
                            location.href = "/mobile/success?companyid=" + result.msg + "&sourceflag=" + $("#sourceflag").val();
                        }
                    } else {
                        showMessage(result.msg);
                        $("#btn_begin").val("注  册");
                        $("#btn_begin").prop("disabled", false);
                    }
                }
            });
        }
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
                        removeMessage();
                        $("#step1").css("display", "none");
                        $("#step2").css("display", "block");
                        $("#title").text("完善资料");
                        $("#applyid").val(result.applyid);
                    } else {
                        showMessage(result.msg);
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
                        location.href = "/mobile/partnerinfo?info=客服经理将在一个工作日内与您联系&message=" + result.msg;
                    } else {
                        showMessage(result.msg);
                        $("#btn_begin").prop("disabled", false);
                    }
                }
            });
        }

    });

    //推广员立即注册
    $("#btn_promoter_register").click(function () {
        if (!CheckUserRealName()) {//昵称是否输入正确
            return;
        } else if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else if (!CheckMsgCode()) {//短信验证码是否正确
            return;
        } else {
            $("#btn_promoter_register").val("请稍后...");
            $("#btn_promoter_register").prop("disabled", true);

            $.ajax({
                url: "/mobile/promoterapply",
                data: $("#registerform").serialize(),
                type: "post",
                success: function (result) {
                    if (result.success) {
                        location.href = "/mobile/partnerinfo?info=关注来肯在线公众号即可获取推广支持&message=" + result.msg;
                    } else {
                        showMessage(result.msg);
                        $("#btn_promoter_register").prop("disabled", false);
                        $("#btn_promoter_register").val("立即注册");
                    }
                }, error: function (result) {
                    showMessage(result.msg);
                    $("#btn_promoter_register").prop("disabled", false);
                    $("#btn_promoter_register").val("立即注册");
                }
            });
        }
    });

    //代理商登录验证
    $("#btn_login").click(function () {
        if (!CheckAgent()) {//代理商名称是否正确
            return;
        } else if (!CheckUserName()) {//用户名是否正确
            return;
        } else if (!CheckAgentPwd()) {//登录密码是否正确
            return;
        } else if (!CheckImgCode()) {//图片验证码是否正确
            return;
        } else {
            $("#btn_login").val("请稍候...");
            $("#btn_login").prop("disabled", true);

            $.ajax({
                url: "/Mobile/AgentValidate",
                data: $("#registerform").serialize(),
                type: "post",
                success: function (result) {
                    if (result.success) {
                        location.href = result.msg;
                    } else {
                        showMessage(result.msg);
                        $("#btn_login").val("立即绑定");
                        $("#btn_login").prop("disabled", false);
                    }
                }
            });

        }
    });

    //返回
    $("#backFirst").click(function () {
        $("#step2").css("display", "none");
        $("#step1").css("display", "block");
    });

    setTimeout(function () {
        $("#cellphone").blur(function () {
            CheckCellphone();
        });
    }, 3000);

    //右侧弹出框
    $(".input_divtext").click(function () {
        $(this).next().next(".rightPanle").show().children(".rightPanle_wra").animate({ "right": "0px" });
        $(this).parent().addClass("active");
    });
    $(".manageTypePanle").height($(window).height())
    //行业
    $("#industryItem li").click(function () {
        $(".industryPanle .rightPanle_wra").animate({ "right": "-320px" }, function () { $(".industryPanle").hide(); });
        var value = $(this).attr("title");
        var text = $(this).children("span").text();
        $("#industry").val(value);
        $("#input_industrytext").text(text);
        CheckIndustry();
    });
    //行业性质
    $("#businessItem div").click(function () {
        $(".businessPanle .rightPanle_wra").animate({ "right": "-320px" }, function () { $(".businessPanle").hide(); });
        var value = $(this).attr("title");
        $("#business").val(value);
        var text = $(this).text();
        $("#input_businesstext").text(text);
        CheckBusiness();
    });
    $("#business").val(1);
    $("#input_businesstext").text("零售");
    //员工人数
    $("#staffSizeItem div").click(function () {
        $(".staffSizePanle .rightPanle_wra").animate({ "right": "-320px" }, function () { $(".staffSizePanle").hide(); });
        var value = $(this).attr("title");
        $("#staff_size").val(value);
        var text = $(this).text();
        $("#input_stafftext").text(text);
        CheckStaffSize();
    });
    $("#staff_size").val(3);
    $("#input_stafftext").text("11～50名");
    //管理业务
    $("#manageType").click(function () {
        var manage_busniness = "";
        $("input[name='manage_busniness']").each(function (index, o) {
            if ($(o).attr("checked") == "checked" && $(o).val().trim().length > 0) {
                manage_busniness += $(o).val() + ",";
            }
        });
        //其他
        //if ($("#other_bussiness").val().trim().length > 0) {
        //    manage_busniness += $("#other_bussiness").val();
        //}

        $("#manageType_text").text(manage_busniness);

        $(".manageTypePanle .rightPanle_wra").animate({ "right": "-320px" }, function () { $(".manageTypePanle").hide(); });
    })


})
//超出屏幕隐藏
$(function () {
    var windowHeight = $(window).height();
    $("#manageType_text").click(function () {
        $('.complete_btn').hide();
        $('.bg_fff').css('background', '#fff');
        var rightPanleHeight = $("#rightPanle").height();
        if (windowHeight < rightPanleHeight) {
            $(".register_down").css("display", "block");
            $("#rightPanle").css({ 'height': $(document).height()-54, 'overflow': 'hidden' });
        } else {
            $("#rightPanle").css('height', '100%');
        }
    });
    $(".register_down_btn").click(function () {
        $("#rightPanle").css({ 'height': $(document).height(), 'overflow': 'hidden' });
        var t = $(window).scrollTop();
        $('#rightPanle,html').animate({ 'scrollTop': t + 300 }, 100);
        $(".register_down").css("display", "none");
        $("#rightPanle").css("overflow", "auto");
    });
    $('#manageType').click(function () {
        $('.complete_btn').show();
        $('.bg_fff').css('background', '#f7f7f7');
    })
})