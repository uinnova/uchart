/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;
    
    self.uline = function () {
        //格式化日期，并保存在这个变量中
        this.parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

        //绘制线条的方法
        this.line = null;

        //存放所有元素的group g
        this.lgroup = null;

        //存放每个line的cell g的集合
        this.lcell = null;

        //y轴是否固定值
        this.yfixed = false;

        //y轴固定值范围
        this.yfixedrange = {
            min: 0,
            max: 100
        };
        this.linecategory = "basis";

        //存放所有的line相关的样式
        this.linestyle = {
            "linestyle": "linestyle",
            "linetext": "linetext"
        };

        this.lineColor = ["#ffffee","red","green"];

        this.xTicks = 0;

        this.yTicks = 0;
    };

    var UL = self.uline.prototype = new ucommon();

    /***
     * 格式化接收到的参数中日期
     * @param f 日期格式，如：20111001 为2011年10月1日，格式为%Y%m%d
     */
    UL.setparseDate = function (f) {
        if(typeof f === "string"){
            this.parseDate = d3.time.format(f).parse;
        }
    };
    /***
     * 设置x和y的比例
     * 该项必须在bindData后执行，这样才能够绑定最新的数据源以产生坐标
     */
    UL.setScale = function () {
        var _this = this;
        this.xScale = d3.time.scale().range([0,(this.w - this.barPadding * 2)]);
        this.yScale = d3.scale.linear().range([(this.h - this.barPadding * 2),0]);
    };

    /***
     * 定义坐标轴
     */
    UL.setAxis = function () {
        var _this = this;
        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient("bottom").ticks(this.xTicks);

        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient("left").ticks(this.yTicks);
    };

    /***
     * 设置线条样式
     * @param l
     */
    UL.setLinecategory = function (l) {
        if(typeof l === "string"){
            this.linecategory = l;
        }
    };

    /***
     * 设置x轴的刻度个数
     */

    UL.setxTicks = function (x) {
        if(typeof x === "number"){
            this.xTicks = x;
        }
    };

    /***
     * 设置y轴的刻度个数
     */
    UL.setyTicks = function (y) {
        if(typeof y === "number"){
            this.yTicks = y;
        }
    };

    /***
     * 定义画曲线的函数
     */
    UL.setLine = function () {
        var _this = this;
        this.line = d3.svg.line()
            .interpolate(this.linecategory)
            .x(function (d) {
                return _this.xScale(d.date);
            })
            .y(function (d) {
                return _this.yScale(d.value);
            })
    };

    /***
     * 设置固定y轴的范围
     * @param x 最小值
     * @param y 最大值
     */
    UL.setYfixed = function (x,y) {
        if(typeof x === "number" && typeof y === "number"){
            this.yfixedrange.min = x;
            this.yfixedrange.max = y;
            this.yfixed = true;
        }
    };

    /***
     * 格式化数据中的日期
     * 格式化后为xscle和yscale的domain
     */
    UL.formatDate = function () {
        var _this = this;
        this.dataset.forEach(function (d) {
            d.values.forEach(function (ds) {
                ds.date = _this.parseDate(ds.date);
            });

        });


        //设置x轴的domain
        this.xScale.domain([
            d3.min(_this.dataset, function (d) {
                return d3.min(d.values, function (t) {
                    return t.date;
                });
            }),
            d3.max(_this.dataset, function (d) {
                return d3.max(d.values, function (t) {
                    return t.date;
                });
            })
        ]);
        //这段作用使Y轴随着数据的区间来取大小范围，y轴不固定
        if(!this.yfixed){

            this.yScale.domain([
                d3.min(_this.dataset, function (d) {
                    return d3.min(d.values, function (t) {
                        return t.value;
                    });
                }),
                d3.max(_this.dataset, function (d) {
                    return d3.max(d.values, function (t) {
                        return t.value;
                    });
                })
            ]);
        }else{

            this.yScale.domain([this.yfixedrange.min,this.yfixedrange.max]);
        }
    };

    /***
     * 在画布svg上直接创建g，用于存放所有元素
     * 在svg上先创建一个g的目的是使svg画布留有四周的padding
     */
    UL.createLgroup = function () {
        return this.render.append("g")
            .attr("transform", "translate(" + this.barPadding + "," + this.barPadding + ")");
    };

    /***
     * 创建x轴和y轴
     */
    UL.createAxis = function (g) {
        var _this = this;
        if(this.hasxAxis){
            this.xR = g.append("g")
                .classed(_this.barstyle.axisStyle,true)
                .attr({
                    transform: "translate(0," + (_this.h - this.barPadding*2) + ")"
                })
                .call(this.xAxis);
            if(_this.xAxistitle != ""){
                _this.xR.append("text")
                    .attr({
                        transform: "translate(" + (_this.w - _this.barPadding*2) +"," + -10 + ")"
                    })
                    .style("text-anchor","end")
                    .text(this.xAxistitle);
            }
        }
        if(this.hasyAxis){
            this.yR = g.append("g")
                .classed(_this.barstyle.axisStyle,true)
                .call(this.yAxis);
            if(_this.yAxistitle != ""){
                _this.yR.append("text")
                    .attr({
                        transform: "rotate(-90)",
                        y: 15
                    })
                    .style("text-anchor", "end")
                    .text(this.yAxistitle);
            }
        }
    };

    /***
     * 绘制线条，如果数据集中有多个name，则绘制多个曲线
     * @param g createLgroup中所创建的g，用于存放曲线及坐标轴等元素
     * @returns {*}
     */
    UL.createLine = function (g) {
        var _this = this;
        var lgs = g.selectAll(".lineg")
            .data(this.dataset)
            .enter()
            .append("g")
            .attr("class","lineg");

        lgs.append("path")
            .attr({
                class: this.linestyle.linestyle,
                d: function (d) {
                    return _this.line(d.values);
                }
            })
            .style("stroke",function (d,i) {
                return _this.lineColor[i];
            });

        //为line最后面添加名称
        /*lgs.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + _this.xScale(d.value.date) + "," + _this.yScale(d.value.value) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .attr("class",_this.linestyle.linetext)
            .text(function(d) { return d.name; });*/

        return lgs;
    };

    UL.updateLine = function (d) {
        var _this = this;
        this.dataset = d;
        this.formatDate();
        this.lcell.data(this.dataset);
        var e = this.lcell.select("path");
        e.transition().duration(500).ease("linear")
            .attr({
                d: function (d) {
                    return _this.line(d.values);
                }
            });
        if(this.hasxAxis){

            this.xR.transition().duration(500).ease("linear").call(this.xAxis);
        }
        if(this.hasyAxis){

            this.yR.transition().duration(500).ease("linear").call(this.yAxis);
        }
    };
    
    UL.draw = function () {
        this.setScale();
        this.createTitle(this.title);
        this.setAxis();
        this.setLine();
        this.formatDate();
        this.lgroup = this.createLgroup();
        this.createAxis(this.lgroup);
        this.lcell = this.createLine(this.lgroup);
    }

})(window);