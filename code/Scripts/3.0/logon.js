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

function serializeAccountInfo(uname, pwd, remove) {
    var obj = { uname: uname, pwd: pwd };
    if (localStorage) {
        localStorage.removeItem("client_v");
    } else {
        jQuery.removeCookie("client_v");
    }
    if (remove !== true) {
        if (localStorage) {
            localStorage.setItem("client_v", encodeURIComponent(JSON.stringify(obj)));
        } else {
            jQuery.cookie("client_v", encodeURIComponent(JSON.stringify(obj)), { expires: 9999 })
        }
    }
    if (localStorage) {
        localStorage.setItem("ck_r", $("#check_expire").prop("checked") + "");
    } else {
        jQuery.cookie("ck_r", $("#check_expire").prop("checked") + "");
    }
}

//记住密码
function deserializeAccountInfo() {
    var _cookie = null;
    if (localStorage) {
        _cookie = localStorage.getItem("client_v");
        $("#check_expire").prop("checked", localStorage.getItem("ck_r") == "true");
    } else {
        _cookie = jQuery.cookie("client_v");
        $("#check_expire").prop("checked", jQuery.cookie("ck_r") == "true");
    }
    if (_cookie) {
        return JSON.parse(decodeURIComponent(_cookie));
    }
    return { uname: "", pwd: "" };
}

//到期提醒弹出框
function ShowExpireNotice(name, expiredate, day, tel, qq) {
    $("#continueName").text(name);
    $("#continueTime").text(expiredate);
    $("#continueDay").text(day > 0 ? day + "天后" : "今天 ");
    if (tel != "") {
        $(".continueTel").show();
        $("#continueTel").text(tel);
    } else {
        $(".continueTel").css("display", "none");
    }
    if (qq != "") {
        $("#continueQQ").attr("href", "http://wpa.qq.com/msgrd?v=3&uin=" + qq + "&site=qq&menu=yes")
        $(".continueQQ").show()
    } else {
        $(".continueQQ").css("display", "none");
    }
    if (qq != "" && tel != "") {
        $(".buttomText1").show();
    } else {
        $(".buttomText1").hide();
    }

    $(".continuePrice").css("display", "block");
}

//刷新图片验证码
function RefreshImgCode() {
    $("#picCode").attr("src", "/account/vcode?v=" + Date());
}

