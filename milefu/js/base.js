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
                //Base._headerSearch();
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
                    Base.setCurTitle()
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
            $('.ipt-search').focus(function () {
                $('.search-result').show();
            }).blur(function () {
                $('.search-result').hide();
            }).on('mouseenter', function () {
                $('.sel-module').slideDown();
                //关键词显示时隐藏轮播和横比选项
                $('#slideBox').slideUp();
                $('.js-hengbi-box').slideUp();
            });

            //搜索区事件
            var $selItems = $('.sel-items'),
                $selBox = $('.js-sel-box');
            $selBox.on('click', 'a', function () {
                var $this = $(this),
                    txt = $this.html(),
                    type = $this.parents('ul').data('type'),
                    id = $this.data('id');

                var $selItem = $selItems.find('[data-type="' + type + '"]');
                if (id != $selItem.data(id)) {
                    $selItem.data('id', id).data('txt', txt).find('em').html(txt);
                    $selItem.show();
                    $this.parents('ul').find('a').removeClass('sel');
                    $this.addClass('sel');
                }
                return false;
            });
            $selItems.on('click', 'a', function () {
                var $this = $(this),
                    $parent = $this.parent();
                $parent.hide();
                $parent.find('em').html('');
                var dataid = $parent.data('id');

                $selBox.find('[data-id="' + dataid + '"]').removeClass('sel');
                return false;
            });
            $('.sel-module').on('click', '.js-sel-close', function () {
                $('.sel-module').slideUp();
                $('#slideBox').slideDown();
            });

            $("#selectSlider").slide({trigger: "click"});
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
            }else{
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
