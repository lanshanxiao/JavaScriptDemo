(function () {
    /**
     * 创建轮播图的构造函数
     * @param {*} optins 
     * @param {*} wrap 
     */
    function Swiper(options, wrap) {
        this.isShowArrowBtn = options.isShowArrowBtn; //是否展示左右按钮
        this.items = options.items || []; //原结构中的内容
        this.len = this.items.length; //内容数量
        this.wrap = wrap; //原结构中内容的父级元素
        this.width = options.width || $(this.wrap).width(); //设置每个内容的宽度
        this.height = options.height || $(this.wrap).height(); //设置每个内容的高度
        this.isAutoMove = options.isAutoMove; //是否自动轮播
        this.curIndex = 0; //当前内容的索引
        this.timer = null; //计时器
        this.lock = false; //动画锁
        this.type = options.type || 'fade'; //动画类型: animate.左右移动; fade.淡入淡出;
        this.trigger = options.trigger || "mouseenter"; //小圆点事件: click.点击; mouseenter.鼠标移入;
        this.init = function () {
            this.createDom(); //创建DOM
            this.initStyle(); //初始化样式
            this.bindEvent(); //绑定事件
            if (this.isAutoMove) {
                this.autoMove(); //自动轮播
            }
        }
    }

    Swiper.prototype.createDom = function () {
        var swiperDiv = $('<div class="my-swiper-div"></div>');
        var swiperUl = $("<ul class='my-swiper-ul'></ul>").addClass('my-swiper-' + this.type);
        var spotDiv = $("<div class='my-swiper-spot'></div>");
        for (var i = 0; i < this.len; i++) {
            var swiperLi = $('<li class="my-swiper-li"></li>');
            $(this.items[i]).appendTo(swiperLi);
            $("<span></span>").appendTo(spotDiv);
            swiperLi.appendTo(swiperUl);
        }
        if (this.type == "animate") {
            $('<li></li>').append($(this.items[0]).clone(true)).appendTo(swiperUl);
        }
        swiperDiv.append(swiperUl).append(spotDiv);

        var swiperRBtn = $('<div class="my-swiper-btn my-swiper-right-btn">&gt;</div>');
        var swiperLBtn = $('<div class="my-swiper-btn my-swiper-left-btn">&lt;</div>');
        swiperDiv.append(swiperRBtn).append(swiperLBtn);
        if (!this.isShowArrowBtn) {
            swiperRBtn.hide();
            swiperLBtn.hide();
        }

        $(this.wrap).append(swiperDiv);
    }

    Swiper.prototype.initStyle = function () {
        $('.my-swiper-div, .my-swiper-div > .my-swiper-ul > li', this.wrap).css({
            width: this.width,
            height: this.height
        });

        $(' .my-swiper-div > .my-swiper-ul', this.wrap).css({
            width: (this.type == "animate") ? this.width * (this.len + 1) : this.width,
            height: this.height || '100%'
        });

        $(".my-swiper-spot>span", this.wrap).eq(this.curIndex).addClass("current");

        if (this.type == 'type') {
            $('.my-swiper-li', this.wrap).hide().eq(this.curIndex).show();
        }
    }

    Swiper.prototype.bindEvent = function () {
        var self = this;
        $(".my-swiper-left-btn", this.wrap).click(function () {
            console.log(self.lock);
            if (self.lock) return;
            self.lock = true;
            if (self.curIndex > 0) {
                self.curIndex--;
            } else {
                if (self.type == 'animate') {
                    $('.my-swiper-div > .my-swiper-ul', self.wrap).css({
                        left: -self.width * self.len
                    });
                    self.curIndex = self.len - 1;
                } else {
                     self.curIndex = self.len - 1;
                }
            }
            self.change();
        });

        $(".my-swiper-right-btn", this.wrap).click(function () {
            if (self.lock) return;
            self.lock = true;
            if ( self.type == 'fade' && self.curIndex < self.len - 1 ) {
                self.curIndex++;
                // 判断当前轮播是不是animate轮播 是的话 判断当前图片是不是后面的第一张图片  不是则索引值+1
            } else if( self.type == 'animate' && self.curIndex < self.len ) {
                self.curIndex++;
                // 判断当前索引值为后面的第一张图片的索引值  是的话轮播图瞬间移动到前面第一张图片的位置  继续轮播
            } else if (self.curIndex == self.len) {
                $('.my-swiper-div > .my-swiper-ul', self.wrap).css({
                    left: 0
                })
                self.curIndex = 1;
            // 当前轮播的图片为最后一张图片 则下一次轮播的图片为第一张
            }else {
                self.curIndex = 0;
                
            }
            self.change();
        });
        $(".my-swiper-spot>span", this.wrap).on(this.trigger, function () {
            if (self.lock) return;
            self.lock = true;
            self.curIndex = $(this).index();
            self.change();
        });
    }

    Swiper.prototype.change = function () {
        var self = this;
        if(this.type == 'fade'){
            $('.my-swiper-li', this.wrap).fadeOut().eq(this.curIndex).fadeIn(function () {
                self.lock = false;
                clearInterval(this.timer);
            });
        } else if (this.type == 'animate') {
            // 修改left值  动画结束之后打开锁
            $('.my-swiper-div > .my-swiper-ul', this.wrap).animate({
                left: -this.curIndex * this.width
            }, function () {
                self.lock = false;
                clearInterval(this.timer);
            })
        }
        
        $(".my-swiper-spot>span", this.wrap).removeClass("current").eq(this.curIndex % this.len).addClass("current");
    }

    Swiper.prototype.autoMove = function () {
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            $(".my-swiper-right-btn", this.wrap).trigger("click");
        }, 2000);
    }

    $.fn.extend({
        swiper: function (options) {
            var obj = new Swiper(options, this);
            obj.init();
        }
    });
})();