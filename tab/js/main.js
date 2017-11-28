;(function($){
    var Tab = function(tab) {
        var self = this;
        this.tab = tab;
        //默认配置参数
        this.config = {
            //定义鼠标触发类型
            "triggerType" : "click",
            //用来定义内容切换效果，直接切换还是淡入淡出
            "effect" : "default",
            //默认显示第几张切换卡
            "invoke" : 1,
            //是否自动切换，指定时间间隔
            "auto" : false
        };
        //如果配置参数存在，就扩展默认配置参数
        if(this.getConfig()){
            $.extend(this.config,this.getConfig());
        }
        //保存Tab标签列表，保存对应的内容列表
        this.tabItems = this.tab.find("ul.tab-nav li");
        this.contentItems = this.tab.find("div.content-wrap div.content-item");
        //保存配置参数
        var config = this.config;
        if(config.triggerType === "click"){
            this.tabItems.on(config.triggerType,function(){
                self.invoke($(this));
            })
        }else if(config.triggerType === "mouseover"){
            this.tabItems.on(config.triggerType,function(){
                 self.invoke($(this));
            })
        }
        //自动切换
        if(config.auto){
            this.timer = null;
            //定义一个计数器
            this.loop = 0;
            this.autoPlay();
            this.tab.hover(function(){
                window.clearInterval(self.timer);
            },function(){
                self.autoPlay();
            });
        }
        //设置默认显示第几张图片
        if(config.invoke > 1){
            this.invoke(this.tabItems.eq(config.invoke - 1));
        }
    };
    Tab.prototype = {
        //自动间隔切换
        autoPlay:function(){

            var self = this,
                tabItems = this.tabItems,
                tabLength = tabItems.length,
                config = this.config;
            this.timer = window.setInterval(function(){
                self.loop++;
                if(self.loop >= tabLength){
                    self.loop = 0;
                }
                tabItems.eq(self.loop).trigger(config.triggerType);
            },config.auto);

        },
        //选项卡切换效果
        invoke:function(currentTab) {
            self = this;
            //当前选中的加上class=“actived”
            //切换当前内容根据当前属性effect的值
            var index = currentTab.index();
            currentTab.addClass("actived").siblings().removeClass("actived");
             //切换内容区域
            var effect = this.config.effect;
            var content = this.contentItems;
            if(effect === "default"){
                content.eq(index).addClass("current").siblings().removeClass("current");
            }else if(effect === "fade"){
                content.eq(index).fadeIn().siblings().fadeOut();
            }
            //配置给自动切换时根据点击时切换的下一张,同步loop值
            if(this.config.auto){
                this.loop = index;
            }
        },

        //获取配置参数
        getConfig:function(){
            //拿一下tab elem上的节点上的data-config
            var config = this.tab.attr("data-config");

            //确保有配置参数
            if(config&&config!=""){
                return $.parseJSON(config);
            }else{
                return null;
            }

        }
    };
    Tab.init = function(tabs){
        var self = this;
        tabs.each(function(){
           new self($(this));
        });
    };
    //注册能jQuery方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            })
        }
    });
    window.Tab = Tab;
})(jQuery);
