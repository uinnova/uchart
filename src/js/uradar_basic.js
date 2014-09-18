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
            ExtraWidthY: 100,
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

        this.cfg.maxValue = Math.max(this.cfg.maxValue, d3.max(this.dataset, function(i){return d3.max(i.value.map(function(o){return o.value;}))}));
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
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (_this.w/2 - levelFactor) + ", " + (_this.h/2 - levelFactor) + ")");
        }
    }

    //每层圆形的标值 10% 20% 30%。。。
    URB.showCirText = function(){
        var _this = this;
        for(var j=0; j < _this.cfg.levels; j++){
            var levelFactor = _this.cfg.factor * _this.radius*((j+1)/_this.cfg.levels);
            _this.g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function(d){return levelFactor*(1- _this.cfg.factor*Math.sin(0));})
                .attr("y", function(d){return levelFactor*(1- _this.cfg.factor*Math.cos(0));})
                .attr("class", "cirtext")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (_this.w/2-levelFactor + _this.cfg.ToRight)
                    + ", " + (_this.h/2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text(_this.Format((j+1) * _this.cfg.maxValue/_this.cfg.levels));
        }
    };

    URB.createAixs = function(){
        var _this = this;
        var axis = _this.g.selectAll(".axis")
            .data(_this.allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        //画出从圆心到最外边的每一段线
        axis.append("line")
            .attr("x1", _this.w/2)
            .attr("y1", _this.h/2)
            .attr("x2", function(d, i){return _this.w/2*(1 - _this.cfg.factor*Math.sin(i * _this.cfg.radians/_this.total));})
            .attr("y2", function(d, i){return _this.h/2*(1 - _this.cfg.factor*Math.cos(i*_this.cfg.radians/_this.total));})
            .attr("class", "line")
            .style("stroke", "grey")
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

        var svg = _this.render
            .append('svg')
            .attr("width", _this.w+300)
            .attr("height", _this.h);

        var legend = svg.append("g")
                .attr("class", "legend")
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
            .style("fill", function(d, i){ return _this.color(i);});

    //Create text next to squares
        legend.selectAll('text')
            .data(_this.legendOptions)
            .enter()
            .append("text")
            .attr("x", _this.w - 52)
            .attr("y", function(d, i){ return i * 20 + 9;})
            .attr("font-size", "11px")
            .attr("fill", "#737373")
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

        var cirtext = _this.g.selectAll('.cirtext');
        cirtext.each(function(d,i){
            d3.select(this).text(_this.Format((i+1) * _this.cfg.maxValue/_this.cfg.levels));
        });
    };

    URB.update = function(options,data){
        this.dataset = data;
        this.init(options);
        this.updataText();
        this.updateRader();
        //this.draw(options);
    };

})(window);