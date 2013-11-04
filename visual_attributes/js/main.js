var w = 1000,
	h = 600;

var cols = 5,
	rows = 5,
	iw = w / cols,
	ih = h / rows,
	marginX = 10,
	marginY = 10;

var duration = 3000;
$(document).ready(function() {
	var root = d3.select("#chart").append("svg").attr("width", w).attr("height", h);
	var i, j, views = [];

	//create views
	for (i = 0; i < rows; i++) {
		for (j = 0; j < cols; j++) {
			var textLayer = root.append("svg:g").attr("transform", "translate(" + i * iw + "," + j * ih + ")");
			views.push(textLayer);
		}
	}

	//Draw Header Line
	root.append("line").attr("x1", 0).attr("y1", ih * 2).attr("x2", iw * 4).attr("y2", ih * 2).attr("stroke", "#ccc").attr("stroke-width", 1);
	root.append("line").attr("x1", 0).attr("y1", ih * 3).attr("x2", iw * 4).attr("y2", ih * 3).attr("stroke", "#ccc").attr("stroke-width", 1);
	root.append("line").attr("x1", 0).attr("y1", ih * 4).attr("x2", iw * 4).attr("y2", ih * 4).attr("stroke", "#ccc").attr("stroke-width", 1);
	root.append("line").attr("x1", iw).attr("y1", 0).attr("x2", iw).attr("y2", ih * 5).attr("stroke", "#ccc").attr("stroke-width", 1);

	//Draw header Text
	var textData = ["Form", "", "Color", "Spatial Position", "Montion"];

	root.selectAll(".title").data(textData).enter().append("text").classed("title", true).attr("x", 10).attr("y", function(d, i) {
		return i * ih + 30;
	}).attr("fill", "#ccc").attr("font-size", 20).text(function(d) {
		return d;
	});

	//Draw Sub Text
	var subTextData = [];
	subTextData.push(["length", "width", "size", "shape", "orientation", "enclosure"]);
	subTextData.push(["hue", "indensity"]);
	subTextData.push(["2d-position", "spatialgroup"]);
	subTextData.push(["direction"]);

	drawTexts(views[0], subTextData[0]);
	drawTexts(views[2], subTextData[1]);
	drawTexts(views[3], subTextData[2]);
	drawTexts(views[4], subTextData[3]);

	//Define Blur here
	var filter = root.append("defs").append("filter").attr("id", "f1").attr("x", 0).attr("y", 0);
	filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 6).attr("result", "blur");

	//Draw each view
	drawLength(views[5]);
	drawWidth(views[10]);
	drawSize(views[15]);
	drawShape(views[6]);
	//drawBlur(views[11]);
	drawOrientation(views[11]);
	drawEnclosure(views[16]);

	drawHue(views[7]);
	drawIndensity(views[12]);

	draw2dPosition(views[8]);
	drawSpatialGroup(views[13]);

	drawDirection(views[9]);

});

function drawLength(view) {
	var dx = (iw - marginX * 2) / 4;
	var x0 = marginX;
	var y1 = marginY;
	var y2 = ih - marginY;
	var data = [y1, y1, y1, y1];

	for (var i = 0; i < 4; i++) {
		var aline = view.append("line").attr("x1", i * dx + x0 + dx / 2)
			.attr("y1", y1)
			.attr("x2", i * dx + x0 + dx / 2)
			.attr("y2", y2)
			.style("stroke", "#555")
			.style("stroke-width", 2);

		if (i === 2) {
			aline.classed("length", true).transition().duration(duration).attr("y1", y1 + 30);
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".length").transition().duration(duration / 2).attr("y1", y1).transition().duration(duration / 2).attr("y1", y1 + 30);
		highlightText("length");
	}).on("mouseout", function() {
		unhighlightText("length");
	});

}

function drawWidth(view) {
	var dx = (iw - marginX * 2) / 4;
	var x0 = marginX;
	var y1 = marginY;
	var y2 = ih - marginY;

	for (var i = 0; i < 4; i++) {
		var aline = view.append("line").classed("line", true).attr("x1", i * dx + x0 + dx / 2)
			.attr("y1", y1).attr("x2", i * dx + x0 + dx / 2)
			.attr("y2", y2).style("stroke", "#555").style("stroke-width", 2);

		if (i === 2) {
			aline.classed("width", true).transition().duration(duration).style("stroke-width", 10);
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".width").transition().duration(duration / 2).style("stroke-width", 2).transition().duration(duration / 2).style("stroke-width", 10);
		highlightText("width");
	}).on("mouseout", function() {
		unhighlightText("width");
	});

}

