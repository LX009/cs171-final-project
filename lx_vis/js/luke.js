



// Set up SVG
var margin = {top: 160, right: 50, bottom: 50, left: 100};

var width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleQuantize()
    .range(["#deebf7",
        "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

var circleRadius = d3.scaleLinear()
    .range([10, 30]);

/* main JS file */

var allData;
// us-10m dataset from https://github.com/d3/d3-geo/blob/master/test/data/us-10m.json
var usa;

d3.select("#select-box").on("change", createVisualization);

queue()
    .defer(d3.csv, "data/overdoses.csv")
    .defer(d3.json, "data/us-10m.json")
    .defer(d3.csv, "data/convert.csv")
    .defer(d3.csv, "data/statelatlong.csv")
    .await(manageData);

// d3.select("#select-box").on("change", updateVisualization);

function manageData(error, data1, data2, data3, data4) {

    data3.forEach(function(d) {
        d.ID = +d.ID;
    });

    data1.forEach(function(d) {
       data4.forEach(function(e) {
           if (d.Abbrev == e.State) {
               d.lat = +e.Latitude;
               d.long = +e.Longitude;
           }
       })
    });

    // Reformat data1 per state
    data1.forEach(function(d){
        d.Population = +d.Population.replace(/,/g, '');
        d.Deaths = +d.Deaths.replace(/,/g, '');

        data3.forEach(function(e) {
            if (d.Abbrev == e.Abbrev) {
                // Match state ID with state data
                d.ID = e.ID;
            }
        })

    });

    allData = data1;
    allData.sort(function(a, b){
        return b.Deaths - a.Deaths;
    });
    
    var temp = topojson.feature(data2, data2.objects.states).features;

    temp.forEach(function(d){
        allData.forEach(function (e) {
           if (d.id == e.ID) {
               d.Deaths = e.Deaths;
               d.Population = e.Population;
           }
        });
    });

    usa = temp;

    // use data2 to map US
    // console.log(usa);

    createVisualization();
}

function createVisualization() {

    var val = d3.select("#select-box").property("value");

    color.domain([
        d3.min(usa, function(d) { return d[val]; }), d3.max(usa, function(d) { return d[val]; })
    ]);

    circleRadius.domain([
        d3.min(allData, function(d) { return d[val]; }), d3.max(allData, function(d) { return d[val]; })
    ]);

    if (val == "Deaths") {
        circleRadius.range([10, 30]);
    } else {
        circleRadius.range([5, 45]);
    }

    var state = svg.selectAll("path")
        .data(usa)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state");
        // .attr("fill", function (d) {
        //     if (isNaN(d.Deaths)) {
        //         return "#f7fbff";
        //     } else {
        //         return color(d.Deaths);
        //     }
        // });

    // Tooltip, as seen on https://github.com/VACLab/d3-tip
    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return "<b>" + d.State + "</b><br/><br/>" + "Opioid Related Deaths: " + d.Deaths + "<br/><br/>" + "Population: " + d.Population;
        });
    svg.call(tool_tip);


    var circle = svg.selectAll(".state-value")
        .data(allData);

    circle.enter()
        .append("circle")
        .attr("class", "state-value")
        .merge(circle)
        .on("mouseover", tool_tip.show)
        .on("mouseout", tool_tip.hide)
        .transition()
        .duration(600)
        .style("opacity", 0.4)
        .attr("r", function(d) {
            return circleRadius(d[val]);
        })

        // .append("rect")
        // .attr("class", "state-value")
        // .merge(circle)
        // .transition()
        // .duration(600)
        // .style("opacity", 0.4)
        // .attr("height", function(d) {
        //     return circleRadius(d[val]);
        // })
        // .attr("width", function(d) {
        //     return circleRadius(d[val]);
        // })

        .attr("fill", "#651FFF")
        .attr("stroke", "#311B92")
        .attr("transform", function(d) {
            return "translate(" + projection([d.long, d.lat]) + ")";
        })
        .on("end", function() {
            d3.select(this).transition().duration(200).style("opacity", 0.8); // Fade in
        });

    circle.exit().remove();

    // Legend
    svg.append("circle")
        .attr("fill", "#651FFF")
        .attr("stroke", "#311B92")
        .style("opacity", 0.8)
        .attr("r", 15)
        .attr("cx", (width / 2) - 25)
        .attr("cy", 120)
        .attr("class", "legend-marker");

    svg.append("text")
        .attr("class", "legend-text")
        .attr("text-anchor", "start")
        .attr("x", (width / 2) + 4)
        .attr("y", 120 + 5);

    svg.selectAll(".legend-text")
        .text(function() {
            if (val == "Deaths") {
                return d3.format(".2r")(circleRadius.invert(15)) + " deaths";
            } else {
                return d3.format(".2s")(circleRadius.invert(15)) + " people";
            }
        });

}