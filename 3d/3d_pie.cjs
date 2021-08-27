const d3 = require("d3");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");


const { document } = new JSDOM(
  `<div id="chart"></div>`,
  { pretendToBeVisual: true }
).window;

let body = d3.select(document.querySelector("#chart"));



var x = 250, y = 150, rx = 130, ry = 100, ir = 0;
var w = 600;
var h = 30;
var r = h/2;

console.log("3D Chart")

var data=[
	{label:"MacOS",value:230, color:"#3366CC"},
	{label:"ios", value:52,color:"#DC3912"},
	{label:"Windows", value:16,color:"#FF9900"},
	{label:"Android",value:91, color:"#109618"},
	{label:"Arch",value:101, color:"#990099"}
];

var vis = body.append("svg:svg").data([data]).attr("width", 700)
              .attr("height", 400).attr("xmlns", "http://www.w3.org/2000/svg");
var _data = d3.pie().value(function(d){return d.value;});

var slices = vis.append("svg:g").attr("transform", "translate(" + x + "," + y + ")")
                   .attr("class", "slice");


slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
    .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
    .attr("d", function (d) { return pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
    .each(function (d) { this._current = d; });

slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
    .style("fill", function (d) { return d.data.color; })
    .style("stroke", function (d) { return d.data.color; })
    .attr("d", function (d) { return pieTop(d, rx, ry, ir); })
    .each(function (d) { this._current = d; });

slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
    .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
    .attr("d", function (d) { return pieOuter(d, rx - .5, ry - .5, h); })
    .each(function (d) { this._current = d; });

    var legendG = slices.selectAll(".legend")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d,i){
      return "translate(" + (w - 300) + "," + (i * 20 + -15) + ")";
    })
    .attr("class", "legend");   
  
  legendG.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d, i) {
      return d.color;
    });
  
  legendG.append("text")
    .text(function(d,i){
      return d.label + " : " + d.value  ;
    })
    .style("font-size", 16)
    .attr("y", 10)
    .attr("x", 11);

// slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
//     .attr("x", function (d) { return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)); })
//     .attr("y", function (d) { return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)); })
//     .text(getPercent).each(function (d) { this._current = d; });

function pieInner(d, rx, ry, h, ir) {
    var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

    var sx = ir * rx * Math.cos(startAngle),
        sy = ir * ry * Math.sin(startAngle),
        ex = ir * rx * Math.cos(endAngle),
        ey = ir * ry * Math.sin(endAngle);

    var ret = [];
    ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
    return ret.join(" ");
} 

function pieTop(d, rx, ry, ir ){
    if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
    var sx = rx*Math.cos(d.startAngle),
        sy = ry*Math.sin(d.startAngle),
        ex = rx*Math.cos(d.endAngle),
        ey = ry*Math.sin(d.endAngle);
        
    var ret =[];
    ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
    ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
    return ret.join(" ");
}

function pieOuter(d, rx, ry, h ){
    var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
    
    var sx = rx*Math.cos(startAngle),
        sy = ry*Math.sin(startAngle),
        ex = rx*Math.cos(endAngle),
        ey = ry*Math.sin(endAngle);
        
        var ret =[];
        ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
        return ret.join(" ");
}

function getPercent(d){
    return (d.endAngle-d.startAngle > 0.2 ? 
            Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
}	


// draw("quotesDonut", data, 250, 150, 130, 90, 30, 0, svg)
// console.log(body.html())
fs.writeFileSync("3d_pie_chart.svg", body.html());
