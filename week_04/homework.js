/* D3 Line Chart */
/// line 2 to 11 does not depend on the data

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-canada.csv').then(data => {

    let timeParse = d3.timeParse("%Y-%m")

    for (let d of data){
        d.Num = +d.Num;
        d.Month = timeParse(d.Month)
    }
    
    let x = d3.scaleTime()  //d3 scale time function
        .domain(d3.extent(data, d => d.Month)) //extent gets space it takes out from date - it's an array
        .range([margin.left, width - margin.right])
    
    let y = d3.scaleLinear() //for continuous
        .domain([0, d3.max(data, d => d.Num)])
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)); // can add ticksizeouter()
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr('class', "y-axis") //only for ticklines
      .call(d3.axisLeft(y).tickFormat(d => d + '%').tickSize(-width)); //add percentage . add ticklines

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let line = d3.line()
        .x(d => x(d.Month)) // x is scale
        .y(d => y(d.Num));
        //.curve()  could use to add curveline

    svg.append("path")
        .datum(data) //only one path
        .attr("d", line)  
        .attr('fill', "none")
        .attr("stroke", "steelblue");

  });