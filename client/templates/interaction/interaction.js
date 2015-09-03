
Template.Interaction.rendered = function(){
    var width = 640,
        height = 480,
        padding = 50;

    var svg = d3.select("#int-wrapper")
    .append("svg")
    .attr('width', width+padding*2)
    .attr('height',height+padding*2)
    .attr('id', 'int-svg')
    .append('g')
    .attr('transform', 'translate(' + padding + ',' + padding + ')');

    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var rScale = d3.scale.linear().range([5, 50]);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(20); // -1
    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(20);   // -1

    var parseTime = d3.time.format("%Y%m%d");
    var defaultCircleRadius = 2;

    var solveForR = function(TMAX) {
        Area = Math.abs(TMAX);
        r = Math.sqrt(Area / Math.PI);
        return r;
    };

    d3.csv("climate_data_truncated.csv", function(err, data){
        var xDomain = d3.extent(data, function(d){
            var date = parseTime.parse(d.DATE);
            return date;
        });

        var yDomain = d3.extent(data, function(d){
            return parseInt(d.TMAX);
        });

        var rDomain = d3.extent(data, function(d){
            return solveForR(parseInt(d.TMAX));
        });

        xScale.domain(xDomain);
        yScale.domain(yDomain);
        rScale.domain(rDomain);

        svg.append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,'+height+')')
        .selectAll('text')
        .style('font-size',10)
        .style('text-anchor','end')
        .attr('transform', 'rotate(-65)')
        .attr('dx','-10')
        .attr('dy','-10');

        svg.append('g')
        .call(yAxis);

        var dots = svg.selectAll('g.dots')
        .data(data)
        .enter()
        .append('g')
        .attr('class','dots');

        dots.attr('transform', function(d){
            var date = parseTime.parse(d.DATE);
            var x = xScale(date);
            var y = yScale(d.TMAX);
            return 'translate('+x+','+y+')';
        });

        dots.append('circle').attr('r', defaultCircleRadius);
        dots.append('text')
        .text(function(d){
            return d.TMAX;
        })
        .style('stroke','#00a0c6')
        .style('display','none')
        .attr('dx','-10')
        .attr('dy','-20');

        dots.on('mouseenter', function(d, i){
            dot =  d3.select(this);
            dot.select('text')
            .style('display','block')

            dot.select('circle')
            .attr('r',rScale(solveForR(parseInt(d.TMAX))));
        });

        dots.on('mouseleave', function(d, i){
            dot = d3.select(this);
            dot.select('text')
            .style('display','none');

            dot.select('circle')
            .attr('r', defaultCircleRadius);
        });
    });


}
