/// <reference path="../jquery-1.11.0.min.js" />
/// <reference path="../knockout-3.1.0.js" />

function GetYearDays() {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    var days = parseInt(Math.abs(date - new Date()) / 1000 / 60 / 60 / 24);
    return days;
}

function UpgradModel() {
    var self = this;
    this.typename = ko.observable();
    this.productList = ko.observableArray([]);
    this.beforeprice = ko.observable();
    this.days = ko.observable();
    this.selectedProductValue = ko.observable();
    this.selectedPrices = ko.observableArray([]);
    this.selectedPriceValue = ko.observable();
    this.show = ko.observable();

    this.loadUpgradData = function () {
        $.ajax({
            url: "/service/loadupgradedata",
            type: "post",
            data: { priceid: $("#priceid").val() },
            success: function (data) {
                if (data.success) {
                    self.show(true);
                    ko.utils.arrayForEach(data.productList, function (item, index) {
                        
                        if (item.prices != null) {
                            ko.utils.arrayForEach(item.prices, function (obj, obj_index) {
                                obj.scale_info = obj.scale + item.scale_unit;
                            });
                        }

                        if (index == 0) {
                            self.selectedPrices(item.prices);
                            if (self.selectedPrices() != null) {
                                ko.utils.arrayForEach(self.selectedPrices(), function (obj, obj_index) {
                                    if (obj_index == 0) {//赋值选择价格
                                        //计算应付价格
                                        var totalmoney = (obj.price - data.beforeprice) / GetYearDays() * data.days;
                                        //显示价格
                                        $("#totalmoney").text(totalmoney.toFixed(2));
                                        $("#price").text(obj.price);
                                        if (obj.oldprice > 0) {
                                            $("#oldprice_info").css("display", "block");
                                            $("#oldprice").text(obj.oldprice);
                                        } else {
                                            $("#oldprice_info").css("display", "none");
                                        }
                                    }
                                    obj.scale_info = obj.scale + item.scale_unit;
                                });
                            }
                        }

                    });

                    //循环商品列表
                    self.selectedProductValue.subscribe(function (v) {
                        ko.utils.arrayForEach(data.productList, function (item, index) {
                            if (item.productid == v) {
                                self.selectedPrices(item.prices);
                            }
                        });
                    });
                    
                    self.selectedPriceValue.subscribe(function (value) {
                        if (self.selectedPrices() != null) {
                            ko.utils.arrayForEach(self.selectedPrices(), function (obj, index) {
                                if (obj.priceid == value) {//赋值选择价格
                                    //计算应付价格
                                    var totalmoney = (obj.price - data.beforeprice) / GetYearDays() * data.days;
                                    //显示价格
                                    $("#totalmoney").text(totalmoney.toFixed(2));
                                    $("#price").text(obj.price);
                                    if (obj.oldprice > 0) {
                                        $("#oldprice_info").css("display", "block");
                                        $("#oldprice").text(obj.oldprice);
                                    } else {
                                        $("#oldprice_info").css("display", "none");
                                    }
                                }
                            });
                        }
                    });

                    self.beforeprice(data.beforeprice);
                    self.days(data.days);
                    self.typename(data.type_name);
                    self.productList(data.productList);
                } else {
                    self.show(false);
                    alert(data.message);
                }
            }, error: function (result) {
                self.show(false);
                alert(result.responseText);
            }
        });
    }
}

var model = new UpgradModel();

$(document).ready(function () {
    if ($("#viewMessage").val() != undefined && $("#viewMessage").val() != "") {
        alert($("#viewMessage").val());
    }
    model.loadUpgradData();
    ko.applyBindings(model, document.getElementById("serviceInfo"));
});