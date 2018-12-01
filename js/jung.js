var svgJung = d3.select('#binaryMaps_maps');

var geojson;


queue()
    .defer(d3.json, 'data/TOWN.geo.json')
    .defer(d3.json, 'data/rate_5yr_odc.json')
    .await(visualize);

var widthJung = 525,
    heightJung = 200;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var projectionJung = d3.geoConicConformal()
    .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41])
    .scale([4900])
    .translate([370, 203]);


var $maps_sub = d3.select("#carte").append("svg")
    .attr("width", widthJung)
    .attr("height", heightJung-200);

var f = d3.format(".1f");

var pathJung = d3.geoPath().projection(projectionJung);
var palette = d3.scaleThreshold()
    .domain([-0.1, 0.1, 2.1, 6.1, 17.1, Infinity])
    .range(["DBE4E6", "#AFC3C8", "#7A9AA3", "#59737A", "#465E66"]);


function visualize(error, states, data) {


    data.data.forEach(function(data, i) {
        var wrapper = svgJung.append('div').attr('class', 'map-wrapper').append('div');

        createMassVisualization(wrapper, states, data);
    });
}


function createMassVisualization(wrapper, geo, data) {

    wrapper.append('span')
        .text("")
        .attr('class', 'selection-label');

    var $maps_sub = wrapper
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + widthJung + " " + heightJung)

        .style('padding-top', "0px")
        .classed("svg-content-responsive", true);



    $maps_sub.selectAll('path')
        .data(geo.features)
        .enter()
        .append('path')
        .attr('d', pathJung)
        .style("stroke", "lightgray")
        .style("stroke-width", "0.0px")
        .style('fill', function(d, i) {
            var value = data.values[d.properties.TOWN];
            return palette(value);
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .8);
            div.html(d.properties.TOWN + `<br>` + 'Death Increase: ' + f(data.values[d.properties.TOWN]) + ' %')
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

var opChgScale = d3.scaleThreshold().domain([0.1, 2.1, 6.1, 17.1, Infinity])
    .range(["DBE4E6", "#AFC3C8", "#7A9AA3", "#59737A", "#465E66"]);
opChgScale.domainStrings = function() {
    return (['0', '0-2.1%', '2.1-6.1%', '6.1-17.1%', '> 17.1%']);
};

generateLegend_map_sub(opChgScale, 'binaryMaps_legend', 'Rate per 100,000 People');

function generateLegend_map_sub(scale, szDivId, szCaption) {

    var legendHeight = 50,
        legendWidth = '50%';

    var $maps_sub_svg = d3.select('#' + szDivId).append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    var $maps_sub_legends = $maps_sub_svg.append("g");

    // Create data array.
    var legendData = [];
    legendData.push({
        d: -9999,
        r: '#f1f1f1',
        s: 'N/A'
    });
    var i;
    for (i = 0; i < scale.domain().length; i++) {
        legendData.push({
            d: scale.domain()[i],
            r: scale.range()[i],
            s: scale.domainStrings()[i]
        });
    }


    var unitWidth = 100 / legendData.length;

    $maps_sub_legends.selectAll("rect")
        .data(legendData)
        .enter().append("rect")
        .attr("height", legendHeight / 3)
        .attr("width", function(d, i) {
            return unitWidth + '%';
        })
        .attr("x", function(d, i) {
            return (i * unitWidth) + '%';
        })
        .attr("y", 10)
        .style("stroke", "black")
        .style("stroke-width", "0.25px")
        .style("fill", function(d, i) {
            return d.r;
        });

    $maps_sub_legends.selectAll("text")
        .data(legendData)
        .enter().append("text")
        .attr('text-anchor', 'middle')
        .attr("font-size", "12px")
        .attr("x", function(d, i) {
            return (i * unitWidth) + (unitWidth / 2) + '%';
        })
        .attr("y", 40)
        .text(function(d, i) {
            return d.s;
        });

    $maps_sub_legends.append("text")
        .attr("class", "vis-caption")
        .attr("y", 8)
        .attr("font-size", "10px")
        .text(szCaption);
}



$('.js-toggle-binary-map').click(function() {
    var date = $(this).data('date');
    $('#binaryMaps').attr('data-active-date', date);
    $('.js-toggle-binary-map').removeClass('active');
    $(this).addClass('active');
});
