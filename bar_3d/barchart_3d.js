(async function(){
    const d3 = Object.assign({},await import('d3'))
    const fs = require("fs");
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM(
        `<!DOCTYPE html><body><div id="my_dataviz"></div></body>`,
        { pretendToBeVisual: true }
      );
      let body = d3.select(dom.window.document.querySelector("#my_dataviz"));
      const MARGIN = { LEFT: 50, RIGHT: 10, TOP: 10, BOTTOM: 130 };
      const WIDTH = 760 - MARGIN.LEFT - MARGIN.RIGHT;
      const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

      var g = body
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("viewBox", "-35 -25 550 550")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    
        let userData = [
            {"Country": "India", "Amount": 301},
            {"Country": "USA", "Amount": 123},
            {"Country": "UK", "Amount": 142},
            {"Country": "UAE", "Amount": 24},
            {"Country": "France", "Amount": 242},
            {"Country": "Germany", "Amount": 132}
          ]

      let data = userData.map(d => d.Amount)
        console.log(data);
      const x = d3
        .scaleBand()
        .domain(userData.map((d) => d.Country))
        .range([0, WIDTH])
        .paddingInner(0.5)
        .paddingOuter(0.5);

      const xAxisCall = d3.axisBottom(x);

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 20)
        .attr("text-anchor", "beginning")
        .attr("transform", "rotate(40)")
        .style("font-size", 14);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(userData.map(d => d.Amount))])
        .range([HEIGHT, 0]);
      const yAxisCall = d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => d + "M");
      g.append("g").attr("class", "y axis").call(yAxisCall);
      

const add3DBar = (parent, xPos, yPos, width, height, depth) => {
    const g = parent.append('g').attr('transform', `translate(${xPos}, ${yPos})`);

    g.append('path')
        .attr('d', `M 0,0 V ${0} H ${width} V 0 H 0 Z`)
        .style('fill', '#ee5252')
        .attr('d', `M 0,0 V ${-height} H ${width} V 0 H 0 Z`);

    g.append('path')
        .attr('d', `M 0,${0} L ${depth},${-depth} H ${depth + width} L ${width},0 Z`)
        .style('fill', '#b23b3b')
        .attr('d', `M 0,${-height} L ${depth},${-height - depth} H ${depth + width} L ${width},${-height} Z`);

    g.append('path')
        .attr('d', `M ${width},0 L ${width + depth},${-depth}, V ${-depth} L ${width},0 Z`)
        .style('fill', '#b23b3b')
        .attr('d', `M ${width},0 L ${width + depth},${-depth}, V ${-height - depth} L ${width},${-height} Z`);
}

userData.forEach((d, i) => {
  add3DBar(g, x(d.Country), HEIGHT, 50, HEIGHT - y(d.Amount), 20);
});

fs.writeFileSync("liner_graph.svg", body.html());
// console.log(body.html());

})()