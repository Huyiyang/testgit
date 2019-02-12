$(function () {
    var lessIE9 = $.browser.msie && parseFloat($.browser.version) < 9;

    $('[placeholder]').focus(function () {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
            if (!lessIE9 && input.data().type == 'password') {
                this.type = 'password';
            }
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            //i9以下不设置密码框的 placeholder
            if (!(lessIE9 && this.type == 'password')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
            //i9以上显示密码框的 placeholder
            if (!lessIE9 && this.type == 'password') {
                this.type = 'text';
                input.data({ type: 'password' });
            }
        }
    }).blur();

    $('form').submit(function () {
        $(this).find('[placeholder]').each(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        })
    });
});