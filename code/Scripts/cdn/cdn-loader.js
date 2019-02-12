(function() {
    "use strict";
    var cookieKey = "_lk_cdn_invalid";
    var hasValidKey = "_lk_cdn_has_valid"

    var LkCookieStorage = {
        add: function(key, value) {
            var cookie = key + "=" + value;
            document.cookie = cookie;
        },

        getValue: function(key) {
            var reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)"),
                matchResult = document.cookie.match(reg);
            if (matchResult) {
                return matchResult[2];
            }
            return null;
        }
    };

    if (typeof _lk_cdn_is_avaiable !== "undefined") {
        LkCookieStorage.add(hasValidKey, "true");
        return;
    }

    function getOriginal() {
        var scripts = document.getElementsByTagName("script"),
            item = null;

        for(var i = 0, j = scripts.length; i < j; ++i) {
            item = scripts[i];

            if (item.getAttribute("data-cdn-loader-type") === "check") {
                return item.getAttribute("data-cdn-loader-src");
            }
        }
        return null;
    }
    function buildInvalidCdn(current) {
        var previousInvalid = LkCookieStorage.getValue(cookieKey);
        if (previousInvalid === null) {
            return current;
        }
        if (previousInvalid.indexOf(currentInvalid) !== -1) {
            return previousInvalid;
        }
        return previousInvalid + "," + currentInvalid;
    }

    var currentInvalid = getOriginal();
    // 如果当前的 cdn 变成了 null 则表明已经尝试了所有的 cdn, 则不在
    if (currentInvalid === null || currentInvalid === "") {
        return;
    }
    currentInvalid = buildInvalidCdn(currentInvalid);
    LkCookieStorage.add(cookieKey, currentInvalid);
    window.location.reload(true);
}());
