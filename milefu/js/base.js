/**
 * @author  gaojun-pd on 2016/8/31
 *
 * @descript
 * @version 1.0
 * @example:
 */
jQuery(function ($) {
    var Base = {
        init: function () {
            this.setCurTitle();
            this.initWChatLogin();
            this._headerSearch();
            //this.loadFooter();
            //this.loadHeader();
            this.bindChangeCodeImg();
            this.bindCollect();
            this.bindFocus();
        },
        //加载头部
        loadHeader: function (callFun) {
            if ($('#header').length == 0) {
                return false;
            }
            $.ajax({
                type: "GET",
                url: './_header.html',
                dataType: "html",
                success: function (data) {
                    $('#header').append(data);
                    Base._doCallBackFun(callFun);
                    Base.setCurTitle();
                    Base._headerSearch();
                },
                error: function () {
                    console.log("加载资源失败");
                }
            });
        },

        //加载尾
        loadFooter: function (callFun) {
            if ($('#footer').length == 0) {
                return false;
            }
            $.ajax({
                type: "GET",
                url: './_footer.html',
                dataType: "html",
                success: function (data) {
                    $('#footer').html(data);
                    Base._doCallBackFun(callFun);
                },
                error: function () {
                    console.log("加载资源失败");
                }
            });
        },

        /*头部关键词搜索*/
        _headerSearch: function () {
            //搜索框事件
            var $searchIpt = $('.search-ipt');

            $searchIpt.on('keyup', function (e) {
                if (e.keyCode == '13') {
                    doSearch();
                }
            });
            $searchIpt.next().click(function () {
                doSearch();
            })
            function doSearch() {
                if ($.trim($searchIpt.val()) == '') {
                    alert('请输入搜索人物名');
                    return false;
                }
                location.href = './searchResult.html?searchipt=' + $searchIpt.val();
            }
        },

        //微信登录、退出
        initWChatLogin: function () {
            //登录
            if ($('.wlogin').length > 0) {
                Base.relUserLogined();
                $.getScript("http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js", function () {
                    $.get('/api/wechat/getopeninfo', {}, function (retData) {
                        var d = retData.data;
                        $('.wlogin').click(function (e) {
                            var obj = new WxLogin({
                                id: "login_container",
                                appid: d.appid,
                                scope: d.scope,
                                redirect_uri: d.redirect_uri,
                                state: d.state,
                                style: "",
                                href: ""
                            });
                            $('#login_container').fadeIn();
                            return false;
                        });
                        $(document).click(function () {
                            $('#login_container').fadeOut();
                        })
                    })
                });
            } else {
                //退出
                $(document).on('click', '.js-logout', function () {
                    $.get('/api/logout', {}, function (retData) {
                        if (retData.errno == 0) {
                            location.href = './index.html'
                        } else {
                            alert('退出失败，请重试');
                        }
                    })
                });
            }
        },

        //与登录用户相关处理
        relUserLogined: function () {
            $('.user-login-do').click(function (e) {
                e.preventDefault();
                $('.wlogin').trigger('click')
                return false;
            })
        },

        //切换标题
        setCurTitle: function () {
            var curTitle = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
            var $curLink = $('.nav .main-link[href$="' + curTitle + '"]');
            if ($curLink.length > 0) {
                $curLink.parent().addClass('on');
            } else {
                //$('.nav li').eq(0).addClass('on');
            }
        },

        //点击验证码刷新
        bindChangeCodeImg: function () {
            var curSrc = $('.imgcode').attr('src');

            $('.imgcode').click(function () {
                $(this).attr('src', curSrc + '&_t=' + new Date().getTime());
                $('.codeipt').val('')
            });
        },

        //收藏、关注
        bindCollect: function () {
            $(document).on('click', '.js-like', function () {
                var $this = $(this),
                    isLiked = $this.hasClass('on'),
                    url = isLiked ? '/api/unlike' : '/api/like',
                    data = isLiked ?
                        {
                            type: $this.data('type'),
                            unlikeId: $this.data('id')
                        } :
                        {
                            type: $this.data('type'),
                            likeId: $this.data('id')
                        }

                $.post(url, data, function (retData) {
                    if (retData.errno == 0) {
                        $this.toggleClass('on');
                        if ($this.data('type') == 'lecture') {
                            $this.html($this.hasClass('on') ? '已收藏' : '收藏')
                        } else {
                            $this.html($this.hasClass('on') ? '已关注' : '关注')
                        }
                    } else {
                        alert(retData.errmsg);
                    }
                });
            });
        },
        //关注
        bindFocus: function () {

        },
        //执行回调函数
        _doCallBackFun: function (callFun, params) {
            if (callFun && $.isFunction(callFun)) {
                setTimeout(function () {
                    callFun(params);
                }, 100)
            }
        }
    }
    Base.init();
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
});
$._get = function (url, data, callback) {
    $.get(url, data || {}, function (retData) {
        if (retData.errno == 0) {
            if (callback && $.isFunction(callback)) {
                callback(retData);
            }
        } else {
            console.error(retData.errmsg);
        }
    })
}

$._post = function (url, data, callback) {
    $.post(url, data || {}, function (retData) {
        if (retData.errno == 0) {
            if (callback && $.isFunction(callback)) {
                callback(retData);
            }
        } else {
            alert(retData.errmsg);
        }
    })
}
/**
 * 使用Template7.js模板引擎渲染数据
 * @param data 数据
 * @param templateEle   模板元素
 * @param dataBoxEle    数据显示元素
 * @constructor
 */
function TemplateRenderData(data, templateEle, dataBoxEle) {
    var template = $(templateEle).html();
    var compiledTemplate = Template7.compile(template);
    var html = compiledTemplate(data);

    $(dataBoxEle).html(html);
}
Date.prototype.Format = function (fmt) { //author: meizz
    fmt = fmt || 'yyyy-MM-dd';

    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}