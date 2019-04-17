/**
 * Created by shangfanfan on 2016/6/24 0024.
 */


// 页面 header 中下拉菜单的控制
$(function () {
    $(".can-extend").click(function () {
        $(this).toggleClass("extend");
        $(".can-extend").not(this).removeClass("extend");
    });
    $(".extend-box").delegate("li", "click", function () {
        var $this = $(this);
        setTimeout(function () {
            $this.closest(".can-extend").removeClass("extend");
        }, 300);
    });

    $(document).on("click touchmove", function (e) {
        var $extend = $(".extend");
        // 是否是 .can-extend 的子节点
        var is_extend = $(e.target).closest(".can-extend").length > 0;

        // 非子节点并且有已经处于 .extend 状态的元素
        if (!is_extend && $extend.length > 0) {
            $extend.removeClass("extend");
            return false;
        }
    });
});