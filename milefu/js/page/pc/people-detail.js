/**
 * @author  Administrator on 2017/1/7
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var $peopleInfo = $('.js-people-info');
    var id = Util.getQueryString('id');
    var myapplyId = Util.getQueryString('myapplyId');
    var celebrityId = Util.getQueryString('celebrityId') || id;

    var Main = {
        init: function () {
            this.bindEvent();
            this.initData();
            this.initSpeechList('', $('.js-sort li.on').index());
        },
        bindEvent: function () {
            //下拉展开
            $peopleInfo.on('click', '.peop-desc', function () {
                $(this).find('img').toggleClass('on')
                $('.peop-desc-cont').slideToggle();
            });

            //切换
            $(".slideBox").slide({
                trigger: 'click',
                delayTime: 200,
                endFun: function () {
                    Main.initSpeechList('', $('.js-sort li.on').index());
                }
            });
        },
        initData: function () {
            if (!id && !myapplyId) {
                alert('没有用户ID');
                return false;
            }

            this.initPeople(function () {
                if (myapplyId) {
                    $('.about,.focus').hide();
                }
            });
        },

        //初始化人物数据
        initPeople: function (callback) {
            function renderData(retData) {
                var template = $('#people-info-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-people-info').html(html);
            }

            var url = myapplyId ? '/api/getmyapplyinfo' : '/api/getcelebrityinfo';
            var data = myapplyId ? {myapplyId: myapplyId} : {celebrityId: id};

            $._get(url, data, function (retData) {
                retData.data.intro = retData.data.intro || '暂无详情描述'
                renderData(retData);
                if (callback && $.isFunction(callback)) {
                    callback(retData);
                }
            });
        },

        //加载演讲列表 viewpoint 观点id sort排序类型
        initSpeechList: function (viewpoint, sort) {
            var pageCount = 5,
                isInit = true;

            getData(1);

            function getData(pageNum) {
                $.get('/api/getlecturelist', {
                    viewpoint: viewpoint,
                    sort: sort,
                    pageNum: pageNum || 1,
                    count: pageCount,
                    celebrityId: celebrityId ? celebrityId : 0
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
                //console.log(isLike, id);
                var tpl = isLike ?
                '<span class="focus js-like on" data-type="celebrity" data-id="' + id + '">已关注</span>' :
                '<span class="focus js-like" data-type="celebrity" data-id="' + id + '">关注</span>'
                return tpl;
            });
            Template7.registerHelper('publicDate', function (speaktime) {
                return new Date(speaktime).Format('yyyy-MM-dd')
            });
            function renderData(retData) {
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
    }
    Main.init();
})