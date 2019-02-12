/// <reference path="../jquery-1.11.0.min.js" />

function getErrorHTML(msg) {
    return "<span class='glyphicon glyphicon-remove-sign' style='font-size:15px;width:15px;color:red'></span> <span style='color:red'>" + msg + "<span>";
}

function getInfoHTML(msg) {
    return "<span class='' style='font-size:15px;width:15px;color:green'></span> <span style='color:green'>" + msg + "<span>";
}

function showPopupError(selector, msg) {
    $(selector).attr("data-content", getErrorHTML(msg));
    $(selector).popover('show');
}

function showPopupInfo(selector, msg) {
    $(selector).attr("data-content", getInfoHTML(msg));
    $(selector).popover('show');
}
$(function () {
    $("input[type=text],input[type=button],input[type=textarea]").attr("data-html", "true");

    /*第一步开始*/
    //手机号码
    $("#cellphone").blur(function () {
        CheckCellphone();
    });

    var timeout = true;

    function smsok() {
        timeout = false;
        var btn_code = $("#btnMsgCode");
        btn_code.prop("disabled", true);

        var t = 60;
        function tick() {
            btn_code.html(t + "s后获取");
            if (t > 0) {
                timeout = false;
                setTimeout(tick, 1000);
                t--;
            } else {
                btn_code.html("点击获取验证码");
                btn_code.prop("disabled", false);
                timeout = true;
            }
        }
        tick();
    }

    $("#btnMsgCode").click(function () {//获取短信验证码
        if (!CheckCellphone()) {//手机号码是否正确
            return;
        } else if (timeout === false) {//检查能否发送短信
            return;
        } else {
            var btn_code = $("#btnMsgCode");
            btn_code.prop("disabled", true);

            $.ajax({
                url: "/Account/sendmessage",
                type: "POST",
                async: false,
                dataType: "json",
                data: { mobile: $("#cellphone").val(), type: 'customizedapply' },
                success: function (rst) {
                    if (rst.error) {
                        if (timeout === true) {
                            btn_code.html("点击获取验证码");
                            btn_code.prop("disabled", false);
                        }
                        ShowMessage("#msgCode", rst.error);
                        return;
                    }
                    $("#t_code").val(rst.code);
                    smsok();
                },
                error: function (err) {
                    if (timeout === true) {
                        btn_code.html("点击获取验证码");
                        btn_code.prop("disabled", false);
                    }
                    ShowMessage("#msgCode", err.responseText);
                }
            });
        }
    });

    //获取方案
    $("#btnNext").click(function () {
        if (!CheckCellphone()) {
            return;
        } else if (!CheckMsgCode()) {
            return;
        } else {
            $("#telephone_section").addClass("hidden");
            $("#contact_section").removeClass("hidden");
        }
    });

    /*第一步结束*/

    /*第二步开始*/

    //联系人
    $("#contactor").blur(function () {
        CheckContactor();
    });

    //提交
    $("#btnSubmit").click(function () {
        if (!CheckContactor()) {
            return;
        } else {
            $("#btnSubmit").attr("disabled", "disabled");
            $.ajax({
                url: "/Account/CustomizedApply",
                type: "POST",
                async: false,
                dataType: "json",
                data: { cellphone: $("#cellphone").val(), msgCode: $("#msgcode").val(), contactor: $("#contactor").val(), companyname: $("#companyname").val(), requirement: $("#requirement").val() },
                success: function (rst) {
                    if (rst.success) {
                        $("#contact_section").addClass("hidden");
                        $("#redirect_section").removeClass("hidden");
                        handleCountDown();
                    } else {
                        ShowMessage("#btnSubmit", rst.message);
                        $("#btnSubmit").removeAttr("disabled");
                    }
                },
                error: function (err) {
                    ShowMessage("#btnSubmit", "信息提交错误，请联系客服！");
                    $("#btnSubmit").removeAttr("disabled");
                }
            });
        }
    });
    /*第二步结束*/

    /* 处理第三步倒计时 */
    function handleCountDown() {
        var count = 5,
            redirectLink = $("#apply_page #redirect_link"),
            countDom = redirectLink.find("span")[0],
            link = redirectLink.find("a").attr("href"),
            delayJob = null;

        delayJob = setInterval(function () {
            countDom.innerHTML = count;
            if (count === 0) {
                clearInterval(delayJob);
                window.location = link;
            }
            count--;
        }, 1000);
    }

});


