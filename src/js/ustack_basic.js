/**
 * Created by wason on 2014/8/13.
 */
(function(arg){
    var self = arg;

    self.ustack = function(){
        //上图位置
        this.margin = {top: 10, right: 10, bottom: 100, left: 40};

        //下图位置
        this.margin2 = {top: 430, right: 10, bottom: 20, left: 40};


        //建立一个工具函数，来格式化时间
        this.parseDate = d3.time.format("%b %Y").parse;

    };

    var USB = self.ustack.prototype = new ucommon();

    USB.setScale = function(){
        var _this = this;

        //总宽
        this.width  = this.w - this.margin.left - this.margin.right;

        //总高
        this.height = this.h - this.margin.top - this.margin.bottom;

        //下图宽度
        this.height2 = this.h - this.margin2.top - this.margin2.bottom;

        //建立数据容器  把数值转为时间标度再转为宽度
        this.x = d3.time.scale().range([0, this.w]);
        this.x2 = d3.time.scale().range([0, this.width]);
        //直线标度
        this.y = d3.scale.linear().range([this.h, 0]);
        this.y2 = d3.scale.linear().range([this.height2-this.margin.top, 0]);

        var arr1=[];
        for(var i = 0;i<this.dataset.length;i++){
            this.dataset[i].forEach(function(d){
                d.name = _this.parseDate(d.name);//读取date并转换为时间对象
                d.value = +d.value;
                arr1.push(d.value);
            });
        }

        /*this.dataset.data1.forEach(function(d) {//遍历数据
            d.name = _this.parseDate(d.name);//读取date并转换为时间对象
            d.value = +d.value;
        });
        this.dataset.data2.forEach(function(d) {//遍历数据
            d.name = _this.parseDate(d.name);//读取date并转换为时间对象
            d.value = +d.value;
        });*/

        this.x.domain(d3.extent(this.dataset[0].map(function(d) { return d.name; })));//利用domain方法给数据容器匹配上数据
        this.y.domain([0, d3.max(arr1)]);
        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

    };

    USB.createAxis = function(){
        //制作上图的X轴
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");

        //制作下图的X轴
        this.xAxis2 = d3.svg.axis().scale(this.x2).orient("bottom");

        //制作上图的Y轴
        this.yAxis = d3.svg.axis().scale(this.y).orient("left");

        this.xR = this.render.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+this.margin.left+"," + (this.h-this.margin.top) + ")")
            .call(this.xAxis);

        this.yR = this.render.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+this.margin.left+","+(-this.margin.top)+")")
            .call(this.yAxis);

    };

    USB.createBrush = function(){
        var _this = this;

        _this.brush = d3.svg.brush().x(_this.x2).on("brush",function(){
            _this.x.domain(_this.brush.empty() ? _this.x2.domain() : _this.brush.extent());
            //利用domain方法绑定数据。domain方法的讲解可以参考第一篇教程
            //这里是一个三元操作符。当brush.empty(选定为空)时，x与x2的数值范围是一样的，当有brush时，x绑定brush对象刷到的区域所代表的数据范围。

            //利用新的数据更新上面图表
            _this.focus.select("path").attr("d", _this.area);

            //这里注意，上面图表的数据范围已经变化了，但坐标轴没变化，我们利用call方法来重新绑定一下
            _this.focus.select(".x.axis").call(_this.xAxis);
        });
    };

    USB.createAreaGroup = function(){
      var _this = this;
        //生成上图area 注意这个area是一个path，要利用attr(d)加载进去
        this.area = d3.svg.area()
            .x(function(d) { return _this.x(d.name); })
            .y0(_this.height)
            .y1(function(d) { return _this.y(d.value); })
            .interpolate("basis");

        this.stacksvg = this.render.append("g")//主容器
            .attr("width", _this.width)
            .attr("height", _this.height);
    };


    USB.createBurshAreaGroup = function(){
        var _this = this;

        //生成下图area
        this.area2 = d3.svg.area()
            .x(function(d) { return _this.x2(d.name); })
            .y0(_this.height2)
            .y1(function(d) { return _this.y2(d.value); })
            .interpolate("basis");

        _this.context = _this.stacksvg.append("g")//制作下图容器
            .attr("transform", "translate(" + _this.margin2.left + "," + (-_this.margin2.top) + ")");
    };

    USB.createArea = function(){
        var _this = this;

        _this.focus = this.stacksvg.append("g")//制作上图容器
            .attr("transform", "translate(" + _this.margin.left + "," +(0) + ")");

        _this.stacksvg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", _this.width)
            .attr("height", _this.height);

        _this.dataset.forEach(function(d,i){
            //添加上面图的图表
            _this.focus.append("path")
                .datum(d)
                .attr("clip-path", "url(#clip)")//在这里增加一个裁剪层
                .attr("class","area"+(i+1))
                .attr("d", _this.area)
                .attr("fill-opacity",0.5+i/10);
        });

            /*//添加上面图的图表
         _this.focus.append("path")
         .datum(data2)
         .attr("clip-path", "url(#clip)")//在这里增加一个裁剪层
         .attr("class","area")
         .attr("d", _this.area)
         .attr("fill-opacity",0.6);

         _this.focus.append("path")
         .attr("clip-path", "url(#clip)")
         .datum(data1)
         .attr("class","area1")
         .attr("d", _this.area)
         .attr("fill-opacity",0.5);*/

    };

    USB.createBurshArea = function(){
        var _this = this;

        _this.dataset.forEach(function(d){
            //添加下面图的图表
            _this.context.append("path")
                .datum(d)
                .attr("d", _this.area2);
        });

        //添加下面图的X坐标轴
        _this.context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _this.height2 + ")")
            .call(_this.xAxis2);

        _this.context.append("g").attr("class","x brush").call(_this.brush)
            .selectAll("rect").attr("y",-6).attr("height",_this.height2 + 7);
    };

    USB.updateArea = function(){
        var _this = this;

        var arr = [];

        //_this.x.domain(_this.brush.empty() ? _this.x2.domain() : _this.brush.extent());
        _this.dataset.forEach(function(d,i){
            _this.focus.select("path.area" + (i+1))
                .datum(d).transition()
                .duration(500).attr("d",_this.area);
            //_this.focus.select(".y.axis").call(_this.y.domain);
            _this.dataset[i].forEach(function(d){
                arr.push(d.value);
            });
        });
        _this.y.domain([0,d3.max(arr)]);
        _this.render.select(".y.axis").call(_this.yAxis);
        //这里注意，上面图表的数据范围已经变化了，但坐标轴没变化，我们利用call方法来重新绑定一下
    };


    USB.draw = function(){
        this.createAxis();
        this.createAreaGroup();
        this.createArea();
        //this.createBrush();
       // this.createBurshAreaGroup();
       // this.createBurshArea();

    }

    USB.update = function(d){
        this.dataset = d;
        this.updateArea();

    }

})(window)
