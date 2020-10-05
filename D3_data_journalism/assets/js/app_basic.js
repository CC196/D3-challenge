var svgWidth = 1000;
var svgHeight = 500;
var margin ={
    top: 20,
    right: 40,
    bottom: 80,
    left: 60
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.right - margin.left;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height",svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

function get_X_Scale(Data, chosenXAxis){
    var xScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d[chosenXAxis])-1,d3.max(Data, d=>d[chosenXAxis])+1])
    .range([0, width]);
    return xScale;
};

function get_Y_Scale(Data, chosenYAxis){
    var yScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d[chosenYAxis])-1,d3.max(Data, d=>d[chosenYAxis])+1])
    .range([height,0]);
    return yScale;
};


d3.csv("assets/data/data.csv").then(function(Data, err){
    if (err) throw err;

    Data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
    var xScale = get_X_Scale(Data, chosenXAxis);
    var yScale = get_Y_Scale(Data, chosenYAxis);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d=> xScale(d[chosenXAxis]))
        .attr("cy", d=> yScale(d[chosenYAxis]))
        .attr("r",15)
        .attr("fill","purple")
        .attr("opacity",".9");

    //label
    var x_labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var poverLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("xaxis active", true)
    .text("In Poverty (%)");
    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - ((height + margin.bottom) / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("yaxis active", true)
    .text("Lacks Healthcare (%)");
    chartGroup.selectAll("#circle_text")
    .data(Data)
    .enter()
    .append("text")
    .classed("circle_text", true)
    .text(d=>d.abbr)
    .attr("dx", d=> xScale(d[chosenXAxis])-5)
    .attr("dy", d=> yScale(d[chosenYAxis])+5)
    .style("fill", "white")
    .style("font-size","10px");

    

}).catch(function(error){
    console.log(error);
})
