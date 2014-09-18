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

        var pt = 0;
        this.dataset.forEach(function (d) {
            pt += d.value;
        });
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
        this.iconGroup.selectAll(g.len).data(this.dataset);
        var te = this.iconGroup.selectAll("text");
        te.each(function () {
            var e = d3.select(this);
            e.text(function(d){
                return d.name + " " + Math.floor(d.value/pt*100) + "%";
            });
        })
    };

    /**
     * 绘制饼图
     */
    UPB.draw = function(){
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
