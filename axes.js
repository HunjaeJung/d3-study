Template.Axes.helpers({
});

Template.Axes.events({
});

Template.Axes.rendered = function(){
    var width = 640
        ,height = 480
        ,padding = 50;

    // Create svg element and g element
    var viz = d3.select("#viz-wrapper")
    .append('svg')
    .attr('width', width+padding*2)
    .attr('height', height+padding*2)
    .append('g')
    .attr('id','viz')
    .attr('transform',
          'translate('+padding+','+padding+')');

    // for x Axis (date time format)
    var parseTime = d3.time.format("%Y%m%d");
    // parseTime.parse("20150901") // 01 Tue Sep ... (It returns javascript date object)

    // Set Scale and Axis
    var xScale = d3.time.scale().range([0, width]); // NEED TO USE d3.time.scale().range(..) SINCE x-axis IS TIMELINE. !IMPORTANT
    var yScale = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(20);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(20);

    // Take data!
    d3.csv('climate_data_truncated.csv', function(err, data){
        // Take x domain
        var xDomain = d3.extent(data, function(ele){
            var date = parseTime.parse(ele.DATE);
            return date;
        });

        // Take y domain
        var yDomain = d3.extent(data, function(ele){
            return parseInt(ele.TMAX);
        });

        // Apply domain to scale (axis)
        xScale.domain(xDomain);
        yScale.domain(yDomain);


        // Create Axes
        viz.append('g')
        .attr('class', 'x axis')
        .attr('transform','translate(0,'+height+')')
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(-65)')
        .style('text-anchor','end')
        .style('font-size','10px')
        .attr('dx','-10px')
        .attr('dy','-10px');

        viz.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

        // Create g elements for data
        var dots = viz.selectAll('g.dots')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'dots')
        .attr('transform', function(d){
            date = parseTime.parse(d.DATE);
            x = xScale(date);
            y = yScale(d.TMAX);
            return 'translate('+x+','+y+')';
        });

        dots.append('circle')
        .attr('r', '5');
        dots.append('text')
        .text(function(d){
            return d.y;
        });
    });
}
