/// <reference path="../jquery-1.11.0.min.js" />
/// <reference path="../knockout-3.1.0.js" />
function ReNewModel() {
    var self = this;
    this.selectedPeriod = ko.observable();
    this.list = ko.observableArray([]);

    this.loadRenewData = function () {
        $.ajax({
            url: "/service/loadbaseservice",
            type: "post",
            data: { productid: $("#productid").val(), scale: $("#scale").val() },
            success: function (data) {
                if (data == null) {
                    alert("没有找到相关信息！");
                } else {
                    ko.utils.arrayForEach(data, function (obj, index) {
                        obj.period_info = obj.years + "年";
                    });

                    self.selectedPeriod.subscribe(function (value) {
                        ko.utils.arrayForEach(data, function (obj, index) {
                            if (obj.priceid == value) {
                                $("#price").text(obj.price);
                                $("#oldprice").text(obj.oldprice);
                                $("#totalmoney").text("￥" + obj.price);

                                if (obj.oldprice > 0) {
                                    $("#oldprice_info").css("display", "block");
                                } else {
                                    $("#oldprice_info").css("display", "none");
                                }
                            }
                        });
                    }, data);
                    self.list(data);
                }
            }, error: function (result) {
                alert(result.responseText);
            }
        });
    }
}

var model = new ReNewModel();

$(document).ready(function () {
    if ($("#viewMessage").val() != undefined && $("#viewMessage").val() != "") {        
        alert($("#viewMessage").val());
    }
    model.loadRenewData();
    ko.applyBindings(model, document.getElementById("serviceInfo"));
});