/**
 * Created by wason on 2014/8/13.
 */
(function(arg){
    var self = arg;

    self.ustack = function(){
        //上图位置
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};

        //建立一个工具函数，来格式化时间
        this.parseDate = d3.time.format("%b %Y").parse;

        this.color = ["green","steelblue"];

    };

    var USB = self.ustack.prototype = new ucommon();

    USB.init = function(options){

        if("undefined" !== typeof options){

            if("undefined" !== typeof options.color){
                this.color = options.color;
            }

        }else{
            options = {};
        }

    };

    USB.setScale = function(){
        var _this = this;

        //总宽
        this.width  = this.w - this.margin.left - this.margin.right;

        //总高
        this.height = this.h - this.margin.top - this.margin.bottom;

        //建立数据容器  把数值转为时间标度再转为宽度
        this.x = d3.time.scale().range([0, this.w]);
       // this.x2 = d3.time.scale().range([0, this.width]);
        //直线标度
        this.y = d3.scale.linear().range([this.h, 0]);
       // this.y2 = d3.scale.linear().range([this.height2-this.margin.top, 0]);

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
        //this.x2.domain(this.x.domain());
        //this.y2.domain(this.y.domain());

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

    USB.createAreaGroup = function(){
      var _this = this;
        //生成上图area 注意这个area是一个path，要利用attr(d)加载进去
        this.area = d3.svg.area()
            .x(function(d) { return _this.x(d.name); })
            .y0(_this.height)
            .y1(function(d) { return _this.y(d.value); })
            .interpolate("basis");
    };

    USB.createArea = function(){
        var _this = this;

        _this.focus = this.render.append("g")//制作上图容器
            .attr("transform", "translate(" + _this.margin.left + "," +_this.margin.top + ")");

        _this.dataset.forEach(function(d,i){
            //添加上面图的图表
            _this.focus.append("path")
                .datum(d)
                .attr("clip-path", "url(#clip)")//在这里增加一个裁剪层
                .attr("class","area"+(i+1))
                .attr("d", _this.area)
                .attr("fill-opacity",0.5+i/10)
                .attr("fill",_this.color[i]);
        });
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

    USB.draw = function(options){
        this.init(options);
        this.createAxis();
        this.createAreaGroup();
        this.createArea();
    };

    USB.update = function(d){
        this.dataset = d;
        this.updateArea();
    };

})(window)
