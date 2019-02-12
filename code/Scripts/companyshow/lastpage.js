function createLastPage(a, b, parsePage) {
    var params = GetRequest();
    if (params.userid) {
        var realurl = location.href.replace(location.search, "");
        var paramString = ""; for (var i in params) {
            if (i == "openid" || i == "weixin")
            { continue; }
            paramString += i + "=" + params[i] + "&";
        }
        realurl = realurl + "?" + paramString.substr(0, paramString.length - 1);
        weixin.hideOptionMenu();
        weixin.setShareContent(params.userid, a.obj.id, a.obj.name, a.obj.description, realurl, PREFIX_FILE_HOST + a.obj.cover);
    } else {
        weixin.setShareContent(0, a.obj.id, a.obj.name, a.obj.description, realurl, PREFIX_FILE_HOST + a.obj.cover);
    }
    document.getElementsByTagName("title")[0].innerText = a.obj.name;

    var type = a.obj.type;


    if (params.nolastpage) {
        parsePage(b, a);
    } else {
        GetAgentInfoByUserId(params.userid || 0, type == 102 ? 1 : 0, function (result) {
            var template = 
                           "<div style='font-size:18px;text-align:center;padding:10px;margin-top:30px'><a href='tel://${tel}'><img style='width:15px' src='//img1.lk361.cn/portal/Images/3.0/common/phone.png'/> ${tel}</a></div>" +
                           "<div style='text-align:center;margin-top:30px'><img style='width:60%' src='${qrcodeurl}'/></div>" +
                           "<div style='text-align:center;font-size:10pt'>长按关注并免费试用</div>" +
                           "<div style='font-size:18px;text-align:center;padding-top:25px'><a style='padding:10px;color:#fff;background:rgb(0,122,204);' href='${registsite}' style='text-decoration:underline'>免费注册试用</a></div>" +
                           "<div style='font-size:14px;text-align:center;padding-top:45px'>${agentrealname}</div>";

            var title = type == 102 ? "来肯，与您携手共创未来" : "来肯云商<br/>互联网端商贸管理专家";
            var barcodeDesc = type == 102 ? "关注后申请成为合作伙伴" : "关注后即可免费注册试用";
            var linkText = type == 102 ? "提交合作申请" : "免费注册试用";
            var linkHref = type == 102 ? "http://m.lk361.com/mobile/agentapply?salerid=" + (params.userid || 0) : result.registsite;
            var page = {
                "id": 99999999,//8831356
                "sceneId": 99999999,
                "num": 22,
                "name": null,
                "properties": null,
                "elements": [
                    {
                        "content": "",
                        "css":
                            {
                                "top": 518,
                                "left": -1417,
                                "zIndex": 0,
                                "color": "rgba(89,207,143,1)",
                                "width": 2320, "height": 700,
                                "backgroundColor": "",
                                "opacity": 1,
                                "borderWidth": 0,
                                "borderStyle": "solid",
                                "borderColor": "rgba(0,0,0,1)",
                                "paddingBottom": 0,
                                "paddingTop": 0,
                                "lineHeight": 1,
                                "borderRadius": "0px",
                                "transform": "rotateZ(0deg)",
                                "borderRadiusPerc": 0,
                                "boxShadow": "NaNpx 0px 0px 0",
                                "boxShadowDirection": 0,
                                "boxShadowSize": 0,
                                "borderBottomRightRadius": "0px",
                                "borderBottomLeftRadius": "0px",
                                "borderTopRightRadius": "0px",
                                "borderTopLeftRadius": "0px"
                            },
                        "id": 3620569832,
                        "pageId": "25580",
                        "properties":
                            {
                                "type": "rect",
                                "viewBox": "0 0 64 64",
                                "width": 2320,
                                "height": 700
                            },
                        "sceneId": 8831356,
                        "type": "h"
                    },
                    {
                        "content": null,
                        "css": [],
                        "id": 8772121673,
                        "num": 0,
                        "pageId": "25580",
                        "properties": {
                            "bgColor": null,
                            "imgSrc": "pic\/1\/201707\/595b0ade73035_small.png",
                            "id": 25467357
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": 3
                    },
                    {
                        "content": "",
                        "css": {
                            "top": 35,
                            "left": 85,
                            "zIndex": 1,
                            "width": 147,
                            "height": 38,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "lineHeight": 1,
                            "borderRadius": "0px", "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 3075306830,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 147,
                            "height": 38,
                            "src": "pic\/1\/201707\/595b0afd91b99.png",
                            "id": 9386090,
                            "imgStyle": {
                                "width": 147,
                                "height": 38,
                                "marginTop": "0px",
                                "marginLeft": "0px"
                            }
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": 4
                    },
                    //互联网端商贸管理专家
                    {
                        "content": "<div style=\"text-align: center;\"><span style=\"color: rgb(255, 255, 255); font-size: 20px; line-height: inherit; background-color: initial;\">互联网端商贸管理专家<\/span><\/div>",
                        "css": {
                            "top": 78,
                            "left": 0,
                            "zIndex": 2,
                            "width": 320,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 7618471555,
                        "num": 1,
                        "pageId": 25580,
                        "properties": [],
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    {
                        "content": "",
                        "css": {
                            "top": 125,
                            "left": 23,
                            "zIndex": 3,
                            "width": 275,
                            "height": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "lineHeight": 1,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 1457910461,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 275,
                            "height": 1,
                            "src": "pic\/1\/201705\/59100cf1e91fe.png",
                            "id": 659,
                            "imgStyle": {
                                "width": 275,
                                "height": 122,
                                "marginTop": "-60.5px",
                                "marginLeft": "0px"
                            }
                        },
                        "sceneId": 8831356,
                        "title": null,
                        "type": 4
                    },
                    //联系人信息标题
                    {
                        "content": "<div style=\"text-align: center;\"><span style=\"line-height: inherit; font-size: 18px; background-color: initial; color: rgb(255, 255, 255);\">联系人信息<\/span><\/div>",
                        "css":
                            {
                                "top": 139,
                                "left": 0,
                                "zIndex": 4,
                                "width": 320,
                                "height": 38,
                                "lineHeight": 1,
                                "backgroundColor": "",
                                "opacity": 1,
                                "color": "#676767",
                                "borderWidth": 0,
                                "borderStyle": "solid",
                                "borderColor": "rgba(0,0,0,1)",
                                "paddingBottom": 0,
                                "paddingTop": 0,
                                "borderRadius": "0px",
                                "transform": "rotateZ(0deg)",
                                "borderRadiusPerc": 0,
                                "boxShadow": "rgba(0,0,0,0) 0 0 0",
                                "boxShadowDirection": 0,
                                "boxShadowSize": 0,
                                "borderBottomRightRadius": "0px",
                                "borderBottomLeftRadius": "0px",
                                "borderTopRightRadius": "0px",
                                "borderTopLeftRadius": "0px"
                            }, "id": 5125711109,
                        "num": 1,
                        "pageId": 25580,
                        "properties": [],
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    //代理商名称标签
                    {
                        "content": "<span style=\"color: rgb(255, 255, 255); font-size: 14px;\">服务商：<\/span>",
                        "css": {
                            "top": 198, "left": 15, "zIndex": 5,
                            "width": 320,
                            "height": 38,
                            "lineHeight": "1.0",
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 4605487935,
                        "num": 1,
                        "pageId": 25580,
                        "properties": [], "sceneId": 8831356,
                        "title": null, "type": "2"
                    },
                    //代理商名称
                    {
                        "content": "<span style=\"font-size: 14px; color: rgb(255, 255, 255);\">" + result.agentrealname + "<\/span>",
                        "css": {
                            "top": 198,
                            "left": 103,
                            "zIndex": 6,
                            "width": 187,
                            "paddingLeft": 0,
                            "marginLeft":-30,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 6911172725,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 187,
                            "height": 38
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    //联系人
                    {
                        "content": "<span style=\"font-size: 14px; color: rgb(255, 255, 255);\">联<\/span><span style=\"color: rgb(255, 255, 255); font-size: 14px;\">系人：<\/span>",
                        "css": {
                            "top": 236,
                            "left": 15,
                            "zIndex": 7,
                            "width": 320,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 9541847052,
                        "num": 1,
                        "pageId": 25580,
                        "properties": [],
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    //联系人姓名
                    {
                        "content": "<span style=\"font-size: 14px; color: rgb(255, 255, 255);\">" + result.userrealname + "<\/span>",
                        "css": {
                            "top": 236,
                            "left": 74,
                            "zIndex": 8,
                            "width": 212,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 168777488,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 212,
                            "height": 38
                        },
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    //联系人电话标签
                    {
                        "content": "<span style=\"font-size: 14px; color: rgb(255, 255, 255);\">电　话：<\/span>",
                        "css": {
                            "top": 274,
                            "left": 15,
                            "zIndex": 9,
                            "width": 320,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 5407784386,
                        "num": 1,
                        "pageId": 25580,
                        "properties": [],
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    //联系人电话
                    {
                        "content": "<span style=\"color: rgb(255, 255, 255); font-size: 14px;\">" + result.tel + "<\/span>",
                        "css": {
                            "top": 275,
                            "left": 103,
                            "zIndex": 10,
                            "width": 130,
                            "paddingLeft": 0,
                            "marginLeft":-30,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 1145120268,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 118,
                            "height": 38
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    {
                        "content": "",
                        "css": {
                            "top": 281,
                            "left": 217,
                            "zIndex": 11,
                            "width": 70,
                            "height": 30,
                            "marginTop": -8,
                            "marginLeft":8,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "lineHeight": 1,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 3858058919,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 70,
                            "height": 30,
                            "src": "pic\/1\/201707\/595b0f5c036c4.png",
                            "id": 9386090,
                            "imgStyle": {
                                "width": 70,
                                "height": 31
                                , "marginTop": "-0.5px",
                                "marginLeft": "0px"
                            }
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": 4
                    },
                    //拨号
                    {
                        "content": "<a  href='tel://" + result.tel + "' style=\"color: rgb(255, 255, 255); font-size: 14px;\">拨号<\/span>",
                        "css": {
                            "top": 274,
                            "left": 207,
                            "zIndex": 12,
                            "width": 59,
                            "height": 38,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "marginTop": 0,
                            "marginLeft": 10,
                            "marginRight": 0,
                            "marginBottom": 0,
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 2023965933,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 59,
                            "height": 38
                        },
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    {
                        "content": "",
                        "css": {
                            "top": 343,
                            "left": 28,
                            "zIndex": 13,
                            "width": 267,
                            "height": 43,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "lineHeight": 1,
                            "borderRadius": "3px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        }, "id": 2443243508,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 267,
                            "height": 46,
                            "src": "pic\/1\/201707\/595b1023bf911.png",
                            "id": 9386090,
                            "imgStyle": {
                                "width": 320,
                                "height": 46,
                                "marginTop": "0px",
                                "marginLeft": "-26.5px"
                            }
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": 4
                    },
                    //免费注册试用按钮
                    {
                        "content": "<div style=\"text-align: center;\"><span style=\"color: rgb(255, 255, 255); line-height: inherit; font-size: 17px; background-color: initial;\"><a href='" + result.registsite + "' target=\"_blank\">免费注册试用<\/a><\/span><\/div>",
                        "css": {
                            "top": 344,
                            "left": 28,
                            "zIndex": 14,
                            "width": 267,
                            "height": 43,
                            "marginTop":4,
                            "lineHeight": 1,
                            "backgroundColor": "",
                            "opacity": 1,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "NaNpx 0px 0px 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 2125536595,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 267,
                            "height": 43
                        },
                        "sceneId": 8831356,
                        "title": null,
                        "type": "2"
                    },
                    {
                        "content": "",
                        "css": {
                            "top": 288,
                            "left": 262,
                            "zIndex": 16,
                            "width": 17,
                            "height": 18,
                            "backgroundColor": "",
                            "opacity": 1,
                            "marginTop": -9,
                            "marginLeft":7,
                            "color": "#676767",
                            "borderWidth": 0,
                            "borderStyle": "solid",
                            "borderColor": "rgba(0,0,0,1)",
                            "paddingBottom": 0,
                            "paddingTop": 0,
                            "lineHeight": 1,
                            "borderRadius": "0px",
                            "transform": "rotateZ(0deg)",
                            "borderRadiusPerc": 0,
                            "boxShadow": "rgba(0,0,0,0) 0 0 0",
                            "boxShadowDirection": 0,
                            "boxShadowSize": 0,
                            "borderBottomRightRadius": "0px",
                            "borderBottomLeftRadius": "0px",
                            "borderTopRightRadius": "0px",
                            "borderTopLeftRadius": "0px"
                        },
                        "id": 2006030272,
                        "num": 1,
                        "pageId": 25580,
                        "properties": {
                            "width": 17,
                            "height": 18,
                            "src": "pic\/1\/201707\/595b2b61c0a43.png",
                            "id": 9386090,
                            "imgStyle": {
                                "width": 17,
                                "height": 18,
                                "marginTop": "0px",
                                "marginLeft": "0px"
                            }
                        }, "sceneId": 8831356,
                        "title": null,
                        "type": 4
                    }
                    
                ],
                "scene": null
            };

            a.list.push(page);

            parsePage(b, a);
        })
    }
}
function mergeTemp(temp, obj) {
    return (temp + "").replace(/\$\{(\w+)\}/g, function (a, b, c) {
        if (obj[b] != null && obj[b] != undefined) {
            return obj[b] + "";
        }
        return "";
    });
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

$(function () {

    var cls = {
        width: "100%",
        position: "fixed",
        height: 35,
        bottom: 0,
        left: 0
    };

    var clsContent = {

    }

    var par = GetRequest();
    var reurl = encodeURIComponent("http://oathen.lk361.com/OAthen?appid=wxec994a3d52045fb4&callbackparams=" + encodeURIComponent("{\"userid\":" + (par["userid"] || "0") + "}"));
    var regurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxec994a3d52045fb4&redirect_uri=" + reurl + "&response_type=code&scope=snsapi_base&state=promoterforce#wechat_redirect";
    if (par["show_registe_promoter"]) {
        $("<div style='background-color:#000;z-index:9999998;'></div>").css(cls).css({ opacity: 0.5 }).appendTo(document.body);
        var url = regurl; //"http://m.lk361.com/mobile/promoterapply?openid=" + (par["openid"] || "") + "&userid=" + (par["userid"] || "") + "&weixin=" + (par["weixin"] || "");
        $("<div style='z-index:9999999'><a href='tel://400-800-7683' style='padding-left:10px;'><img src='http://img1.lk361.cn/portal/images/3.0/wenku/phone.png' style='width:20px;vertical-align: bottom;' /><span style='margin-left:10px;color:#fff;font-size:16px;display:inline-block;margin-top:10px;'>400-800-7683</span></a><a href='" + url + "' style='position:absolute;right:0;top:0; display:inline-block; background:rgb(8,160,238);color:#fff;padding:11px;width:45%;text-align:center;font-size:16px;'>申请成为推广员</a></div>").css(cls).css(clsContent).appendTo(document.body);
    }
});