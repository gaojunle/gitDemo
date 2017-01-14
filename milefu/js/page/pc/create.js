/**
 * @author  Administrator on 2017/1/8
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var _data = {
        avatar: 'http://106.75.72.156/img/upload/0/5356b7085f3441490a914aba8fcca63e_175928e7ew46pnt6lpnyuu_640_480.jpg',
        birthplace: '山西 阳泉',
        labels: '企业家,经济学家',
        captcha: '8549',
        intro: '<div class="para" style="font-size: 14px; word-wrap: break-word; color: rgb(51, 51, 51); margin-bottom: 5px; text-indent: 28px; line-height: 24px; zoom: 1; font-family: arial, tahoma, &quot;Microsoft Yahei&quot;, 宋体, sans-serif; white-space: normal;">李彦宏，百度公司创始人、董事长兼首席执行官，全面负责百度公司的战略规划和运营管理。</div><div class="para" style="font-size: 14px; word-wrap: break-word; color: rgb(51, 51, 51); margin-bottom: 5px; text-indent: 28px; line-height: 24px; zoom: 1; font-family: arial, tahoma, &quot;Microsoft Yahei&quot;, 宋体, sans-serif; white-space: normal;">1991年，李彦宏毕业于<a target="_blank" href="http://undefined" style="color: rgb(19, 110, 194);">北京大学</a>信息管理专业，随后前往美国<a target="_blank" href="http://undefined" style="color: rgb(19, 110, 194);">布法罗纽约州立大学</a>完成计算机科学硕士学位，先后担任道·琼斯公司高级顾问、《<a target="_blank" href="http://undefined" style="color: rgb(19, 110, 194);">华尔街日报</a>》网络版实时金融信息系统设计者，以及国际知名互联网企业——Infoseek公司资深工程师。李彦宏所持有的“超链分析”技术专利，是奠定整个现代搜索引擎发展趋势和方向的基础发明之一。</div><div class="para" style="font-size: 14px; word-wrap: break-word; color: rgb(51, 51, 51); margin-bottom: 5px; text-indent: 28px; line-height: 24px; zoom: 1; font-family: arial, tahoma, &quot;Microsoft Yahei&quot;, 宋体, sans-serif; white-space: normal;">2000年1月，李彦宏创建了百度。经过十多年的发展，百度已经发展成为全球第二大独立搜索引擎和最大的中文搜索引擎。百度的成功，也使中国成为美国、俄罗斯和韩国之外，全球仅有的4个拥有搜索引擎核心技术的国家之一。2005年，百度在美国纳斯达克成功上市，并成为首家进入纳斯达克成分股的中国公司。百度已经成为中国最具价值的品牌之一。</div><div class="para" style="font-size: 14px; word-wrap: break-word; color: rgb(51, 51, 51); margin-bottom: 5px; text-indent: 28px; line-height: 24px; zoom: 1; font-family: arial, tahoma, &quot;Microsoft Yahei&quot;, 宋体, sans-serif; white-space: normal;">2013年，当选第十二届全国政协委员，兼任第十一届中华全国工商业联合会副主席、第八届北京市科协副主席等职务，并获聘“国家特聘专家”。</div><div class="para" style="font-size: 14px; word-wrap: break-word; color: rgb(51, 51, 51); margin-bottom: 5px; text-indent: 28px; line-height: 24px; zoom: 1; font-family: arial, tahoma, &quot;Microsoft Yahei&quot;, 宋体, sans-serif; white-space: normal;">2016年3月两会，<a target="_blank" href="http://undefined" style="color: rgb(19, 110, 194);">李彦宏</a>公布了自己的两会提案：一、关于加快制定和完善无人驾驶汽车相关政策法规，抢占产业发展制高点的提案；二是关于支持专网资源投入社会化运营，促进提速降费的提案 ；三是关于完善我国空域资源管理制度，提升民航准点率，推动我国航空事业发展的提案 。<span style="font-size: 12px; line-height: 0; position: relative; vertical-align: baseline; top: -0.5em; white-space: nowrap; margin-left: 2px; color: rgb(51, 102, 204); cursor: default; padding: 0px 2px;">[1]</span><a class="sup-anchor" style="color: rgb(19, 110, 194); position: relative; top: -50px; font-size: 0px; line-height: 0;" href="http://undefined">&nbsp;</a></div><p><br/></p>',
        nameCn: '李彦宏',
        role: '百度CEO',
        career: 'CEO执行官',
        userProvince: '山西',
        userCity: '阳泉',
        birthday: '2017-01-02',
        college: '清华大学',
        nationality: '中国'
    }
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
                var d = retData.data.myapplyInfo;

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
                $.each(d.labels.split(','), function (i, v) {
                    $labels.eq(i).val(v);
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
            citys = citys || {prov: '北京', city: '东城区'}
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
                $curIpt.val($this.html()).data('markid', $this.data('markid'));
                console.log($curIpt.data('markid'))
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
                        if ($(this).data('markid')) {
                            labels.push($(this).data('markid'))
                        }
                        console.log($(this).data('markid'))
                    });

                    if ($('.a-upload img').attr('src').indexOf('upload-default.png') > -1) {
                        alert('请上传用户图片');
                        return false;
                    }

                    var formJSON = $('#createForm').serializeJson();
                    var data = $.extend({}, {
                        avatar: $('.a-upload img').attr('src'),
                        birthplace: $('.prov option:selected').html() + ' ' + $('.city option:selected').html(),
                        labels: formJSON.label.join(','),
                        captcha: $('.codeipt').val(),
                        intro: um.getContent()
                    }, formJSON);

                    $.post('/api/submitcelebrity', data, function (retData) {
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
    EditPeople.init();
})