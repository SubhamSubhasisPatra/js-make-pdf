!function(){
	var Donut3D={};
	
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

	function pieInner(d, rx, ry, h, ir ){
		var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
		
		var sx = ir*rx*Math.cos(startAngle),
			sy = ir*ry*Math.sin(startAngle),
			ex = ir*rx*Math.cos(endAngle),
			ey = ir*ry*Math.sin(endAngle);

			var ret =[];
			ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
			return ret.join(" ");
	}

	// function getPercent(d){
	// 	return (d.endAngle-d.startAngle > 0.2 ? 
	// 			Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
	// }	
	
	
	Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/, 
			rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){
	
		var _data = d3.pie().sort(null).value(function(d) {return d.value;})(data);
		
		var slices = d3.selectAll("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
			.attr("class", "slices");
			
		slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
			.attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
			.each(function(d){this._current=d;});
		
		slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
			.style("fill", function(d) { return d.data.color; })
			.style("stroke", function(d) { return d.data.color; })
			.attr("d",function(d){ return pieTop(d, rx, ry, ir);})
			.attr("border-leg",function(d) { return d.data.label})
			.each(function(d){this._current=d;})
		
		slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
			.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
			.attr("border-leg",function(d) {return d.data.label})
			.each(function(d){this._current=d;})
		

		// slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
		// 	.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
		// 	.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
		// 	.text(getPercent).each(function(d){this._current=d;});			
            
            
        //  Code for Legend
        
		let legendDotRadius = 8;
		var legendG = slices
		  .selectAll(".legend")
		  .data(data)
		  .enter()
		  .append("g")
		  .attr("transform", function (d, i) {
			return "translate(" + (600/2.5) + "," + (i * 30 - 40) + ")";
		  })
		  .attr("class", "legend");
	
		legendG
		  .append("circle")
		  .attr("r", legendDotRadius)
		  .attr("stroke", "black")
		  .attr("stroke-width", "1px")
		  .style("fill", (d) => d.color)
		
	
		legendG
		  .append("text")
		  .text(d => d.label + " : " + d.value)
		  .style("font-size", legendDotRadius * 2.5 + "px")
		  .attr("text-anchor", "left")
		  .attr("alignment-baseline", "middle")
		  .attr("y", 2)
		  .attr("x", 13);
		console.log(legendG);


		legend = slices.append("g")
    .attr("class","legend")
    .attr("transform","translate(250,60)")
    .style("font-size","12px")

    legend.each(function() {
        var g= d3.select(this),
            items = {},
            svg = d3.select(g.property("nearestViewportElement")),
            legendPadding = g.attr("data-style-padding") || 5,
            lb = g.selectAll(".legend-box").data([true]),
            li = g.selectAll(".legend-items").data([true])
		console.log(g);
        lb.enter().append("rect").classed("legend-box",true)
        li.enter().append("g").classed("legend-items",true)
    
        svg.selectAll("[border-leg]").each(function() {
            var self = d3.select(this)
            items[self.attr("border-leg")] = {
              pos : self.attr("border-leg-pos") || this.getBBox().y,
              color : self.attr("border-leg-color") != undefined ? self.attr("border-leg-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
            }
          })
   
        let result = []
			for (const i in items){
				temp = {}
				temp.key = i 
				temp.value = items[i]
				result.push(temp)
				temp = {}
			}
        items = result
        // console.log(items);
        // li.selectAll("text")
        //     .data(items,function(d) { console.log(d);return d.key})
        //     .call(function(d) { d.enter().append("text")})
        //     .call(function(d) { d.exit().remove()})
        //     .attr("y",function(d,i) { return i+"em"})
        //     .attr("x","1em")
        //     .text(function(d) { return d.key})
        
        // li.selectAll("circle")
        //     .data(items,function(d) { return d.key})
        //     .call(function(d) { d.enter().append("circle")})
        //     .call(function(d) { d.exit().remove()})
        //     .attr("cy",function(d,i) { return i-0.25+"em"})
        //     .attr("cx",0)
        //     .attr("r","0.4em")
        //     .style("fill",function(d) { return d.value.color})  
        
        // Reposition and resize the box
		console.log(li);
        var lbbox = li._parents[0].getBBox()  
        console.log(lbbox);
        lb.attr("x",(lbbox.x-legendPadding))
            .attr("y",(lbbox.y-legendPadding))
            .attr("height",(lbbox.height+2*legendPadding))
            .attr("width",(lbbox.width+2*legendPadding))
      })

	}

    
	
	this.Donut3D = Donut3D;
}();