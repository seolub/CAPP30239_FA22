let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 }); //how big the visualization is 
  
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); //viewbox changes the size based on the space

d3.csv('penguins.csv').then(data => {                 //load data
    
  let x = d3.scaleLinear() //declare x scale 
    .domain(d3.extent(data, d => d.body_mass_g)).nice()  // from data
    .range([margin.left, width - margin.right]);         // from space

  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.flipper_length_mm)).nice()
    .range([height - margin.bottom, margin.top]);               

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.body_mass_g))
    .attr("cy", d => y(d.flipper_length_mm))
    .attr("r", 2) //radius
    .attr("opacity", 0.75); //just in case they overlap

  const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip") //svg tooltip is passed 
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red"); //select this, what we are on, change it to red so we see we are selecting
      tooltip
        .style("visibility", "visible") //make it visible
        .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.body_mass_g/1000}kg`); //info to display
    })
    .on("mousemove", function(event) {      // need to make sure that tooltip is close to mouse (info)
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {     //make sure what we don't select anymore goes to bkacl
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
    
});