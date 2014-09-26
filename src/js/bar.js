/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;

    self.ubb = function () {

        this.color = d3.scale.category10();

        this.format = d3.format(",.0f");

    };

    //实现从基类继承
    var UBB = self.ubb.prototype = new ucommon();

    UBB.init = function(options){

        if("undefined" !== typeof options){

            if("undefined" !== typeof options.color) {
                this.color = d3.scale.ordinal().range(options.color);
            }

            this.format = options.format || d3.format(",.0f");

        }else{
            options = {};
        }

    };

    /***
     * 设置x和y的比例
     * 该项必须在bindData后执行，这样才能够绑定最新的数据源以产生坐标
     */
    UBB.setScale = function () {
        this.x = d3.scale.linear().range([0, this.w - this.barPadding*3]),
        this.y = d3.scale.ordinal().rangeRoundBands([0, this.h - this.barPadding], .1);

        this.xAxis = d3.svg.axis().scale(this.x).orient("top").tickSize(-this.h);
        this.yAxis = d3.svg.axis().scale(this.y).orient("left").tickSize(0);

        //this.dataset.sort(function(a, b) { return b.value - a.value; });

        this.x.domain([0, d3.max(this.dataset, function(d) { return d.value; })]);
        this.y.domain(this.dataset.map(function(d) { return d.name; }));

    };

    /***
     * 按照数据创建每个bar的group
     * @returns {void|*}
     */
    UBB.createGroup = function () {
        var _this = this;

        this.svg = this.render
            .attr("width", _this.w)
            .attr("height", _this.h)
            .append("g")
            .attr("transform", "translate(" + _this.barPadding*2 + "," + _this.barPadding + ")");

        var g = this.svg.selectAll("g.bar")
            .data(_this.dataset)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(0," + _this.y(d.name) + ")"; });

        return g;
    };

    /***
     * 生成每个bar的rect及值
     * @param g
     */
    UBB.createBar = function (g) {
        var _this = this;

        g.append("rect")
            .attr("width", function(d) { return _this.x(d.value); })
            .attr("height", _this.y.rangeBand())
            .attr("fill",function(d){
                return _this.color(d.value);
            });

        g.append("text")
            .attr("class", "value")
            .attr("x", function(d) { return _this.x(d.value); })
            .attr("y", _this.y.rangeBand() / 2)
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function(d) { return _this.format(d.value); });

    };

    /***
     * 更新滚动条
     * @param g
     */
    UBB.updateBar = function (g) {
        var _this = this;

        g.selectAll("rect")
            .transition()
            .duration(500)
            .ease("linear")
            .attr({
                "width":function(d) { return _this.x(d.value); },
                "height":_this.y.rangeBand()
            });

        g.selectAll("text")
            .transition()
            .duration(500)
            .ease("linear")
            .attr({
                x:function(d) { return _this.x(d.value); },
                y:_this.y.rangeBand() / 2
            })
            .text(function(d) { return _this.format(d.value); });

    };

    /***
     * 创建坐标轴
     */
    UBB.createAxis = function () {

        this.svg.append("g")
            .attr("class", "x axis")
            .call(this.xAxis);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
    };

    /**
     * 更新坐标轴
     */
    UBB.updateAxis = function(){

        this.svg.select("g.x.axis").call(this.xAxis);
        this.svg.select("g.y.axis").call(this.yAxis);
    };

    /***
     * 绘制柱状图
     */
    UBB.draw = function (options) {
        this.init(options)
        this.setScale();
        this.grp = this.createGroup();
        this.createBar(this.grp);
        this.createAxis();
    };

    /***
     * 更新柱状图，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    UBB.update = function (d) {
        this.dataset = d;
        this.setScale();
        this.updateBar(this.grp);
        this.updateAxis();
        //this.createAxis();
    }

})(window);