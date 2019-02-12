/// <reference path="../jquery-1.7.1.min.js" />
/// <reference path="../../../CC.Agent/CC.Agent/Scripts/knockout-3.1.0.js" />
var toFixed = function (number, s) {
    var i = 0.5;
    if (number * 1 < 0) {
        i = -0.5;
    }
    return (parseInt(number * Math.pow(10, s) + i) / Math.pow(10, s)).toString();
}

function Model() {
    var self = this;
    this.list = ko.observableArray([]);

    this.bind = function () {

        $.ajax({
            url: "/service/LoadBuyProduct",
            type: "post",
            data: {},
            success: function (data) {
                if (data.success) {
                    ko.utils.arrayForEach(data.list, function (type, index) {
                        //选中产品
                        type.selectedProduct = ko.observable();
                        type.selectedProductId = ko.observable();
                        //选中规格
                        type.selectedScale = ko.observable();
                        type.selectedScaleId = ko.observable();
                        //选中有效期
                        type.selectedYear = ko.observable();
                        type.selectedYearId = ko.observable();

                        if (type.exsitProduct) {
                            self.setProduct(type);
                        }
                    });
                    self.list(data.list);
                }
            }, error: function (data) {
                alert("信息加载失败！");
            }
        })
    }

    this.setProduct = function (type) {
        //监控选择产品
        type.selectedProductId.subscribe(function (p_value) {
            ko.utils.arrayForEach(type.productList, function (product, p_index) {
                if (product.productid == p_value) {
                    if (product.exsitScale) {
                        type.selectedProduct(product);
                        self.setScale(type, product);
                    }
                }
            });
        });

        //循环产品列表，设置默认选中产品
        ko.utils.arrayForEach(type.productList, function (product, p_index) {
            if (p_index == 0) {
                type.selectedProductId(product.productid);
            }
            product.parent = type;
        });
    }

    this.setScale = function (type, product) {
        //监控选中规格
        type.selectedScaleId.subscribe(function (s_value) {
            ko.utils.arrayForEach(product.scaleList, function (scale, s_index) {
                if (scale.priceid == s_value) {
                    type.selectedScale(scale);
                    self.setYear(type, product, scale);
                }
            });
        });

        //循环规格列表
        ko.utils.arrayForEach(product.scaleList, function (scale, s_index) {
            if (s_index == 0) {
                type.selectedScaleId(scale.priceid);
            }
            scale.parent = product;
        });
    }

    this.setYear = function (type, product, scale) {
        //监控选中有效期
        type.selectedYearId.subscribe(function (y_value) {
            ko.utils.arrayForEach(scale.periodList, function (year, y_index) {
                if (year.priceid == y_value) {
                    type.selectedYear(year);
                }
            });
        });

        //循环有效期列表，设置默认有效期
        ko.utils.arrayForEach(scale.periodList, function (year, y_index) {
            if (y_index == 0) {
                type.selectedYearId(year.priceid);
            }
        });
    }
}

//选中产品
function doChangeSelectProduct() {
    //选中年份
    var year;
    $("#years li").each(function (i, o) {
        if ($(this).hasClass("user-selected")) {
            year = $(this).attr("id");
        }
    });
    //选中ERP版本号
    var select_base_product_flag = $("#select_base_product_flag").val();

    var event = window.event || arguments.callee.caller.arguments[0];
    var myevent = event.srcElement;
    if (!myevent) {
        myevent = event.target;
    }
    var tagName = myevent.tagName;
    var li;
    if (tagName == "DIV") {
        li = $(myevent).parent();
    } else if (tagName == "LI") {
        li = $(myevent);
    }

    var li_flag = $(li).parent().parent().parent().attr("productflag");

    if (li_flag > 0) {
        $("#ul_products li").each(function (index, obj) {
            var this_flag = $(this).attr("productflag");

            if (li_flag == this_flag) {
                $(".price_div").addClass("productBg0" + this_flag);

                if (index == 0) {
                    $(this).css({ "box-shadow": "-9px -1px 12px #276962" });
                } else if (index == 1) {
                    $(this).css({ "box-shadow": "-9px -1px 12px #14502a" });
                } else if (index == 2) {
                    $(this).css({ "box-shadow": "-9px -1px 12px #634220" });
                } else if (index == 3) {
                    $(this).css({ "box-shadow": "-9px -1px 12px #582231" });
                } else if (index == 4) {
                    $(this).css({ "box-shadow": "-9px -1px 12px #1c3463" });
                }

                $(".produce_border").children("div").eq($(this).index()).show().siblings().hide();
                $(this).addClass("li-border").siblings().removeClass("li-border");
                $(this).find(".edition").hide();
                $(this).siblings().find(".edition").show();
            } else {
                $(".price_div").removeClass("productBg0" + this_flag)
                $(this).css({ "box-shadow": "none" });
            }
        });
    }

    arguments[0].parent.selectedProductId(arguments[0].productid);

    ComputeTotalMoney();
}

