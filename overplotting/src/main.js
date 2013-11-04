$(document).ready(function() {
	var margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 40
	}, width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var grid = 30;
	var startYear = 1850,
		endYear = 2009;
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	var color = d3.scale.category10();
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	var svg = d3.select("body").append("svg").attr("id", "SVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var svg1 = d3.select("body").append("svg").attr("id", "aggSVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var currentData;
	var t1, t2, t3;

	$("#slider").attr("min", "" + startYear);
	$("#slider").attr("max", "" + endYear);
	$("#slider").attr("value", "" + startYear);

	update(data, "INCOME", "LIFEEXPECTANCY", "REGION", "1850");

	$("#slider").change(function() {
		console.log(this.value);
		update(data, "INCOME", "LIFEEXPECTANCY", "REGION", this.value);
	});

	$("#heatgr").change(function() {
		grid = parseInt($("#heatgr").attr("value"));
		$("#aggSVG").empty();
		svg1 = d3.select("#aggSVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		buildPlotAgg(currentData, "INCOME", "LIFEEXPECTANCY");
	});

	$("#hideGrid").change(function() {
		if ($('#hideGrid').is(':checked')) {
			svg1.selectAll(".dot").style("stroke-width", 0);
		} else {
			svg1.selectAll(".dot").style("stroke-width", 1);
		}
	});

	$("#hideNumber").change(function() {
		if ($('#hideNumber').is(':checked')) {
			svg1.selectAll(".text").style("visibility", "hidden");
		} else {
			svg1.selectAll(".text").style("visibility", "visible");
		}
	});

	function clearSVG1() {
		$("#aggSVG").empty();
		svg1 = d3.select("#aggSVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	};

	function clearSVG() {
		$("#SVG").empty();
		svg = d3.select("#SVG").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	};

	function update(data, xMeasure, yMeasure, colorDim, yearRange) {
		//Get Time Scale
		var query = JSLINQ(data).Where(function(item) {
			return item.YEAR < yearRange;
		}).Select(function(item) {
			return item;
		});

		currentData = query.items;

		$("#dataNumber").text("Data points : " + query.items.length);
		clearSVG1();
		clearSVG();
		if(currentData.length > 0 ) {
			buildPlot(currentData, xMeasure, yMeasure, colorDim);
			buildPlotAgg(currentData, xMeasure, yMeasure);
		}
	}

	function buildPlot(data, xMeasure, yMeasure, colorDim) {
		t1 = (new Date()).getTime();
		x.domain(d3.extent(data, function(d) {
			return d[xMeasure];
		})).nice();
		y.domain(d3.extent(data, function(d) {
			return d[yMeasure];
		})).nice();

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(xMeasure);

		svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yMeasure)

		svg.selectAll(".dot").data(data).enter().append("circle").attr("class", "dot").attr("r", 3.5).attr("cx", function(d) {
			return x(d[xMeasure]);
		}).attr("cy", function(d) {
			return y(d[yMeasure]);
		}).style("fill", function(d) {
			return color(d[colorDim]);
		});

		var legend = svg.selectAll(".legend").data(color.domain()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
			return "translate(0," + i * 20 + ")";
		});

		legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);

		legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
			return d;
		});
		t2 = (new Date()).getTime();
		$("#t0").text(t2 - t1);
	}

	function buildPlotAgg(data, xMeasure, yMeasure) {
		t1 = (new Date()).getTime();
		x.domain(d3.extent(data, function(d) {
			return d[xMeasure];
		})).nice();
		y.domain(d3.extent(data, function(d) {
			return d[yMeasure];
		})).nice();

		svg1.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(xMeasure);

		svg1.append("g").attr("class", "y axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yMeasure)

		var gridData = buildGrid();
		updateAgg(data, xMeasure, yMeasure, gridData);
		t2 = (new Date()).getTime();
		renderAgg(gridData, xMeasure, yMeasure);
		t3 = (new Date()).getTime();
		$("#t1").text(t2 - t1);
		$("#t2").text(t3 - t2);
	}

	function buildGrid() {
		var i = 0,
			j = 0,
			gridData = [];
		var dx = (d3.max(x.domain()) - d3.min(x.domain())) / grid;
		var dy = (d3.max(y.domain()) - d3.min(y.domain())) / grid;
		var x0 = d3.min(x.domain()),
			x1 = x0 + dx;
		for (; i < grid; i++) {
			var y0 = d3.min(y.domain()),
				y1 = y0 + dy;
			j = 0;
			var col = [];
			gridData.push(col);
			for (; j < grid; j++) {
				var obj = {};
				obj.x0 = x0;
				obj.y0 = y0;
				obj.x1 = x1;
				obj.y1 = y1;
				obj.col = i;
				obj.row = j;
				y0 = y1;
				y1 = y1 + dy;
				obj.val = 0;
				col.push(obj);
			}
			x0 = x1;
			x1 = x1 + dx;
		}
		return gridData;
	}

	function updateAgg(data, xMeasure, yMeasure, gridData) {
		var xDomain = x.domain(),
			yDomain = y.domain();
		var dx = (d3.max(x.domain()) - d3.min(x.domain())) / grid;
		var dy = (d3.max(y.domain()) - d3.min(y.domain())) / grid;
		var i = 0,
			length = data.length;

		for (; i < length; i++) {
			var xv = data[i][xMeasure];
			var yv = data[i][yMeasure];

			var colIndex = Math.floor((xv - d3.min(x.domain())) / dx);
			var rowIndex = Math.floor((yv - d3.min(y.domain())) / dy);

			gridData[colIndex][rowIndex].val++;
		}
	}

	function renderAgg(gridData, xMeasure, yMeasure) {
		var heatScale = d3.scale.linear().domain([0, currentData.length * 100 / (grid * grid)]).range(["#eeeeee", "red"]);
		var col = svg1.selectAll(".col").data(gridData).enter().append("g").attr("class", "col");
		col.selectAll(".dot").data(function(d) {
			return d;
		}).enter().append("rect").attr("class", "dot").attr("x", function(d) {
			return x(d.x0);
		}).attr("y", function(d) {
			return y(d.y1);
		}).attr("width", function(d) {
			return x(d.x1) - x(d.x0);
		}).attr("height", function(d) {
			return y(d.y0) - y(d.y1);
		}).style("fill", function(d) {
			if (d.val === 0) {
				return "white";
			} else {
				return heatScale(d.val);
			}
		}).style("stroke", "#cccccc");

		col.selectAll(".text").data(function(d) {
			return d;
		}).enter().append("text").attr("class", "text").attr("x", function(d) {
			return x(d.x0);
		}).attr("y", function(d) {
			return y(d.y1) + 8;
		}).attr("fill", "black").text(function(d) {
			if (d.val === 0) {
				return "";
			} else {
				return d.val
			}
		});
	}
});