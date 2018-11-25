

// Function to convert date objects to strings or reverse
var dateFormatter = d3.timeFormat("%Y-%m-%d");
var dateParser = d3.timeParse("%Y-%m-%d");


// (1) Load data asynchronously
queue()
	.defer(d3.csv,"data/age_gender.csv")
    //.defer(d3.csv,"data/data.csv")
	.await(createVis);


function createVis(error, ageGender){
	if(error) { console.log(error); }

	// (2) Make our data look nicer and more useful
	allData = ageGender;

	// (3) Create event handler
    var MyEventHandler = {};


	var barVis = new BarVis("barvis", allData);
    var pictoVis = new PictoVis("pictovis", allData);

    $(document).ready(function(){
        $('input[name="Gender"]').on('change', function(){
            pictoVis.wrangleData();
            barVis.wrangleData();
        });
        $("#age-range").on('change', function(){
            pictoVis.wrangleData();
            barVis.wrangleData();
        });
    });


	// (5) Bind event handler
	// when 'selectionChanged' is triggered, specified function is called
    $(MyEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
        countVis.onSelectionChange(rangeStart, rangeEnd);
    });

}
