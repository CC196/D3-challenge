var svgWidth = 960;
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

// x Linear Scale
function get_X_Scale(Data, chosenXAxis){
    var xScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d[chosenXAxis])-1,d3.max(Data, d=>d[chosenXAxis])+1])
    .range([0, width]);
    return xScale;
};
// Y Linear Scale
function get_Y_Scale(Data, chosenYAxis){
    var yScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d[chosenYAxis])-1,d3.max(Data, d=>d[chosenYAxis])+1])
    .range([height,0]);
    return yScale;
};
// Change bottom Axis
function renderAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
};
// Change Left Axis
function renderLEFTAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
    .duration(1000)
    .call(leftAxis);
    return yAxis;
}
// Change Circle's X
function renderX(circlesGroup,newXScale, chosenXAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d=> newXScale(d[chosenXAxis]));
    return circlesGroup;
};
// Change Circle's Y
function renderY(circlesGroup,newYScale, chosenYAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cy", d=> newYScale(d[chosenYAxis]));
    return circlesGroup;
};
// Change Circle's text
function renderText(TextGroup, newXScale, newYScale,chosenXAxis,chosenYAxis){
    TextGroup.transition()
    .duration(1000)
    .attr("dx", d=> newXScale(d[chosenXAxis])-5)
    .attr("dy", d=> newYScale(d[chosenYAxis])+5);
    return TextGroup;
}

d3.csv("assets/data/data.csv").then(function(Data, err){
    if (err) throw err;

    Data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });
    // initial to poverty vs healthcare
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
    // set scale
    var xScale = get_X_Scale(Data, chosenXAxis);
    var yScale = get_Y_Scale(Data, chosenYAxis);
    // set axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    // Circle
    var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d=> xScale(d[chosenXAxis]))
        .attr("cy", d=> yScale(d[chosenYAxis]))
        .attr("r",10)
        .attr("fill","purple")
        .attr("opacity",".8");

    //label
    var x_labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var poverLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("xaxis active", true)
    .text("In Poverty (%)");
    var ageLabel = x_labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") 
    .classed("xaxis inactive", true)
    .text("Age (median)");
    // Y label
    var HCLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - ((height + margin.bottom) / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("yaxis active", true)
    .text("Lacks Healthcare (%)");
    var SKLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - ((height + margin.bottom) / 2))
    .attr("dy", "1em")
    .classed("yaxis inactive", true)
    .attr("value", "smokes")
    .text("Smokes (%)");
    // Text in Circle
    var C_text_Group = chartGroup.selectAll("#circle_text")
    .data(Data)
    .enter()
    .append("text")
    .classed("circle_text", true)
    .text(d=>d.abbr)
    .attr("dx", d=> xScale(d[chosenXAxis])-5)
    .attr("dy", d=> yScale(d[chosenYAxis])+5)
    .style("fill", "white")
    .style("font-size","10px");
    // bottom axis listen event
    x_labelsGroup.selectAll(".xaxis").on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis){
            chosenXAxis = value;
            xScale = get_X_Scale(Data, chosenXAxis); // new x scale
            xAxis = renderAxes(xScale, xAxis); // new x axis
            circlesGroup = renderX(circlesGroup, xScale, chosenXAxis); // new circle
            C_text_Group = renderText(C_text_Group, xScale, yScale,chosenXAxis,chosenYAxis); // new text in circle
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
    // left axis listen event
    chartGroup.selectAll(".yaxis").on("click",function(){
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis){
            chosenYAxis = value;
            yScale = get_Y_Scale(Data, chosenYAxis);
            yAxis = renderLEFTAxes(yScale, yAxis);
            circlesGroup = renderY(circlesGroup, yScale, chosenYAxis);
            C_text_Group = renderText(C_text_Group, xScale, yScale,chosenXAxis,chosenYAxis);
            if (chosenYAxis === "smokes"){
                HCLabel.classed("active",false).classed("inactive",true);
                SKLabel.classed("active",true).classed("inactive",false);
            }
            else{
                SKLabel.classed("active",false).classed("inactive",true);
                HCLabel.classed("active",true).classed("inactive",false);
            }
        }
    });
    

}).catch(function(error){
    console.log(error);
})
