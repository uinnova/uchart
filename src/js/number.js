/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;

    self.unumb = function () {

        this.color = d3.scale.category10();

        this.cfg = {
            "color":"white",
            "bgColor":"blue",
            "fontSize":"24px"
        }

    };

    //实现从基类继承
    var UNB = self.unumb.prototype = new ucommon();

    UNB.init = function(options){

        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    this.cfg[i] = options[i];
                }
            }
        }

        if(this.dataset.length > 8){
            this.dataset.splice(8,this.dataset.length-8);
        }else if (this.dataset.length < 8){
            var len = 8 - this.dataset.length;
            for(var i = 0 ; i < len ; i++){
                this.dataset.unshift(0);
            }
        }

    };

    /***
     * 设置x和y的比例
     * 该项必须在bindData后执行，这样才能够绑定最新的数据源以产生坐标
     */
    UNB.setScale = function () {

        this.x = d3.scale.ordinal().rangeRoundBands([0, 200], .1);

        this.x.domain(d3.range(this.dataset.length));

    };

    /***
     * 按照数据创建每个bar的group
     * @returns {void|*}
     */
    UNB.createGroup = function () {
        var _this = this;

        this.svg = this.render
            .attr("width", this.w)
            .attr("height", this.h)
            .append("g")
            .attr("transform", "translate(" + (this.w - 200)/2 + "," + (this.h - 40)/2 + ")");

       this.g = this.svg
            .selectAll("g.num")
            .data(_this.dataset)
            .enter()
            .append("g")
            .attr("class","num")
            .attr("transform",function(d,i){
                return "translate("+(_this.x(i))+",0)";
           });

    };

    /***
     * 生成每个bar的rect及值
     * @param g
     */
    UNB.createBar = function () {
        var _this = this;

        this.g.append("rect")
            .attr("width",_this.x.rangeBand())
            .attr("height",40)
            .attr("fill",_this.cfg.bgColor);

        this.g.append("text")
            .attr("class", "value")
            .attr("x", function(d,i) { return _this.x.rangeBand()/2 + 3; })
            .attr("y", 40 / 2)
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill",_this.cfg.color)
            .attr("font-size",_this.cfg.fontSize)
            .text(function(d) { return d; });

    };

    /***
     * 更新滚动条
     * @param g
     */
    UNB.updateBar = function () {
        var _this = this;

        this.g.data(_this.dataset);

        this.g.each(function(d){
            d3.select(this).select("text")
                .text(d);
        });

    };

    /***
     * 绘制数字
     */
    UNB.draw = function (options) {
        this.init(options);
        this.setScale();
        this.createGroup();
        this.createBar();
    };

    /***
     * 更新数字，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    UNB.update = function (d,options) {
        this.dataset = d;
        this.init(options);
        this.setScale();
        this.updateBar();

    }

})(window);