//选中规格
function doChangeScale() {
    var event = window.event || arguments.callee.caller.arguments[0];
    var myevent = event.srcElement;
    if (!myevent) {
        myevent = event.target;
    }
    $("#ul_users li").removeClass("user-selected");
    var li;

    if (myevent.tagName == "LI") {
        li = $(myevent);
    } else {
        li = $(myevent).parent();
    }

    $(li).addClass("user-selected");
    arguments[0].parent.parent.selectedScaleId(arguments[0].priceid);

    ComputeTotalMoney();
}

//选中有效期
function doChangeYear(e) {
    //选中年份
    var year = $(e).attr("id");
    //选中ERP版本号
    var select_base_product_flag = $("#select_base_product_flag").val();

    $("#years li").removeClass("user-selected");
    $(e).addClass("user-selected");

    ComputeTotalMoney();
}

//计算价格
function ComputeTotalMoney() {
    //获取选中的年分
    var year;
    $("#years li").each(function (i, o) {
        if ($(this).hasClass("user-selected")) {
            year = $(this).attr("id");
        }
    });

    var showQQ = false, usercount = 1;

    $("#ul_users li").each(function (i, o) {
        if ($(this).hasClass("user-selected")) {
            usercount = $(this).find(".span_usercount").text();
        }
    });

    //精简版1用户1或2年，以及2用户一年不允许购买
    if ($("#select_base_product_flag").val() == "1" && ((usercount == 1 && (year == 1 || year == 2)) || (usercount == 2 && year == 1))) {
        showQQ = true;
    } else if ($("#select_base_product_flag").val() == "2" && usercount == 1 && year == 1) {//标准版1用户不允许购买
        showQQ = true;
    }

    if (showQQ) {
        $("#btnBuyBase").text("联系客服");
    } else {
        $("#btnBuyBase").text("立即购买");
    }

    var discount = 10;
    var is_show_old_price = false;
    if (year == 1) {
        discount = 10;
    } else if (year == 2) {
        discount = parseFloat($("#discount_two_year").val()) * 10;
    } else if (year == 3) {
        discount = parseFloat($("#discount_three_year").val()) * 10;
    }

    if (discount < 10) {
        is_show_old_price = true;
    }

    $("#discount").text(toFixed(discount, 2));

    //设置各个产品选择年限
    //必选产品
    ko.utils.arrayForEach(model.list(), function (type, index) {

        if (type.selectedScale() != null) {
            ko.utils.arrayForEach(type.selectedScale().periodList, function (period, p_index) {
                if (period.years == year) {
                    type.selectedYearId(period.priceid);
                    if (period.price < period.oldprice) {
                        is_show_old_price = true;
                    }
                }
            });
        }
    });

    //计算总价格
    var oldTotalMoney = $(".selectedprice").val();
    if (parseFloat($(".selectedoldprice").val()) > 0) {
        $("#oldTotalMoney").text("￥" + toFixed($(".selectedoldprice").val(), 2));
    } else {
        $("#oldTotalMoney").text("￥" + toFixed(oldTotalMoney, 2));
    }

    //计算折后价
    var totalMoney = toFixed(oldTotalMoney * parseFloat(discount / 10), 0);

    //if (is_show_old_price) {
    //    $("#div_old_money").css("display", "block");
    //} else {
    //    $("#div_old_money").css("display", "none");
    //}

    $("#totalMoney").text(totalMoney);

    //计算单价
    var eachYear = totalMoney / year;
    var UserNum = $(".user-selected").find(".span_usercount").text();
    var unitPriceValue = Math.round(eachYear / UserNum)
    $("#unitPrice").text(unitPriceValue);
   
}

//提交订单
function submitOrder() {
    var years = 1, usercount = 1;
    $("#years li").each(function (i, o) {
        if ($(this).hasClass("user-selected")) {
            years = $(this).attr("id");
        }
    });

    $("#ul_users li").each(function (i, o) {
        if ($(this).hasClass("user-selected")) {
            usercount = $(this).find(".span_usercount").text();
        }
    });
    //精简版1用户1或2年，以及2用户一年不允许购买
    if ($("#select_base_product_flag").val() == "1" && ((usercount == 1 && (years == 1 || years == 2)) || (usercount == 2 && years == 1))) {
        window.open($("#qq_href").val());
        return false;
    } else if ($("#select_base_product_flag").val() == "2" && usercount == 1 && years == 1) {//标准版1用户不允许购买
        window.open($("#qq_href").val());
        return false;
    }

    var arrayPrice = [];
    arrayPrice.push({ "priceid": $(".selectedYearId").val() });
    if (arrayPrice.length > 0) {
        $("#btnBuyBase").attr("disabled", "disabled");
        $.ajax({
            url: "/service/submitorder",
            type: "post",
            async: false,
            dataType: "json",
            data: { "type": 0, "companyid": $("#companyid").val(), "list": JSON.stringify(arrayPrice) },
            success: function (result) {
                if (result.success) {
                    location.href = result.message;
                } else {
                    alert(result.message);
                    $("#btnBuyBase").removeAttr("disabled");
                }
            }, error: function (result) {
                alert(result.responseText);
                $("#btnBuyBase").removeAttr("disabled");
            }
        });
    } else {
        alert("参数传递错误！");
    }
}

var model = new Model();
$(function () {
    model.bind();
    ko.applyBindings(model, document.getElementById("div_product"));
    ComputeTotalMoney();
})