# CS171 Final Project: What Time Is It Right Now?

The site may be found [here](https://lx009.github.io/cs171-final-project/).

A screencast demonstrating the site may be found [here](www.google.com).

This final project directory consists of the following:

* Folders

  * css: holds css files for the directory

    * fullpage.css: Fullpage.js framework for the entire website
    * bootstrap.css: Bootstrap library for grid formatting within sections
    * jquery-ui.css: JQuery UI Library CSS for implementation of JQuery within sections
    * styles.css: all custom styles reside in this file

  * data: holds all data files for the rendering of visualizations

    * Symbol Map utilizes the following:
      * convert.csv - state ID to abbreviations
      * overdoses.csv - data on 2014 opioid deaths
      * us-10m.json - used for rendering the map
      * statelatlong.csv - state latitude and longitude

    * Line Chart - Historical Map utilizes the following:
      * conversion.csv - state ID to state name
      * overdose-death-history.csv - historical data on deaths based on type of opioid from 1999-2016
      * us-death-rates.csv - historical data on opioid death rates from 1999-2016
      * us-10m.json - used for rendering the map

    * Massachusetts Map utilizes the following:
      * rate_5yr_odc.json - opioid death rates in Massachusetts over 5 year periods
      * TOWN.geo.json - used for rendering town boundaries

    * Bar Chart - Pictograph utilizes the following:
      * age_gender.csv - demographic data of 2014 Massachusetts opioid deaths

  * img: holds all images used in the website
    * Stock images (all images except student images) drawn from Pexels, Unsplash, and Harvard University
    * Student images (jung, luke, steven, vicky jpegs) provided by students

  * js: holds libraries and files used within website
    * Libraries
      * Angular
      * Bootstrap
      * Colorbrewer
      * D3.js
      * D3-tip and D3-legend
      * Fullpage.js
      * Modernizr
      * Popper
      * Queue
      * Topojson
      * Vendor

    * Constructors
      * barvis
      * pictovis

    * Scripts
      * luke - implements symbol map visualization
      * steven - implements line chart - historical map visualization
      * jung - implements Massachusetts map visualization
      * vicky - implements bar chart - pictograph visualization
      * whatsbeingdone - implements button clicking for purpose

* Files
  * index.html: the website itself
  * DEPRECATED_index.html: placeholder prototype website
