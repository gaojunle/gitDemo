/**
 * @author  gaojun-pd on 2017-01-13 18:00
 *
 * @descript people-list
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
            this.bindLabelSelect();
        },

        initData: function () {
            this.initLabelList();
            this.initPeopleList();
        },

        //标签选择操作
        bindLabelSelect: function () {
            var selLabelIds = [];

            function removeByValue(arr, val) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == val) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }

            //单选
            $('.js-labels').on('click', 'a', function () {
                var $this = $(this);
                $this.addClass('on').siblings().removeClass('on');
                Main.initPeopleList($(this).data('id'));
            });
            return false;
            //多选
            /*$('.js-labels').on('click', 'a:not([data-id=0])', function () {
                var $this = $(this),
                    $sLabels = $('.js-select-labels'),
                    selId = $this.data('id'),
                    selLabel = $sLabels.find('[data-id=' + selId + ']');

                $this.toggleClass('on');

                //没有选择该标签
                if (selLabel.length == 0) {
                    $sLabels.append($this.clone().addClass('on'));
                    selLabelIds.push(selId);
                } else {
                    removeByValue(selLabelIds, selId);
                    selLabel.remove();
                }

                Main.initPeopleList(selLabelIds.join(','))
                return false;
            });*/
        },

        //加载标签
        initLabelList: function () {
            $._get('/api/getlabellist', {type: 'celebrity'}, function (retData) {
                var template = $('#labal-list-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData);

                $('.js-labels').html(html);
            });
        },

        //加载人物列表, labels所选的人物标签
        initPeopleList: function (labels) {
            var pageCount = 10,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getcelebritylist', {
                    type: 'celebrity',
                    labels: labels || '',
                    pageNum: pageNum,
                    count: pageCount
                }, function (retData) {
                    renderData(retData);
                    if (isInit) {
                        initPagination(retData);
                        isInit = false;
                    }

                    return false;
                });
            }
            Template7.registerHelper('likeTpl', function (isLike, id) {
                var tpl = isLike ?
                '<span class="focus js-like on" data-type="celebrity" data-id="' + id + '">已关注</span>' :
                '<span class="focus js-like" data-type="celebrity" data-id="' + id + '">关注</span>'
                return tpl;
            });

            Template7.registerHelper('statusName', function (status) {
                var statusMap = ['审核中', '审核通过', '审核拒绝'];//1,2,3
                return statusMap[status - 1] || '审核中';
            });
            function renderData(retData) {
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