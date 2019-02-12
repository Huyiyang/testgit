/// <reference path="jquery-1.7.1.js" />

var selectVersion = null;
var selectIndustry = null;

var _global_domain = null;
function chooseRole(version) {
    
    selectVersion = version;
   
    if (version == 0) {
        $('#lblVersion').html("基础版：演示帐套");
    }else if (version == 1) {
        $('#lblVersion').html("标准版：演示帐套");
    }else if (version == 2) {
        $('#lblVersion').html("旗舰版：演示帐套");
    } else if (version == 3) {
        var herf = "//" + _global_domain + "/product/trial/12";
        window.open(herf, "_self");
        return;
    } else if (version == 4) {
        var herf = "//" + _global_domain + "/product/trial/13";
        window.open(herf, "_self");
        return;
    }
    $('#foo').modal().css({
        'margin-top': function () {
            return "100px";
        }
    });
}

function chooseVersion(industry) {

    selectIndustry = industry;

    $('#foo').modal().css({
        'margin-top': function () {
            return "100px";
        }
    });
}

function toErpRole() {
    var version = $("#allVersion").val();
    var industry = $("#allIndustry").val();
    var role = parseInt(version - 1) * 4 + parseInt(industry) - 1;
    var herf = "//" + _global_domain + "/product/trial/" + role;
    window.open(herf, "_self");
}

function toErpDH() {
    var dh = $("#allDh").val();
    var herf = "//" + _global_domain + "/product/trial/";
    if (dh == 1) {
        herf = herf + "12";
    } else if (dh == 2) {
        herf = herf + "13";
    }
    window.open(herf, "_self");
}

function toErp() {
    var roleId = $("#industry").val() * 1 + 4 * selectVersion;

    if (roleId > 0 && roleId < 13 && parseInt(roleId) == roleId) {
        var herf = "//" + _global_domain + "/product/trial/" + (parseInt(roleId) - 1);
        window.open(herf, "_self");
    }
}

function toErpVersion() {
    var roleId = $("#version").val() * 4 + 1 * selectIndustry;

    if (roleId > 0 && roleId < 13 && parseInt(roleId) == roleId) {
        var herf = "//" + _global_domain + "/product/trial/" + (parseInt(roleId) - 1);
        window.open(herf, "_self");
    }
}

function close() {
    $("#chooseForm").hide();
    $("#BgDiv").hide();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

$(

    function () {
        _global_domain = getHostName();
        var agentInfo = getAgentInfo();
        var isLaiken=agentInfo["islaiken"];
        var agentid = agentInfo["agentid"];
        var logtype = "";
        if (getCookie("lgtype") == "quick") {
            logtype = "type=quick";
        }
        if (!isLaiken) {
            if (logtype) {
                logtype = "&" + logtype;
            }
            $("._buy").each(function (index, item) {
                var href = $(this).attr("href");
                var querystring = "", newhref = "//" + _global_domain + "/buy/buy";
                if (href.indexOf("?") > 0) {
                    querystring = href.substring(href.indexOf("?") + 1, href.length);
                    newhref = newhref + "?" + querystring + "&agentid=" + agentid;
                } else {
                    newhref = newhref + "?agentid=" + agentid;
                }
                $(this).attr("href", newhref);
            });

            $("._register").each(function (index, item) {
                var href = $(this).attr("href");
                var querystring = "",newhref = "//" + _global_domain + "/Account/Register";
                if (href.indexOf("?") > 0) {
                    querystring = href.substring(href.indexOf("?") + 1, href.length);
                    newhref = newhref + "?" + querystring + "&agentid=" + agentid;
                } else {
                    newhref = newhref + "?agentid=" + agentid;
                }
                $(this).attr("href", newhref);
            });

            $("._login").attr("href", "//" + _global_domain + "/Account/logon?" + "agentid=" + agentid + logtype);
        }
        else {

            $("._buy").each(function (index, item) {
                var href = $(this).attr("href");
                var querystring = "", newhref = "//" + _global_domain + "/buy/buy";
                if (href.indexOf("?") > 0) {
                    querystring = href.substring(href.indexOf("?") + 1, href.length);
                    newhref = newhref + "?" + querystring;
                } 
                $(this).attr("href", newhref);
            });
            $("._register").each(function (index, item) {
                var href = $(this).attr("href");
                var querystring = "", newhref = "//" + _global_domain + "/Account/Register";
                if (href.indexOf("?") > 0) {
                    querystring = href.substring(href.indexOf("?") + 1, href.length);
                    newhref = newhref + "?" + querystring;
                }
                $(this).attr("href", newhref);
            });

            if (logtype) {
                logtype = "?" + logtype;
            }
            $("._login").attr("href", "//" + _global_domain + "/Account/logon" + logtype);

        }
    }
);