//显示错误信息
function ShowMessage(selector, message) {
    showPopupError(selector, message);
    //$(selector).focus();
    $(selector).css("border-color", "#ed6c00 ");
}

//隐藏错误信息
function RemoveMessage(selector) {
    $(selector).popover('hide');
    $(selector).css("border-color", "#e5e5e5 ")
}

//检查手机号码
function CheckCellphone() {
    var cellphone = $("#cellphone").val();
    var flag = false;
    if ($.trim(cellphone) == "") {
        ShowMessage("#cellphone", "请填写手机号码！");
    } else if (!/^1[3-9]{1}\d{9}$/gi.test(cellphone)) {
        ShowMessage("#cellphone", "手机号码不正确！");
    } else {//后台验证手机号码，成功后将提示信息改为空
        $.ajax({
            url: "/Account/CustomizedMobileValidate",
            type: 'POST',
            async: false,
            dataType: "json",
            data: { mobile: cellphone },
            async: false,
            success: function (result) {
                if (!result.success) {
                    ShowMessage("#cellphone", result.message);
                } else {
                    RemoveMessage("#cellphone");
                    flag = true;
                }
            }
        });
    }

    return flag;
}

//检查验证码
function CheckMsgCode() {
    var msgcode = $("#msgcode").val();
    var flag = false;
    if ($.trim(msgcode) == "") {
        ShowMessage("#msgcode", "请填写短信验证码！");
    } else {
        $.ajax({
            async: false,
            type: "POST",
            url: "/account/validatemsgcode",
            data: { mobile: $("#cellphone").val(), code: msgcode, type: "customizedapply" },
            success: function (result) {
                if (result.success) {
                    flag = true;
                    RemoveMessage("#msgcode");
                } else {
                    ShowMessage("#msgcode", result.message);
                }
            }, error: function () {
                ShowMessage("#msgcode", "验证短信验证码失败！");
            }
        });
    }

    return flag;
}

//检查联系人
function CheckContactor() {
    var contactor = $("#contactor").val();
    var flag = false;
    if ($.trim(contactor) == "") {
        ShowMessage("#contactor", "请填写联系人！");
    } else {
        RemoveMessage("#contactor");
        flag = true;
    }

    return flag;
}


