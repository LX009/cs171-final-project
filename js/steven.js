/* main JS file */

// LINE CHART VARIABLES AND IMPLEMENTATION

// set the dimensions and margins of the graph
var line_chart_margin = {top: 100, right: 20, bottom: 30, left: 50},
    line_chart_width = $("#line").width() - line_chart_margin.left - line_chart_margin.right,
    line_chart_height = 400 - line_chart_margin.top - line_chart_margin.bottom;

// parse the date / time
var line_chart_parseTime = d3.timeParse("%Y");

// set the ranges for scales
var line_chart_x = d3.scaleTime()
  .range([0, line_chart_width]);

var line_chart_y = d3.scaleLinear()
  .range([line_chart_height, 0]);

var line_legend_scale = d3.scaleOrdinal()
  .domain(["Prescription", "Heroin", "Synthetic Opioids"])
  .range(["#3A79D1", "#B74040", "#FFC46D"]);

// define the 1st line
var line_chart_prescription = d3.line()
    .x(function(d) { return line_chart_x(d.year); })
    .y(function(d) { return line_chart_y(d.prescription); });

// define the 2nd line
var line_chart_heroin = d3.line()
    .x(function(d) { return line_chart_x(d.year); })
    .y(function(d) { return line_chart_y(d.heroin); });

// define the 3rd line
var line_chart_synthetic = d3.line()
    .x(function(d) { return line_chart_x(d.year); })
    .y(function(d) { return line_chart_y(d.synthetic); });

var line_chart_legend = d3.legendColor()
  .scale(line_legend_scale)

// append the svg object to the div
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var line_chart_svg = d3.select("#line").append("svg")
    .attr("width", line_chart_width + line_chart_margin.left + line_chart_margin.right)
    .attr("height", line_chart_height + line_chart_margin.top + line_chart_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + line_chart_margin.left + "," + line_chart_margin.top + ")");

// Get the data
d3.csv("data/overdose-death-history.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.year = line_chart_parseTime(d.year);
      d.prescription = +d.prescription;
      d.heroin = +d.heroin;
      d.synthetic = +d.synthetic;
  });

  // Scale the range of the data
  line_chart_x.domain([line_chart_parseTime(1998), line_chart_parseTime(2017)]);
  line_chart_y.domain([0, d3.max(data, function(d) {
	  return d.synthetic; })]);

  // Add the prescription path.
  line_chart_svg.append("path")
      .datum(data)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#3A79D1")
      .style("stroke-width", "2px")
      .attr("d", line_chart_prescription);

  // Add the heroin path.
  line_chart_svg.append("path")
      .datum(data)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#B74040")
      .style("stroke-width", "2px")
      .attr("d", line_chart_heroin);

  // Add the synthetic path.
  line_chart_svg.append("path")
      .datum(data)
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#FFC46D")
      .style("stroke-width", "2px")
      .attr("d", line_chart_synthetic);

  // Add a determine marker:
  line_chart_svg.append("path")
    .attr("class", "marker")
    .attr("d", "M " + line_chart_x(line_chart_parseTime(2016)) + " " + line_chart_height + " L " + line_chart_x(line_chart_parseTime(2016)) + " " + 0)
    .style("stroke", "grey")
    .style("fill", "none")
    .style("stroke-dasharray", ("2, 2"))

  line_chart_svg.append("text")
    .attr("class", "marker-text")
    .text(function () {
      return "2016";
    })
    .attr("x", function (d) {
      return line_chart_x(line_chart_parseTime(2016));
    })
    .attr("y", -5)
    .attr("font-family", "serif")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle");

  // Add the X Axis
  line_chart_svg.append("g")
      .attr("transform", "translate(0," + line_chart_height + ")")
      .call(d3.axisBottom(line_chart_x));

  // Add the Y Axis
  line_chart_svg.append("g")
      .call(d3.axisLeft(line_chart_y));

  // Axis labels
  line_chart_svg.append("text")
    .text("Deaths")
    .attr("font-family", "serif")
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("x", -5)
    .attr("y", -5);

  line_chart_svg.append("text")
    .text("Year")
    .attr("text-anchor", "end")
    .attr("font-family", "serif")
    .attr("font-size", "12px")
    .attr("x", line_chart_width)
    .attr("y", line_chart_height - 5);

  // Add legend
  line_chart_svg.append("g")
    .attr("class", "line-chart-legend")
    .attr("transform", "translate(20,-100)");

  line_chart_svg.select(".line-chart-legend")
    .call(line_chart_legend);

});

// MAP VARIABLES AND IMPLEMENTATION

