/// <reference path="../jquery-1.11.0.min.js" />

var turnplate = {
    restaraunts: [],				//大转盘奖品名称
    colors: [],					//大转盘奖品区块对应背景颜色
    outsideRadius: 192,			//大转盘外圆的半径
    textRadius: 155,				//大转盘奖品位置距离圆心的距离
    insideRadius: 50,			//大转盘内圆的半径
    startAngle: 0,				//开始角度
    textcolors: [],
    bRotate: false,				//false:停止;ture:旋转,
    gettime: 0,
    textrotate: false
};

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
//window.onload=function(){
////	drawRouletteWheel();
////	drawGetTime(3);
//};
function rnd(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}

function drawGetTime(text) {
    var canvas = document.getElementById("getTime");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");	  //在给定矩形内清空一个矩形
        if (!turnplate.textrotate) {
            turnplate.textrotate = true;
            ctx.rotate(15 * Math.PI / 180);
            ctx.font = '25px Microsoft YaHei';
            ctx.fillStyle = "#ffffff";
        }
        ctx.clearRect(0, 0, 100, 100);
        ctx.fillText(text, 10, 20);
    }
}
function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
        ctx.strokeStyle = "#DFDFDF";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.restaraunts[i].bgcolor;
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            //  ctx.fillStyle = "#E5302F";
            ctx.fillStyle = turnplate.restaraunts[i].textcolor;
            var text = turnplate.restaraunts[i].title;
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text.indexOf("元") > 0) {//流量包
                var texts = text.split("元");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
                    if (j == 0) {
                        ctx.fillText(texts[j] + "元", -ctx.measureText(texts[j] + "元").width / 2, j * line_height);
                    } else {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            } else if (text.indexOf("元") == -1 && text.length > 6) {//奖品名称长度超过一定范围 
                text = text.substring(0, 6) + "||" + text.substring(6);
                var texts = text.split("||");
                for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            } else if (text.indexOf("U盾") > 0) {//流量包
                var texts = text.split("U盾");
                for (var j = 0; j < texts.length; j++) {
                    ctx.font = j != 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
                    if (j != 0) {
                        ctx.fillText(texts[j] + "U盾", -ctx.measureText(texts[j] + "U盾").width / 2, j * line_height + 2);
                    } else {
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            } else {
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }
            //把当前画布返回（调整）到上一个save()状态之前 
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}
$(document).ready(function () {

    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = [
	{ title: "800元组合抵扣券", msg: "恭喜您获得800元抵扣券！可用于购买来肯进销存+B2C商城标准版", get: true, range: [1, 30], bgcolor: "#E5302F", textcolor: "#FFFFFF" },
	{ title: "谢谢参与", msg: "谢谢参与", get: false, range: [96, 100], bgcolor: "#C6BDBE", textcolor: "#FFFFFF" },
	{ title: "480元通用抵扣券", msg: "恭喜您获得480元通用抵扣券！可用于购买来肯任意软件", get: true, range: [61, 85], bgcolor: "#FFF4D6", textcolor: "#FFFFFF" },
	{ title: "谢谢参与", msg: "谢谢参与", get: false, range: [96, 100], bgcolor: "#C6BDBE", textcolor: "#FFFFFF" },
	{ title: "专属加密U盾", msg: "恭喜获得来肯云商加密U盾！", get: true, range: [91, 95], bgcolor: "#FFF4D6", textcolor: "#FFFFFF" },
	{ title: "谢谢参与", msg: "谢谢参与", get: false, range: [96, 100], bgcolor: "#C6BDBE", textcolor: "#FFFFFF" },
	{ title: "50元手机话费", msg: "恭喜获得50元充值话费", get: true, range: [86, 90], bgcolor: "#E5302F", textcolor: "#FFFFFF" },
	{ title: "谢谢参与", msg: "谢谢参与", get: false, range: [96, 100], bgcolor: "#C6BDBE", textcolor: "#FFFFFF" },
	{ title: "1200元组合抵扣券", msg: "恭喜您获得1200元抵扣券！可用于购买来肯进销存+B2B商城", get: true, range: [31, 60], bgcolor: "#FFF4D6", textcolor: "#FFFFFF" },
{ title: "谢谢参与", msg: "谢谢参与", get: false, range: [96, 100], bgcolor: "#C6BDBE", textcolor: "#FFFFFF" }];
//    turnplate.colors = ["#E5302F", "#C6BDBE", "#FFF4D6", "#C6BDBE", "#FFF4D6", "#C6BDBE", "#E5302F", "#C6BDBE", "#FFF4D6", "#C6BDBE"];
//    turnplate.textcolors = ["#FFFFFF", "#FFFFFF", "#E5302F", "#FFFFFF", "#E5302F", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#E5302F", "#FFFFFF"];

    var showAlertMsg = function (get, msg) {

        if (get) {
            $("#msgText").html(msg);
        } else {
            if (turnplate.gettime > 0) {
                $("#msgText").html("<div style='width:100%;text-align:center'>没有抽中，再来一次</div>");
            } else {
                $("#msgText").html("<div style='width:100%;text-align:center'>抽奖次数已经用完，欢迎明天再来！</div>");
            }
        }
        $("#showMsg").show();
    }

    var showMyLottery = function (msg) {

        $("#showmelisttext").html(msg);
        $("#showmelist").show()
    }

    var showLogin = function () {     
        $("#showLogin").show();
    }

    var rotateTimeOut = function () {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 8000,
            callback: function () {
                showAlertMsg(true, '网络超时，请检查您的网络设置！');
            }
        });
    };

    var getLotteryList = function () {
        $.ajax("/Lottery/GetLotteryList", {
            async: true,
            dataType:"json",
            success: function (data) {
                turnplate.restaraunts = data;
                drawRouletteWheel();
            },
            error: function (data) {
                showAlertMsg(true, data.responseText);
            }
        });
    }

    var getLotteryCount = function (funcsuccess) {
        $.ajax("/Lottery/GetTodayLotteryChanceCount", {
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.error) {
                    if (data.errortype == 1) {
                        showLogin();
                    } else {
                        showAlertMsg(true, data.msg);
                    }
                } else {
                    turnplate.gettime = data.leftcount;
                    drawGetTime(turnplate.gettime);
                    if (funcsuccess)
                        funcsuccess();
                }
            },
            error: function (data) {
                showAlertMsg(true, data.responseText);
            }
        });
    }

    var getTookLotteryList = function (funcsuccess) {
        $.ajax("/Lottery/GetTookLotteryList", {
            async: true,
            dataType: "json",
            success: function (data) {
                var htmlString = "";
                for (var i = 0; i < data.length; i++) {
                    htmlString = htmlString + "恭喜用户 " + data[i].username + " 获得 " + data[i].lotteryname + "<br />";
                }
                $("#giftList").html(htmlString);
            },
            error: function (data) {
                showAlertMsg(true, data.responseText);
            }
        });
    }
    $("#btnLogin").click(function () {
        //window.location = "/account/logon";
        $(".lkDialog").hide();
        $("#showDoLogin").show();
    });
    $("#btnRegister").click(function () {
        window.location = "/account/register";
    });
    $(".lkDialogClose").click(function () {
        $(".lkDialog").hide();
    });
    $("#showmeclose").click(function () {
        $("#showmelist").hide()
    });
    $("#btnLoginRightNow").click(function () {
        var data = { username: $("#username").val(), password: $("#pwd").val(), logintype: 1, vcode: $("#imgCode").val() };
        //$.getJSON("/Account/Auth", data, function (d) {

        //});
        $.ajax(authurl, {
            dataType: "jsonp", 
            data: data,
            success: function (result) {
                if (result.success) {
                    $("#showDoLogin").hide();
                } else {                   
                    showAlertMsg(true, result.msg);
                }
            }, error: function (result) {
                showAlertMsg(true, result.responseText);
            }
        });
    });
    $("#showme").click(function () {
        $.ajax("/Lottery/GetMyLottery", {
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.error) {
                    if (data.errortype == 1) {
                        showLogin();
                    } else {
                        showAlertMsg(true, data.msg);
                    }
                } else {
                    if (data.data.length == 0) {
                        showAlertMsg(true, "您还没有中过奖哟");
                    } else {
                        var html = "";
                        for (var i = 0; i < data.data.length; i++) {
                            html += "奖品 " + data.data[i].name + " 中奖时间： " + data.data[i].gettime + "<br />"
                        }
                        showMyLottery(html);
                    }
                }
            },
            error: function (data) {
                showAlertMsg(true, data.responseText);
            }
        });
    });
    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, restaraunts) {
        var angles = item * (360 / turnplate.restaraunts.length);
        if (angles < 270) {
            angles = 270 - angles;
        } else {
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: angles + 1800,
            duration: 8000,
            callback: function () {
                showAlertMsg(restaraunts.get, restaraunts.msg);
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    };

    var getRateItemIndex = function () {
        var random = Math.floor(Math.random() * 100 + 1);
        console.log(random);
        for (var i = 0; i < turnplate.restaraunts.length; i++) {
            if (turnplate.restaraunts[i].range[1] >= random && turnplate.restaraunts[i].range[0] <= random) {
                return i + 1;
            }
        }
        return 2;
    }
    var pointerClick = function () {
        if (turnplate.gettime == 0) {
            showAlertMsg(false, "");
            return;
        }
        turnplate.gettime = turnplate.gettime - 1;
        drawGetTime(turnplate.gettime);
        doGetLottery();
    }

    var doGetLottery = function () {
      //  $.ajax("/Lottery/GetLotteryList", {});
        $.ajax("/Lottery/GetLotteryIndex", {
            async: true,
            dataType: "json",
            success: function (data) {
                if (data.error) {
                    if (data.errortype == 1) {
                        showLogin();
                    } else {
                        showAlertMsg(true, data.msg);
                    }
                } else {
                    //turnplate.gettime = data.leftcount;
                    //drawGetTime(turnplate.gettime);
                    turnplate.bRotate = !turnplate.bRotate;
                    //获取随机数(奖品个数范围内)
                    var item = data.lindex;//rnd(1,turnplate.restaraunts.length);
                    //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
                    rotateFn(item, turnplate.restaraunts[item - 1]);
                }
            },
            error: function (data) {
                showAlertMsg(true, data.responseText);
            }
        });
    }


    $('.pointer').click(function () {
        if (turnplate.bRotate) return;
        getLotteryCount(pointerClick);
        
    });
    drawGetTime(0);
    drawRouletteWheel();
    getLotteryList();
    getLotteryCount();
    getTookLotteryList();
    setInterval(getTookLotteryList, 60000);   
});

