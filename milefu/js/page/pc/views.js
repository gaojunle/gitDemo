/**
 * @author  gaojun-pd on 2017-01-09 18:56
 *
 * @descript views
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var Main = {
        init: function () {
            this.bindEvent();
            this.initLabelList();
            this.initSpeechList('', $('.js-sort li.on').data('sort'));
        },

        bindEvent: function () {
            $(".slideBox").slide({trigger: 'click', delayTime: 200,endFun:function () {
                Main.initSpeechList('', $('.js-sort li.on').data('sort'));
            }});
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
                Main.initSpeechList($(this).data('id'),$('.js-sort li.on').data('sort'))
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

                Main.initSpeechList(selLabelIds.join(','),$('.js-sort li.on').data('sort'))
                return false;
            });*/
        },
        //加载标签
        initLabelList: function () {
            $._get('/api/getlabellist', {type: 'lecture'}, function (retData) {
                var template = $('#labal-list-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData);

                $('.js-labels').html(html);
                Main.bindLabelSelect();
            });
        },

        //加载演讲列表 viewpoint 观点id sort排序类型
        initSpeechList: function (viewpoint, sort) {
            var pageCount = 10,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getlecturelist', {
                    viewpoint: viewpoint,
                    sort: sort,
                    pageNum: pageNum || 1,
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

            function renderData(retData) {
                Template7.registerHelper('publicDate', function (speaktime) {
                    return new Date(speaktime).Format('yyyy-MM-dd')
                })
                var template = $('#speech-list-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-speech-list-box').eq($('.js-sort li.on').index()).html(html);
            }

            function initPagination(retData) {
                $("#pagination-speech").pagination(Math.ceil(retData.data.totalNum / pageCount), {
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