let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 }); //how big the visualization is 


d3.csv('data/Final_data.csv').then(data => {
    console.log(data)

    xScale = d3.scaleLinear() //declare x scale 
    .domain(d3.extent(data, d => d.Unemployment)).nice()  // from data
    .range([margin.left, width - margin.right])

    xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(6)

    d3.select("svg")
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,150)")
    .call(xAxis)
    .append("text")
    .attr("x", "435")
    .attr("y", "50")
    .text("Population")

    d3.select("svg")
      .append("text")
      .attr("class", "title")
      .attr("x", 435)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .text("TOP 10 MOST POPULOUS COUNTRIES 2019")

    d3.select("svg")
        .append("text")
        .attr("class", "source")
        .attr("x", 50)
        .attr("y", 255)
        .attr("text-anchor", "start")
        .text("Source:Wikipedia")
  
});