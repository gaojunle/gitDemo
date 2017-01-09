/**
 * @author  Administrator on 2017/1/7
 *
 * @descript
 * @version 1.0
 * @example:
 */
$(function () {
    $(".slideBox").slide({trigger: 'click', delayTime: 200});

    //这是一个非常简单的demo实例，让列表元素分页显示
    //回调函数的作用是显示对应分页的列表项内容
    //回调函数在用户每次点击分页链接的时候执行
    //参数page_index{int整型}表示当前的索引页
    var initPagination = function () {
        // 创建分页
        $("#Pagination").pagination(40, {
            num_edge_entries: 5, //边缘页数
            num_display_entries: 4, //主体页数
            callback: pageselectCallback,
            prev_text: "< 上一页",
            next_text: "下一页 >",
            items_per_page: 3 //每页显示1项
        });
    }();

    function pageselectCallback(page_index, jq) {
        return false;
    }
})