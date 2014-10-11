/**
 * Created by leiting on 14/8/6.
 */
/**
 * Created by leiting on 14/8/4.
 */
(function (arg) {

    var self = arg;

    self.ucommon = function () {
        //设置图表默认宽度
        this.w = 300;
        //设置图表默认高度
        this.h = 300;
        //设置柱状图柱子之间的间隔
        this.barPadding = 35;
        //设置数据集
        this.dataset = null;
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
        //设置标题栏颜色
        this.titleColor = "steelblue";
        this.themes = "default";
    };

    var UC = self.ucommon.prototype;

    /***
     * 设置柱状图尺寸类型
     * @param t 类型: 0-4
     */
    UC.setType = function (t) {
        if(typeof  t === "number"){

            this.type = t;
        }else{
            console.log("图表的尺寸类型必须是0-4的数字");
        }
    };

    /***
     * 设置坐标轴样式
     * @param v
     */
    UC.setAxisStyle = function(v){
        this.barstyle["axisStyle"] = v;
    };

    /***
     * 根据柱状图的尺寸类型设置柱状图的宽和高
     * @param w 宽
     * @param h 高
     */
    UC.setSize = function (w,h) {
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
    UC.setTitle = function (t) {
        this.title = t;
    };

    /***
     * 设置是否显示横坐标即X轴
     * @param x true/fase
     */
    UC.isxAsix = function (x) {
        if(typeof x === "boolean"){

            this.hasxAxis = x;
        }
    };

    /***
     * 设置是否显示纵坐标即Y轴
     * @param y true/fase
     */
    UC.isyAsix = function (y) {
        if(typeof y === "boolean"){

            this.hasyAxis = y;
        }
    };

    /***
     * 设置x轴标题
     * @param t
     */
    UC.setxAxistitle = function (t) {
        if(t != "" && t != null && typeof t ==="string"){
            this.xAxistitle = t;
        }
    };

    /***
     * 设置y轴标题
     * @param t
     */
    UC.setyAxistitle = function (t) {
        if(t != "" && t != null && typeof t ==="string"){
            this.yAxistitle = t;
        }
    };

    /***
     * 设置图标标题颜色
     * @param t
     */
    UC.setTitleColor = function (t) {
        if(typeof t === "string"){
            this.titleColor = t;
        }
    };

    /**
     * 创建d3的基础对象，将来所有的d3图表中的子对象都要画到该svg中来。
     * @param t 创建画布的来源类型，jo:JavaScript对象，比如div等;id:通过html标签的id来进行创建svg;htmlmark:通过某个html标签来进行创建。
     * @param r 对应的被选择对象的值。
     * @returns {void|*}
     */
    UC.createRender = function (t,r) {
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
    UC._setRendsize = function (o,w,h){
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
    UC.bindData = function (d) {
        if(typeof d === "object"){

            this.dataset = d;
        }else{
            console.log("绑定的数据类型不正确");
        }
    };

    /***
     * 返回是否显示title，用于后续的尺寸判断
     * @returns {boolean}
     */
    UC.hasTtile = function () {
        var rtn = false;
        if(this.title != "" && this.title != null && typeof this.title != "undefined"){
            rtn = true;
        }
        return rtn;
    };

    UC.setBarpadding = function (b) {
        if(typeof b === "number"){
            this.barPadding = b;
        }
    };

    /***
     * 创建title并设置显示位置等属性
     */
    UC.createTitle = function () {
        var _this = this;
        if(this.hasTtile()){

            var ti = this.render.append("text").text(this.title);
            ti.classed(this.barstyle.barTitle,true);
            ti.attr({
                x: _this.w / 2,
                y: 20,
                fill:this.titleColor
            })
        }
    };

    UC.setThemes = function (t) {
        if(t){
            this.themes = t;
        }
    };


})(window);
/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;

    self.unumb = function () {

        this.color = d3.scale.category10();

        /*this.cfg = {
            "color":"white",
            "bgColor":"blue",
            "fontSize":"24px"
        }*/

    };

    //实现从基类继承
    var UNB = self.unumb.prototype = new ucommon();

    UNB.init = function(options){

        if('undefined' !== typeof options){

            this.numberColor = options.color || "white";

            this.bgColor = options.bgColor || "blue";

            this.fontSize = options.fontSize || "24px";

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

            /*for(var i in options){
                if('undefined' !== typeof options[i]){
                    this.cfg[i] = options[i];
                }
            }*/
        }else{
            options = {};
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
        if(!this.themes || this.themes === "default"){
            _this.bgColor = "black";
            _this.numberColor = "white";
        }else{
            _this.bgColor = "white";
            _this.numberColor = "black";
        }

        this.g.append("rect")
            .attr("width",_this.x.rangeBand())
            .attr("height",40)
            .attr("fill",_this.bgColor);

        this.g.append("text")
            .attr("class", "value")
            .attr("x", function(d,i) { return _this.x.rangeBand()/2 + 3; })
            .attr("y", 40 / 2)
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill",_this.numberColor)
            .attr("font-size",_this.fontSize)
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

            if("undefined" !== typeof options.title) {
                this.title = options.title;
                this.setTitle(this.title);
            }

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

            if("undefined" !== typeof options.titleColor) {
                this.titleColor = options.titleColor;
            }

            if("undefined" !== typeof options.type) {
                this.type = options.type;
            }

            if("undefined" !== typeof options.barPadding) {
                this.barPadding = options.barPadding;
            }

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
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
        this.x = d3.scale.linear().range([0, this.w - this.barPadding*3]);
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

        var tempThemes = "bar";
        if(this.themes){
            tempThemes += "_" + this.themes;
        }
        var g = this.svg.selectAll("g."+tempThemes)
            .data(_this.dataset)
            .enter()
            .append("g")
            .attr("class", tempThemes)
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

        var xThemes = "xaxis";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        var yThemes = "yaxis";
        if(this.themes){
            yThemes += "_" + this.themes;
        }

        this.svg.append("g")
            .attr("class", xThemes)
            .call(this.xAxis);

        this.svg.append("g")
            .attr("class", yThemes)
            .call(this.yAxis);
    };

    /**
     * 更新坐标轴
     */
    UBB.updateAxis = function(){

        var xThemes = "g.xaxis";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        this.svg.select(xThemes).call(this.xAxis);
        //this.svg.select(yThemes).call(this.yAxis);
    };

    /***
     * 绘制柱状图
     */
    UBB.draw = function (options) {
        this.init(options)
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
    UBB.update = function (d) {
        this.dataset = d;
        this.setScale();
        this.updateBar(this.grp);
        this.updateAxis();
        //this.createAxis();
    }

})(window);
/**
 * Created by wason on 2014/9/12.
 */
(function (arg) {

    var self = arg;

    self.uradarb = function(){

        this.cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 50,
            ExtraWidthX: 100,
            ExtraWidthY: 60,
            color: d3.scale.category10()
        }

        this.Format = d3.format('%');

        this.tooltip;

    };

    var URB = self.uradarb.prototype = new ucommon();

    URB.init = function(options){

        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    this.cfg[i] = options[i];
                }
            }
        }

        if("undefined" !== typeof options.themes) {
            this.setThemes(options.themes);
        }

        if("undefined" !== typeof options.data) {
            this.dataset = options.data;
        }

        if("undefined" !== typeof options.title) {
            this.title = options.title;
            this.setTitle(this.title);
        }

        if("undefined" !== typeof options.titleColor) {
            this.titleColor = options.titleColor;
        }

        if("undefined" !== typeof options.size) {
            this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
        }

        /*this.cfg.maxValue = Math.max(this.cfg.maxValue, d3.max(this.dataset, function(i){return d3.max(i.value.map(function(o){return o.value;}))}));
        this.allAxis = (this.dataset[0].value.map(function(i, j){return i.axis}));
        this.total = this.allAxis.length;
        this.radius = this.cfg.factor*Math.min(this.w/2, this.h/2);*/
    };

    URB.setScale = function(){
        this.cfg.maxValue = Math.max(0, d3.max(this.dataset, function(i){return d3.max(i.value.map(function(o){return o.value;}))}));
        this.allAxis = (this.dataset[0].value.map(function(i, j){return i.axis}));
        this.total = this.allAxis.length;
        this.radius = this.cfg.factor*Math.min(this.w/2, this.h/2);
    };

    URB.setContainer = function(){

        this.render.select('svg').remove();
       // d3.select(id).select("svg").remove();

        this.g = this.render
            .attr("width", this.w + this.cfg.ExtraWidthX)
            .attr("height", this.h + this.cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + this.cfg.TranslateX + "," + this.cfg.TranslateY + ")")
            .attr("class","radar");

    };

    //组成每一层圆形的每条线
    URB.createCircular = function(){
        var _this = this;

        var xThemes = "line";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        for(var j=0; j < _this.cfg.levels; j++){
            var levelFactor = _this.cfg.factor * _this.radius * ((j+1) / _this.cfg.levels);
            _this.g.selectAll(".levels")
                .data(_this.allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function(d, i){return levelFactor*(1-_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total));})
                .attr("y1", function(d, i){return levelFactor*(1-_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total));})
                .attr("x2", function(d, i){return levelFactor*(1-_this.cfg.factor*Math.sin((i+1)*_this.cfg.radians/_this.total));})
                .attr("y2", function(d, i){return levelFactor*(1-_this.cfg.factor*Math.cos((i+1)*_this.cfg.radians/_this.total));})
                .attr("class", xThemes)
               // .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (_this.w/2 - levelFactor) + ", " + (_this.h/2 - levelFactor) + ")");
        }
    };

    //每层圆形的标值 10% 20% 30%。。。
    URB.showCirText = function(){
        var _this = this;

        var lineThemes = "cirtext";
        if(this.themes){
            lineThemes += "_" + this.themes;
        }

        for(var j=0; j < _this.cfg.levels; j++){
            var levelFactor = _this.cfg.factor * _this.radius*((j+1)/_this.cfg.levels);
            _this.g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d){return levelFactor*(1- _this.cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1- _this.cfg.factor*Math.cos(0));})
                .attr("class", lineThemes)
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (_this.w/2-levelFactor + _this.cfg.ToRight)
                    + ", " + (_this.h/2 - levelFactor) + ")")
                //.attr("fill", "#737373")
                .text(_this.Format((j+1) * _this.cfg.maxValue/_this.cfg.levels));
        }
    };

    URB.createAixs = function(){
        var _this = this;

        var xThemes = "axis";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        var axis = _this.g.selectAll("."+xThemes)
            .data(_this.allAxis)
            .enter()
            .append("g")
            .attr("class", xThemes);

        //画出从圆心到最外边的每一段线
        axis.append("line")
            .attr("x1", _this.w/2)
            .attr("y1", _this.h/2)
            .attr("x2", function(d, i){return _this.w/2*(1 - _this.cfg.factor*Math.sin(i * _this.cfg.radians/_this.total));})
            .attr("y2", function(d, i){return _this.h/2*(1 - _this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total));})
            .attr("class", "line")
            //.style("stroke", "grey")
            .style("stroke-width", "1px");

        //在圆形外边画出每个axis的值
        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -10)"})
            .attr("x", function(d, i){return _this.w/2*(1-_this.cfg.factorLegend*Math.sin(i*_this.cfg.radians/_this.total))-60*Math.sin(i*_this.cfg.radians/_this.total);})
            .attr("y", function(d, i){return _this.h/2*(1-Math.cos(i*_this.cfg.radians/_this.total))-20*Math.cos(i*_this.cfg.radians/_this.total);});

    };

    URB.createRadar = function(){
        var _this = this;
        //根据axis的值画出多边形雷达图
        var series = 0;

        this.dataset.forEach(function(y, x){
            dataValues = [];
            _this.g.selectAll(".nodes")
                .data(y.value, function(j, i){
                    dataValues.push([
                            _this.w/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total)),
                            _this.h/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            _this.g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", _this.cfg.color(series))
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return _this.cfg.color(series)})
                .style("fill-opacity", _this.cfg.opacityArea)
                .on('mouseover', function (d){
                    var  z = "polygon."+d3.select(this).attr("class");
                    _this.g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    _this.g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    _this.g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", _this.cfg.opacityArea);
                });
            series++;
        });
        series=0;

        //画出多边形雷达图的每个圆形顶点
        _this.dataset.forEach(function(y, x){
            _this.g.selectAll(".nodes")
                .data(y.value).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie"+series)
                .attr('r', _this.cfg.radius *2/3)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                    dataValues.push([
                            _this.w/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total)),
                            _this.h/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total))
                    ]);
                    return _this.w/2*(1-(Math.max(j.value, 0)/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total));
                })
                .attr("cy", function(j, i){
                    return _this.h/2*(1-(Math.max(j.value, 0)/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total));
                })
                .attr("data-id", function(j){return j.axis})
                .style("fill", "white")
                .style("stroke",_this.cfg.color(series)).style("fill-opacity", .9)
                .style("stroke-width",function(){
                    return _this.cfg.radius/3;
                })
                .on('mouseover', function (d){
                   var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                   var newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                    _this.tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(_this.Format(d.value))
                        .transition(200)
                        .style('opacity', 1);

                    var z = "polygon."+d3.select(this).attr("class");
                    _this.g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    _this.g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    _this.tooltip.transition(200)
                        .style('opacity', 0);
                    _this.g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", _this.cfg.opacityArea);
                })
                .append("svg:title")
                .text(function(j){return Math.max(j.value, 0)});

            series++;
        });
    };

    URB.createTooltip = function(){
        //Tooltip //提示框
        this.tooltip = this.g.append('text')
            .style('opacity', 0)
            .style('font-family', 'sans-serif')
            .style('font-size', '13px')
            .attr('class','tooltip');
    };

    URB.createLegend = function(){
        var _this = this;
        _this.setLegendOptions();

        var legendThemes = "legend";
        if(this.themes){
            legendThemes += "_" + this.themes;
        }

        var svg = _this.render
            .append('svg')
            .attr("width", _this.w+300)
            .attr("height", _this.h);

        var legend = svg.append("g")
                .attr("class", legendThemes)
                .attr("height", 100)
                .attr("width", 200)
                .attr('transform', 'translate(90,20)');

    //Create colour squares
        legend.selectAll('rect')
            .data(_this.legendOptions)
            .enter()
            .append("rect")
            .attr("x", _this.w - 65)
            .attr("y", function(d, i){ return i * 20;})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d, i){ return _this.cfg.color(i);});

    //Create text next to squares
        legend.selectAll('text')
            .data(_this.legendOptions)
            .enter()
            .append("text")
            .attr("x", _this.w - 52)
            .attr("y", function(d, i){ return i * 20 + 9;})
            .attr("font-size", "11px")
            //.attr("fill", "#737373")
            .text(function(d) { return d; })
        ;

    };

    URB.setLegendOptions = function(){
        var len = [];
        for(var i = 0 ; i < this.dataset.length ; i++){
            len.push(this.dataset[i].name);
        }
      this.legendOptions = len;

    };

    URB.draw = function(options){
        this.init(options);
        this.setScale();
        this.setContainer();
        this.createCircular();
        this.showCirText();
        this.createAixs();
        this.createRadar();
        this.createTitle(this.title);
        this.createTooltip();

    };

    URB.updateRader = function(){
        var _this = this;

        _this.dataset.forEach(function(y, x){
            dataValues = [];
            _this.g.selectAll(".nodes")
                .data(y.value, function(j, i){
                    dataValues.push([
                            _this.w/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total)),
                            _this.h/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total))
                    ]);
                });
            dataValues.push(dataValues[0]);

            _this.g.select(".radar-chart-serie"+x)
                .data([dataValues])
                .transition()
                .duration(500)
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                });

        });

        _this.dataset.forEach(function(y, x){
            _this.g.selectAll("circle.radar-chart-serie"+x)
                .data(y.value)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .transition()
                .duration(500)
                .attr("cx", function(j, i){
                    dataValues.push([
                            _this.w/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total)),
                            _this.h/2*(1-(parseFloat(Math.max(j.value, 0))/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total))
                    ]);
                    return _this.w/2*(1-(Math.max(j.value, 0)/_this.cfg.maxValue)*_this.cfg.factor*Math.sin(i*_this.cfg.radians/_this.total));
                })
                .attr("cy", function(j, i){
                    return _this.h/2*(1-(Math.max(j.value, 0)/_this.cfg.maxValue)*_this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total));
                })
                .select("title")
                .text(function(j){
                    return Math.max(j.value, 0);
                });

        });

    };

    URB.updataText = function(){
        var _this = this;

        var lineThemes = "cirtext";
        if(this.themes){
            lineThemes += "_" + this.themes;
        }

        var cirtext = _this.g.selectAll('.'+lineThemes);
        cirtext.each(function(d,i){
            d3.select(this).text(_this.Format((i+1) * _this.cfg.maxValue/_this.cfg.levels));
        });
    };

    URB.update = function(data){
        this.dataset = data;
        this.setScale();
        this.updataText();
        this.updateRader();
    };

})(window);
/**
 * Created by leiting on 14/8/6.
 */
