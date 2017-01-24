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
            this.initPeopleList();
            this.initSpeechList();
        },

        bindEvent: function () {
            $(".slideBox").slide({trigger: 'click', delayTime: 200});
        },

        //加载人物列表
        initPeopleList: function () {
            var pageCount = 5,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getmyapplylist', {
                    type: 'celebrity',
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
                Template7.registerHelper('likeTpl', function (isLike, id) {
                    var tpl = isLike ?
                    '<span class="focus js-like on" data-type="celebrity" data-id="' + id + '"><i></i>已关注</span>' :
                    '<span class="focus js-like" data-type="celebrity" data-id="' + id + '"><i></i>关注</span>'
                    return tpl;
                });
                Template7.registerHelper('editBtn', function (status, myapplyId, celebrityId) {
                    if (status != 1) {
                        return '<a class="btn-edit" href="./createPeople.html?id=' + celebrityId + '">编辑</a>';
                    }
                    return '';
                });
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
                        if (!isInit) {
                            getData(page + 1);
                        }
                    },
                    prev_text: "< 上一页",
                    next_text: "下一页 >",
                    items_per_page: 1 //每页显示项
                });
            }
        },

        //加载演讲列表
        initSpeechList: function () {
            var pageCount = 5,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getmyapplylist', {
                    type: 'lecture',
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
                Template7.registerHelper('editBtn', function (status, myapplyId, lectureId) {
                    if (status != 1) {
                        return '<a class="btn-edit" style="vertical-align: middle;" href="./createSpeech.html?id=' + lectureId + '">编辑</a>';
                    }
                    return '';
                });
                Template7.registerHelper('statusName', function (status) {
                    var statusMap = ['审核中', '审核通过', '审核拒绝'];//1,2,3
                    return statusMap[status - 1] || '审核中';
                });
                Template7.registerHelper('publicDate', function (speaktime) {
                    return new Date(speaktime).Format('yyyy-MM-dd')
                })
                var template = $('#speech-list-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-speech-list-box').html(html);
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