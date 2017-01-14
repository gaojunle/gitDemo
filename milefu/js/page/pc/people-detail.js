/**
 * @author  Administrator on 2017/1/7
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var $peopleInfo = $('.js-people-info');

    var Main = {
        init: function () {
            this.bindEvent();
            this.initData();
        },
        bindEvent: function () {
            //下拉展开
            $peopleInfo.on('click', '.peop-desc', function () {
                $(this).find('img').toggleClass('on')
                $('.peop-desc-cont').slideToggle();
            });

            //切换
            $(".slideBox").slide({trigger: 'click', delayTime: 200});
        },
        initData: function () {
            var celebrityId = Util.getQueryString('id');
            if (!celebrityId) {
                alert('没有用户ID');
                //history.back();
                return false;
            }
            this.initPeople(celebrityId);
            this.initRelSpeech(celebrityId);
        },

        //初始化人物数据
        initPeople: function (id) {
            function renderData(retData) {
                var template = $('#people-info-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-people-info').html(html);
            }

            var url = Util.getQueryString('_c') == 1 ? '/api/getmyapplyinfo' : '/api/getcelebrityinfo';
            var idStr = Util.getQueryString('_c') == 1 ? 'myapplyId' : 'celebrityId';
            $._get(url, {idStr: id}, function (retData) {
                retData.data.intro = retData.data.intro || '暂无详情描述'
                renderData(retData);
            });
        },

        initRelSpeech: function (celebrityId) {
            //TODO 与该用户相关的演讲列表
        }
    }
    Main.init();
})