(function () {

    function ScrollOver(element, options) {
        this._container = element;
        this.options = options;
        this._init();
    }

    function isSupportTransition() {
        var thisBody = document.body || document.documentElement,
                    thisStyle = thisBody.style,
                    support = thisStyle.transition !== undefined ||
                              thisStyle.WebkitTransition !== undefined ||
                              thisStyle.MozTransition !== undefined ||
                              thisStyle.MsTransition !== undefined ||
                              thisStyle.OTransition !== undefined;
        return support;
    }

    ScrollOver.prototype = {
        _refreshTime: 0,
        _supportTransition: null,

        _init: function () {
            this._bindEventHandler();
            this._buildScrollItem();
        },

        _bindEventHandler: function () {
            $(window).on("load", $.proxy(this._handleWindowLoad, this));
        },

        _handleWindowLoad: function () {
            setTimeout(function () {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 100);
        },

        _buildScrollItem: function () {
            var items = this._container.find("[data-over-item]"),
                itemOptions = this._getScrollItemOptions();

            this._items = [];

            for (var i = 0; i < items.length; ++i) {
                this._items.push(new ScrollOverItem(items[i], itemOptions));
            }
        },

        _getScrollItemOptions: function () {
            return {
                offsetTop: this.options.offsetTop,
                contentOffset: this.options.contentOffset,
                handleShowAction: $.proxy(this._handleShowOverItem, this),
                handleCloseAction: $.proxy(this._handleCloseOverItem, this)
            };
        },

        _handleShowOverItem: function (showItem) {
            var otherItems = [];

            if (!this._isSupportTransition()) {
                showItem.showExpandSection();
                return;
            }
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i] !== showItem) {
                    otherItems.push(this._items[i]);
                }
            }

            for (i = 0; i < otherItems.length; ++i) {
                otherItems._isCanBeFixed = false;
            }
            showItem.showExpandSectionWithTransition();

            setTimeout(function () {
                for (i = 0; i < otherItems.length; ++i) {
                    otherItems._isCanBeFixed = true;
                }
            }, 3000);
        },

        _cacheElementFixedData: function (element, position) {
            element.data({
                position: "fixed",
                top: position.top,
                left: position.left,
                right: position.right,
                width: position.right - position.left,
                height: position.bottom - position.top,
                bottom: position.bottom
            });
        },

        _setElementPositionByData: function (element) {
            element.css(element.data());
        },

        _isSupportTransition: function () {
            if (this._supportTransition === null) {
                this._supportTransition = isSupportTransition();
            }
            return this._supportTransition;
        },

        _handleCloseOverItem: function (hideItem) {
            var items = this._items,
                i = null,
                container = null,
                position = null,
                self = this,
                item = null,
                expandPosition = hideItem.getExpandPosition(),
                hideContainerPosition = hideItem.getContainerPosition(),
                nextItem = null,
                nextItemContainer = null,
                nextItemPosition = null,
                firstBelowElement = null,
                isLastItem = false,
                expandStatus = null,
                screenHeight = window.screen.availHeight;;


            if (expandPosition.top > 0) {
                expandStatus = "half";
            } else if (expandPosition.top <= 0 && expandPosition.bottom > screenHeight) {
                expandStatus = "full";
            } else {
                expandStatus = "tail";
            }

            if (expandStatus === "half") {
                hideItem.hideExpandSection();
                return;
            }

            for (i = 0; i < this._items.length; ++i) {
                if (items[i] === hideItem) {
                    nextItem = items[i + 1];
                    break;
                }
            }

            if (nextItem) {
                nextItemContainer = nextItem.getContainerElement();
            } else {
                isLastItem = true;
            }

            document.body.style.overflow = "hidden";

            for (i = 0; i < items.length; ++i) {
                item = items[i];
                container = item.getContainerElement();
                position = item.getContainerPosition();

                this._cacheElementFixedData(container, position);
            }

            if (isLastItem) {
                for (i = 0; i < this.options.belowElements.length; ++i) {
                    item = this.options.belowElements[i];
                    position = item.get(0).getBoundingClientRect();
                    this._cacheElementFixedData(item, position);
                }
            }


            if (isLastItem) {
                for (i = 0; i < this.options.belowElements.length; ++i) {
                    this._setElementPositionByData(this.options.belowElements[i]);
                }
            }

            for (var i = 0; i < items.length; ++i) {
                item = items[i];
                container = item.getContainerElement();
                this._setElementPositionByData(container);
            }


            if (isLastItem) {
                firstBelowElement = this.options.belowElements[0];

                if (expandStatus === "full") {
                    firstBelowElement.css({ top: hideItem.getContainerElement().data().bottom - (expandPosition.bottom - screenHeight) });
                    firstBelowElement.css({ "margin-top": -200 });
                    hideItem._collapseElement.css({ top: screenHeight - (340 + expandPosition.top), "z-index": 8 });
                } else {
                    this._container.css("height", hideItem.getContainerPosition().bottom + screenHeight);
                    hideItem._collapseElement.css({ top: hideItem._expandElement.height() - 140, "z-index": 8 });
                }
                nextItemPosition = firstBelowElement.get(0).getBoundingClientRect();
            } else {
                this._container.css("height", items[items.length - 1].getContainerPosition().bottom + "px");

                if (expandStatus === "full") {
                    // 将下一块的上边界定位到屏幕的下边界
                    nextItemContainer.css({ top: hideItem.getContainerElement().data().bottom - (expandPosition.bottom - screenHeight) });
                    nextItemContainer.css({ "margin-top": -200 });
                    /**
                     * 首先将 top 设置为展开块的距屏幕上边界的负值，即将收起块的下边界与屏幕的上边界重合
                     * 然后再向下移动 screenHeight - 200 即为与下面重合但是因为在展开时
                     * 展开块与收起块有 10em 的重合，所以需要减去重合的调试 10em = 140px
                     */

                    hideItem._collapseElement.css({ top: screenHeight - (340 + expandPosition.top), "z-index": 8 });
                } else {
                    hideItem._collapseElement.css({ top: expandPosition.height - 140, "z-index": 8 });
                }

                nextItemPosition = nextItem.getCollapsePosition();
            }

            setTimeout(function () {
                var container = null,
                    scrollTop = null,
                    i = null;

                if (isLastItem) {
                    firstBelowElement.css("transition", "none");
                    for (i = 0; i < self.options.belowElements.length; ++i) {
                        container = self.options.belowElements[i];
                        container.css({ position: "", top: "", left: "", right: "", bottom: "", width: "", height: "", "margin-top": "" });
                    }
                } else {
                    nextItemContainer.css("transition", "none");
                    nextItemContainer.css({ top: "", "margin-top": "" });
                }

                self._container.css("height", "");

                hideItem._collapseElement.css("transition", "none");
                hideItem._collapseElement.css({ top: "", "z-index": "" });
                hideItem._expandElement.css("transition", "none");
                hideItem.hideExpandSection();


                for (i = 0; i < items.length; ++i) {
                    container = items[i].getContainerElement();
                    container.css("transition", "none");
                    container.css({ position: "", top: "", left: "", right: "", bottom: "", width: "", height: "" });
                }

                if (isLastItem) {
                    if (expandStatus === "full") {
                        //document.body.scrollTop =  hideItem.getCollapsePosition().bottom -  screenHeight + 340;
                        //document.body.scrollTop = 10000;
                        scrollTop = hideItem.getCollapsePosition().bottom - screenHeight + 200;
                        document.documentElement.scrollTop = scrollTop;
                        self._setScrollTop(scrollTop);
                    } else {
                        //document.body.scrollTop = document.body.scrollTop + hideItem.getCollapsePosition().bottom - nextItemPosition.top;
                        scrollTop = self._getScrollTop() + hideItem.getCollapsePosition().bottom - nextItemPosition.top;
                        document.documentElement.scrollTop = scrollTop;
                        self._setScrollTop(scrollTop);
                    }
                } else {
                    if (expandStatus === "full") {
                        //document.body.scrollTop +=  hideItem.getCollapsePosition().bottom - screenHeight + 200;
                        scrollTop = self._getScrollTop() + hideItem.getCollapsePosition().bottom - screenHeight + 200;
                        self._setScrollTop(scrollTop);
                    } else {
                        //document.body.scrollTop = document.body.scrollTop + hideItem.getCollapsePosition().bottom - nextItemPosition.top;
                        scrollTop = self._getScrollTop() + hideItem.getCollapsePosition().bottom - nextItemPosition.top;
                        self._setScrollTop(scrollTop);
                    }

                }
                document.body.style.overflow = "";

                setTimeout(function () {
                    if (isLastItem) {
                        firstBelowElement.css("transition", "");
                    } else {
                        nextItemContainer.css("transition", "");
                    }
                    hideItem._collapseElement.css("transition", "");
                    hideItem._expandElement.css("transition", "");
                    for (var i = 0; i < items.length; ++i) {
                        container = items[i].getContainerElement();
                        container.css("transition", "");
                    }
                }, 0);
            }, 1100);
        },

        _getScrollTop: function () {
            if (document.documentElement.scrollTop > document.body.scrollTop) {
                return document.documentElement.scrollTop;
            }

            return document.body.scrollTop;
        },

        _setScrollTop: function (scrollTop) {
            if (document.documentElement.scrollTop > document.body.scrollTop) {
                document.documentElement.scrollTop = scrollTop;
            } else {
                document.body.scrollTop = scrollTop;
            }
        }
    };



    function ScrollOverItem(element, options) {
        this._container = $(element);
        this.options = options;
        this._init();
    }

    ScrollOverItem.prototype = {
        overflowHeight: 1600,
        finalOptacity: 0.7,
        findalShakeDistance: 40,
        _avargeShakeDistance: null,
        _opacityDistance: null,
        _beforeScrollTop: 0,
        _currentStatus: null,
        _defaultOffsetTop: 0,
        _defaultId: 0,
        _isCanBeFixed: true,
        _isSupportTransition: null,

        _init: function () {
            this._setInitialData();
            this._setInitialSize();
            this._calculateAvargeValue();
            this._addOptacityLayer();
            this._addReplaceLayer();
            this._addExpandPaddingLayer();
            this._bindEventHandler();
            this._overId = this._defaultId++;
        },


        _bindEventHandler: function () {
            $(window).on("scroll", $.proxy(this._handleScroller, this));
            this._expandBtn.on("click", $.proxy(this._handleExpandSection, this));
            this._closeBtn.on("click", $.proxy(this._handleCloseSection, this));
        },

        _setInitialData: function () {
            this.offsetTop = this.options.offsetTop ? this.options.offsetTop : this._defaultOffsetTop;
            this.contentOffset = this.options.contentOffset ? this.options.contentOffset : 0;

            this._collapseElement = this._container.find("[data-type='collapse']");
            this._collapseBg = this._collapseElement.find("[data-type='collapse-bg']");
            this._collapseContent = this._collapseElement.find("[data-type='collapse-content']");
            this._expandElement = this._container.find("[data-type='expand']");
            this._expandContent = this._expandElement.find("[data-type='expand-content']");

            this._expandBtn = this._collapseElement.find("[data-type='expand-btn']");
            this._closeBtn = this._expandElement.find("[data-type='close-btn']");

            this._initPosition = this._container.get(0).getBoundingClientRect();
            this._isSupportTransition = isSupportTransition();

        },

        _setInitialSize: function () {
            var collapseHeight = window.screen.availHeight - this.options.offsetTop,
                collapseContentPosition = {
                    position: this._collapseContent.css("position"),
                    top: this._collapseContent.css("top"),
                    right: this._collapseContent.css("right"),
                    bottom: this._collapseContent.css("bottom"),
                    left: this._collapseContent.css("left")
                };
            this._container.css({ "position": "relative", "z-index": 4 });
            this._collapseElement.css({ "height": "auto", "position": "relative" });
            this._collapseContent.data("init_state", collapseContentPosition);
            this._collapseContent.css({
                position: "absolute",
                "z-index": 3,
                height: collapseHeight ,
                top: this.overflowHeight - collapseHeight,
            });
            this._collapseBg.css({
                width: "100%",
                height: collapseHeight + "px"
            });
            this._opacityDistance = this.overflowHeight - collapseHeight - this.options.offsetTop + 150;
        },

        _calculateAvargeValue: function () {
            this._avargeOptacity = this.finalOptacity / this._opacityDistance;
            this._avargeShakeDistance = this.findalShakeDistance / this.overflowHeight;
        },

        _addReplaceLayer: function () {
            this._replaceElement = this._createReplaceLayer();
            this._collapseElement.append(this._replaceElement);
        },

        _createReplaceLayer: function () {
            var height = this.overflowHeight;

            return $("<div style='height: " + height + "px; width: 100%; position: relative; display: none;'></div>");
        },

        _addOptacityLayer: function () {
            this._layerElement = this._createOptacityLayer();
            this._collapseElement.append(this._layerElement);
        },

        _createOptacityLayer: function () {
            return $("<div style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: none; opacity: 0; z-index: 2; background-color: #000'></div>");
        },

        _addExpandPaddingLayer: function () {
            this._expandLayer = this._createExpandPaddingLayer();
            this._expandElement.append(this._expandLayer);
        },

        _createExpandPaddingLayer: function () {
            return $("<div style='position: static; display: none;'></div>");
        },

        _createContainerReplaceLayer: function () {
            return $("<div style='position: static;'>");
        },

        _handleScroller: function () {
            var replaceSize = this._getReplaceElementSize(),
                collpaseBgSize = this.getCollapseBgPosition();


            if (this._isScrollDown()) {
                if (this._isCanBeFixed && this._currentStatus !== "match_bottom" && this._currentStatus !== "fixed" && collpaseBgSize.top < this.offsetTop) {
                    this._setCollapseFixed();
                    this._currentStatus = "fixed";
                    return;
                }

                if (this._currentStatus === "fixed") {
                    if (replaceSize.bottom > collpaseBgSize.bottom) {
                        this._changeLayerOpacityByDistance();
                    } else {
                        this._collapseBg.css({ position: "absolute", top: "auto", bottom: -this.findalShakeDistance });
                        this._currentStatus = "match_bottom";
                    }
                }

            } else {
                if (this._isCanBeFixed && this._currentStatus === "match_bottom" && collpaseBgSize.top > this.offsetTop) {
                    this._setCollapseFixed();
                    this._currentStatus = "fixed";
                    return;
                }

                if (this._currentStatus === "fixed") {
                    if (collpaseBgSize.top > replaceSize.top) {
                        this._changeLayerOpacityByDistance();
                    } else {
                        this._currentStatus = "match_top";
                        this._layerElement.css({ display: "none", opacity: 0 });
                        this._collapseBg.css({ position: "absolute", top: "0px", bottom: "auto"});
                    }
                }
            }
            this._shakeBgByScroll();
        },


        _shakeBgByScroll: function () {
            var collapseBgPosition = null,
                replacePosition = null,
                currentShake = null;

            if (this._isSupportTransition && this._currentStatus !== null) {
                collapseBgPosition = this.getCollapseBgPosition();

                if (collapseBgPosition.top < window.screen.availHeight) {
                    replacePosition = this._replaceElement.get(0).getBoundingClientRect(),
                    currentShake = this._avargeShakeDistance * (this.overflowHeight + collapseBgPosition.bottom - replacePosition.bottom);
                    this._collapseBg.css("transform", 'translate3d(0,-' + currentShake + 'px,0)');
                }
            }
        },

        _handleExpandSection: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this._isExpandTriggerElement(event.target)) {
                if (this.options.handleShowAction) {
                    this.options.handleShowAction(this);
                } else {
                    this.showExpandSection();
                }
            }
        },

        _isExpandTriggerElement: function(element) {
            var tagName = element.tagName.toLowerCase();
            return tagName === "img" || tagName === "span";
        },

        _handleCloseSection: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.options.handleCloseAction) {
                this.options.handleCloseAction(this);
            } else {
                this.hideExpandSection();
            }
        }, 

        _isScrollDown: function () {
            return this._getScrollDirection() === "down";
        },

        _isScrollUp: function () {
            return this._getScrollDirection() === "up";
        },

        _getReplaceElementSize: function () {
            var position = this._replaceElement.get(0).getBoundingClientRect();
            return this._formatElementPosition(position);
        },

        _getCollapseBgSize: function () {
            var position = this._collapseBg.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        _getExpandElementSize: function () {
            var position = this._expandElement.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        _getCollapseSize: function () {
            var position = this._collapseElement.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        _getScrollDirection: function () {
            var distance = this._getScrollDistance();

            if (distance > 0) {
                return "down";
            } else if (distance < 0) {
                return "up";
            }

            return null;
        },

        _getScrollDistance: function () {
            var top = document.documentElement.scrollTop || document.body.scrollTop,
                distance = top - this._beforeScrollTop;

            this._beforeScrollTop = top;
            return distance;
        },


        _changeLayerOpacityByDistance: function () {
            var collapseBgPosition = this._collapseBg.get(0).getBoundingClientRect(),
                replacePosition = this._replaceElement.get(0).getBoundingClientRect(),
                currentOpacity = Math.abs(this._avargeOptacity * (this._opacityDistance - (replacePosition.bottom - collapseBgPosition.bottom)));

            this._layerElement.css("opacity", currentOpacity);
        },

        _setCollapseFixed: function () {
            this._replaceElement.css("display", "block");
            this._layerElement.css("display", "block");
            this._collapseBg.css({
                "position": "fixed",
                "top": this.offsetTop
            });
        },

        _formatElementPosition: function (position) {
            return {
                top: position.top,
                right: position.right,
                bottom: position.bottom,
                left: position.left,
                width: position.right - position.left,
                height: position.bottom - position.top
            };
        },

        showExpandSection: function () {
            this.isExpand = true;
            this._expandElement.addClass("show-section");
            this._collapseElement.addClass("expand");
        },

        showExpandSectionWithTransition: function () {
            this.isExpand = true;

            var position = this.getCollapsePosition(),
                height = window.screen.availHeight - position.bottom + this.offsetTop;

            // 设置元素的调试为收起块到屏幕底部的距离，避免展开块的高度太大导致动画过快
            this._expandElement.css({ height: height });
            this._expandElement.addClass("show-section");
            this._collapseElement.addClass("expand");

            var _this = this;
            setTimeout(function () {
                var self = _this;
                // 设置展开块的高度为自动以使展开块的内容完全显示
                self._expandElement.css({ height: "auto" });
                // 设置展开块的高度为其自身的高度以使展开块在收起是有动画效果
                self._expandElement.css({ height: self._expandElement.height() });
            }, 1100);
        },

        hideExpandSection: function () {
            this.isExpand = false;
            // 取消显示时为展开块设置的高度，以隐藏展开块
            this._expandElement.css("height", "");
            this._expandElement.removeClass("show-section");
            this._collapseElement.removeClass("expand");
        },

        getCollapsePosition: function () {
            var position = this._collapseElement.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        getExpandPosition: function () {
            var position = this._expandElement.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        getContainerElement: function () {
            return this._container;
        },

        getContainerPosition: function () {
            var position = this._container.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

        getCollapseBgPosition: function () {
            var position = this._collapseBg.get(0).getBoundingClientRect();

            return this._formatElementPosition(position);
        },

    };

    $.fn.scrollOver = function (options) {
        return new ScrollOver(this, options);
    };


}());


(function () {
    "use strict";
    /* 定制方案展示页面 */
    var customPage = $("#custom_page");

    (function () {
        "use strict";
        var appealSection = customPage.find("#appeal_section"),
            footerSection = customPage.find("#footer");

        $("#custom_page #content_section").scrollOver({
            offsetTop: 60,
            contentOffset: 50,
            belowElements: [appealSection, footerSection]
        });
    }());

    var expandElements = customPage.find(".expand-section");

    for (var i = 0, j = expandElements.length; i < j; ++i) {
        var item = $(expandElements[i]);
        item.affix({
            offset: {
                top: $.proxy(calculateOffset, item)
            }
        });
    }

    function calculateOffset() {
        return this.offset().top;
    }

}());
