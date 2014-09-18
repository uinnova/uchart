/**
 * Created by leiting on 14/8/4.
 */
(function (arg) {

    var self = arg;

    self.histgram = function (d) {
        //设置图表默认宽度
        this.w = 300;
        //设置图表默认高度
        this.h = 300;
        //设置柱状图柱子之间的间隔
        this.barPadding = 1;
        //设置数据集
        this.dataset = d;
        //设置柱状图的尺寸类型，0：自定义尺寸，1-4分别从sizearray中获取数组的值分别作为宽和高
        this.type = 0;
        //设置图标标题
        this.title = "";
        //显示横坐标
        this.hasxAxis = true;
        //显示纵坐标
        this.hasyAxis = true;
        //尺寸数组
        this.sizearray = [[300,300],[500,300],[600,300],[800,300]];
        //设置画布
        this.render = null;
        //设置存放bar的group
        this.grp = null;
        //设置xsclae
        this.xScale = null;
        //设置yscale
        this.yScale = null;
        //设置x坐标轴
        this.xAxis = null;
        //设置x轴标题
        this.xAxistitle = "";
        //x轴g容器
        this.xR = null;
        //设置y坐标轴
        this.yAxis = null;
        //设置y轴标题
        this.yAxistitle = "";
        //y轴容器
        this.yR = null;
        //设置颜色，暂时方案
        this.color = d3.scale.category10();
        //设置bar样式
        this.barstyle = {
            "barText" : "h_bartext",
            "barTitle": "h_bartitle",
            "axisStyle": "h_axis"
        };
        //如果设置了标题，则在最上方留出20px的高度
        this.titlePadding = 30;
        //如果显示x轴，则在最下方留出20px的高度
        this.xAxisPadding = 30;
        //如果显示y轴，则在画布的最左侧留出20px的宽度
        this.yAxisPadding = 30;
    };

    var HS = self.histgram.prototype;

    /***
     * 设置柱状图尺寸类型
     * @param t 类型: 0-4
     */
    HS.setType = function (t) {
        if(typeof  t === "number"){

            this.type = t;
        }else{
            console.log("图表的尺寸类型必须是0-4的数字");
        }
    };

    /***
     * 根据柱状图的尺寸类型设置柱状图的宽和高
     * @param w 宽
     * @param h 高
     */
    HS.setSize = function (w,h) {
        if(this.type > 0 && this.type <= 4){
            this.w = this.sizearray[this.type - 1][0];
            this.h = this.sizearray[this.type - 1][1];
        }
        else if(this.type == 0){
            if(typeof w === "number" && typeof h === "number"){

                this.w = w;
                this.h = h;
            }else{
                console.log("图表尺寸只能够接受数字类型,系统已经将数据类型设置为默认500*300大小");
            }
        }else{
            console.log("请先设置正确的图表尺寸类型再进行具体尺寸设置");
        }
    };

    /***
     * 设置图标的标题
     * @param t
     */
    HS.setTitle = function (t) {
        this.title = t;
    };

    /***
     * 设置是否显示横坐标即X轴
     * @param x true/fase
     */
    HS.isxAsix = function (x) {
        if(typeof x === "boolean"){

            this.hasxAxis = x;
        }
    };

    /***
     * 设置是否显示纵坐标即Y轴
     * @param y true/fase
     */
    HS.isyAsix = function (y) {
        if(typeof y === "boolean"){

            this.hasyAxis = y;
        }
    };

    /***
     * 设置x轴标题
     * @param t
     */
    HS.setxAxistitle = function (t) {
        if(t != "" && t != null && typeof t ==="string"){
            this.xAxistitle = t;
        }
    };

    /***
     * 设置y轴标题
     * @param t
     */
    HS.setyAxistitle = function (t) {
        if(t != "" && t != null && typeof t ==="string"){
            this.yAxistitle = t;
        }
    }

    /**
     * 创建d3的基础对象，将来所有的d3图表中的子对象都要画到该svg中来。
     * @param t 创建画布的来源类型，jo:JavaScript对象，比如div等;id:通过html标签的id来进行创建svg;htmlmark:通过某个html标签来进行创建。
     * @param r 对应的被选择对象的值。
     * @returns {void|*}
     */
    HS.createRender = function (t,r) {
        if(t == "jo"){
            this.render = this._setRendsize(d3.select(r).append("svg"),this.w,this.h);
            return this.render;
        }
        if(t == "id"){
            this.render = this._setRendsize(d3.select('#' + r).append("svg"),this.w,this.h);
            return this.render;
        }
        if(t == "htmlmark"){
            this.render = this._setRendsize(d3.select(r).append("svg"),this.w,this.h);
            return this.render;
        }
    };

    /***
     * 设置画布的大小
     * @param o 画布的d3对象
     * @param w 设置的宽
     * @param h 设置的高
     * @returns {*}
     */
    HS._setRendsize = function (o,w,h){
        o.attr({
            width: w,
            height: h
        });
        return o;
    };

    /**
     * 绑定外部数据源
     * @param d 外部数据源，是一个JavaScript object
     */
    HS.bindData = function (d) {
        if(typeof d === "object"){

            this.dataset = d;
        }else{
            console.log("绑定的数据类型不正确");
        }
    };
    /***
     * 设置x和y的比例
     * 该项必须在bindData后执行，这样才能够绑定最新的数据源以产生坐标
     */
    HS.setScale = function () {
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
     * 返回是否显示title，用于后续的尺寸判断
     * @returns {boolean}
     */
    HS.hasTtile = function () {
        var rtn = false;
        if(this.title != "" && this.title != null && typeof this.title != "undefined"){
            rtn = true;
        }
        return rtn;
    };

    /***
     * 创建title并设置显示位置等属性
     */
    HS.createTitle = function () {
        var _this = this;
        if(this.hasTtile()){

            var ti = this.render.append("text").text(this.title);
            ti.classed(this.barstyle.barTitle,true);
            ti.attr({
                x: _this.w / 2,
                y: 20
            })
        }
    };

    /***
     * 按照数据创建每个bar的group
     * @returns {void|*}
     */
    HS.createGroup = function () {
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
    HS.createBar = function (g) {
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
    HS.updateBar = function (g) {
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
    HS.createAxis = function () {
        var _this = this;
        if(this.hasxAxis){
            this.xAxis = d3.svg.axis().scale(_this.xScale).orient("bottom");
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
            this.yAxis = d3.svg.axis().scale(_this.yScale).orient("left");
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
    HS.draw = function () {
        this.setScale();
        this.createTitle(this.title);
        this.grp = this.createGroup();
        this.createBar(this.grp);
        this.createAxis();
    };

    /***
     * 更新柱状图，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    HS.update = function (d) {
        this.dataset = d;
        this.setScale();
        this.grp.data(this.dataset);
        this.updateBar(this.grp);
        if(this.hasxAxis){

            this.xR.remove();
        }
        if(this.hasyAxis){

            this.yR.remove();
        }
        this.createAxis();
    }

})(window);