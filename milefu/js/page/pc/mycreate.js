/**
 * @author  gaojun-pd on 2017-01-13 18:30
 *
 * @descript mycreate
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var Main = {
        init: function () {
            this.bindEvent();
            this.initData();
        },
        bindEvent: function () {
            $(".slideBox").slide({trigger: 'click', delayTime: 200});
        },
        initData: function () {
            var pageCount = 10,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getmyapplylist', {
                    type: 'celebrity',
                    pageNum: pageNum,
                    count: pageCount
                }, function (retData) {
                    renderData(retData);
                    if(isInit){
                        initPagination(retData);
                        isInit = false;
                    }

                    return false;
                });
            }

            function renderData(retData) {
                Template7.registerHelper('statusName', function (status) {
                    var statusMap = ['审核中', '审核通过', '审核拒绝'];//1,2,3
                    return statusMap[status - 1] || '审核中';
                });

                var template = $('#people-list-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-people-list-box').html(html);
            }

            function initPagination(retData) {
                $("#pagination-people").pagination(Math.ceil(retData.data.totalNum / pageCount), {
                    num_edge_entries: 4, //边缘页数
                    num_display_entries: 4, //主体页数
                    callback: function (page) {
                        console.log(page)
                        getData(page + 1);
                    },
                    prev_text: "< 上一页",
                    next_text: "下一页 >",
                    items_per_page: 1 //每页显示项
                });
            }
        }
    };
    Main.init();
})