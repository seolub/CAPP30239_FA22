states_data = FileAttachment("cleaned_data.csv").csv({typed: true})

namemap = new Map(states.features.map(d => [d.properties.name, d.id]))

chart = UsStateChoropleth(states_data, {
    id: d => namemap.get(d.NameState),
    value: d => d.Percentage,
    scale: d3.scaleQuantize,
    domain: [1, 7],
    range: d3.schemeBlues[6],
    title: (f, d) => `${f.properties.name}\n${d?.rate}%`
  })


document.getElementById("chart_2").appendChild(chart)


function UsStateChoropleth(data, {
    features = states,
    borders = statemesh,
    width = 975,
    height = 610,
    ...options
  } = {}) {
    return Choropleth(data, {features, borders, width, height, ...options});
  }