function drawSize(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;
			var circle = view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

			if (i === 1 && j === 1) {
				circle.classed("size", true).transition().duration(duration).attr("r", 20);
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".size").transition().duration(duration / 2).attr("r", 10).transition().duration(duration / 2).attr("r", 20);
		highlightText("size");
	}).on("mouseout", function() {
		unhighlightText("size");
	});
}

function drawEnclosure(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20,
		bSize = 25;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;
			view.append("rect").attr("x", cx - size / 2).attr("y", cy - size / 2).attr("width", size).attr("height", size).attr("fill", "#555");

			if (i === 1 && j === 1) {
				view.append("rect").classed("enclosure", true).attr("x", cx - bSize / 2).attr("y", cy - bSize / 2).attr("width", bSize).attr("height", bSize).attr("stroke", "#fff").attr("stroke-width", 2).attr("fill", "none").transition().duration(duration).attr("stroke", "#555");
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".enclosure").transition().duration(duration / 2).attr("stroke", "#fff").transition().duration(duration / 2).attr("stroke", "#555");
		highlightText("enclosure");
	}).on("mouseout", function() {
		unhighlightText("enclosure");
	});
}

function drawShape(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	var aniX, aniY;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

			if (i === 1 && j === 1) {
				view.append("rect").classed("shape", true).attr("x", cx).attr("y", cy).attr("width", 0).attr("height", 0).attr("fill", "#555").transition().duration(duration).attr("width", size).attr("height", size).attr("x", cx - size / 2).attr("y", cy - size / 2);
				aniX = cx;
				aniY = cy;
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".shape").transition().duration(duration / 2).attr("x", aniX).attr("y", aniY).attr("width", 0).attr("height", 0).attr("fill", "#555").transition().duration(duration / 2).attr("width", size).attr("height", size).attr("x", aniX - size / 2).attr("y", aniY - size / 2);
		highlightText("shape");
	}).on("mouseout", function() {
		unhighlightText("shape");
	});
}

function drawBlur(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var circle = view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

			if (i === 1 && j === 1) {
				circle.attr("filter", "url(#f1)");

				var clip = view.append("defs").append("svg:clipPath")
					.attr("id", "clip")
					.append("svg:circle")
					.attr("id", "clip-circle")
					.attr("cx", cx)
					.attr("cy", cy)
					.attr("r", 11)

				circle.attr("clip-path", "url(#clip)");

				var grad = view.append("defs").append("radialGradient")
					.attr("id", "grad1")
					.attr("cx", "50%")
					.attr("cy", "50%")
					.attr("r", "50%");

				grad.append("stop").attr("offset", "0%").style("stop-color", "#555").style("stop-opacity", 1);
				grad.append("stop").attr("offset", "100%").style("stop-color", "#555").style("stop-opacity", 0.2);
				circle.attr("fill", "url(#grad1)");
			}
		}
	}
}


function drawHue(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var circle = view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

			if (i === 1 && j === 1) {
				circle.classed("hue", true).transition().duration(duration).attr("fill", "red");
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".hue").transition().duration(duration / 2).attr("fill", "#555").transition().duration(duration / 2).attr("fill", "red");
		highlightText("hue");
	}).on("mouseout", function() {
		unhighlightText("hue");
	});
}

function drawIndensity(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var circle = view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

			if (i === 1 && j === 1) {
				circle.classed("indensity", true).transition().duration(duration).attr("fill", "#ddd");
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".indensity").transition().duration(duration / 2).attr("fill", "#555").transition().duration(duration / 2).attr("fill", "#ddd");
		highlightText("indensity");
	}).on("mouseout", function() {
		unhighlightText("indensity");
	});
}

function draw2dPosition(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	var move = null,
		dix, diy;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			if (j === 1) {
				var circle = view.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");

				if (i === 3) {
					move = circle.classed("position", true).transition().duration(duration).attr("cy", cy - dy);
					dix = cx;
					diy = cy;
				}
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {;
		d3.selectAll(".position").transition().duration(duration / 2).attr("cy", diy).transition().duration(duration / 2).attr("cy", diy - dy);
		highlightText("2d-position");
	}).on("mouseout", function() {
		unhighlightText("2d-position");
	});
}

