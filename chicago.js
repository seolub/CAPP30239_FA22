const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  
const svg_map = d3
  .select("#illinois")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  //load two datasets
  d3.csv("data/Final_data.csv"),
  d3.json("data/Boundaries - Community Areas (current).geojson"),
]).then(([data, chi]) => {
  const dataById = {};

  for (let d of data) {
    d.INCOMEPC = +d.INCOMEPC; 
    dataById[d["Community_Area_Number"]] = d;
  }
  const communities = chi;

  // color scale
  const color = d3
    .scaleQuantile()
    .domain(d3.extent(data, (d) => d.INCOMEPC))
    .range(['#b6d4e9','#9dc9e2','#81badb','#65a9d3','#4c98ca','#3686c0','#2372b4','#145fa6','#0b4c92','#083877']);

// Chicago specific projection
  let projection = d3
    .geoAlbers()
    .center([0, 41.83])
    .rotate([87.65, 0])
    .parallels([35, 50])
    .scale(70000)
    .translate([width / 2, height / 2])
    .fitSize([width, height], communities);

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
        : "blue"; 
    })
    .attr("stroke", "black")
    .on("mousemove", function (event, d) {
      let info = dataById[d.properties.area_num_1];
      tooltip
        .style("visibility", "visible")
        .html(`${info?.COMMUNITY_AREA_NAME}<br>$${info?.INCOMEPC}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => color(+dataById[d.properties.area_num_1].INCOMEPC));
    });

  // Legend
  d3.select("#illinois")
  .node()
  .appendChild(
    Legend(
      d3.scaleOrdinal(
          [1,2,3,4,5,6,7,8,9,10],
          (['#b6d4e9',
          '#9dc9e2',
          '#81badb',
          '#65a9d3',
          '#4c98ca',
          '#3686c0',
          '#2372b4',
          '#145fa6',
          '#0b4c92',
          '#083877'])
      ),
      {title: "Decile of Income per Capita in USD "}
    ));

    console.log(color)

});