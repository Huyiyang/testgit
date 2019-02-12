/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery-ui-1.8.20.js" />
(function ($) {
    $.fn.slidBox = function (options) {
        this.options = {

        };

        var settings = $.extend(this.options, options || {});
        var wrapper = $(this);
        var items = wrapper.children().first();
        var btns = items.next();
        var activeIndex = 0;
        var size = items.children("div").size();
        if (size == 0) {
            return;
        }

        var first_item = items.children().first();
        var first_img = $("a > img", first_item).first();



        var init = function () {
            btns.css({ opacity: .8, borderRadius: 20 });
            wrapper.show();
            for (var i = 0; i < size; i++) {
                $("<a>").attr("href", "#").appendTo(btns).mouseover(function (e) {
                    activeIndex = $(this).index();
                    start();
                    stop();
                });
            }

            start();
        }

        var start = function () {
            var activeItem = items.find("div:eq(" + activeIndex + ")");

            activeItem
                .addClass("active")
                .css({ opacity: 0 })
                .siblings().removeClass("active");
            btns.find("a:eq(" + activeIndex + ")")
                .addClass("active").siblings().removeClass("active");

            activeItem.stop().animate({ opacity: 1 }, 1500);

            activeIndex = (activeIndex + 1) % size;

            wrapper.data('timeid', window.setTimeout(start, 5000, "swing"));
        }

        var stop = function () {
            window.clearTimeout(wrapper.data('timeid'));
        }


        var __img = new Image();
        __img.onload = function (e) {
            __img.onload = null;
            init();
        };
        __img.src = first_img.attr("src");

    };
})(jQuery);