(function (arg) {

    var self = arg;

    self.ubarb = function () {

    };

    //实现从基类继承
    var UBB = self.ubarb.prototype = new ucommon();

    UBB.init = function(options){

        if("undefined" !== typeof options){

            //options.color为各柱状图中柱子的颜色数组，如["green","red","blue"...]
            if("undefined" !== typeof options.color){
                this.color = d3.scale.ordinal().range(options.color);
            }

            if("undefined" !== typeof options.title) {
                this.title = options.title;
                this.setTitle(this.title);
            }

            if("undefined" !== typeof options.titleColor) {
                this.titleColor = options.titleColor;
            }

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

            if("undefined" !== typeof options.type) {
                this.type = options.type;
            }

            if("undefined" !== typeof options.barPadding) {
                this.barPadding = options.barPadding;
            }

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

            if("undefined" !== typeof options.xAxistitle) {
                this.xAxistitle = options.xAxistitle;
            }

            if("undefined" !== typeof options.yAxistitle) {
                this.yAxistitle = options.yAxistitle;
            }

        }else{
            options = {};
        }
    };

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

        var xThemes = _this.barstyle.axisStyle;
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        if(this.hasxAxis){
            //this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
            this.xR = this.render.append("g")
                .classed(xThemes,true)
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
                .classed(xThemes,true)
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
    UBB.draw = function (options) {
        this.init(options);
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

    UL.init = function(options){

        if("undefined" !== typeof options){

            this.lineColor = options.lineColor || ["#ffffee","red","green"];

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

        }else{
            options = {};
        }

    };

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

        var tempThemes = _this.barstyle.axisStyle;
        if(this.themes){
            tempThemes += "_" + this.themes;
        }

        if(this.hasxAxis){
            this.xR = g.append("g")
                .classed(tempThemes,true)
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
                .classed(tempThemes,true)
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

    UL.update = function (d) {
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
    
    UL.draw = function (options) {
        this.init(options);
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
/**
 * Created by wason on 2014/8/6.
 */
(function(arg){

    var self = arg;

    self.upieb = function(){
        //设置是圆和圆环展示，true:圆,false圆环
        this.circle = true;

        //用于存放arcs
        this.arcs = null;

        //用于存放arc
        this.arc = null;

        //是否加图例 true:有图例 false:无图例
        this.isIcon = true;

        //存放图例的g group
        this.iconGroup = null;

        //偏移量
        this.baroffset = 0;

        this.sum = 0;
    };

    var UPB = self.upieb.prototype = new ucommon();

    UPB.init = function(options){

        if("undefined" !== typeof options){

            //自定义圆环各部分的颜色，如果不自定义就用d3中的默认的颜色
            if("undefined" !== typeof options.color){
                this.color = d3.scale.ordinal().range(options.color);
            }

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.type) {
                this.type = options.type;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

            if("undefined" !== typeof options.title) {
                this.title = options.title;
                this.setTitle(this.title);
            }

            if("undefined" !== typeof options.titleColor) {
                this.titleColor = options.titleColor;
            }

            if("undefined" !== typeof options.icon) {
                this.isIcon = options.icon;
            }

        }else{
            options = {};
        }

    };

    /***
     * 是饼图还是环形图标志位，true饼图，false环形图
     * @param flag
     */
    UPB.setCircle = function(flag){
        if(typeof flag === "boolean"){
            this.circle = flag;
        }
    };

    /***
     * 是否显示图例，true显示，false不显示
     * @param flag
     */
    UPB.setIcon = function (flag) {
        if(typeof flag === "boolean"){
            this.isIcon = flag;
        }
    };

    /***
     * 设置饼图的比例参数
     * @param x
     */
    UPB.setScale = function(x){
        var outerRadius = Math.min(this.w, this.h)/2;
        if(typeof x === "boolean"){
            outerRadius = Math.min(this.w, this.h)/4 + this.barPadding;
        }
        var innerRadius = 0;
        if(!this.circle){
            innerRadius = Math.min(this.w, this.h)/4;
        }

        //barPadding是饼图和画布四周的距离
        this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius - this.barPadding);

    };

    /**
     * 为每个要绘制的扇形分组(g),把用于生成饼图的数据绑定到这些新元素，并把每个分组平移到图表中心
     * @returns {void|*}
     */
    UPB.createGroup = function(){
        var _this = this;

        this.pie = d3.layout.pie().sort(null).value(function(d){
            return d.value;
        });

        this.baroffset = 0;
        if(this.isIcon){
            this.baroffset = 20;
        }
        this.arcs = _this.render.selectAll("g.arc")
            .data(this.pie(this.dataset))
            .enter()
            .append("g").
        attr("class","arc").attr("transform","translate("+(this.w/2 - this.baroffset)+","+this.h/2+")");
    };

    /**
     * 创建path元素并把相关属性的值保存在d中，并设置颜色
     * @param arcs
     * @param arc
     */
    UPB.createPie = function(g){
        var _this = this;

           //自定义颜色
        //var color = d3.scale.ordinal()
            //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        g.each(function(d){
            var e = d3.select(this);
            var b = e.append("path");
            var t = e.append("text").text(d.data.value);
            b.attr({
                "fill":_this.color(d.data.name),
                "d":_this.arc
            })
                .each(function(d) { this._current = d; });

            /*b.transition().duration(500).ease("circle")
                .attr({
                    "d":_this.setScale()
                });*/

            t.attr({
                "text-anchor":"middle",
                "font-size":14,
                "fill":"white",
                "transform":function(){
                    return "translate("+_this.arc.centroid(d)+")";
                }
            });
        });

        if(_this.isIcon){
            _this.iconGroup = _this.createLenGroup();
        }

    };

    /***
     * 创建存放图例的g和图例内容
     * @returns {*}
     */
    UPB.createLenGroup = function(){
        var _this = this;

        var xThemes = "g.len";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        var yThemes = "len";
        if(this.themes){
            yThemes += "_" + this.themes;
        }

        var pt = 0;
        this.dataset.forEach(function (d) {
            pt += d.value;
        });
        var g = _this.render.append("g").
            attr("transform","translate("+(((_this.w/2 - this.baroffset) + (_this.h/2 - _this.barPadding)) + 10)+","+(this.barPadding + 10)+")");

        var len = g.selectAll(xThemes).data(this.dataset).enter().
            append("g").attr({
                "class":yThemes,
                "transform": function(d,i){return "translate(0," + (i*22) + ")"}

            });
        len.append("rect").attr("width",30).attr("height",20).attr("fill", function (d) {
            return _this.color(d.name);
        });
        len.append("text")
            .text(function(d,i){
            return d.name + " " + Math.floor(d.value/pt*100) + "%";
        })
            .attr({
              "x":32,
              "y": function (d,i) {
                  return i+11;
              },
              "font-size":12
        });

        return g;
    };

    /**
     * 更新各个组
     * @param g
     */
    UPB.updatePie = function(g){
        var _this = this;

        var pt = 0;
        this.dataset.forEach(function (d) {
            pt += d.value;
        });
        g.each(function(d){
            var e = d3.select(this);
            var p = e.select("path");
            var t = e.select("text").text(d.data.value);
            p.transition().duration(500).attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return _this.arc(interpolate(t));
                };
            });
            /*p.attr({
                "fill":_this.color(d.data.name),
                "d":_this.arc
            });*/
            t.transition().duration(500).attr({
                "text-anchor":"middle",
                "font-size":14,
                "fill":"white",
                "transform":function(){
                    return "translate("+_this.arc.centroid(d)+")";
                }
            });
        });

        var xThemes = "g.len";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        if(this.isIcon){
            this.iconGroup.selectAll(xThemes).data(this.dataset);
            var te = this.iconGroup.selectAll("text");
            te.each(function () {
                var e = d3.select(this);
                e.text(function(d){
                    return d.name + " " + Math.floor(d.value/pt*100) + "%";
                });
            })
        }
    };

    /**
     * 绘制饼图
     */
    UPB.draw = function(options){
        this.init(options);
        this.setScale();
        this.createGroup();
        this.createPie(this.arcs);
        this.createTitle(this.title);
    };

    /**
     * 更新饼图，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    UPB.update = function(d){
        this.dataset = d;
        this.setScale();
        this.arcs.data(this.pie(this.dataset));
        this.updatePie(this.arcs);
    }

})(window);

/**
 * Created by wason on 2014/8/6.
 */
(function(arg){

    var self = arg;

    self.upiemxp = function(){
        //设置是圆和圆环展示，true:圆,false圆环
        this.circle = false;

        //是否加图例 true:有图例 false:无图例
        this.isIcon = false;

        this.arcs = null;

        this.arc = null;

        //偏移量
        this.baroffset = 0;

        this.piestyle={
            "pieText":"prebarText"
        };

        this.processground = null;

        this.barPadding = 2;

        this.processColor = ["green","gray"];


    };

    var UPMXP = self.upiemxp.prototype = new ucommon();

    UPMXP.init = function(options){

        if("undefined" !== typeof options){

            if("undefined" !== typeof options.processColor){
                this.processColor = options.processColor;
            }

            if("undefined" !== typeof options.processground){
                this.processground = options.processground;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

            if("undefined" !== typeof options.fontSize){
                this.fontSize = options.fontSize;
            }

        }else{
            options = {};
        }

    };

    UPMXP.setCircle = function(flag){
        if(typeof flag === "boolean"){
            this.circle = flag;
        }
    };

    UPMXP.setIcon = function (flag) {
        if(typeof flag === "boolean"){
            this.isIcon = flag;
        }
    };

    UPMXP.setScale = function(x){
        var outerRadius = Math.min(this.w, this.h)/2;
        if(typeof x === "boolean"){
            outerRadius = Math.min(this.w, this.h)/4 + this.barPadding;
        }
        var innerRadius = 0;
        if(!this.circle){
            innerRadius = Math.min(this.w, this.h)/3;
        }

        //barPadding是饼图和画布四周的距离
        this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius - this.barPadding);
    };

    UPMXP.setProcessGround = function (g) {
        if(typeof g === "string"){
            this.processground = g;
        }
    };

    UPMXP.setProcesscolor_start = function (c) {
        this.processColor[0] = c;
    };

    UPMXP.setProcesscolor_end = function (c) {
        this.processColor[1] = c;
    };

    /**
     * 为每个要绘制的扇形分组(g),把用于生成饼图的数据绑定到这些新元素，并把每个分组平移到图表中心
     * @returns {void|*}
     */
    UPMXP.createGroup = function(){
        var _this = this;

        var bg = this.render.append("g");
        bg.append("image").attr({
            "xlink:href": _this.processground,
            width: _this.w,
            height: _this.h,
            opacity:1
        });

        this.pie = d3.layout.pie().sort(null).value(function(d){
            return d;
        });

        this.arcs = _this.render.selectAll("g.arc")
            .data(this.pie(this.dataset))
            .enter()
            .append("g").
            attr("class","arc").attr("transform","translate("+(this.w/2 - this.baroffset)+","+this.h/2+")");
    };

    /**
     * 创建path元素并把相关属性的值保存在d中，并设置颜色
     * @param arcs
     * @param arc
     */
    UPMXP.createPie = function(g){
        var _this = this;

        //自定义颜色
        var color = d3.scale.ordinal()
            .range(this.processColor);

        g.each(function(d,i){
            var e = d3.select(this);
            var b = e.append("path");
            b.attr({
                "fill":color(i),
                "d":_this.arc
            })
                .each(function(d) { this._current = d; });
        });

        this.createPreBar();

        if(_this.isIcon){
            _this.createLenGroup();
        }

    };

    UPMXP.createPreBar = function(){
        var _this = this;

        var gPce = _this.render.append("g").attr("transform","translate("+(_this.w/2)+","+(_this.h/2+5)+")");
        this.pce = gPce.append("text").text("");
        this.pce.attr({
            "text-anchor":"middle",
            "font-family":"Arial",
            "font-size":this.fontSize?this.fontSize:14,
            "font-weight":"bold",
            "fill":_this.processColor[1]
        });

    };


    UPMXP.createLenGroup = function(){
        var _this = this;

        var g = _this.render.append("g").
            attr("transform","translate("+(((_this.w/2 - this.baroffset) + (_this.h/2 - _this.barPadding)) + 10)+","+(this.barPadding + 10)+")");

        var len = g.selectAll("g.len").data(this.dataset).enter().
            append("g").attr({
                "class":"len",
                "transform": function(d,i){return "translate(0," + (i*22) + ")"}

            });
        len.append("rect").attr("width",30).attr("height",20).attr("fill", function (d) {
            return _this.color(d.name);
        });
        len.append("text")
            .text(function(d,i){
                return d.name;
            })
            .attr({
                "x":32,
                "y": function (d,i) {
                    return i+11;
                },
                "font-size":12
            });

        return g;
    };

    /**
     * 更新各个组
     * @param g
     */
    UPMXP.updatePie = function(g){
        var _this = this;

        g.each(function(d){
            var e = d3.select(this);
            var p = e.select("path");
            p.transition().duration(100).attrTween("d",function(a) {
                this._current = this._current || d;
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return _this.arc(i(t));
                };
            });

        });
    };

    UPMXP.updatePre = function(){
        var _this = this;
        _this.pce.text(_this.dataset[0] + "%");
    };

    /**
     * 绘制饼图
     */
    UPMXP.draw = function(options){
        this.init(options);
        this.setScale();
        this.createGroup();
        this.createPie(this.arcs);
        this.createTitle(this.title);
    };

    /**
     * 更新饼图，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    UPMXP.update = function(d){
        this.dataset = d;
        this.setScale();
        this.arcs.data(this.pie(this.dataset));
        this.updatePie(this.arcs);
        this.updatePre();
    };

    UPMXP.interValcreate = function (i,options,ciid) {
        var interval = 100;
        if(i != "undefined" && typeof i === "number"){
            interval = i;
        }
        var _this = this;
        var dataset = this.dataset = [0,100];
        this.draw(options);

        //update
        setInterval(function () {

            if(dataset[0]>=0&&dataset[0]<100&&dataset[1]>=0&&dataset[1]<=100){
                dataset[0]++;
                dataset[1]--
            }
            _this.update(dataset);
        },interval);
    }

})(window);

/**
 * Created by wason on 2014/8/6.
 */
(function(arg){

    var self = arg;

    self.upiep = function(){
        //设置是圆和圆环展示，true:圆,false圆环
        this.circle = true;

        //是否加图例 true:有图例 false:无图例
        this.isIcon = true;

        this.arcs = null;

        this.arc = null;

        //偏移量
        this.baroffset = 0;

        this.piestyle={
            "pieText":"prebarText"
        }

        this.color = d3.scale.ordinal().range(["green", "gray"]);

    };

    var UPP = self.upiep.prototype = new ucommon();

    UPP.init = function(options){

        if("undefined" !== typeof options){

            if("undefined" !== typeof options.color){
                this.color = d3.scale.ordinal().range(options.color);
            }

            if("undefined" !== typeof options.type) {
                this.type = options.type;
            }

            if("undefined" !== typeof options.barPadding) {
                this.barPadding = options.barPadding;
            }

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

            if("undefined" !== typeof options.icon) {
                if(typeof options.icon === "boolean"){
                    this.isIcon = options.icon;
                }
            }

            if("undefined" !== typeof options.circle) {
                if(typeof options.circle === "boolean"){
                    this.circle = options.circle;
                }
            }


        }else{
            options = {};
        }

    };

    UPP.setCircle = function(flag){
        if(typeof flag === "boolean"){
            this.circle = flag;
        }
    };

    UPP.setIcon = function (flag) {
        if(typeof flag === "boolean"){
            this.isIcon = flag;
        }
    };

    UPP.setScale = function(x){
        var outerRadius = Math.min(this.w, this.h)/2;
        if(typeof x === "boolean"){
            outerRadius = Math.min(this.w, this.h)/4 + this.barPadding;
        }
        var innerRadius = 0;
        if(!this.circle){
            innerRadius = Math.min(this.w, this.h)/4;
            //barPadding是饼图和画布四周的距离
            this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius - this.barPadding);
        }else{
            //barPadding是饼图和画布四周的距离
            this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius/2);
        }


    };

    /**
     * 为每个要绘制的扇形分组(g),把用于生成饼图的数据绑定到这些新元素，并把每个分组平移到图表中心
     * @returns {void|*}
     */
    UPP.createGroup = function(){
        var _this = this;


        this.pie = d3.layout.pie().sort(null).value(function(d){
            return d;
        });

        this.baroffset = 0;
        if(this.isIcon){
            this.baroffset = 20;
        }
        this.arcs = _this.render.selectAll("g.arc")
            .data(this.pie(this.dataset))
            .enter()
            .append("g").
        attr("class","arc").attr("transform","translate("+(this.w/2 - this.baroffset)+","+this.h/2+")");
    };

    /**
     * 创建path元素并把相关属性的值保存在d中，并设置颜色
     * @param arcs
     * @param arc
     */
    UPP.createPie = function(g){
        var _this = this;

           //自定义颜色
        //var color = d3.scale.ordinal().range(["green", "gray"]);

        g.each(function(d,i){
            var e = d3.select(this);
            var b = e.append("path");
            b.attr({
                "fill":_this.color(i),
                "d":_this.arc
            })
                .each(function(d) { this._current = d; });
        });

        this.createPreBar();

        if(_this.isIcon){
            _this.createLenGroup();
        }

    };

    UPP.createPreBar = function(){
        var _this = this;

        var gPce = _this.render.append("g").attr("transform","translate("+(_this.w/2)+","+(_this.h/2+10)+")");
        this.pce = gPce.append("text").text(this.dataset[0] + "%");
        this.pce.attr({
            "text-anchor":"middle"
        }).classed(_this.piestyle.pieText,true);

    };


    UPP.createLenGroup = function(){
        var _this = this;

        var g = _this.render.append("g").
            attr("transform","translate("+(((_this.w/2 - this.baroffset) + (_this.h/2 - _this.barPadding)) + 10)+","+(this.barPadding + 10)+")");

        var len = g.selectAll("g.len").data(this.dataset).enter().
            append("g").attr({
                "class":"len",
                "transform": function(d,i){return "translate(0," + (i*22) + ")"}

            });
        len.append("rect").attr("width",30).attr("height",20).attr("fill", function (d) {
            return _this.color(d.name);
        });
        len.append("text")
            .text(function(d,i){
            return d.name;
        })
            .attr({
              "x":32,
              "y": function (d,i) {
                  return i+11;
              },
              "font-size":"12px"
        });

        return g;
    };

    /**
     * 更新各个组
     * @param g
     */
    UPP.updatePie = function(g){
        var _this = this;

        g.each(function(d){
            var e = d3.select(this);
            var p = e.select("path");
            p.transition().duration(100).attrTween("d",function(a) {
                this._current = this._current || d;
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return _this.arc(i(t));
                };
            });

        });
    };

    UPP.updatePre = function(){
        var _this = this;
        _this.pce.text(_this.dataset[0] + "%");
    };

    /**
     * 绘制饼图
     */
    UPP.draw = function(options){
        this.init(options);
        this.setScale();
        this.createGroup();
        this.createPie(this.arcs);
        this.createTitle(this.title);
    };

    /**
     * 更新饼图，使用新的数据进行绑定
     * @param d 新传入的数据对象数组
     */
    UPP.update = function(d){
        this.dataset = d;
        this.setScale();
        this.arcs.data(this.pie(this.dataset));
        this.updatePie(this.arcs);
        this.updatePre();
    };

})(window);

/**
 * Created by wason on 2014/9/23.
 */
(function(arg){
    var self = arg;

    self.uarea = function(){

        //建立一个工具函数，来格式化时间
        //this.parseDate = d3.time.format("%d-%b-%y").parse;
        this.parseDate = d3.time.format("%b %Y").parse;

        this.color = ["green","steelblue"];

    };

    var UAB = self.uarea.prototype = new ucommon();

    UAB.init = function(options){

        if("undefined" !== typeof options){

            if("undefined" !== typeof options.color){
                this.color = options.color;
            }

            if("undefined" !== typeof options.title) {
                this.title = options.title;
                this.setTitle(this.title);
            }

            if("undefined" !== typeof options.titleColor) {
                this.titleColor = options.titleColor;
                this.setTitleColor(this.titleColor);
            }

            if("undefined" !== typeof options.themes) {
                this.setThemes(options.themes);
            }

            if("undefined" !== typeof options.type) {
                this.type = options.type;
            }

            if("undefined" !== typeof options.barPadding) {
                this.barPadding = options.barPadding;
            }

            if("undefined" !== typeof options.data) {
                this.dataset = options.data;
            }

            if("undefined" !== typeof options.size) {
                this.setSize(parseInt(options.size.split(",")[0]),parseInt(options.size.split(",")[1]));
            }

            if("undefined" !== typeof options.render) {
                this.createRender(options.render.split(",")[0],options.render.split(",")[1]);
            }

        }else{
            options = {};
        }

    };

    UAB.setScale = function(){
        var _this = this;

        this.margin = {top: 20, right: 20, bottom: 30, left: 50},
        this.width = this.w - this.margin.left - this.margin.right,
        this.height = this.h - this.margin.top - this.margin.bottom;

        this.x = d3.time.scale()
            .range([0, this.width]);

        this.y = d3.scale.linear()
            .range([this.height, 0]);

        var arr=[];
        for(var i = 0;i<this.dataset.length;i++){
            this.dataset[i].forEach(function(d){
                d.name = _this.parseDate(d.name);//读取date并转换为时间对象
                d.value = +d.value;
                arr.push(d.value);
            });
        }

            /*_this.dataset.forEach(function(d) {
                d.name = _this.parseDate(d.name);
                d.value = +d.value;
            });*/

        this.x.domain(d3.extent(_this.dataset[0], function(d) { return d.name; }));
        //this.y.domain([0, d3.max(_this.dataset, function(d) { return d.value; })]);
        this.y.domain([0, d3.max(arr)]);
    };

    UAB.createGroup = function(){
        var _this = this;

        var g = _this.render
            .attr("width", _this.w)
            .attr("height", _this.h)
            .append("g")
            .attr("transform", "translate(" + _this.margin.left + "," + _this.margin.top + ")");

        return g;
    };

    UAB.createArea = function(g){
        var _this = this;

        _this.area = d3.svg.area()
            .x(function(d) { return _this.x(d.name); })
            .y0(_this.height)
            .y1(function(d) { return _this.y(d.value); })
            .interpolate("basis");

        /*g.append("path")
         .datum(_this.dataset)
         .attr("class", "area")
         .attr("d", this.area);*/

        _this.dataset.forEach(function(d,i){
            g.append("path")
                .datum(d)
                .attr("class","area"+(i+1))
                .attr("d", _this.area)
                .attr("fill-opacity",0.5+i/10)
                .attr("fill",_this.color[i]);
        });

    };

    UAB.createAixs = function(g){
        var _this = this;

        this.xAxis = d3.svg.axis()
            .scale(_this.x)
            .orient("bottom");

        this.yAxis = d3.svg.axis()
            .scale(_this.y)
            .orient("left");

        var xThemes = "x axis";
        if(this.themes){
            xThemes += "_" + this.themes;
        }

        var yaxis = "y axis";
        if(this.themes){
            yaxis += "_" + this.themes;
        }

        g.append("g")
            .attr("class", xThemes)
            .attr("transform", "translate(0," + (_this.height) + ")")
            .call(this.xAxis);

        g.append("g")
            .attr("class", yaxis)
            .call(this.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    };

    UAB.updateArea = function(){
        var _this = this;

        /*d3.select("path.area")
            .datum(_this.dataset).transition()
            .duration(500).attr("d",_this.area);*/

        /*_this.dataset.forEach(function(d,i){
            d3.select("path.area")
                .datum(d).transition()
                .duration(500).attr("d",_this.area);

        });*/

        var yaxis = ".y.axis";
        if(this.themes){
            yaxis += "_" + this.themes;
        }

        var arr1 = [];

        _this.dataset.forEach(function(d,i){
            d3.select("path.area" + (i+1))
                .datum(d).transition()
                .duration(500).attr("d",_this.area);
            _this.dataset[i].forEach(function(d){
                arr1.push(d.value);
            });
        });

        //_this.y.domain([0, d3.max(_this.dataset, function(d) { return d.value; })]);
        _this.y.domain([0, d3.max(arr1)]);
        _this.render.select(yaxis).call(_this.yAxis);

    };

    UAB.draw = function(options){
        this.init(options);
        this.setScale();
        this.createTitle(this.title);
        this.g = this.createGroup();
        this.createArea(this.g);
        this.createAixs(this.g);
    };

    UAB.update = function(d){
        this.dataset = d;
        this.updateArea();
    };

})(window)
