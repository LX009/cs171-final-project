
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

BarVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = this.data;


    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

BarVis.prototype.initVis = function(){
    var vis = this;
    console.log(vis.data[1]);

    vis.margin = { top: 30, right: 20, bottom: 100, left: 50 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ") scale(0.7 0.7)");


    // Scales and axes
    vis.x = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.2)
        .domain(d3.range(0,6));

    vis.y = d3.scaleLinear()
        .range([vis.height,0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // Axis title
    vis.svg.append("text")
    .attr("x",-250)
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
        .text("# of Opioid-related Deaths");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

BarVis.prototype.wrangleData = function(){
	var vis = this;

	var all = [];
    var ageCount = [];
    var genderCount = [];

    var peopleByAge = d3.nest()
        .key(function(d){
            return d.Age
        })
        .entries(vis.data);

    var peopleByGender = d3.nest()
        .key(function(d){
            return d.Gender
        })
        .entries(vis.data);


    console.log(peopleByAge[3]["values"][1].A);
   console.log(peopleByGender);

    // Create a sequence from 0 - 6 (ages: 1-15; array length: 15), initialize values to 0
    ageCount = d3.range(0,5).map(function() {
        return 0;
    });

    console.log(vis.data[0]);
    // Aggregate over priorities, iterate over all data
    //console.log(vis.filteredData[1].priorities);

    var counter = 0;
    var total = 0;

    // count number of people in each age range
    peopleByAge.forEach(function(age,i){
           // console.log(age["values"][0].A);

            total = +age["values"][0].A + +age["values"][1].A;

            // add number of people for each age category for males and females
            ageCount[counter] = total;
            counter ++;
    });

    counter = 0;

    // Create a sequence from 0 - 12 (ages: 1-15; array length: 15), initialize values to 0
    all = d3.range(0,10).map(function() {
        return 0;
    });

    vis.data.forEach(function(d){
        //console.log(d);
        all[counter]=d.A;
        counter++;
    });

    console.log(all);



    counter = 0;
    //count number of people by gender
    peopleByGender.forEach(function(gen){
        console.log(gen["values"][0].A);

        total = +gen["values"][0].A + +gen["values"][1].A
            + +gen["values"][2].A + +gen["values"][3].A
            + +gen["values"][4].A;

        // add number of people for each age category for males and females
        genderCount[counter] = total;
        counter ++;

    })

    console.log(vis.data[1].A);

    ///////============ Update based on selection data =========

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

    if (genderValue == "All")
    {
        vis.displayData = ageCount;
        vis.domain = peopleByAge.length;
    }
    else
    {
        vis.displayData = all;
        //selection domain adjustment
        console.log(all.length);
        vis.domain = all.length;
    }

	vis.updateVis(genderValue, ageRange);
}


/*
 * The drawing function
 */

BarVis.prototype.updateVis = function(genderValue, ageRange){
	var vis = this;

    console.log(vis.displayData);
    console.log(vis.domain);

    if (genderValue == "All")
    {
        vis.y.domain([0, 900]);
    }
    else
        vis.y.domain([0, 600]);
    // Update domains

   // vis.y.domain([0, d3.max(vis.displayData)]);
    vis.x.domain(d3.range(0,vis.domain));

    var bars = vis.svg.selectAll(".bar")
        .data(vis.displayData);

    var color = 0;

    bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .style("fill", function(d,i){
            console.log(vis.data[i].ID);
            console.log(ageRange);
            if (vis.data[i].Gender == genderValue && vis.data[i].Age == vis.data[ageRange].Age && genderValue != "All"){
                return "orange";
            }
            if (vis.data[i].ID == ageRange/2 + 1 && genderValue == "All"){
                color = 1;
                return "orange";
            }
            if(vis.data[i].Gender =="Males" && genderValue != "All"){
                return "blue";
            }
            if(vis.data[i].Gender =="Females" && genderValue != "All"){
                return "purple";
            }
            else
                return "green";
        })
        .attr("width", vis.x.bandwidth())
        .attr("height", function(d){
            return vis.height - vis.y(d);
        })
        .attr("x", function(d, index){
            return vis.x(index);
        })
        .attr("y", function(d){
            return vis.y(d);
        });

    vis.svg.selectAll("rect")
        .on("click", function(d,i){
            console.log(vis.data[i].Age);
            var value2 = vis.data[i].Gender;

            if (document.getElementById("all-rad").checked != true ) {
                if (value2 == "Males"){
                    document.getElementById("mal-rad").checked = true;
                }
                else if(value2 == "Females"){
                    document.getElementById("female-rad").checked = true;
                }
            }

            //document.getElementById("age-range").value = vis.data[i].Age;


        });

    bars.exit().remove();

    // Call axis function with the new domain
    vis.svg.select(".y-axis").call(vis.yAxis);

    //console.log(vis.metaData.priorities[1]['item-title']);
    // TODO: adjust axis labels
    vis.svg.select(".x-axis").call(vis.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
        .text(function(d,i){
            if (genderValue == "All")
            {
                return vis.data[i*2].Age;
            }
            else
                return vis.data[i].Age + " " + vis.data[i].Gender;
        });

}

BarVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
	var vis = this;


    vis.filteredData = vis.data.filter(function(d){
        return d.time >= selectionStart && d.time <= selectionEnd;
    });

	vis.wrangleData();
}
