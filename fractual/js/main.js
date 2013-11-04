var w = 1000,
	h = 600;

$(document).ready(function() {
	var root = d3.select("#chart").append("svg").attr("width", w).attr("height", h);

	var p1 = {
		x: 100,
		y: 150
	};
	var p2 = {
		x: 500,
		y: 150
	};

	var p3 = getFractual(p2, p1);


	var line1 = drawLine(p1, p2);
	var line2 = drawLine(p2, p3);
	var line3 = drawLine(p3, p1);

	var lineList = [{
		line: line1,
		p1: p1,
		p2: p2
	}, {
		line: line2,
		p1: p2,
		p2: p3
	}, {
		line: line3,
		p1: p3,
		p2: p1
	}];

	setTimeout(function() {
		doF(lineList, 0);
	}, 1000);

	function doF(lines, depth) {
		var mydepth = depth + 1;
		if (mydepth === 8) {
			return;
		}

		for (var i = 0; i < lines.length; i++) {
			var sublines = doFractural(lines[i].line, lines[i].p1, lines[i].p2);
			setTimeout(runner(sublines, mydepth), 1000);
		}
	}

	var runner = function(l, d) {
		return function() {
			doF(l, d);
		}
	};

	function split(point1, point2) {
		var dx = (point2.x - point1.x) / 3;
		var dy = (point2.y - point1.y) / 3;

		var p11 = {}, p22 = {};
		p11.x = point1.x + dx;
		p11.y = point1.y + dy;
		p22.x = point2.x - dx;
		p22.y = point2.y - dy;
		return [p11, p22];
	}

	function drawLine(point1, point2) {
		var line = root.append("line").attr("x1", point1.x).attr("y1", point1.y).attr("x2", point2.x).attr("y2", point2.y).style("stroke", "#DDD").style("stroke-width", 2);
		return line;
	}

	function drawPoint(point) {
		root.append("circle").attr("cx", point.x).attr("cy", point.y).attr("r", 5).style("stroke", "#000").style("stroke-width", 1);
	}

	function getFractual(point1, point2) {
		var angel = Math.PI / 6 + Math.atan((point2.y - point1.y) / (point2.x - point1.x));
		var r = Math.sqrt((point2.y - point1.y) * (point2.y - point1.y) + (point2.x - point1.x) * (point2.x - point1.x));
		var dx = Math.sin(angel) * r;
		var dy = Math.cos(angel) * r;

		var p3 = {};
		if (point1.x > point2.x) {
			p3.x = point1.x - dx;
			p3.y = point1.y + dy;
		} else {
			p3.x = point1.x + dx;
			p3.y = point1.y - dy;
		}

		return p3;
	}

	function doFractural(line, point1, point2) {
		var pts = split(point1, point2);

		//drawPoint(pts[0]);
		//drawPoint(pts[1]);

		var l1 = drawLine(point1, pts[0]);
		var l2 = drawLine(pts[0], pts[1]);
		var l3 = drawLine(pts[1], pts[0]);
		var l4 = drawLine(pts[1], point2);
		line.remove();

		var p3 = getFractual(pts[0], pts[1]);

		//drawPoint(p3);
		l2.transition().duration(1000).attr("x2", p3.x).attr("y2", p3.y);
		l3.transition().duration(1000).attr("x2", p3.x).attr("y2", p3.y);

		return [{
			line: l1,
			p1: point1,
			p2: pts[0]
		}, {
			line: l2,
			p1: pts[0],
			p2: p3
		}, {
			line: l3,
			p1: p3,
			p2: pts[1]
		}, {
			line: l4,
			p1: pts[1],
			p2: point2
		}];
	}

});