function drawSpatialGroup(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	var count = 0;

	var data = [
		[40, 30],
		[62, 28],
		[83, 38],
		[72, 50],
		[50, 46],
		[32, 52],
		[43, 70],
		[68, 68],
		[150, 100],
		[130, 95],
		[155, 78],
		[175, 90]
	];

	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var circle = view.append("circle").datum([cx, cy]).classed("spatial", true).attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555");
		}
	}

	d3.selectAll(".spatial").transition().duration(duration).attr("cx", function(d, i) {
		return data[i][0];
	}).attr("cy", function(d, i) {
		return data[i][1];
	});

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".spatial").transition().duration(duration / 2)
			.attr("cx", function(d, i) {
			return d[0];
		}).attr("cy", function(d, i) {
			return d[1];
		}).transition().duration(duration / 2).attr("cx", function(d, i) {
			return data[i][0];
		}).attr("cy", function(d, i) {
			return data[i][1];
		});
		highlightText("spatialgroup");
	}).on("mouseout", function() {
		unhighlightText("spatialgroup");
	});
}

function drawDirection(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var dix = Math.cos(Math.random() * Math.PI / 2) * 20;
			var diy = Math.sin(Math.random() * Math.PI / 2) * 20;

			function onEnd(selection) {
				selection.transition().attr("cx", function(d) {
					return d.cx + d.dix;
				}).attr("cy", function(d) {
					return d.cy + d.diy;
				}).transition().attr("cx", function(d) {
					return d.cx;
				}).attr("cy", function(d) {
					return d.cy;
				}).each("end", function() {
					onEnd(selection);
				});
			}

			var data = {
				cx: cx,
				cy: cy,
				dix: dix,
				diy: diy
			};

			var circle = view.append("circle").classed("direction", true)
				.datum(data)
				.attr("cx", cx).attr("cy", cy).attr("r", 10).attr("fill", "#555")
				.transition().duration(duration / 2).attr("cx", cx + dix).attr("cy", cy + diy)
				.transition().duration(duration / 2).attr("cx", cx).attr("cy", cy).each("end", function() {
				//onEnd(d3.select(this));
			});

			var line = view.append("line").classed("drline", true).attr("x1", cx).attr("x2", cx + dix)
				.attr("y1", cy).attr("y2", cy + diy).attr("stroke", "#555").attr("stroke-width", 1);
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		//TODO
		//Start Transition
		var circle = d3.selectAll(".direction").transition().duration(duration / 2).attr("cx", function(d) {
			return d.cx + d.dix;
		}).attr("cy", function(d) {
			return d.cy + d.diy;
		}).transition().duration(duration / 2).attr("cx", function(d) {
			return d.cx;
		}).attr("cy", function(d) {
			return d.cy;
		});
		highlightText("direction");
	}).on("mouseout", function() {
		unhighlightText("direction");
	});
}

function drawOrientation(view) {
	var dx = (iw - marginX * 2) / 4;
	var dy = (ih - marginY * 2) / 3;
	var i, j;
	var size = 20;
	var aniX = 0,
		aniY = 0;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 3; j++) {
			var cx = marginX + dx * i + dx / 2;
			var cy = marginY + dy * j + dy / 2;

			var x1 = x2 = cx;
			var y1 = cy - 10;
			var y2 = cy + 10;

			var line = view.append("line").attr("x1", x1).attr("x2", x2)
				.attr("y1", y1).attr("y2", y2).attr("stroke", "#555").attr("stroke-width", 2);

			if (i === 1 && j === 1) {
				line.classed("orientation", true).transition().duration(duration).attr("transform", "rotate(-45 " + cx + " " + cy + ")");
				aniX = cx;
				aniY = cy;
			}
		}
	}

	view.append("rect").attr("x", 0).attr("y", 0).attr("width", iw).attr("height", ih)
		.style("fill-opacity", 0).on("mouseover", function() {
		d3.selectAll(".orientation").transition().duration(duration / 2).attr("transform", "").transition().duration(duration / 2).attr("transform", "rotate(-45 " + aniX + " " + aniY + ")");
		highlightText("orientation");
	}).on("mouseout", function() {
		unhighlightText("orientation");
	});
}

function drawTexts(view, strList) {
	for (var i = 0; i < strList.length; i++) {
		view.append("text").attr("id", "title-" + strList[i]).attr("x", 30).attr("y", function(d) {
			return i * 15 + 50;
		}).attr("fill", "#ccc").attr("font-size", 15).text(strList[i]);
	}
}

function highlightText(title) {
	d3.select("#title-" + title).attr("fill", "red");
}

function unhighlightText(title) {
	d3.select("#title-" + title).attr("fill", "#ccc");
}