
//分类信息列表点击‘基础服务’及‘增值服务’下拉列表消失或出现
$('.serve').click(function () {
    $(this).parent().find('.serve-menu').toggle(100);
})
//点击左边下拉列表的对应项字体颜色变化
$('.serve-menu>a').click(function () {
    $(this).addClass('active');
    $('.serve-menu>a').not(this).removeClass('active');
})
//点击产品信息的数量列表的‘-’对应数量减少的事件，以及价格随之的变化
function reduce(e) {
    var index = $(e).parent().parent().index();
    var array = $('.price-font').eq(index).html().split('￥');
    $('.number').eq(index).val(parseInt($('.number').eq(index).val()) - 1);
    if (parseInt($('.number').eq(index).val()) < 1) {
        $('.number').eq(index).val(1)
    }
    var numberA = parseInt($('.number').eq(index).val());
    $('.money').eq(index).html(parseFloat(parseFloat(array[1]) * parseInt(numberA)).toFixed(2));//单价12.80的价格乘数量，12.80价格可以根据实际情况改变
    var sumNumber = 0;
    $('.money').each(function (i, e) {
        var a = $(e).html();
        sumNumber += parseFloat(a);
        $('.total').html('￥' + sumNumber.toFixed(2));
    })
}
//点击产品信息的数量列表的‘+’对应数量增加的事件,以及价格的随之的变化
function add(e) {
    var index = $(e).parent().parent().index();
    var array = $('.price-font').eq(index).html().split('￥');
    $('.number').eq(index).val(parseInt($('.number').eq(index).val()) + 1);
    var numberA = parseInt($('.number').eq(index).val());
    $('.money').eq(index).html(parseFloat(parseFloat(array[1]) * parseInt(numberA)).toFixed(2));//单价12.80的价格乘数量，12.80价格可以根据实际情况改变
    var sumNumber = 0;
    $('.money').each(function (i, e) {
        var a = $(e).html();
        sumNumber += parseFloat(a);
        $('.total').html('￥' + sumNumber.toFixed(2));
    })
}

//产品数量失去焦点计算价格
function computePrice(e){
    var index = $(e).parent().parent().index();
    var array = $('.price-font').eq(index).html().split('￥');
    var numberA = parseInt($('.number').eq(index).val());

    if (numberA == "" || isNaN(numberA) || numberA % 1 != 0) {
        alert("请填写正确的数量！");
        numberA = 1;
        $('.number').eq(index).val(1);
    }
    $('.money').eq(index).html(parseFloat(parseFloat(array[1]) * parseInt(numberA)).toFixed(2));//单价12.80的价格乘数量，12.80价格可以根据实际情况改变
    var sumNumber = 0;
    $('.money').each(function (i, e) {
        var a = $(e).html();
        sumNumber += parseFloat(a);
        $('.total').html('￥' + sumNumber.toFixed(2));
    })
}
//求页面价格有”￥“符号的对应总计的和，和删除
$(function () {
    function sumNumber() {
        var num = 0;
        $('.everyPrice').each(function (i) {
            var array = $(this).html().split('￥');//获得当前价格的内容，并以”￥“截取到的为数组array;
            num += parseFloat(array[1]);//累加当前的值并赋值给num;
        })
        return num.toFixed(2);//以两位小数返回num的值，使sumNumber函数得到返回值;
    }
    $('.totalPrice').html('￥' + sumNumber());//把￥+sumNumber函数的返回值赋值给总计
})
//点击‘按钮’删除该行数据，且总计数据对应变化
function removeParent(e) {
    function sumNumber() {
        var num = 0;
        $('.everyPrice').each(function (i, e) {
            var array = $(e).html().split('￥');//获得当前价格的内容，并以”￥“截取到的为数组array;
            num += parseFloat(array[1]);//累加当前的值并赋值给num;
        })
        return num.toFixed(2);//以两位小数返回num的值，使sumNumber函数得到返回值;
    }
    $(e).parent().parent().remove();
    $('.totalPrice').html('￥' + sumNumber());
}

//求页面价格没有”￥“符号的对应总计的和
$(function () {
    function sumPrice() {
        var num = 0;
        $('.everyMoney').each(function (i) {
            var price = $(this).html();
            num += parseFloat(price);
        })
        return num.toFixed(2);
    }
    $('.totalMoney').html('￥' + sumPrice());
    //点击‘删除按钮’删除该行数据，且总计数据对应变化
})
function removeIt(e) {
    function sumPrice() {
        var num = 0;
        $('.everyMoney').each(function (i, e) {
            var price = $(e).html();
            num += parseFloat(price);
        })
        return num.toFixed(2);
    }
    $(e).parent().parent().remove();//删除父元素的父元素tr；
    $('.total').html('￥' + sumPrice());//给总计赋值；
}


//判断购物车页面的收件信息输入框的输入,并给出相应提示
//判断收件人电话输入框的输入，并给出相应提示
$('#receiverPhone').blur(function () {
    var isMobile = /^(?:13\d|15\d|18\d)\d{5}(\d{3}|\*{3})$/; //手机号码验证规则
    var isPhone = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;   //座机验证规则
    var dianhua = $("#receiverPhone").val();                   //获得用户填写的号码值,赋值给变量dianhua
    if (!isMobile.test(dianhua) && !isPhone.test(dianhua)) { //如果用户输入的值不同时满足手机号和座机号的正则
        alert("请正确填写电话号码，例如:13415764179或0321-4816048");  //就弹出提示信息
        $("#receiverPhone").focus();       //输入框获得光标
        return false;         //返回一个错误，不向下执行
    }
})
//判断收件人电话输入框的输入,并给出相应提示
$('#postalcode').blur(function () {
    var isPost = /^\d{6}$/;
    var youbian = $(this).val();
    if (!isPost.test(youbian)) {
        alert('请输入正确邮编');
        $(this).focus();
        return false;
    }
})
//点击关闭弹出框
function closeDialog(e) {
    $(e).parent().parent().parent().css({ 'display': 'none' });
}
//加入购物车
function addToCart(e, counts) {
    var message = "成功加入购物车！";
    var count = counts;

    if (counts == null) {
        count = $(event.target.parentElement.parentElement).find(".number").val();
    }
    $.ajax({
        url: "/service/addtocart",
        type: "post",
        data: { priceid: e, count: count },
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
