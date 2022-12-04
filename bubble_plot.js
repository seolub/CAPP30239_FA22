//https://d3-graph-gallery.com/graph/bubble_tooltip.html

// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/Final_data.csv").then((data) => {


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100000])
    .range([0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, d => d.LifeExpectancy),  d3.max(data, d => d.LifeExpectancy)]).nice() 
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("id", "bubbleYAxis");
   
  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([200, 131000])
    .range([1, 40]);

  // Add a scale for bubble color
  var myColor = d3
    .scaleQuantile()
    .domain(d3.extent(data, (d) => d.INCOMEPC))
    .range(['#b6d4e9','#9dc9e2','#81badb','#65a9d3','#4c98ca','#3686c0','#2372b4','#145fa6','#0b4c92','#083877']);

   // -1- Create a tooltip div that is hidden by default:
   const tooltip = d3.select("body")
      .append("div")
      .attr("class", "svg-tooltip");

 // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function(event, d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("visibility", "visible")
        .html(`${d.COMMUNITY_AREA_NAME} <br> ${d.LifeExpectancy || d.value}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
        d3.select(this).style("stroke", "black");
    }
    const moveTooltip = function(event, d) {
      tooltip
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
    }
    const hideTooltip = function(event, d) {
      tooltip
        .transition()
        .duration(200)
        tooltip.style("visibility", "hidden");
      d3.select(this)
      .style("stroke", "none")
    }

    // Add dots
    var bubbles = svg.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return x(d.INCOMEPC); } )
        .attr("cy", function (d) { return y(d.LifeExpectancy); } ) 
        .attr("r", function (d) { return z(d.Population)/2; } )
        .style("fill", function (d) { return myColor(d.INCOMEPC); } )
      // -3- Trigger the functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )


    var allGroup = ['LifeExpectancy', 'HOMICIDE', 'Unemployment', 'ACT_GRADE11', 'NO_HIGHSCHOOLDIPLOMA25+','Teen_Births_2009','HOUSING_CROWDED'] 

    var dict_map = {'LifeExpectancy': 'Life Expectancy (Years)', 
                    'HOMICIDE': 'Homicides per 100.000 people',
                    'Unemployment': 'Unemployment Rate (%)',
                    'ACT_GRADE11': 'Act Grade 11 (Percentile}',
                    'Teen_Births_2009': 'Teen Births per 100.000 people',
                    'NO_HIGHSCHOOLDIPLOMA25+': 'Adults without High School Diploma',
                    'HOUSING_CROWDED': 'Housing Crowded (%)'}

    //update function
    d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return dict_map[d]; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A function that update the chart
    function update(selectedGroup) {
      // Give these new data to update line

      var dataFilter = data.map(function (d) {
        return {
          COMMUNITY_AREA_NAME: d.COMMUNITY_AREA_NAME,
          INCOMEPC: +d.INCOMEPC,
          value: +d[selectedGroup],
          Population: +d.Population,
        };
      });  
      
      y.domain([
        d3.min(dataFilter, (d) => d.value),
        d3.max(dataFilter, (d) => d.value),
      ])
        .nice()
        .range([height, 0]);

      // Update Y Axis
    d3.select("#bubbleYAxis").call(d3.axisLeft(y));

    d3.selectAll(".bubbles")
      .data(dataFilter)
      .join("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.INCOMEPC);
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .attr("r", function (d) {
        return z(d.Population) / 2;
      })
      .style("fill", function (d) {
        return myColor(d.INCOMEPC);
      });
  }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
  })
})

    