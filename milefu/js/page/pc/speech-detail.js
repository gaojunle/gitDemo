/**
 * @author  Administrator on 2017/1/7
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var $lectureInfo = $('.js-speech-detail');
    var id = Util.getQueryString('id');
    var myapplyId = Util.getQueryString('myapplyId');

    var Main = {
        init: function () {
            this.bindEvent();
            this.initData();
        },
        bindEvent: function () {

        },
        initData: function () {
            if (!id && !myapplyId) {
                alert('没有演讲ID');
                return false;
            }
            this.initSpeech();
            this.initRelSpeech();
        },

        //初始化演讲数据
        initSpeech: function () {
            Template7.registerHelper('publicDate', function (createTime) {
                return new Date(createTime).Format();
            });
            Template7.registerHelper('speaktimeFormat', function (speaktime) {
                return new Date(speaktime).Format();
            });
            Template7.registerHelper('likeTpl', function (isLike, id) {
                var tpl = isLike ?
                '<a class="btn-collect js-like on" href="javascript:;" data-type="lecture" data-id="' + id + '">已收藏</a>' :
                '<a class="btn-collect js-like" href="javascript:;" data-type="lecture" data-id="' + id + '">收藏</a>';
                return tpl;
            });

            function renderData(retData) {
                var template = $('#speech-detail-tpl').html();
                var compiledTemplate = Template7.compile(template);

                retData.data.summarys = retData.data.summary.split(',')
                //console.log(retData.data);
                var html = compiledTemplate(retData.data);

                $lectureInfo.html(html);
            }

            var url = myapplyId ? '/api/getmyapplyinfo' : '/api/getlectureinfo';
            var data = myapplyId ? {myapplyId: myapplyId} : {lectureId: id};

            $._get(url, data, function (retData) {
                retData.data.content = retData.data.content || '暂无详情描述'
                renderData(retData);
            });
        },

        initRelSpeech: function () {
            function renderData(retData) {
                var template = $('#speech-recom-tpl').html();
                var compiledTemplate = Template7.compile(template);
                var html = compiledTemplate(retData.data);

                $('.js-speech-recom').html(html);
            }

            $._get('/api/recom', {
                type: 'lecture',
                lectureId: id,
                pageNum: 1,
                count: 4
            }, function (retData) {
                renderData(retData);
            });
        }
    }
    Main.init();
})