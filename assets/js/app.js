var svgWidth = 800;
var svgHeight = 500;
var margin ={
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.right - margin.left;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height",svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// function get_X_Scale(Data, chosenXAxis){
//     var xScale = d3.scaleLinear()
//         .domain()
//         .range([0, width]);
//     return xScale;
// };

// function get_Y_Scale(Data, chosenYAxis){
//     var yScale = d3.scaleLinear()
//         .domain()
//         .range([height,0]);
//     return yScale;
// }


d3.csv("assets/data/data.csv").then(function(Data, err){
    if (err) throw err;

    Data.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    var xScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d.poverty)-1,d3.max(Data, d=>d.poverty)+1])
    .range([0, width]);
    var yScale = d3.scaleLinear()
    .domain([d3.min(Data, d=>d.healthcare)-1,d3.max(Data, d=>d.healthcare)+1])
    .range([height,0]);

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
    
    

}).catch(function(error){
    console.log(error);
})
