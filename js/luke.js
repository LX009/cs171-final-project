



// Set up svgLuke
var marginLuke = {top: 160, right: 50, bottom: 50, left: 100};

var widthLuke = 800 - marginLuke.left - marginLuke.right,
    heightLuke = 440 - marginLuke.top - marginLuke.bottom;

var svgLuke = d3.select("#symbol-map-area").append("svg")
    .attr("width", widthLuke + marginLuke.left + marginLuke.right)
    .attr("height", heightLuke + marginLuke.top + marginLuke.bottom);

var projectionLuke = d3.geoAlbersUsa()
    .translate([400, heightLuke])
    .scale(800);

var pathLuke = d3.geoPath()
    .projection(projectionLuke);

var colorLuke = d3.scaleQuantize()
    .range(["#deebf7",
        "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

var circleRadius = d3.scaleLinear()
    .range([10, 30]);

/* main JS file */

var allDataLuke;
// us-10m dataset from https://github.com/d3/d3-geo/blob/master/test/data/us-10m.json
var usaLuke;

d3.select("#binary").on("change", createVisualization);

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
        d.DeathsPerPop = d.Deaths / d.Population;

        data3.forEach(function(e) {
            if (d.Abbrev == e.Abbrev) {
                // Match state ID with state data
                d.ID = e.ID;
            }
        })

    });

    allDataLuke = data1;
    allDataLuke.sort(function(a, b){
        return b.Deaths - a.Deaths;
    });

    var temp = topojson.feature(data2, data2.objects.states).features;

    temp.forEach(function(d){
        allDataLuke.forEach(function (e) {
           if (d.id == e.ID) {
               d.Deaths = e.Deaths;
               d.Population = e.Population;
               d.DeathsPerPop = d.Deaths / d.Population;
           }
        });
    });

    usaLuke = temp;

    // use data2 to map US
    createVisualization();
}

function createVisualization() {

    var val = d3.select("#binary").property("value");

    colorLuke.domain([
        d3.min(usaLuke, function(d) { return d[val]; }), d3.max(usaLuke, function(d) { return d[val]; })
    ]);

    circleRadius.domain([
        d3.min(usaLuke, function(d) { return d[val]; }), d3.max(usaLuke, function(d) { return d[val]; })
    ]);

    if (val == "Deaths") {
        circleRadius.range([5, 20]);
    } else if (val == "Population"){
        circleRadius.range([5, 20]);
    } else {
        circleRadius.range([5, 20]);
    }

    var state = svgLuke.selectAll("path")
        .data(usaLuke)
        .enter()
        .append("path")
        .attr("d", pathLuke)
        .attr("class", "state");

    // Tooltip, as seen on https://github.com/VACLab/d3-tip
    var tool_tipLuke = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return "<b>" + d.State + "</b><br/><br/>" + "Opioid Related Deaths: " + d.Deaths + "<br/><br/>" + "Population: " + d.Population + "<br/><br/>" + "Deaths per capita: " + d3.format(".4r")(d.DeathsPerPop);
        });
    svgLuke.call(tool_tipLuke);


    var circle = svgLuke.selectAll(".state-value")
        .data(allDataLuke);

    circle.enter()
        .append("circle")
        .attr("class", "state-value")
        .merge(circle)
        // .on("mouseover", tool_tipLuke.show)
        .on("mouseover", function(d) {
            tool_tipLuke.show(d);
            d3.select(this)
            .style("fill", function () {
                if (val == "DeathsPerPop") {
                    return "#B74040";
                } else if (val == "Population") {
                    return "#3A79D1";
                } else {
                    return "#85B1BC";
                }
            });
        })
        // .on("mouseout", tool_tipLuke.hide)
        .on("mouseout", function(d) {
            tool_tipLuke.hide(d);
            d3.select(this)
            .style("fill", function () {
                if (val == "DeathsPerPop") {
                    return "#842E2E";
                } else if (val == "Population") {
                    return "#2D5C9E";
                } else {
                    return "#618189";
                }
            })
        })
        .transition()
        .duration(600)
        .style("opacity", 0.4)
        .attr("r", function(d) {
            return circleRadius(d[val]);
        })
        .style("fill", function () {
            if (val == "DeathsPerPop") {
                return "#842E2E";
            } else if (val == "Population") {
                return "#2D5C9E";
            } else {
                return "#618189";
            }
        })
        .attr("stroke", function () {
            if (val == "DeathsPerPop") {
                return "#511C1C";
            } else if (val == "Population") {
                return "#1D3E6B";
            } else {
                return "#3D5156";
            }
        })
        .attr("transform", function(d) {
            return "translate(" + projectionLuke([d.long, d.lat]) + ")";
        })
        .on("end", function() {
            d3.select(this).transition().duration(200).style("opacity", 0.8); // Fade in
        });

    circle.exit().remove();

    // Legend
    svgLuke.append("circle")
        .attr("fill", function () {
            if (val == "DeathsPerPop") {
                return "#842E2E";
            } else if (val == "Population") {
                return "#2D5C9E";
            } else {
                return "#618189";
            }
        })
        .attr("stroke", function () {
            if (val == "DeathsPerPop") {
                return "#511C1C";
            } else if (val == "Population") {
                return "#1D3E6B";
            } else {
                return "#3D5156";
            }
        })
        .style("opacity", 0.8)
        .attr("r", 15)
        .attr("cx", 370 - 10)
        .attr("cy", 30)
        .attr("class", "legend-marker");

    svgLuke.append("text")
        .attr("class", "legend-text")
        .attr("text-anchor", "start")
        .attr("x", 370 + 10)
        .attr("y", 30 + 5);

    svgLuke.selectAll(".legend-text")
        .text(function() {
            if (val == "Deaths") {
                return d3.format(".2r")(circleRadius.invert(15)) + " deaths";
            } else if (val == "Population"){
                return d3.format(".2s")(circleRadius.invert(15)) + " people";
            } else {
                return d3.format(".4r")(circleRadius.invert(15)) + " deaths per capita";
            }
        });

}
