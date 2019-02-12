
//http://res.wx.qq.com/open/js/jweixin-1.0.0.js


var rootUrl = "http://www.lk361.com";//官网url，根据环境修改


//API： 根据代理商userid获取代理商信息（名称，联系方式，代理商id，操作员id，注册地址，关注微信二维码）
function GetAgentInfoByUserId(userid, mptype, callback) {
    var url = rootUrl + "/WeiXin/GetAgentInfoByUserId?userid=" + userid + "&mptype=" + mptype + "&callback=?";
    $.getJSON(url, callback);
}

function success_jsonpCallback(data) { }

//API： 记录openid分享日志（记录openid，文章id，分享时间，其他。。）
var inited = false;
var expireTime = 0;
var weixin = {
    isWx: function () {
        if (typeof wx == "undefined") {
            return false;
        }
        return true;
    },
    //微信认证
    initWxConfig: function (afterinit) {
        if (this.isWx()) {
            if (new Date() - expireTime > 7100000 || inited == false) {
                var wxsign_url = rootUrl + "/WeiXin/DoGetOAthenWx";

                $.ajax({
                    type: "post",
                    async: false,
                    url: wxsign_url,
                    data: { url: window.location.href },
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                    success: function (ret) {
                        if (ret == null) {
                            inited = false;
                        } else {
                            try {
                                var retObj = typeof ret == "object" ? ret : JSON.parse(ret);
                                if (retObj && retObj.data) {
                                    var configData = retObj.data;
                                    //目前仅使用扫描二维码
                                    configData.jsApiList = [
                                        'scanQRCode',
                                        'hideOptionMenu',
                                        'closeWindow',
                                        'hideMenuItems',
                                        'onMenuShareTimeline',
                                        'onMenuShareAppMessage',
                                        'onMenuShareQQ',
                                        'onMenuShareWeibo',
										'showMenuItems'];
                                    // ret.debug = true;
                                    // alert(JSON.stringify(ret));
                                    wx.config(configData);
                                    wx.error(function (res) {
                                        console.log(JSON.stringify(res));
                                        //  alert(JSON.stringify(res));
                                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

                                    });
                                    inited = true;
                                    expireTime = new Date();
                                    if (afterinit) {
                                        afterinit();
                                    }
                                }

                            } catch (e) {
                                alert(e.message);
                            }

                        }
                    },
                    error: function (ret) {
                        console.log(JSON.stringify(ret));
                        //   AlertDialog(ret.msg || "初始化微信接口失败");
                        inited = false;
                    }
                });

            } else {
                if (afterinit) {
                    afterinit();
                }
            }
            return inited;
        }
        return false;
    },
    //隐藏菜单
    hideOptionMenu: function () {
        if (this.isWx()) {
            var _this = this;
            this.initWxConfig(function () {
                wx.ready(function () {
                    wx.hideMenuItems({
                        menuList: ['menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:readMode', 'menuItem:copyUrl', 'menuItem:exposeArticle', 'menuItem:setFont'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                });
            });
        }
    },//隐藏菜单
    hideAllOptionMenu: function () {
        if (this.isWx()) {
            this.initWxConfig(function () {
                wx.ready(function () {
                    wx.hideMenuItems({
                        menuList: [
                                    'menuItem:openWithQQBrowser',
                                    'menuItem:openWithSafari',
                                    'menuItem:readMode',
                                    'menuItem:copyUrl',
                                    'menuItem:exposeArticle',
                                    'menuItem:setFont',
                                    'menuItem:share:appMessage',
                                    'menuItem:share:timeline',
                                    'menuItem:share:qq',
                                    'menuItem:share:weiboApp',
                                    'menuItem:share:facebook',
                                    'menuItem:share:QZone',
                                    'menuItem:favorite',
                                    'menuItem:originPage',
                                    'menuItem:share:email'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                });
            });
        }
    },
    showShareOptionMenu: function () {
        if (this.isWx()) {
            this.initWxConfig(function () {
                wx.ready(function () {
                    //  wx.showAllNonBaseMenuItem();
                    wx.showMenuItems({
                        menuList: [
                            'menuItem:openWithQQBrowser',
                            'menuItem:openWithSafari',
                            'menuItem:readMode',
                            'menuItem:copyUrl',
                            'menuItem:exposeArticle',
                            'menuItem:setFont',
                            'menuItem:share:appMessage',
                            'menuItem:share:timeline',
                            'menuItem:share:qq',
                            'menuItem:share:weiboApp',
                            'menuItem:share:facebook',
                            'menuItem:share:QZone',
                            'menuItem:favorite',
                            'menuItem:originPage'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                });
            });
        }
    },
    //设置分享内容
    _setShareContent: function (_userid, _sceneid, _title, _desc, _link, _imgUrl, callback) {
        this.showShareOptionMenu();
        wx.onMenuShareAppMessage({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imgUrl,
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function (res) {
                //alert('已分享');
                if (callback) {
                    callback();
                } else {
                    addShareLogForEqishow(1);
                }
               
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
        wx.onMenuShareTimeline({
            title: _title,
            link: _link,
            imgUrl: _imgUrl,
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击分享到朋友圈');
            },
            success: function (res) {
                //alert('已分享');
                if (callback) {
                    callback();
                } else {
                    addShareLogForEqishow(2);
                }
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
        wx.onMenuShareQQ({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imgUrl,
            trigger: function (res) {
                //alert('用户点击分享到QQ');
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                //alert('已分享');
                if (callback) {
                    callback();
                } else {
                    addShareLogForEqishow(3);
                }
            },
            cancel: function (res) {
                //alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });

        wx.onMenuShareWeibo({
            title: _title,
            desc: _desc,
            link: _link,
            imgUrl: _imgUrl,
            trigger: function (res) {
                //   alert('用户点击分享到微博');
            },
            complete: function (res) {
                //   alert(JSON.stringify(res));
            },
            success: function (res) {
                //    alert('已分享');
                if (callback) {
                    callback();
                } else {
                    addShareLogForEqishow(4);
                }
            },
            cancel: function (res) {
                //   alert('已取消');
            },
            fail: function (res) {
                //    alert(JSON.stringify(res));
            }
        });

        function addShareLogForEqishow(_optype)//添加分享Eqishow日志 
        {
            var url = rootUrl + "/WeiXin/AddShareLogForEqishow?userid=" + _userid + "&optype=" + _optype + "&fromid=" + _sceneid;
            $.ajax({
                type: "post",
                async: true,
                url: url,
                //data: { userid: _userid, optype: _optype, fromid: _sceneid },
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "success_jsonpCallback",
                success: function (data) {
                    if (data.success) {

                    }
                },
                error: function () {
                    console.log(JSON.stringify(ret));
                }
            });
        }
    },
    setShareContent: function (_userid, _sceneid, _title, _desc, _link, _imgUrl, callback) {
        if (this.isWx()) {
            var _this = this;
            this.initWxConfig(function () {
                wx.ready(function () {
                    _this._setShareContent(_userid, _sceneid, _title, _desc, _link, _imgUrl, callback);
                });
            });
        }
    },
    //扫描二维码，条码
    scanCode: function (success, failed) {
        if (this.isWx()) {
            this.initWxConfig(function () {
                wx.ready(function () {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            //条码返回的时候，会返回条码类型，所以这里要把条码类型去掉
                            var string = res.resultStr.split(",");                       
                            if (string.length > 1) {
                                success(string[string.length - 1]);
                            } else {
                                success(res.resultStr);
                            }

                        }
                    });
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                });
            });
        }
    }
}

//weixin.setShareContent(1, 1, "测试", "描述", "http://www.laikensoft.com/WeiXin/WenKuList/0", "");
