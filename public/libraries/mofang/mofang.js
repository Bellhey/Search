/* mofang v0.1.0 */
//防止$覆盖，直接引用jQuery
jQuery(function () {
    var $ = jQuery;
    var sidebarCon = $('.didi-sidebar-l')[0];
    var lastActiveItem = $('.didi-sidebar-l .sub-link.active')[0] && $('.didi-sidebar-l .sub-link.active'); //最后一次点击的导航元素;

    //侧导航栏UI事件
    $('.didi-mainnav').delegate('.menu-each', 'click', function (e) {
        var target = $(e.target);
        var parentLi = target.closest('.parent_li');
        /*var sibParentLi = parentLi.siblings();
        var hasOpenClass = parentLi.hasClass('open');*/

        var subMenu = parentLi.find('.child_list');

        if (subMenu.length > 0) {
            subMenu.slideToggle('normal', function () {
                parentLi.toggleClass('open');

                //更新滚动条状态
                customScrollBar.update(sidebarCon);
            });
        } else {
            parentLi.addClass('active').siblings('.parent_li').removeClass('active');

            if (lastActiveItem) {
                lastActiveItem.removeClass('active');
                lastActiveItem = null;
            }
        }

        //手风琴效果
        /*if (hasOpenClass) {

        } else {
            sibParentLi.filter('.open').find('.child_list').slideUp('normal', function () {
                sibParentLi.removeClass('open');
                //更新滚动条状态
                customScrollBar.update();
            });
        }*/

    })
        .delegate('.child_list', 'click', function (e) {
            var target = $(e.target);
            var isSubLink = target.hasClass('sub-link');
            //var parentLi = target.closest('.parent_li');
            var lastIsNotCur;   //上一次激活的元素不是这一次元素
            var parentLi = target.closest('.parent_li');

            if (isSubLink) {
                lastIsNotCur = lastActiveItem && (lastActiveItem != target);

                if (lastIsNotCur) {
                    lastActiveItem.removeClass('active');
                    //lastActiveItem.closest('.parent_li').removeClass('active');
                }

                target.addClass('active');
                //parentLi.addClass('active');
                lastActiveItem = target;
                parentLi.addClass('active').siblings('.parent_li').removeClass('active');
            }
        });


    //侧导航栏自定义滚动条
    var customScrollBar = {
        Ps: PerfectScrollbar,
        initialize: function (sidebarCon) {
            if (sidebarCon) {
                this.Ps.initialize(sidebarCon);
            }
        },
        update: function (sidebarCon) {
            //动态更新滚动条状态
            if (sidebarCon) {
                this.Ps.update(sidebarCon);
            }
        }
    };

    customScrollBar.initialize(sidebarCon);

    //header部分
    $('.nav-container').delegate('.mis-nav', 'click', function (e) {
        var target = $(e.target);
        var isNavBtn = target.hasClass('nav-icon');

        if (isNavBtn) {
            $('.nav-con').slideToggle();
        }
    });

    //全局事件
    $('body').click(function (e) {
        var target = $(e.target);
        var isNavBtn = target.hasClass('nav-icon');

        if (!isNavBtn) {
            $('.nav-con').slideUp();
        }
    });
});