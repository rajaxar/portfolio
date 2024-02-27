import React, { Component } from 'react';
import * as d3 from 'd3';

function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0;
}

function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
}

class NBAKDEPlot extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.tooltipRef = React.createRef(); // Add this line
    }


    componentDidMount() {
        this.drawDensityplot();
    }

    componentDidUpdate(prevProps) {
        // Assuming `data` is the prop affecting the plot,
        // replace `data` with any prop that your component depends on.
        if (this.props.data !== prevProps.data) {
            this.drawDensityplot();
        }
    }

    drawDensityplot = () => {
        const totalWidth = 600;
        const totalHeight = 600;
        const margin = { top: 10, right: 80, bottom: 60, left: 80 };
        const width = totalWidth - margin.left - margin.right;
        const height = totalHeight - margin.top - margin.bottom;

        d3.select(this.ref.current).selectAll("*").filter(".kde").remove();

        const svg = d3.select(this.ref.current)
            .attr('width', totalWidth)
            .attr('height', totalHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const data = this.props.data;
        const jiggeredData = data

        const xScale = d3.scaleLinear()
            .domain([-10, 30])
            .range([0, width])

        const yScale = d3.scaleLinear()
            .domain([0, 0.25])
            .range([height, 0])

        d3.select(this.ref.current).selectAll(".kde").transition()
            .duration(500) // Adjust time as needed
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(d => xScale(d[0]))
                .y(() => yScale.range()[0]) // Move to the bottom
            )

        svg.append('g')
            .attr("transform", `translate(0,${height})`)
            .style("font-size", "16px")
            .style("font-family", "Graphik")
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .style("font-size", "16px")
            .style("font-family", "Graphik")
            .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));


        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width - margin.left)
            .attr("y", height + margin.bottom)
            .text("Performance (WAR) Values")
            .style("font-family", "Graphik")
            .style("fill", "black")
            .style("font-size", "20px");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 25)
            .attr("x", -height / 3)
            .text("Percentage of Players")
            .style("fill", "black")
            .style("font-family", "Graphik")
            .style("font-size", "20px");

        let line = d3.line()
            .curve(d3.curveBasis)
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]));

        let n = jiggeredData.length;
        let sigma = d3.deviation(jiggeredData, d => d.contract_war);
        let bandwidth = Math.pow(n, -1 / 8) * sigma;
        let thresholds = d3.range(-10, 30, 0.1);
        let kde_graph = kde(epanechnikov(bandwidth), thresholds, jiggeredData.map(d => d.contract_war));

        let path = svg.append("path")
            .attr('class', 'kde')
            .attr("fill", "#69b3a2")
            .attr("fill-opacity", 0.5)
            .datum(kde_graph)
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 2)
            .attr("stroke-linejoin", "round")
            .attr("d", line.y(() => yScale(0)));  // Set the initial y attribute to the bottom of the chart

        path.transition()
            .duration(500)  // Duration of the animation in milliseconds
            .attr("d", line.y(d => yScale(d[1])));

        svg.append("circle").attr("cx", xScale(15)).attr("cy", yScale(.12)).attr("r", 6).style("fill", "#69b3a2")
        svg.append("text").attr("x", xScale(16)).attr("y", yScale(.1195)).text("Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")

        sigma = d3.deviation(jiggeredData, d => d.previous_war);
        bandwidth = Math.pow(n, -1 / 8) * sigma;
        thresholds = d3.range(-10, 30, 0.1);
        kde_graph = kde(epanechnikov(bandwidth), thresholds, jiggeredData.map(d => d.previous_war));

        path = svg.append("path")
            .datum(kde_graph)
            .attr('class', 'kde')
            .attr("fill", "#beaed4")
            .attr("fill-opacity", 0.5)
            .attr("stroke-width", 2)
            .attr("stroke", "#beaed4")
            .attr("stroke-linejoin", "round")
            .attr("d", line.y(() => yScale(0)));  // Set the initial y attribute to the bottom of the chart
        path.transition()
            .duration(500)  // Duration of the animation in milliseconds
            .attr("d", line.y(d => yScale(d[1])));

        svg.append("circle").attr("cx", xScale(15)).attr("cy", yScale(.11)).attr("r", 6).style("fill", "#beaed4")
        svg.append("text").attr("x", xScale(16)).attr("y", yScale(.1095)).text("Pre-Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")

        sigma = d3.deviation(jiggeredData, d => d.post_contract_war);
        bandwidth = Math.pow(n, -1 / 8) * sigma;
        thresholds = d3.range(-10, 30, 0.1);
        kde_graph = kde(epanechnikov(bandwidth), thresholds, jiggeredData.map(d => d.post_contract_war));

        path = svg.append("path")
            .datum(kde_graph)
            .attr('class', 'kde')
            .attr("fill", "#FDC086")
            .attr("fill-opacity", 0.5)
            .attr("stroke-width", 2)
            .attr("stroke", "#FDC086")
            .attr("stroke-linejoin", "round")
            .attr("d", line.y(() => yScale(0)));  // Set the initial y attribute to the bottom of the chart

        path.transition()
            .duration(500)
            .attr("d", line.y(d => yScale(d[1])));

        svg.append("circle").attr("cx", xScale(15)).attr("cy", yScale(.10)).attr("r", 6).style("fill", "#FDC086")
        svg.append("text").attr("x", xScale(16)).attr("y", yScale(.0995)).text("Post-Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")
    }

    render() {
        return (
            <div>
                <div ref={this.tooltipRef} style={{ position: 'absolute', visibility: 'hidden' }} />
                <svg ref={this.ref} />
            </div>
        );
    }
}

export default NBAKDEPlot;
