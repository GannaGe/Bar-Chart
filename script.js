var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = function () {
  /* converting JSON into js object */
  data = JSON.parse(req.responseText);
  value = data.data;

  svgContainer();
  scales();
  bars();
  axises();
};

req.send();

var data;
var value = [];
var xAxisSc;
var yAxisSc;
var xScale;
var yScale;
var scales;

var width = 800;
var height = 500;
var padding = 70;

var svg = d3.select("svg");

var svgContainer = function () {
  svg.attr("width", width);
  svg.attr("height", height);
};

/* generating scales */
scales = function () {
  yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(value, (item) => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, value.length - 1])
    .range([padding, width - padding]);

  /* creating new dates array to convert  string dates to numerical values */
  var dates = value.map((item) => {
    return new Date(item[0]);
  });

  xAxisSc = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yAxisSc = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(value, (item) => {
        return item[1];
      }),
    ])
    .range([height - padding, padding]);
};
/* generating axises */
var axises = function () {
  var xAxis = d3.axisBottom(xAxisSc);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  var yAxis = d3.axisLeft(yAxisSc);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};

/* creating bars */
var bars = () => {
  /* creating a tooltip */
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("width", "120px")
    .style("height", "20px")
    .style("padding", "10px")
    .style("margin-top", "10px")
    .style("border-radius", "4px")
    .style("visibility", "hidden");

  svg
    .selectAll("rect")
    .data(value)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / value.length)
    .attr("data-date", (item) => {
      return item[0];
    })
    .attr("data-gdp", (item) => {
      return item[1];
    })
    .attr("height", (item) => {
      return yScale(item[1]);
    })
    /* positioning of bars */
    .attr("x", (item, index) => {
      return xScale(index);
    })
    .attr("y", (item) => {
      return height - padding - yScale(item[1]);
    })
    .on("mouseover", (item, index) => {
      tooltip.transition().style("visibility", "visible");
      tooltip.text(index[0]);

      document.querySelector("#tooltip").setAttribute("data-date", index[0]);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};
