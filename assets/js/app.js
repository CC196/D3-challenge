var svgWidth = 960;
var svgHeight = 500;
var margin ={
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
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

function renderAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
};

function renderCircles(circlesGroup,newXScale, chosenXAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d=> newXScale(d[chosenXAxis]));
    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(Data, err){
    if (err) throw err;

    Data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    // var xScale = d3.scaleLinear()
    // .domain([d3.min(Data, d=>d.poverty)-1,d3.max(Data, d=>d.poverty)+1])
    // .range([0, width]);
    // var yScale = d3.scaleLinear()
    // .domain([d3.min(Data, d=>d.healthcare)-1,d3.max(Data, d=>d.healthcare)+1])
    // .range([height,0]);
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
    
    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d=> xScale(d.poverty))
        .attr("cy", d=> yScale(d.healthcare))
        .attr("r",10)
        .attr("fill","purple")
        .attr("opacity",".5");

    //label
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var poverLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");
    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median)");
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - ((height + margin.bottom) / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

    labelsGroup.selectAll("text").on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis){
            chosenXAxis = value;
            xScale = get_X_Scale(Data, chosenXAxis);
            xAxis = renderAxes(xScale, xAxis);
            circlesGroup = renderCircles(circlesGroup, xScale, chosenXAxis);
            if (chosenXAxis === "age"){
                poverLabel.classed("active",false).classed("inactive",true);
                ageLabel.classed("active",true).classed("inactive",false);
            }
            else{
                ageLabel.classed("active",false).classed("inactive",true);
                poverLabel.classed("active",true).classed("inactive",false);
            }
        }
    });
    

}).catch(function(error){
    console.log(error);
})