$(function () {
    $("input[type=text],input[type=button],input[type=password],select").popover({ trigger: 'manual', container: '.wrapper_tips', html: true, delay: { show: 900, hide: 400 } });
    window.onkeydown = function (e) {
        if (e.keyCode == 13) {
            if ($(".account_header_selectedA").attr("id") == "a_login") {
                $("#btn_login").click();
            } else if ($(".account_header_selectedA").attr("id") == "a_login_u") {
                $("#btn_login_u").click();
            }
        }
    }

    $("#a_login").click(function () {
        clearPopup();
        $("#login1").css("display", "block");
        $("#login2").css("display", "none");
        $("#login3").css("display", "none");
        $("li").removeClass("account_header_selectedA");
        $("#a_login").addClass("account_header_selectedA");
        if ($("#div_img_code").css("display") == "block") {
            $("#login").css("padding-top", "59px");
        }
    });

    $("#a_login_weixin").click(function () {
        clearPopup();
        $("#login1").css("display", "none");
        $("#login2").css("display", "block");
        $("#login3").css("display", "none");
        $("#login").css("padding-top", "82px");

        $("li").removeClass("account_header_selectedA");
        $("#a_login_weixin").addClass("account_header_selectedA");

        /*生成微信登录二维码 */
        var tick = "";
        $.post("./CreateWxQRCode", {}, function (rst) {
            if (rst.success === false) {
                alert(rst.msg);
                return;
            }
            tick = rst.ticket;
            $("#wx_login_qrcode").attr("src", rst.url);
            var fn = null;
            setTimeout(fn = function () {
                $.post("./CheckWxLogin", { tick: tick }, function (rst) {
                    if (rst.success === true) {
                        //判断域名
                        if ($("#domain").val() != "") {
                            var href = location.href.indexOf("https") >= 0 ? "https://" : "http://";
                            //跨域写入cookie
                            $.getJSON(href + $("#domain").val() + "/service/WriteLoginInfoTo?tok=" + result.token + "&s=" + result.sign + "&jsoncallback=?",
                                  function (json) {
                                  });
                        }
                        location.href = "./enterproduct";
                    } else if (rst.status === 0) {
                        setTimeout(fn, 2000);
                    } else {
                        alert(rst.msg);
                    }
                }, "json");
            }, 2000);

        }, "json");
    });

    $("#a_login_u").click(function () {
        clearPopup();
        $("#login1").css("display", "none");
        $("#login2").css("display", "none");
        $("#login3").css("display", "block");
        $("#login").css("padding-top", "82px");

        $("li").removeClass("account_header_selectedA");
        $("#a_login_u").addClass("account_header_selectedA");
    });

    $(".input_div input").focus(function () {
        $(this).css("border-color", "#47b3db");
    }).blur(function () {
        $(this).css("border-color", "#dcdcdc");
    });
    //ie placeholder
    if (navigator.appName == "Microsoft Internet Explorer") {
        $(".login_wra .regster_content .input_div  .labelPlaceholder").show();
        $(".login_wra .regster_content .input_div input").focus(function () {
            $(this).siblings(".labelPlaceholder").hide();
        }).blur(function () {
            if ($(".login_wra .regster_content .input_div input").val() == "") {
                $(this).siblings(".labelPlaceholder").show();
            }
        })
    } else {
        $(".login_wra .regster_content .input_div  .labelPlaceholder").hide();
    }
    //关闭到期提醒弹出层
    $(".btnClose").click(function () {
        $(".continuePrice").hide();
        location.href = "./enterproduct";
    })

    //图片验证码点击刷新
    $("#picCode").click(function () {
        RefreshImgCode();
    });

    /*================================登录：开始===================================*/
    $("#btn_login").click(function () {
        if (!CheckUsername()) {
            return;
        } else if (!CheckPwd()) {
            return;
        } else {
            $("#btn_login").val("登录中...");
            $(this).attr("disabled", "disabled");
            $.ajax({
                url: "/account/auth",
                type: "POST",
                async: false,
                data: { username: $("#username").val(), password: $("#pwd").val(), logintype: 1, type: $("input:radio[name='type'][checked]").val(), vcode: $("#imgCode").val() },
                success: function (result) {
                    if (result.needvcode) {
                        if ($("#login").height() < 450) {
                            $("#login").css({ "height": "430px", "padding-top": "58px" });
                            $("#login1 .bot_tel").css("margin-top", "15px")

                        }
                        $("#div_img_code").css("display", "block");
                    } else {
                        $("#div_img_code").css("display", "none");
                    }

                    if (result.success) {
                        var isIE = !!window.ActiveXObject;
                        var isIE6 = isIE && !window.XMLHttpRequest;
                        var isIE8 = isIE && !!document.documentMode;
                        var isIE7 = isIE && !isIE6 && !isIE8;

                        if (!(isIE6 || isIE7 || isIE8)) {
                            serializeAccountInfo($("#username").val(), $("#pwd").val(), !$("#check_expire").prop("checked"));
                        }
                        $("#btn_login").popover('hide');
                        $("#imgCode").popover('hide');

                        if (result.remind) {
                            ShowExpireNotice(result.username, "", result.leveldays, result.cellphone, result.qq);
                        } else {

                            //判断域名
                            if ($("#domain").val() != "") {
                                
                                var href = location.href.indexOf("https") >= 0 ? "https://" : "http://";
                                //跨域写入cookie
                                $.getJSON(href + $("#domain").val() + "/service/WriteLoginInfoTo?tok=" + result.token + "&s=" + result.sign + "&jsoncallback=?",
                                      function (json) {
                                      });
                            }

                            location.href = "./enterproduct" + location.search;
                        }
                    } else {
                        RefreshImgCode();
                        $("#btn_login").val("登录");
                        $("#btn_login").removeAttr("disabled");
                        if (result['needaccounttype']) {
                            $("#login").css("height", 414);
                            $("#accounttypecontainer").show();
                            $("#login1 .bot_tel").hide();
                            $("#login1 .account_footer").css({ "position": "relative", "top": "-36px" });
                            $("#logon_foot_link").css({ "position": "relative", "top": "61px" });
                            $(".login_wra").css("padding-top", "60px");
                        }
                        if (result.msg == "请输入验证码" || result.msg == "验证码错误") {
                            showPopupError("#imgCode", result.msg);
                        } else {
                            $("#imgCode").popover('hide');
                            showPopupError("#btn_login", result.msg);
                        }
                    }
                }, error: function (result) {
                    showPopupError("#btn_login", "登录失败，请检查您的输入！");
                    RefreshImgCode();
                    $("#btn_login").val("登录");
                    $("#btn_login").removeAttr("disabled");
                }
               
            });
        }
    });

    $("#btn_login_u").click(function () {
        var btn = $(this);
        //判断
        if (!CheckUpwd()) {
            return;
        } else {
            $('#msg3').text("");
            $("#btn_login_u").val("登录中...");
            $("#btn_login_u").attr("disabled", "disabled");
        }
        check_lkusbkey_service_status(function () {
            callValidateService("validate", function (ret) {
                if (ret.type == "success") {
                    $.post("./ULogin", {
                        serialno: ret.data.serialno,
                        validatecode: ret.data.validatecode,
                        random: window.ukr,
                        utype: ret.data.utype
                    }, function (rst) {
                        if (rst.success === true) {
                            //判断域名
                            if ($("#domain").val() != "") {
                                var href = location.href.indexOf("https") >= 0 ? "https://" : "http://";
                                //跨域写入cookie
                                $.getJSON(href + $("#domain").val() + "/service/WriteLoginInfoTo?tok=" + result.token + "&s=" + result.sign + "&jsoncallback=?",
                                      function (json) {
                                      });
                            }
                            location.href = "./enterproduct";
                        } else {
                            $('#msg3').text(rst.msg);
                            $("#btn_login_u").val("登录");
                            $("#btn_login_u").removeAttr("disabled");
                        }
                    }, "json");
                }
                else {
                    $('#msg3').text(ret.msg);
                    $("#btn_login_u").val("登录");
                    $("#btn_login_u").removeAttr("disabled");
                }
            });
        }, function () {
            $("#btn_login_u").text("登录");
            $('#msg3').html("U盾验证服务没有开启或不是最新版,请[<a href='javascript:start_lkusbkey_service()'>运行</a>]或[<a href='" + window.plugin + "'>下载</a>]");
            $("#btn_login_u").removeAttr("disabled");
        })

        return false;
    });
    /*================================登录：结束===================================*/

    setTimeout(function () {
        $("#username").blur(function () {
            CheckUsername();
        });

        $("#pwd").blur(function () {
            CheckPwd();
        });

        $("#upwd").blur(function () {
            CheckUpwd();
        });
    }, 0)

    var u = deserializeAccountInfo();
    if (u) {
        $("#username").val(u.uname);
        $("#pwd").val(u.pwd);
    }
});

