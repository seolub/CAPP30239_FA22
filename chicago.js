const tooltip = d3.select("#illinois")
  .append("div")
  .attr("class", "svg-tooltip")
  
const svg_map = d3
  .select("#illinois")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  //load two datasets
  d3.csv("data/final_data.csv"),
  d3.json("data/Boundaries - Community Areas (current).geojson"),
]).then(([data, chi]) => {
  const dataById = {};

  for (let d of data) {
    d.INCOMEPC = +d.INCOMEPC; 
    dataById[d["Community_Area_Number"]] = d;
  }
  const communities = chi;

  // linear color scale
  const color = d3
    .scaleQuantile()
    .domain(d3.extent(data, (d) => d.INCOMEPC))
    .range(["#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b"]);

// Chicago specific projection
  let projection = d3
    .geoAlbers()
    .center([0, 41.83])
    .rotate([87.65, 0])
    .parallels([35, 50])
    .scale(70000)
    .translate([width / 2, height / 2]);

  let geoGenerator = d3.geoPath().projection(projection);

  svg_map
    .append("g")
    .selectAll("path")
    .data(communities.features)
    .join("path")
    .attr("d", geoGenerator)
    .attr("fill", (d) => {
      return dataById[d.properties.area_num_1]?.INCOMEPC 
        ? color(+dataById[d.properties.area_num_1].INCOMEPC)
        : "blue"; //where does area_num1 comes from?
    })
    .attr("stroke", "black")
    .on("mousemove", function (event, d) {
      let info = dataById[d.properties.area_num_1];
      tooltip
        .style("visibility", "visible")
        .html(`${info?.COMMUNITY_AREA_NAME}<br>${info?.INCOMEPC}$`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => color(+dataById[d.properties.area_num_1].INCOMEPC));
    });

});