/// <reference path="jquery-1.11.0.min.js" />
/*注册成功跳转到ERP*/
function toErp() {
    setTimeout(function () {
        $("#guidForm").submit();
    }, 3000);

    var t = 3;
    function tick() {
        $("#stime").text(--t);
        if (t > 0)
            setTimeout(tick, 1000);
    }
    tick();
}

/*选择行业后自动选择行业特性*/
function selectIndustry() {
    var industry = $("#industry").val();
    var more = $("#step1SelectedMore").val();

    if (industry != 0 && industry != 40) {
        $("#industrySet").show();

        if (industry == 20) {//服装行业
            $("#deal").show();
            $("#cbkDeal").attr("checked", true);
            $("#txtDeal1").removeAttr("disabled");
            $("#txtDeal2").removeAttr("disabled");
            $("#cbkSeries").attr("checked", false);
            $("#cbkPeriod").attr("checked", false);
            $("#cbkMutUnit").attr("checked", false);

            if (more == 0) {
                $("#series").hide();
                $("#period").hide();
                $("#mutUnit").hide();
            }
        } else if (industry == 10 || industry == 11) {//通讯行业
            $("#series").show();
            $("#cbkSeries").attr("checked", true);
            $("#cbkDeal").attr("checked", false);
            $("#txtDeal1").attr("disabled", "disabled");
            $("#txtDeal2").attr("disabled", "disabled");
            $("#cbkPeriod").attr("checked", false);
            $("#cbkMutUnit").attr("checked", false);

            if (more == 0) {
                $("#deal").hide();
                $("#period").hide();
                $("#mutUnit").hide();
            }
        } else if (industry == 30 || industry == 31) {//食品医药
            $("#period").show();
            $("#cbkPeriod").attr("checked", true);
            $("#cbkDeal").attr("checked", false);
            $("#txtDeal1").attr("disabled", "disabled");
            $("#txtDeal2").attr("disabled", "disabled");
            $("#cbkSeries").attr("checked", false);
            $("#cbkMutUnit").attr("checked", false);

            if (more == 0) {
                $("#deal").hide();
                $("#series").hide();
                $("#mutUnit").hide();
            }
        } else if (industry == 41 || industry == 42 || industry == 43) {//其他
            $("#mutUnit").show();
            $("#cbkMutUnit").attr("checked", true);
            $("#cbkDeal").attr("checked", false);
            $("#txtDeal1").attr("disabled", "disabled");
            $("#txtDeal2").attr("disabled", "disabled");
            $("#cbkSeries").attr("checked", false);
            $("#cbkPeriod").attr("checked", false);

            if (more == 0) {
                $("#deal").hide();
                $("#series").hide();
                $("#period").hide();
            }
        }
    } else if (more == 0) {
        $("#industrySet").hide();
    }
}

/*修改属性管理*/
function changeDeal() {
    if ($("#cbkDeal").is(':checked')) {
        $("#txtDeal1").val("颜色");
        $("#txtDeal2").val("尺码");
        $("#txtDeal1").removeAttr("disabled");
        $("#txtDeal2").removeAttr("disabled");
    } else {
        $("#txtDeal1").val("");
        $("#txtDeal2").val("");
    }
}

/*显示步骤1的全部行业特性*/
function step1More() {
    $("#industrySet").show();
    $("#deal").show();
    $("#series").show();
    $("#period").show();
    $("#mutUnit").show();
    $("#step1SelectedMore").val(1);
}

/*显示步骤2的全部特性*/
function step2More() {
    $("#feature").show();
    $("#step2SelectedMore").val(1);
}

/*转到步骤一*/
function toStep1() {
    $("#stepImg1").show();
    $("#stepImg2").hide();
    $("#stepImg3").hide();
    $("#step1").show();
    $("#step2").hide();
    $("#step3").hide();
}

/*转到步骤二*/
function toStep2() {

    if ($("#industry").val() == 0) {
        alert("请选择行业!");
        return false;
    } else if ($("#cbkDeal").is(':checked') && $("#txtDeal1").val() == "" && $("#txtDeal2").val() == "") {
        alert("启用属性管理后，至少需要填写一个属性名称!");
        return;
    }

    $("#stepImg1").hide();
    $("#stepImg2").show();
    $("#stepImg3").hide();
    $("#step1").hide();
    $("#step2").show();
    $("#step3").hide();
}

/*转到步骤三*/
function toStep3() {
    $("#stepImg1").hide();
    $("#stepImg2").hide();
    $("#stepImg3").show();
    $("#step1").hide();
    $("#step2").hide();
    $("#step3").show();
    //toErp();
}



