/**
 * @author  Administrator on 2017/1/7
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var $peopleInfo = $('.js-people-info'),
        myapplyId = Util.getQueryString('myapplyId'),
        id = Util.getQueryString('id');

    //如果有myApplyId，说明要获取申请后那份数据，否则使用普通ID，表示审核通过的ID
    var config = {
        getDataUrl: myapplyId ? '/api/getmyapplyinfo' : '/api/getlectureinfo',
        data: myapplyId ? {myapplyId: myapplyId} : {lectureId: id}
    }
    var Main = {
        init: function () {
            this.bindEvent();
            this.initData();
        },
        bindEvent: function () {

        },
        initData: function () {
            if (!id || !myapplyId) {
                alert('没有用户ID');
                //history.back();
                return false;
            }
            this.initSpeech();
            this.initRelSpeech();
        },

        //初始化人物数据
        initSpeech: function () {
            var that = this;
            function renderData(retData) {
                var template = $('#people-info-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-people-info').html(html);
            }

            $._get(config.getDataUrl, config.data, function (retData) {
                retData.data.intro = retData.data.intro || '暂无详情描述'
                renderData(retData);

                that.initRelSpeech(retData);
            });
        },

        initRelSpeech: function (retData) {
            //TODO 与该用户相关的演讲列表
        }
    }
    Main.init();
})