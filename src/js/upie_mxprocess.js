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

    var UPMXP = self.upiemxp.prototype = new UCHART.ucommon();


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
            "font-size":14,
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
    UPMXP.draw = function(){
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

    UPMXP.interValcreate = function (i,ciid) {
        var interval = 100;
        if(i != "undefined" && typeof i === "number"){
            interval = i;
        }
        var _this = this;
        var dataset = this.dataset = [0,100];
        this.draw();

        //update
        setInterval(function () {

            if(dataset[0]>=0&&dataset[0]<100&&dataset[1]>=0&&dataset[1]<=100){
                dataset[0]++;
                dataset[1]--
            }
            _this.update(dataset);
        },interval);
    }

})(portalSpace.reg("UCHART"));
