var timeOutList = [3000, 5000, 5000, 7000, 5000, 7000, 5000, 5000, 5000, 4000, 1000];
$(document).ready(function() {
	var w = 800,
		h = 600;

	var root = d3.select("#chart").append("svg").attr("width", w).attr("height", h);
	var graphLayer1 = root.append("svg:g").classed("g1", true);
	var graphLayer2 = root.append("svg:g").classed("g2", true);
	var subRegion;
	var textLayer = root.append("svg:g").attr("transform", "translate(" + 50 + "," + 500 + ")");
	var sCenter = centerPoint(w / 3, h * 0.8 / 2);
	var sPentPoints = pentagramPoint(sCenter.x, sCenter.y, 60);

	var i = 0;
	play();

	function play() {
		playText(textList[i]);
		playGraphic(i);
		i++;
		if (i > 10) {
			return;
		} else {
			setTimeout(function() {
				play();
			}, timeOutList[i - 1]);
		}
	}


	function playGraphic(index) {
		var center = centerPoint(w, h);
		var pentPoints = pentagramPoint(center.x, center.y, 120);

		if (index === 0) {
			drawPoints(graphLayer1, [pentPoints[0]], true);
			graphLayer1.append("text").transition().delay(1000).duration(1000).attr("x", pentPoints[0].x + 15).attr("y", pentPoints[0].y - 15).attr("fill", "yellow").attr("font-size", 25).text(t1);
		} else if (index === 1) {
			graphLayer1.selectAll("text").remove();
			drawPoints(graphLayer1, [pentPoints[2], pentPoints[3]], true);
		} else if (index === 2) {
			drawPoly(graphLayer1, [pentPoints[0], pentPoints[2], pentPoints[3]]);
		} else if (index === 3) {
			//graphLayer1.attr("visibility", "hidden");
			transitLayers(graphLayer1, graphLayer2);
			subRegion = layoutGrid(graphLayer2, 3, 2, w, h * 0.8);
			var subPs = subPoints();
			for (var i = 0; i < 6; i++) {
				drawPoints(subRegion[i], [sPentPoints[0], sPentPoints[2], sPentPoints[3]], false);
				if (i < 5) {
					drawPoly(subRegion[i], subPs[i]);
				} else {
					drawPoly(subRegion[i], [sCenter, sPentPoints[0]]);
					drawPoly(subRegion[i], [sCenter, sPentPoints[2]]);
					drawPoly(subRegion[i], [sCenter, sPentPoints[3]]);
				}

				if (i === 3) {
					var ssPentPoints = pentagramPoint(sCenter.x, sCenter.y, 24, Math.PI / 5);
					drawPoly(subRegion[i], [ssPentPoints[0], ssPentPoints[2], ssPentPoints[4], ssPentPoints[1], ssPentPoints[3]]);
				}
			}
		} else if (index === 4) {
			graphLayer1.selectAll("line").data([]).exit().remove();
			transitLayers(graphLayer2, graphLayer1);
			drawPoints(graphLayer1, [pentPoints[1], pentPoints[4]], true);
		} else if (index === 5) {
			transitLayers(graphLayer1, graphLayer2);
			for (var i = 0; i < 6; i++) {
				drawPoints(subRegion[i], [sPentPoints[1], sPentPoints[4]], false);
				if ([1, 2, 4, 5].indexOf(i) >= 0) {
					drawFault(subRegion[i], w / 6, h * 0.8 / 4, w / 6, h * 0.8 / 4);
				}
			}
		} else if (index === 6) {
			for (var i = 0; i < 6; i++) {
				if ([1, 2, 4, 5].indexOf(i) >= 0) {
					subRegion[i].data([]).exit().remove();
				} else if (i === 0) {
					subRegion[i].transition().duration(1000).attr("transform", "scale(" + 2 + "," + 2 + ")");
				} else {
					subRegion[i].transition().duration(1000).attr("transform", "translate(" + w / 2 + "," + 0 + ") scale(" + 2 + "," + 2 + ")");
				}
				subRegion[i].selectAll("circle").transition().attr("r", 5);
				subRegion[i].selectAll("line").transition().attr("stroke-width", 1);
			}
		} else if (index === 7) {
			drawFault(subRegion[3], w / 6, h * 0.8 / 4, w / 6, h * 0.8 / 4);
		} else if (index === 8) {
			subRegion[3].selectAll("circle").transition().remove();
			subRegion[3].selectAll("line").transition().remove();
			subRegion[0].transition().duration(1000).attr("transform", "translate(100,0) scale(" + 2 + "," + 2 + ")");
		} else if (index === 9) {
			subRegion[0].selectAll("circle").transition().attr("r", 0).remove();
			subRegion[0].append("polygon").attr("points", function(d) {
				var i = 0,
					length = sPentPoints.length,
					result = "";
				for (; i < length; i++) {
					result = result + sPentPoints[i].x + "," + sPentPoints[i].y + " ";
				}
				return result;
			}).style("fill", "#888");
		} else if (index === 10) {
			subRegion[0].transition().attr("transform", "scale(" + 2 + "," + 2 + ")");
			subRegion[3].append("circle").attr("cx", w / 6).attr("cy", h * 0.8 / 4).attr("r", 0).transition().duration(1000).attr("r", 60).attr("fill", "#888");;
			subRegion[0].append("text").transition().delay(1000).duration(1000).attr("x", sPentPoints[3].x + 10).attr("y", sPentPoints[3].y + 30).attr("fill", "yellow").attr("font-size", 10).text(t3);
			subRegion[3].append("text").transition().delay(1000).duration(1000).attr("x", sPentPoints[3].x + 20).attr("y", sPentPoints[3].y + 30).attr("fill", "yellow").attr("font-size", 10).text(t2);
		}
	}

	function playText(t) {
		var text = textLayer.selectAll(".t");
		if (!text.empty()) {
			if (!t) {
				//Remove last text
				//text.transition().duration(2000).attr("fill", "#000000").remove();
				clearInterval(timer);
				return;
			}
			text.transition().duration(1000).attr("fill", "#000").remove().each("end", function() {
				textLayer.selectAll(".t").data([t]).enter().append("text").classed("t", true).transition().duration(2000).attr("x", 10).attr("y", 10).attr("fill", "#888").text(function(d) {
					return d;
				});

			});
		} else {
			text.data([t]).enter().append("text").classed("t", true).transition().duration(2000).attr("x", 10).attr("y", 10).attr("fill", "#888").text(function(d) {
				return d;
			});
		}
	}

	function pentagramPoint(cx, cy, r, angel) {
		var result = [],
			dx, dy;
		var length = 5,
			alpha = 2 * Math.PI / length;
		if (angel === undefined) {
			angel = 0;
		}
		for (var i = 0; i < length; i++) {
			dx = r * Math.sin(alpha * i + angel);
			dy = r * Math.cos(alpha * i + angel);

			var o = {};
			o.x = cx + dx;
			o.y = cy - dy;
			result.push(o);
		}
		return result;
	}

	function centerPoint(width, height) {
		var result = {};
		result.x = width / 2;
		result.y = height / 2;
		return result;
	}

	function drawPoints(layer, points, transition) {
		var j = 0,
			length = points.length;
		for (; j < length; j++) {
			if (transition) {
				layer.append("circle").transition().duration(2000).attr("cx", points[j].x).attr("cy", points[j].y).attr("r", 10).attr("fill", "#888");
			} else {
				layer.append("circle").attr("cx", points[j].x).attr("cy", points[j].y).attr("r", 10).attr("fill", "#888");
			}
		}
	}

	function drawFault(layer, cx, cy, width, height) {
		var x1 = cx - width / 2;
		var y1 = cy - height / 2;
		var x2 = cx + width / 2;
		var y2 = cy + height / 2;
		layer.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x1).attr("y2", y1).transition().duration(1000).attr("x2", x2).attr("y2", y2).attr("stroke", "red").attr("stroke-width", 5).each("end", function() {
			layer.append("line").attr("x1", x2).attr("y1", y1).attr("x2", x2).attr("y2", y1).transition().duration(1000).attr("x2", x1).attr("y2", y2).attr("stroke", "red").attr("stroke-width", 5)
		});
	}

	function drawPoly(layer, points) {
		var length = points.length,
			i = 0;
		drawLine(points[0], points[1]);

		function drawLine(p1, p2) {
			layer.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p1.x).attr("y2", p1.y).transition().duration(1000).attr("x2", p2.x).attr("y2", p2.y).attr("stroke", "#888").attr("stroke-width", 2).each("end", function() {
				i++;
				if (i < length - 1) {
					drawLine(points[i], points[i + 1]);
				} else if (i === length - 1) {
					drawLine(points[i], points[0]);
				}
			});
		}
	}

	function layoutGrid(layer, col, row, width, height) {
		var i, j, result = [],
			deltaX = width / col,
			deltaY = height / row;
		for (i = 0; i < col; i++) {
			for (j = 0; j < row; j++) {
				var region = layer.append("svg:g").attr("transform", "translate(" + deltaX * i + "," + deltaY * j + ")").classed("rg", true);
				result.push(region);
			}
		}
		return result;
	}

	function subPoints() {
		var result = [];
		var sCenter = centerPoint(w / 3, h * 0.8 / 2);
		var sPentPoints = pentagramPoint(sCenter.x, sCenter.y, 60);
		var result1 = [];
		for (var i = 0; i < sPentPoints.length; i++) {
			result1.push(sPentPoints[i]);
		}
		result.push(result1);
		var result2 = [sPentPoints[0], sPentPoints[2], sPentPoints[3]];
		result.push(result2);
		var result3 = [sPentPoints[0], sPentPoints[2], sPentPoints[3]];
		var v3p = {
			x: sCenter.x,
			y: sCenter.y + 10
		};
		result3.push(v3p);
		result.push(result3);

		var result4 = [sPentPoints[0], sPentPoints[2], sPentPoints[4], sPentPoints[1], sPentPoints[3]];
		result.push(result4);

		var result5;
		var v5p1 = {
			x: sPentPoints[3].x - 10,
			y: sPentPoints[0].y - 30
		};
		var v5p2 = {
			x: sPentPoints[2].x + 10,
			y: sPentPoints[0].y - 40
		};
		result5 = [sPentPoints[0], v5p2, sPentPoints[2], sPentPoints[3], v5p1];
		result.push(result5);

		var result6 = [sPentPoints[0], sPentPoints[2], sPentPoints[3]];
		result.push(result6);
		return result;
	}

	function transitLayers(l1, l2) {
		l1.transition().duration(1000).attr("transform", "scale(0,0)").each("end", function() {
			d3.select(this).attr("visibility", "hidden");
		})
		l2.attr("visibility", "visible").transition().attr("transform", "scale(1,1)");
	}
});