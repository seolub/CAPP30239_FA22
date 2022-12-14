d3.csv('data/Final_data.csv').then(data => {
    chart1 = BeeswarmChart(data, {
        x: d => Number(d.Unemployment),
        xLabel: "Unemployment (%) →",
        title: d => d.Community_Area_Number,
        width: 600
        }) 

    chart2 = BeeswarmChart(
      data.filter((d) => d.ACT_GRADE11 > 0),
      {
        x: d => Number(d.ACT_GRADE11), //when zero
        xLabel: "ACT Grade 11 (Percentile) →",
        title: d => d.Community_Area_Number,
        width: 600
        })
    
    chart3 = BeeswarmChart(data, {
        x: d => Number(d.LifeExpectancy),
        xLabel: "Life Expectancy →",
        title: d => d.Community_Area_Number,
        width: 600
        }) 
    
    chart4 = BeeswarmChart(data, {
        x: d => Number(d.HOMICIDE),
        xLabel: "Homicides per 100.000 people →",
        title: d => d.Community_Area_Number,
        width: 600
        }) 

    chart5 = BeeswarmChart(data, {
        x: d => Number(d.Teen_Births_2009), //when zero
        xLabel: "Teen Births per 100.000 people →",
        title: d => d.Community_Area_Number,
        width: 600
        })
    
    chart6 = BeeswarmChart(data, {
        x: d => Number(d['NO_HIGHSCHOOLDIPLOMA25+']),
        xLabel: "No High School Diploma (%) →",
        title: d => d.Community_Area_Number,
        width: 600
        }) 
    
    chart7 = BeeswarmChart(data, {
        x: d => Number(d.HOUSING_CROWDED),
        xLabel: "Crowded Housing (%) →",
        title: d => d.Community_Area_Number,
        width: 600
        })         
  

    // (5) APPEND TO PAGE
    document.getElementById("chart1").appendChild(chart1)
    document.getElementById("chart2").appendChild(chart2) 
    document.getElementById("chart3").appendChild(chart3)
    document.getElementById("chart4").appendChild(chart4)
    document.getElementById("chart5").appendChild(chart5)
    document.getElementById("chart6").appendChild(chart6) 
    document.getElementById("chart7").appendChild(chart7);
});

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/mirrored-beeswarm

function BeeswarmChart(data, {
    value = d => d, // convience alias for x
    label, // convenience alias for xLabel
    domain, // convenience alias for xDomain
    x = value, // given d in data, returns the quantitative x value
    title = null, // given d in data, returns the title
    radius = 3, // (fixed) radius of the circles
    padding = 1.5, // (fixed) padding between the circles
    marginTop = 10, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 40, // bottom margin, in pixels
    marginLeft = 20, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xLabel = label, // a label for the x-axis
    xDomain = domain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight] // [left, right]
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const T = title == null ? null : d3.map(data, title);
    
    // Compute which data points are considered defined.
    const I = d3.range(X.length).filter(i => !isNaN(X[i]));
  
    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
  
    // Construct scales and axes.
    const xScale = d3.scaleLinear(xDomain, xRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  
    // Compute the y-positions.c
    const Y = dodge(I.map(i => xScale(X[i])), radius * 2 + padding);
  
    // Compute the default height;
    if (height === undefined) height = (d3.max(Y, Math.abs) + radius + padding) * 2 + marginTop + marginBottom;
  
    // Given an array of x-values and a separation radius, returns an array of y-values.
    function dodge(X, radius) {
      const Y = new Float64Array(X.length);
      const radius2 = radius ** 2;
      const epsilon = 1e-3;
      let head = null, tail = null;
    
      // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
      function intersects(x, y) {
        let a = head;
        while (a) {
          const ai = a.index;
          if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
          a = a.next;
        }
        return false;
      }
    
      // Place each circle sequentially.
      for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {
    
        // Remove circles from the queue that can’t intersect the new circle b.
        while (head && X[head.index] < X[bi] - radius2) head = head.next;
    
        // Choose the minimum non-intersecting tangent.
        if (intersects(X[bi], Y[bi] = 0)) {
          let a = head;
          Y[bi] = Infinity;
          do {
            const ai = a.index;
            let y1 = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
            let y2 = Y[ai] - Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
            if (Math.abs(y1) < Math.abs(Y[bi]) && !intersects(X[bi], y1)) Y[bi] = y1;
            if (Math.abs(y2) < Math.abs(Y[bi]) && !intersects(X[bi], y2)) Y[bi] = y2;
            a = a.next;
          } while (a);
        }
    
        // Add b to the queue.
        const b = {index: bi, next: null};
        if (head === null) head = tail = b;
        else tail = tail.next = b;
      }
    
      return Y;
    }
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .attr("class", "axis")
            .text(xLabel));

    const tooltip = d3.select("body")
        .append("div")  
        .attr("class", "svg-tooltip")

    const color_1 = d3
      .scaleQuantile()
      .domain(d3.extent(data, (d) => d.INCOMEPC))
      .range(['#b6d4e9','#9dc9e2','#81badb','#65a9d3','#4c98ca','#3686c0','#2372b4','#145fa6','#0b4c92','#083877']
      );

    const showTooltip = function(event, X) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("visibility", "visible")
        .html(`${data[X].COMMUNITY_AREA_NAME}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
        d3.select(this).style("stroke", "black");
    }
      const moveTooltip = function(event, X) {
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

  
    const dot = svg.append("g")
      .selectAll("circle")
      .data(I)
      .join("circle")
        .attr("cx", i => xScale(X[i]))
        .attr("cy", i => (marginTop + height - marginBottom) / 2 + Y[i])
        .attr("r", radius)
        .attr('fill', function (i) {return color_1(data[i].INCOMEPC)})
      // -3- Trigger the functions
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
  
    if (T) dot.append("title")
        .text(i => T[i]);
  
    return svg.node();
  }