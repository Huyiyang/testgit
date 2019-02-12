/// <reference path="../jquery-1.11.0.min.js" />
/// <reference path="../knockout-3.1.0.js" />
function PageModel() {
    var self = this;
    this.productList = ko.observableArray([]);
    this.productCount = ko.observable();
    this.loadByTypeid = function (typeid, isbase) {
        $.ajax({
            url: "/service/loadproduct",
            type: "post",
            data: { typeid: typeid, isbase : isbase },
            success: function (list) {
                //循环产品列表
                ko.utils.arrayForEach(list, function (data, index) {
                    //添加选中规格、价格监控
                    data.selectedPrice = ko.observable();
                    data.selectedScale = ko.observable();
                    //改变选中规格值
                    data.selectedScaleValue = ko.observable();
                    data.selectedScaleValue.subscribe(function (val) {
                        ko.utils.arrayForEach(data.scaleList, function (item, item_index) {
                            if (item.priceid == val) {
                                data.selectedScale(item);
                                if (item.periodCount > 0) {
                                    ko.utils.arrayForEach(item.periodList, function (obj, obj_index) {
                                        if (obj_index == 0) {
                                            data.selectedPrice(obj);
                                        }
                                    });
                                }
                            }
                        });
                    }, data);
                    //改变选中有效期值
                    data.selectedPeriodValue = ko.observable();
                    data.selectedPeriodValue.subscribe(function (val) {
                        if (data.selectedScale() != null && data.selectedScale().periodCount > 0) {
                            ko.utils.arrayForEach(data.selectedScale().periodList, function (item, item_index) {
                                if (item.priceid == val) {
                                    data.selectedPrice(item);
                                }
                            });
                        }
                    }, data);

                    data.periodList = ko.observableArray();
                    data.scaleId = ko.observable();
                    data.periodId = ko.observable();
                    data.scaleId = "scale_" + data.productid;
                    data.periodId = "period_" + data.productid;

                    data.detailUrl = "/service/productdetail?id=" + data.productid;

                    ko.utils.arrayForEach(data.scaleList, function (item, item_index) {
                        item.scale_info = item.scale + data.scale_unit;

                        if (item.exsitPeriod) {//存在有效期信息
                            ko.utils.arrayForEach(item.periodList, function (obj, obj_index) {
                                obj.period_info = obj.years + "年";
                                if (item_index == 0 && obj_index == 0) {
                                    //如果存在有效期，则产品默认选中价格为第一个规格的第一个有效期价格信息
                                    data.selectedPrice(obj);
                                }
                            });
                            data.periodList = item.periodList;
                        } else if (item_index == 0) {
                            data.selectedPrice(item);
                        }

                        if (item_index == 0) {
                            data.selectedScale(item);
                        }
                    });
                });

                self.productCount(list.length);
                self.productList(list);
            }, error: function (result) {
                alert(result.responseText);
            }
        });
    }
}

var model = new PageModel();

//加入购物车
function addToMyCart(obj, e) {
    var message = "成功加入购物车！";
    var count = $(e.target).parent().parent().find(".number").val();
    var id = $(e.target).attr("id");

    $.ajax({
        url: "/service/addtocart",
        type: "post",
        data: { priceid:id, count: count },
        success: function (data) {
            if (!data.success) {
                message = data.message;
            }
            $("#message").text(message);
            $('.dialogDiv').css('display', 'block');
        },
        error: function (result) {
            message = "出错了，请联系来肯客服！";
            $("#message").text(message);
            $('.dialogDiv').css('display', 'block');
        }
    });
}

$(document).ready(function () {
    $loadProduct(0);
    ko.applyBindings(model, document.getElementById("table_product"));
});

$loadProduct = function (typeid, isbase) {
    if (typeid == 0) {
        typeid = $("#currentType").val();
    }
    var boolbase = isbase == 1 ? false : true;
    if (typeid == -1) {
        boolbase = false;
    }

    $(".active").removeClass("active");
    $(".hr_active").css("display", "none");
    $("#type_" + typeid).addClass("active");
    $("#type_" + typeid).find(".hr_active").css("display", "inline");
    model.loadByTypeid(typeid, boolbase);
}