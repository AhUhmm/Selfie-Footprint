var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1080 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width-120]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
      .domain(["East Asia", "Middle East", "North America", "South America", "Europe", "South Asia", "Asia", "Oceania", "Africa"])
      .range(["#F15E34", "#B1AD25" , "#278C9D", "#5DA649", "#11BFAE", "#7B5095", "#F0BE2A", "#F87272", "#3371C3"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(-width + 120)
    .orient("left");

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tip");

d3.tsv("selfie-data.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.CO2perCapitaPerCountry = +d.CO2perCapitaPerCountry;
    d.selfies = +d.selfies;
    d.radius = +d.radius;
  });

  x.domain([0, d3.max(data, function(d){return d.selfies;})]).nice();
  y.domain([0, d3.max(data, function(d){return d.CO2perCapitaPerCountry;})]).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width - 120)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Selfies per Day");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".8em")
      .style("text-anchor", "end")
      .text("mt CO2 per Capita")

  svg.selectAll(".y.axis .tick")
    .each(function (d) {
        console.log(d);
        if ( d === 0 ) {
            this.remove();
        }
    });

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return d.radius})
      .attr("cx", function(d) { return x(d.selfies); })
      .attr("cy", function(d) { return y(d.CO2perCapitaPerCountry); })
      .style("fill", function(d) { return color(d.region); })
    .on("mouseover", function(d,i){
      return tooltip.html("<p>" + "<b>" + d.city + ", " + d.Country +  "</b>" + "</p>" + "<p>" + d.co2 + " kg CO2e" + "</p>" + "<p>" + d.cups + " cups of coffee" + "</p>")
      .style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip.style("top", (d3.event.pageY) + "px")
      .style("left", (d3.event.pageX + 15) + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
    });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});