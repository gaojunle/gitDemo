/**
 * @author  Administrator on 2017/1/8
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var um = null;
    var EditPeople = {
        init: function () {
            if (Util.getQueryString('id')) {
                this.initEditData();
            } else {
                this.initCreate();
            }
        },
        //创建操作
        initCreate: function (citys) {
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
                if (d.avatar) {
                    $('.a-upload img').attr('src', d.avatar);
                    $('.a-upload span').html('');
                }
                TemplateRenderData(d, '#edit-people-tpl', '#createForm');
                EditPeople.initCreate({
                    prov: d.userProvince,
                    city: d.userCity
                });
                //出生日期
                laydate({
                    elem: '#birthday',
                    start: d.birthday,
                    max: laydate.now()
                });
                //标签内容
                var $labels = $('.js-mark-list');

                $.each(d.labelDesc || [], function (i, v) {
                    $labels.eq(i).val(v.value).data('id', v.id);
                });
                //编辑器内容
                um.setContent(d.intro);
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
                elem: '#birthday',
                min: '',
                max: laydate.now(),
                choose: function (datas) {
                    //start.max = datas;
                }
            });
        },
        //实例化编辑器
        initEditor: function () {
            um = UM.getEditor('myEditor');
        },
        //加载标签
        initLabels: function () {
            $._get('/api/getlabellist', {type: 'celebrity'}, function (retData) {
                TemplateRenderData(retData, '#labal-list-tpl', '.peomark-list');
                EditPeople._bindLabelSel();
            });
        },
        //人物标签选择
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
                        //console.log($(this).data('id'))
                    });

                    if ($('.a-upload img').attr('src').indexOf('upload-default.png') > -1) {
                        alert('请上传用户图片');
                        return false;
                    }

                    var formJSON = $('#createForm').serializeJson();
                    var data = $.extend({}, {
                        avatar: $('.a-upload img').attr('src'),
                        birthplace: $('.prov option:selected').html() + ' ' + $('.city option:selected').html(),
                        labels: labels.join(','),
                        captcha: $('.codeipt').val(),
                        intro: um.getContent()
                    }, formJSON);

                    $.post('/api/submitcelebrity', data, function (retData) {
                        if (retData.errno == 0) {
                            location.href = './mycreate.html';
                        } else {
                            alert(retData.errmsg);
                            $('.imgcode').trigger('click')
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
    EditPeople.init();
})