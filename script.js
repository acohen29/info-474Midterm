// Alexander Cohen
// Info 474 Week 3 D3 Visualizations
// 1/31/2020

(function(){
    "use strict";
    let data = ""
    let margin = {top: -50, right: 30, bottom: 50, left: 10};
    let width = 550 - margin.left - margin.right;
    let height = 550 - margin.top - margin.bottom;

    const colors = {
        "Bug": "#4E79A7",
        "Dark": "#A0CBE8",
        "Electric": "#F28E2B",
        "Fairy": "#FFBE7D",
        "Fighting": "#59A14F",
        "Fire": "#8CD17D",
        "Ghost": "#B6992D",
        "Grass": "#499894",
        "Ground": "#86BCB6",
        "Ice": "#FABFD2",
        "Normal": "#E15759",
        "Poison": "#FF9D9A",
        "Psychic": "#79706E",
        "Steel": "#BAB0AC",
        "Water": "#D37295",
        "Dragon": "#7038F8",
        "Rock": "#B8A038",
        "Flying": "#A890F0"
    }

    let display = d3.select('body')
        .append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv("pokemon.csv")
        .then((input) => data = input)
        .then(makeScatterPlot);

    id("gen").addEventListener("change", makeScatterPlot)
    id("legend").addEventListener("change", makeScatterPlot)
    

    function makeScatterPlot() {
        d3.selectAll("circle").remove();
        let spDef = data.map((row) => parseInt(row["Sp. Def"]));
        let total = data.map((row) => parseInt(row["Total"]));
        
        let xScale = d3.scaleLinear()
            .domain([0, d3.max(spDef)])
            .range([50, 450]);

        let yScale = d3.scaleLinear()
            .domain([d3.max(total) + 50, d3.min(total) - 50])
            .range([50, 450]);
        
        drawAxes(xScale, yScale);
        plotData(xScale, yScale);
    }

    function drawAxes(xScale, yScale) {
        let xAxis = d3.axisBottom()
            .scale(xScale);

        let yAxis = d3.axisLeft()
            .scale(yScale);
        
        display.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis);

        display.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis);

        display.append("text")             
            .attr("transform", "translate(250,485)")
            .style("text-anchor", "middle")
            .text("Sp. Def");

        display.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -250)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total"); 
    }

    function plotData(xScale, yScale) {
        let xMap = function(d) { return xScale(getData(d, "Sp. Def")) };
        let yMap = function(d) { return yScale(getData(d, "Total")) };
        let color = function(d) {return colors[d["Type 1"]]}

        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
        
        display.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 4)
                .attr('fill', color)
                .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html(d["Name"] + "</br>" + d["Type 1"] + " " + d["Type 2"] + "</br>")	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("background", colors[d["Type 1"]]);
                    })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
    }

    function getData(data, retValue) {
        let genOption = id("gen").value;
        let legOption = id("legend").value;
        let genData = data["Generation"];
        let legData = data["Legendary"];
        if (genOption != "all" && genOption != genData) {
            return
        } else if (legOption != "all" && legOption != legData) {
            console.log(legData)
            return
        }
        return data[retValue];
    }

    function id(element_id) {
        return document.getElementById(element_id);
      }
})()