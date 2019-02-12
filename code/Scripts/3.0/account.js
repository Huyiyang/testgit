/// <reference path="../jquery-1.11.0.min.js" />

$(function () {
    if (!placeholderSupport()) {   // 判断浏览器是否支持 placeholder
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    };

  
})

/*================================公共调用方法：开始===================================*/

/*检查是否支持placeholder*/
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/*================================公共调用方法：结束===================================*/


