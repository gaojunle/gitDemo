/**
 * @author  gaojun-pd on 2016/6/8
 *
 * @descript
 * @version 1.0
 * @example:
 */

jQuery(function ($) {
    var Main = {
        init: function () {
            this.bindEvent();
            this.initList();
        },

        bindEvent: function () {
            $('.slideBox').slide({
                mainCell: '.bd ul',
                effect: 'left',
                autoPlay: true,
                trigger: 'click',
                delayTime: 700,
                vis: 'auto'
            });
        },


        //加载人物列表
        initList: function () {
            var pageCount = 9,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/home', {
                    pageNum: pageNum || 1,
                    count: pageCount
                }, function (retData) {
                    renderData(retData);
                    //人物上切换
                    $(".people-slide").slide({delayTime: 0});

                    if (isInit) {
                        initPagination(retData);
                        isInit = false;
                    }

                    return false;
                });
            }

            function renderData(retData) {
                Template7.registerHelper('introFormat', function (intro) {
                    return intro.replace(/white-space: nowrap/g,'')
                })
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
                        if (!isInit) {
                            getData(page + 1);
                        }
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