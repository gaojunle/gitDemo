/**
 * @author  Administrator on 2017/1/8
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var um = null,
        peoples = null;
    var createSpeech = {
        init: function () {
            //TODO 人物列表
            $._get('/api/search', {
                type: 'celebrity',
                keyword: '',
                pageNum: 1,
                count: 1000
            }, function (retData) {
                peoples = retData.data;
                if (Util.getQueryString('id')) {
                    createSpeech.initEditData();
                } else {
                    createSpeech.initCreate();
                    this.bindSelPeople();
                }
            });
        },
        //创建操作
        initCreate: function (citys, selPeopleId) {
            this.initUploadImg();
            this.initCitySel(citys);
            this.initDateSel();
            this.initEditor();
            this.initLabels();
            this.bindFormSubmit();
        },
        //编辑时，初始化数据
        initEditData: function () {
            $.get('/api/getmyapplyInfo', {
                myapplyId: Util.getQueryString('id')
            }, function (retData) {
                var d = retData.data;

                //头像
                if (d.image) {
                    $('.a-upload img').attr('src', d.image);
                    $('.a-upload span').html('');
                }
                TemplateRenderData(d, '#edit-speech-tpl', '#createForm');
                createSpeech.initCreate({
                    prov: d.userProvince,
                    city: d.userCity
                });

                //选择人物
                createSpeech.bindSelPeople(d.speaker);
                //标签内容
                var $labels = $('.js-mark-list');
                $.each(d.labelDesc || [], function (i, v) {
                    $labels.eq(i).val(v.value).data('id', v.id);
                });
                //三句摘要
                var $summarys = $('.js-summary input');
                $.each(d.summary.split(','), function (i, v) {
                    $summarys.eq(i).val(v);
                })
                //编辑器内容
                um.setContent(d.content);
            });
        },
        //上传图片文件
        initUploadImg: function () {
            $('.a-upload input').change(function () {
                $("#uploadImg").ajaxSubmit({
                    url: '/api/uploadimg',
                    data: {
                        type: 'celebrity'
                    },
                    type: "POST",
                    success: function (retData) {
                        if (retData.errno == 0) {
                            $('.a-upload img').attr('src', retData.data);
                            $('.a-upload span').html('');
                        } else {
                            alert('上传出错')
                        }
                    },
                    error: function (msg) {
                        alert("出错了");
                    }
                });
            });
        },
        //城市选择
        initCitySel: function (citys) {
            citys = citys || {prov: '北京', city: '东城区'};

            //城市选择
            $("#cityselect").citySelect({
                prov: citys.prov,
                city: citys.city,
                required: false
            });
        },
        //日期选择
        initDateSel: function () {
            laydate({
                elem: '#speaktime'
            });
        },
        //实例化编辑器
        initEditor: function () {
            um = UM.getEditor('myEditor');
        },
        //加载标签
        initLabels: function () {
            $._get('/api/getlabellist', {type: 'lecture'}, function (retData) {
                TemplateRenderData(retData, '#labal-list-tpl', '.peomark-list');
                createSpeech._bindLabelSel();
            });
        },
        //绑定选择人物
        bindSelPeople: function (selPeopleId) {
            if (typeof selPeopleId != 'undefined') {
                $.each(peoples.list, function (i, v) {
                    if (v.id == selPeopleId) {
                        peoples.list[i].selected = true;
                    }
                });
                $('#js-peoples-list').data('id', selPeopleId);
            }

            TemplateRenderData(peoples, '#peoples-list-tpl', '#js-peoples-list');
            $('#js-peoples-list').chosen({}).change(function (e) {
                $(e.target).data('id', $(e.target).find('option:selected').data('id'))
            });
        },
        //绑定选择标签
        _bindLabelSel: function () {
            var $iptPeoMark = $('.js-mark-list'),
                $peomarkList = $('.peomark-list'),
                $curIpt = null;

            $iptPeoMark.focus(function () {
                $curIpt = $(this);
                $peomarkList.css('top', $curIpt.offset().top + $curIpt.height() + 2 - $('#createForm').offset().top).show();
            }).blur(function () {
                setTimeout(function () {
                    $peomarkList.hide(200);
                }, 200)
            }).keyup(function (e) {
                $peomarkList.find('li').show();
                $peomarkList.find('li:not(:contains("' + $(this).val() + '"))').hide();
            }).click(function () {
                return false;
            });
            $peomarkList.on('click', 'li', function () {
                var $this = $(this);
                $curIpt.val($this.html()).data('id', $this.data('id'));
                console.log($curIpt.data('id'))
                $peomarkList.hide();
                return false;
            });
        },
        //表单验证和提交
        bindFormSubmit: function () {
            //表单验证
            $('.createForm').validate({
                submitHandler: function (form) {
                    var labels = [];
                    $('.js-mark-list').each(function () {
                        if ($(this).data('id')) {
                            labels.push($(this).data('id'))
                        }
                        console.log($(this).data('id'))
                    });

                    if ($('.a-upload img').attr('src').indexOf('upload-default.png') > -1) {
                        alert('请上传用户图片');
                        return false;
                    }

                    var formJSON = $('#createForm').serializeJson();

                    var data = $.extend({}, formJSON, {
                        image: $('.a-upload img').attr('src'),
                        speaker: $('#js-peoples-list').data('id'),
                        speakplace: $('.prov option:selected').html() + ' ' + $('.city option:selected').html(),
                        viewpoint: labels.join(','),
                        summary: formJSON.summary.join(','),
                        captcha: $('.codeipt').val(),
                        content: um.getContent()
                    });

                    if(Util.getQueryString('id')){
                        data.lectureId = Util.getQueryString('id');
                    }
                    $.post('/api/submitlecture', data, function (retData) {
                        if (retData.errno == 0) {
                            location.href = './mycreate.html';
                        } else {
                            alert(retData.errmsg)
                        }
                    });
                },
                errorElement: 'i',
                rules: {
                    nameCn: 'required',
                    birthday: 'required'
                },
                messages: {
                    nameCn: '*',
                    birthday: '*'
                }
            });

            //提交
            $('.js-submit').click(function () {
                $('.createForm').submit()
            });
        }
    };
    createSpeech.init();
})