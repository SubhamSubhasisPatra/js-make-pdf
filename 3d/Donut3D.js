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
	
				let colorScheme = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(data.map((d) => d.label));
		
		var _data = d3.pie().sort(null).value(function(d) {return d.value;})(data);
		
		var slices = d3.selectAll("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
			.attr("class", "slices");
			
		slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
			.style("fill", function(d) { return d3.hsl(colorScheme(d.data.label)).darker(0.7); })
			.attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
			.each(function(d){this._current=d;});
		
		slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
			.style("fill", function(d) {return colorScheme(d.data.label); })
			.style("stroke", function(d) { return colorScheme(d.data.label); })
			.attr("d",function(d){ return pieTop(d, rx, ry, ir);})
			.attr("border-leg",function(d) { return d.data.label})
			.each(function(d){this._current=d;})
		
		slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
			.style("fill", function(d) { return d3.hsl(colorScheme(d.data.label)).darker(0.7); })
			.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
			.attr("border-leg",function(d) {return d.data.label})
			.each(function(d){this._current=d;})
		

		// slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
		// 	.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
		// 	.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
		// 	.text(getPercent).each(function(d){this._current=d;});			
            
            
        //  Code for Legend

		
    	// set up legend
    	// step 1: create a group for all legend-related elements
    	var legendGroup = svg
    	  .append("g")
    	  .attr("class", "legendOrdinal")
    	  .attr("transform", "translate(480,80)");
    	// step 2: first thing (lowest in z-order) to add is a rectangle to outline the legend with
    	// we will fill in its size later
    	var legendBox = legendGroup
    	  .append("rect")
    	  .attr("class", "legend-box")
    	  .attr("fill", "none")
    	  .attr("stroke", "black");
    	// step 3: invoke d3-legend to create the legend
    	var legendOrdinal = d3
    	  .legendColor()
    	  .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
    	  .shapePadding(10)
    	  .scale(colorScheme);
    	var legend = svg.select(".legendOrdinal").call(legendOrdinal);
    	// step 4: select the legend cells - we will do something with them
    	var legendCells = legendGroup.selectAll(".cell");
		console.log(legendCells);
    	// step 4b: figure out what size to make the legendBox by iterating over the legendCells
    	var maxWidth = 0;
    	var totalHeight = 0;
    	legendCells.each(function (d) {
    	  var bbox = d3.select(this).node().getBBox();
    	  maxWidth = bbox.width > maxWidth ? bbox.width : maxWidth;
    	  totalHeight += bbox.height + 10;
    	});
    	legendBox
    	  .attr("width", maxWidth + 15)
    	  .attr("height", totalHeight)
    	  .attr("transform", "translate(-15,-15)");


	}

    
	
	this.Donut3D = Donut3D;
}();