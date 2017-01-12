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
            this.loadHeader(function () {
                Base.initWChatLogin();
            });
            this.loadFooter();
        },
        //加载头部
        loadHeader: function (callFun) {
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

        //微信登录
        initWChatLogin: function () {
            $.getScript("http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js", function (data, status, jqxhr) {
                $('.login').click(function (e) {
                    var obj = new WxLogin({
                        id: "login_container",
                        appid: "wxf3fc838959ff20bb",
                        scope: "snsapi_login",
                        redirect_uri: "http://wx.wangchao.org",
                        state: new Date().getTime(),
                        style: "",
                        href: ""
                    });
                    $('#login_container').fadeIn();
                    return false;
                });
                $(document).click(function () {
                    $('#login_container').fadeOut();
                })
            });
        },

        //切换标题
        setCurTitle: function () {
            var curTitle = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
            var $curLink = $('.nav .main-link[href$="' + curTitle + '"]');
            if ($curLink.length > 0) {
                $curLink.parent().addClass('on');
            } else {
                $('.nav li').eq(0).addClass('on');
            }
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
