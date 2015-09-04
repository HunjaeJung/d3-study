
Template.Zoompan.rendered = function(){
    var width = 640,
        height = 480,
        padding = 50;

    var zoom = d3.behavior.zoom()
    .scaleExtent([1,10])
    .on("zoom", zoomed);

    var svg = d3.select("#zoompan-wrapper")
    .append('svg')
    .attr('width', width+padding*2)
    .attr('height', height+padding*2)
    .call(zoom);

    var viz = svg.append('g')
    .attr('id','viz')
    .attr('transform','translate('+padding+','+padding+')');

    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(8);
    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(20);

    var parseTime = d3.time.format("%Y%m%d");

    d3.csv('climate_data_truncated.csv', function(data){
        var xDomain = d3.extent(data, function(ele){
            var time = parseTime.parse(ele.DATE);
            return time;
        });

        var yDomain = d3.extent(data, function(ele){
            return parseInt(ele.TMAX);
        });

        xScale.domain(xDomain);
        yScale.domain(yDomain);

        viz.append('g')
        .attr('transform', 'translate(0,'+height+')')
        .call(xAxis);

        viz.append('g')
        .call(yAxis);

        var dots = viz.selectAll('g.dots')
        .data(data)
        .enter()
        .append('g')
        .attr('class','dots');

        dots.attr('transform', function(d){
            date = parseTime.parse(d.DATE);
            x = xScale(date);
            y = yScale(d.TMAX);
            return 'translate('+x+','+y+')';
        });

        dots.append('circle')
        .attr('r','5');
    });

    function zoomed(){
        // Zoom event is occured!
        viz.attr("transform", "translate("+ d3.event.translate + ")" + "scale("+d3.event.scale+")");
    }

}