function clearPopup() {
    $("#username").popover('hide');
    $("#upwd").popover('hide');
    $("#pwd").popover('hide');
    $("#btn_login").popover('hide');
    $("#imgCode").popover('hide');
    $("#btn_login_u").popover('hide');
}

function CheckUsername() {
    var username = $("#username").val();
    var flag = false;

    if ($.trim(username) == "" || username == $("#username").attr("placeholder")) {
        showPopupError("#username", "请填写用户名/手机号码！");
        $("#username").parent(".input_div").css("border", "1px solid #ed6c00")
    } else {
        $("#username").popover('hide');
        $("#username").parent(".input_div").css("border", "1px solid #e5e5e5")
        flag = true;
    }

    return flag;
}

function CheckPwd() {
    var pwd = $("#pwd").val();
    var flag = false;

    if ($.trim(pwd) == "" || pwd == $("#pwd").attr("placeholder")) {
        showPopupError("#pwd", "请填写登录密码！");
        $("#pwd").parent(".input_div").css("border", "1px solid #ed6c00")
    } else {
        $("#pwd").popover('hide');
        flag = true;
        $("#pwd").parent(".input_div").css("border", "1px solid #e5e5e5")
    }

    return flag;
}

function CheckUpwd() {
    var upwd = $("#upwd").val();
    var flag = false;

    if ($.trim(upwd) == "" || upwd == $("#upwd").attr("placeholder")) {
        showPopupError("#upwd", "请填写U盾密码！");
        $("#upwd").parent(".input_div").css("border", "1px solid #ed6c00")
    } else {
        $("#upwd").popover('hide');
        flag = true;
        $("#upwd").parent(".input_div").css("border-color", "#e5e5e5 ")
    }

    return flag;
}

var service_query_count = 0;
var service_query_queue = {};

onValidateCallback = function (data) {
    var rst = (JSON.parse(data));
    var ctxid = rst.data.ctxid;
    if (service_query_queue[ctxid]) {
        service_query_queue[ctxid](rst);
        delete service_query_queue[ctxid];
    }
}
function callValidateService(method, fn) {
    service_query_queue[(++service_query_count) + ""] = fn;
    var data = {
        m: method,
        p: $("#upwd").val(),
        r: window.ukr,
        ctxid: service_query_count
    };
    jQuery("#ukvalidate_service_form___postdata").val(JSON.stringify(data));
    jQuery("#ukvalidate_service_form")[0].submit();
}
function check_lkusbkey_service_status(fnSuccess, fnError) {
    var js = jQuery("<img style='display:none'>");
    js.on("load", function () {
        if (fnSuccess)
            fnSuccess(arguments);
        js.remove();
    }).on("error", function () {
        if (fnError)
            fnError(arguments);
        js.remove();
    });
    js.appendTo(document.body);
    setTimeout(function () {
        js.attr("src", window.actionurl + "check_uk_status?r=" + Math.random());
    }, 1);
}
function start_lkusbkey_service(fnSuccess, fnError) {
    jQuery("#ukvalidate_service_frame").attr("src", "lkprint://startup");
}