var national_map_margin = {top: 30, right: 20, bottom: 30, left: 50};

var national_map_width = $("#map").width() - national_map_margin.left - national_map_margin.right,
    national_map_height = 400 - national_map_margin.top - national_map_margin.bottom;

var national_map_svg = d3.select("#map").append("svg")
    .attr("width", national_map_width + national_map_margin.left + national_map_margin.right)
    .attr("height", national_map_height + national_map_margin.top + national_map_margin.bottom);

var national_map_projection = d3.geoAlbersUsa()
    .translate([national_map_width / 2, national_map_height / 1.5])
    .scale(600);

var national_map_path = d3.geoPath()
    .projection(national_map_projection);

var national_map_color = d3.scaleLinear()
  .range(["white", "#3D5156"]);

var national_map_legend = d3.legendColor()
  .title("Deaths per 100,000 People")
  .shapeWidth((national_map_width / 5) - 15)
  .orient("horizontal")
  .scale(national_map_color);

var mapData;

var usaSteven;

queue()
  .defer(d3.csv, "data/us-death-rates.csv")
  .defer(d3.json, "data/us-10m.json")
  .defer(d3.csv, "data/conversion.csv")
  .await(wrangleMapData);

function wrangleMapData(error, values, map, conversion) {

  conversion.forEach(function (d) {
    d.ID = +d.ID;
  });

  values.forEach(function (d) {
    d[1999] = +d[1999];
    d[2000] = +d[2000];
    d[2001] = +d[2001];
    d[2002] = +d[2002];
    d[2003] = +d[2003];
    d[2004] = +d[2004];
    d[2005] = +d[2005];
    d[2006] = +d[2006];
    d[2007] = +d[2007];
    d[2008] = +d[2008];
    d[2009] = +d[2009];
    d[2010] = +d[2010];
    d[2011] = +d[2011];
    d[2012] = +d[2012];
    d[2013] = +d[2013];
    d[2014] = +d[2014];
    d[2015] = +d[2015];
    d[2016] = +d[2016];
    d.Total = +d.Total;

    conversion.forEach(function (e) {
      if (d.State == e.State) {
        d.ID = e.ID;
      }
    });


  });

  var temp = topojson.feature(map, map.objects.states).features;

    temp.forEach(function(d){
        values.forEach(function (e) {
           if (d.id == e.ID) {
             d[1999] = +e[1999];
             d[2000] = +e[2000];
             d[2001] = +e[2001];
             d[2002] = +e[2002];
             d[2003] = +e[2003];
             d[2004] = +e[2004];
             d[2005] = +e[2005];
             d[2006] = +e[2006];
             d[2007] = +e[2007];
             d[2008] = +e[2008];
             d[2009] = +e[2009];
             d[2010] = +e[2010];
             d[2011] = +e[2011];
             d[2012] = +e[2012];
             d[2013] = +e[2013];
             d[2014] = +e[2014];
             d[2015] = +e[2015];
             d[2016] = +e[2016];
             d.Total = +e.Total;
           }
        });
    });

  usaSteven = temp;

  console.log(usaSteven);

  createMap();
}

function createMap() {
  national_map_color.domain([0, 50]);

  national_map_svg.selectAll("path")
        .data(usaSteven)
        .enter()
        .append("path")
        .attr("d", national_map_path)
        .attr("class", "national-map-state")
        .attr("stroke", "slategrey")
        .attr("stroke-width", "0.5px")
        .attr("fill", function (d) {
            if (isNaN(d[2016])) {
                return "#f7fbff";
            } else {
                return national_map_color(d[2016]);
            }
        });

  national_map_svg.append("g")
    .attr("class", "national-map-legend")
    .attr("transform", "translate(20,20)");

  national_map_svg.select(".national-map-legend")
    .call(national_map_legend);
}

function updateNationalVis() {
  var year = $("#year").val();

  national_map_svg.selectAll(".national-map-state")
    .transition()
    .attr("fill", function (d) {
      if (isNaN(d[year])) {
          return "#f7fbff";
      } else {
          return national_map_color(d[year]);
      }
    })

  line_chart_svg.selectAll(".marker")
    .transition()
    .attr("d", "M " + line_chart_x(line_chart_parseTime(year)) + " " + line_chart_height + " L " + line_chart_x(line_chart_parseTime(year)) + " " + 0)

  line_chart_svg.selectAll(".marker-text")
    .text(function () {
      return year;
    })
    .transition()
    .attr("x", function () {
      return line_chart_x(line_chart_parseTime(year));
    });

}
