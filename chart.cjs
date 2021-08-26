const d3 = require("d3");
const fs = require("fs");
const { JSDOM } = require("jsdom");

function generatePieChart() {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><div id="my_dataviz"></div></body>`,
    { pretendToBeVisual: true }
  );

  let body = d3.select(dom.window.document.querySelector("#my_dataviz"));

  let width = 450;
  let height = 450;
  let marin = 60;
  let radius = Math.min(width, height) / 2 - marin;

  var svg = body
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "-35 -25 550 550")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var data = { MacOS: 29, ios: 20, Windows: 30, Linux: 8, Android: 12 , iPadOS : 12, KaliLinux : 123, ArchLinux : 214};

  // set the color scale
  var color = d3
    .scaleOrdinal()
    // .domain(["MacOS", "ios", "Windows", "Linux", "Android","iPadOS"])
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3
    .pie()
    .sort(null)
    .value((d) => d[1]);

  var data_ready = pie(Object.entries(data));
  // console.log(data_ready);

  var arc = d3
    .arc()
    .innerRadius(radius * 0.0) // This is the size of the donut hole
    .outerRadius(radius * 0.8);

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll("allSlices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  // Add the polylines between chart and labels:
  svg
    .selectAll("allPolylines")
    .data(data_ready)
    .enter()
    .append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      var posA = arc.centroid(d); // line insertion in the slice
      var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC];
    });

  // Add the polylines between chart and labels:
  svg
    .selectAll("allLabels")
    .data(data_ready)
    .enter()
    .append("text")
    .text((d) => d.data[0])
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });

  // console.log(body.html());
  fs.writeFileSync("arc_final.svg", body.html());
  return body.html()
}

module.exports = generatePieChart();
