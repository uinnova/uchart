/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;

    self.ubarb = function () {

    };

    //实现从基类继承
    var UBB = self.ubarb.prototype = new ucommon();

    /***
     * 设置x和y的比例
     * 该项必须在bindData后执行，这样才能够绑定最新的数据源以产生坐标
     */
    UBB.setScale = function () {
        var x = 0,y = 0;
        if(this.hasTtile()){
            y += this.titlePadding;
        }
        if(this.hasxAxis){
            y += this.xAxisPadding;
        }
        if(this.hasyAxis){
            x += this.yAxisPadding;
        }
        //this.xScale = d3.scale.ordinal().domain(d3.range(this.dataset.length)).rangeRoundBands([0,this.w - x],0.05);
        var dname = [];
        this.dataset.forEach(function (d) {
            dname.push(d.name);
        });
        this.xScale = d3.scale.ordinal().domain(dname).rangeRoundBands([0,this.w - x],0.05);
        this.yScale = d3.scale.linear()
            .domain([0,d3.max(this.dataset, function (d) {
                return d.value;
            })])
            .range([this.h,y]);
    };

    /***
     * 定义坐标轴
     */
    UBB.setAxis = function () {
        var _this = this;
        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient("bottom").ticks(8);

        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient("left").ticks(5);
    };

    /***
     * 按照数据创建每个bar的group
     * @returns {void|*}
     */
    UBB.createGroup = function () {
        var _this = this;
        var g = this.render.selectAll("g")
            .data(this.dataset)
            .enter()
            .append("g");
        g.attr("transform", function (d,i) {
            var y = 0,x = 0;
            if(_this.hasxAxis){
                y += _this.xAxisPadding;
            }
            if(_this.hasyAxis){
                x += _this.yAxisPadding;
            }
            var tr =  "translate(" + (_this.xScale(d.name) + x) +","+ -y +")";
            return tr;
        });
        return g;
    };

    /***
     * 生成每个bar的rect
     * @param g
     */
    UBB.createBar = function (g) {
        var _this = this;
        g.each(function (d) {
            var e = d3.select(this);
            var b = e.append("rect");
            var t = e.append("text").text(d.value).classed(_this.barstyle.barText,true);
            b.attr({
                width: _this.xScale.rangeBand(),
                y: _this.h,
                height: 0,
                fill: _this.color(d.value)
            });
            b.transition().duration(500).ease("linear").attr({
                height: _this.h - _this.yScale(d.value),
                y: _this.yScale(d.value)
            });
            t.attr({
                y: _this.yScale(d.value) + 15,
                x: _this.xScale.rangeBand()/2
            });
        })
    };

    /***
     * 更新滚动条
     * @param g
     */
    UBB.updateBar = function (g) {
        var _this = this;
        g.each(function (d) {
            var e = d3.select(this);
            var g = e.select("rect");
            var t = e.select("text");
            g.transition().duration(500).ease("linear").attr({
                height: _this.h - _this.yScale(d.value),
                y: _this.yScale(d.value)
            });
            t.transition().duration(500).ease("linear").attr({
                y: _this.yScale(d.value) + 15,
                x: _this.xScale.rangeBand()/2
            }).text(d.value);
        });
    };

    /***
     * 创建坐标轴
     */
    UBB.createAxis = function () {
        var _this = this;
        if(this.hasxAxis){
            //this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
            this.xR = this.render.append("g")
                .classed(_this.barstyle.axisStyle,true)
                .attr({
                    transform: "translate(" + _this.yAxisPadding +"," + (_this.h - _this.xAxisPadding) + ")"
                })
                .call(this.xAxis);
            //添加横坐标标题
            if(this.xAxistitle != ""){
                this.xR.append("text")
                    .attr({
                        x: _this.w - _this.yAxisPadding - 10,
                        y: -5
                    })
                    .style("text-anchor","end")
                    .text(this.xAxistitle);
            }
        }
        if(this.hasyAxis){
            //this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");
            this.yR = this.render.append("g")
                .classed(_this.barstyle.axisStyle,true)
                .attr({
                    transform: "translate(" + _this.yAxisPadding +"," + (_this.yAxisPadding - _this.xAxisPadding - _this.titlePadding) + ")"
                })
                .call(this.yAxis);
            //添加纵坐标标题
            if(this.yAxistitle != ""){
                this.yR.append("text")
                    .attr({
                        transform: "rotate(-90)",
                        y: 15,
                        x: -(_this.yAxisPadding + _this.xAxisPadding)
                    })
                    .style("text-anchor", "end")
                    .text(this.yAxistitle);
            }

        }
    };

    /***
     * 绘制柱状图
     */
    UBB.draw = function () {
        this.setScale();
        this.setAxis();
        this.createTitle(this.title);
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
        this.setAxis();
        this.grp.data(this.dataset);
        this.updateBar(this.grp);
        if(this.hasxAxis){

            this.xR.transition().duration(500).ease("linear").call(this.xAxis);
        }
        if(this.hasyAxis){

            this.yR.transition().duration(500).ease("linear").call(this.yAxis);
        }
    }

})(window);