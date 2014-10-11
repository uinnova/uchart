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
