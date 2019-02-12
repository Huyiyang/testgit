/// <reference path="jquery-1.11.0.js" />
(function ($) {
    $.fn.bannerscroller = function () {
        var self = this;
        var wrapper = $(self);
        var imgs = $("img", self);
        var size = imgs.size();
        var total_h = size * 400;
        var i = 1;
        setInterval(function () {
            wrapper.css("background-color", imgs.eq(i).attr("bgcolor"));
            imgs.eq(i).fadeIn().siblings().hide();
            i++;
            i = i % size;
        }, 5000);

    };
})(jQuery);