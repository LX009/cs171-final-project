
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

PictoVis = function(_parentElement, _data){
    console.log("yes");
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = this.data;


    this.initVis();
}

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

PictoVis.prototype.initVis = function(){
    var vis = this;
    //placeholder div for jquery slider

    vis.margin = { top: 0, right: 20, bottom: 200, left: 150 };

    vis.width = 550 - vis.margin.left - vis.margin.right,
        vis.height = 650 - vis.margin.top - vis.margin.bottom;


    //create svg element
    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .attr("viewBox","0 0 100 100");

    //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
    vis.svg.append("defs")
        .append("g")
        .attr("id","iconCustom")
        .attr("transform","scale(0.65 0.5)")
        .append("path")
        .attr("d","M28.256,11.163c-1.123-0.228-2.344-0.218-3.447,0.042c-7.493,0.878-9.926,9.551-9.239,16.164c0.298,2.859,4.805,2.889,4.504,0c-0.25-2.41-0.143-6.047,1.138-8.632c0,3.142,0,6.284,0,9.425c0,0.111,0.011,0.215,0.016,0.322    c-0.003,0.051-0.015,0.094-0.015,0.146c0,7.479-0.013,14.955-0.322,22.428c-0.137,3.322,5.014,3.309,5.15,0    c0.242-5.857,0.303-11.717,0.317-17.578c0.244,0.016,0.488,0.016,0.732,0.002c0.015,5.861,0.074,11.721,0.314,17.576    c0.137,3.309,5.288,3.322,5.15,0c-0.309-7.473-0.32-14.949-0.32-22.428c0-0.232-0.031-0.443-0.078-0.646    c-0.007-3.247-0.131-6.497-0.093-9.742c1.534,2.597,1.674,6.558,1.408,9.125c-0.302,2.887,4.206,2.858,4.504,0C38.678,20.617,36.128,11.719,28.256,11.163z");

    vis.svg.select("#iconCustom")
        .append("circle")
        .attr("cx","26.686")
        .attr("cy","4.507")
        .attr("r","4.507");

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

PictoVis.prototype.wrangleData = function(){
    var vis = this;

    var genderValue = d3.select('input[name="Gender"]:checked').node().value;
    console.log(genderValue);

    var ageValue = +d3.select("#age-range").property("value");
    console.log(ageValue);

    var ageRange = 0;

    if (ageValue <= 24)
    {
        console.log(ageValue);
        ageRange = 0;
    }
    else if (ageValue <= 34 && ageValue > 24){
        console.log(ageValue);
        ageRange = 2;
    }
    else if (ageValue <= 49 && ageValue > 34){
        console.log(ageValue);
        ageRange = 4;
    }
    else if (ageValue <= 64 && ageValue > 49){
        console.log(ageValue);
        console.log("hi");
        ageRange = 6;
    }
    else if(ageValue >= 65 ){
        console.log(ageValue);
        ageRange = 8;
    }
    else
        ageRange = 10;

    if (genderValue == "Males"){
        console.log("test");
        console.log(ageRange);
        ageRange = ageRange + 1;
    }

    console.log(ageRange);

    // EDITS HERE!! ****************************
    if (genderValue != "All"){
        console.log("entered, but not");
        document.getElementById("gender-info").innerHTML = genderValue;
        document.getElementById("num-info").innerHTML = vis.data[ageRange].B + "%";
        document.getElementById("death-info").innerHTML = vis.data[ageRange].A;
    }
    else {

        document.getElementById("gender-info").innerHTML = "residents";
        document.getElementById("num-info").innerHTML = vis.data[ageRange].E + "%";
        document.getElementById("death-info").innerHTML = +vis.data[ageRange].A + +vis.data[ageRange+1].A ;
        // console.log("tester info");
        // console.log(ageRange);
        // console.log(vis.data[ageRange]);
        // console.log(vis.data);

    }

    document.getElementById("age-info").innerHTML = vis.data[ageRange].Age;
    document.getElementById("age-selected").innerHTML = ageValue;

    document.getElementById("agerange-selected").innerHTML = vis.data[ageRange].Age;

    // EDITS HERE!! ****************************

    vis.updateVis(ageRange, genderValue);
}


/*
 * The drawing function
 */

PictoVis.prototype.updateVis = function(ageRange, genderValue){
    var vis = this;

    console.log(vis.data[ageRange].B);
    //console.log(vis.domain.length);

    //specify the number of columns and rows for pictogram layout
    var numCols = 10;
    var numRows = 10;

    //padding for the grid
    var xPadding = 20;
    var yPadding = 20;

    //horizontal and vertical spacing between the icons
    var hBuffer = 40;
    var wBuffer = 35;

    //generate a d3 range for the total number of required elements
    var myIndex = d3.range(numCols*numRows);

    //create group element and create an svg <use> element for each icon
    vis.svg.append("g")
        .attr("id","pictovis")
        .selectAll("use")
        .data(myIndex)
        .enter()
        .append("use")
        .attr("xlink:href","#iconCustom")
        .attr("id",function(d)    {
            return "icon"+d;
        })
        .attr("x",function(d) {
            var remainder=d % numCols;//calculates the x position (column number) using modulus
            return xPadding+(remainder*wBuffer);//apply the buffer and return value
        })
        .attr("y",function(d) {
            var whole=Math.floor(d/numCols)//calculates the y position (row number)
            return yPadding+(whole*hBuffer);//apply the buffer and return the value
        })
        .attr("fill",function(d,i){
            if(i<vis.data[ageRange].B && genderValue !="All")
                return "red";
            if(i<vis.data[ageRange].E && genderValue =="All")
                return "red";
            else
                return "black";
        })
        .classed("iconPlain",true);


    //********** LEGEND **********

    vis.svg
        .append("use")
        .attr("xlink:href","#iconCustom")
        .attr("x", -50)
        .attr("y",22)
        .attr("fill", "red")
        .attr("class","legend")
        .classed("iconPlain",true);


    vis.svg
        .append("text")
        .attr("x", -47)
        .attr("y", 70)
        .text("= 1%");

    vis.svg
        .append("text")
        .attr("x", -47)
        .attr("y", 100)
        .text("of total");

    vis.svg
        .append("text")
        .attr("x", -47)
        .attr("y", 130)
        .text("deaths");

    vis.svg
        .append("text")
        .attr("x", -47)
        .attr("y", 160)
        .text("related to");

    vis.svg
        .append("text")
        .attr("x", -47)
        .attr("y", 190)
        .text("Opioids");



}

PictoVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
    var vis = this;


    vis.filteredData = vis.data.filter(function(d){
        return d.time >= selectionStart && d.time <= selectionEnd;
    });

    vis.wrangleData();
}
