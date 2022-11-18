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
d3.csv("data/final_data.csv").then((data) => {

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
    .call(d3.axisLeft(y));
   
  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([200, 131000])
    .range([1, 40]);

  // Add a scale for bubble color
  var myColor = d3
    .scaleQuantile()
    .domain(d3.extent(data, (d) => d.INCOMEPC))
    .range(["#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b"]);

   // -1- Create a tooltip div that is hidden by default:
   const tooltip = d3.select("#bubble_plot")
      .append("div")
      .attr("class", "svg-tooltip");

 // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function(event, d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("visibility", "visible")
        .html(`${d.COMMUNITY_AREA_NAME} <br> ${d.LifeExpectancy} `)
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
    svg.append('g')
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

    })

    