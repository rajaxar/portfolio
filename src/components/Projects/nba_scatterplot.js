import React, { Component } from 'react';
import * as d3 from 'd3';

class NBASalaryScatterplot extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.tooltipRef = React.createRef(); // Add this line
  }

  componentDidMount() {
    this.drawScatterplot();
  }

  componentDidUpdate() {
    this.drawScatterplot();
  }

  drawScatterplot = () => {
    const totalWidth = 600;
    const totalHeight = 600;
    const margin = { top: 10, right: 80, bottom: 60, left: 80 };
    const width = totalWidth - margin.left - margin.right;
    const height = totalHeight - margin.top - margin.bottom;

    d3.select(this.ref.current).selectAll("*").remove();

  
    const positions = [" PG", " SG", " SF", " PF", " C"];
    const colorScale = d3.scaleOrdinal()
      .domain(positions)
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]);

    const svg = d3.select(this.ref.current)
      .attr('width', totalWidth)
      .attr('height', totalHeight);

    const data = this.props.data;
    const jiggeredData = data
      .filter(d => d.post_salary_deviation_from_prev < 1 && d.post_salary_deviation_from_prev > -1)
      .filter(d => d.position === " PG" || d.position === " SG" || d.position === " SF" || d.position === " PF" || d.position === " C");

    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([-1, 1.0])
      .range([height, 0])
      .nice();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('rect')
      .attr('x', xScale(0))
      .attr('y', yScale(1))
      .attr('width', xScale(10) - xScale(0))
      .attr('height', yScale(0) - yScale(1))
      .style('fill', 'lightgreen')
      .style('opacity', 0.15);

    svg.append('text')
      .attr('x', xScale(13.4))
      .attr('y', yScale(0.9))
      .text('Played Better, Paid Better')
      .style('font-family', 'Graphik')
      .style('font-size', '12px')
      .style('fill','#333')
      .attr('text-anchor', 'end');


    g.append('rect')
      .attr('x', xScale(-10))
      .attr('y', yScale(0))
      .attr('width', xScale(0) - xScale(-10))
      .attr('height', yScale(-1) - yScale(0))
      .style('fill', 'lightcoral')
      .style('opacity', 0.075);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', xScale(-29.5))
      .attr('y', yScale(.625))
      .text('Played Worse, Paid Worse')
      .style('font-family', 'Graphik')
      .style('font-size', '12px')
      .style('fill', '#333')
      .attr('text-anchor', 'start');

    const yValues = d3.range(-0.5, 1.5, .5);
    const xValues = d3.range(-10, 11, 5);

    g.append('g')
      .style("font-size", "16px")
      .style("font-family", "Graphik")
      .call(d3.axisLeft(yScale).tickValues(yValues));

    g.append('g')
      .style("font-size", "16px")
      .style("font-family", "Graphik")
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickValues(xValues));

    const tooltip = d3.select(this.tooltipRef.current);

    const circles = g.selectAll('circle')
      .data(jiggeredData)
      .enter().append('circle')
      .attr('cx', d => xScale(d.curr_war_deviation_from_prev))
      .attr('cy', d => yScale(d.post_salary_deviation_from_prev))
      .attr('r', 7)
      .style('fill', d => colorScale(d.position))
      .style('opacity', 0.75)
      .each(function (d) {
        d.originalPosition = { x: xScale(d.curr_war_deviation_from_prev), y: yScale(d.post_salary_deviation_from_prev) };
      });

    svg.on('mousemove', function (event) {
      const [mouseX, mouseY] = d3.pointer(event);
      circles.each(function (d) {
        const node = d3.select(this);
        const nodeX = xScale(d.curr_war_deviation_from_prev) + margin.left;
        const nodeY = yScale(d.post_salary_deviation_from_prev) + margin.top;
        const dx = mouseX - nodeX;
        const dy = mouseY - nodeY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 25) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = 2;
          const moveX = forceDirectionX * force / distance;
          const moveY = forceDirectionY * force / distance;
          node.attr('cx', +node.attr('cx') + moveX)
            .attr('cy', +node.attr('cy') + moveY);
        }
      });
    }).on('mouseleave', function () {
      circles.transition()
        .duration(100)
        .attr('cx', d => d.originalPosition.x)
        .attr('cy', d => d.originalPosition.y);
    });

    circles.on('mouseover', function (event, d) {
      tooltip.style('visibility', 'visible')
        .text(`${d.player_name} in ${d.year}`);
    })
      .on('mousemove', function (event) {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
        d3.select(this).transition()
          .duration(1000)
          .attr('cx', d => d.originalPosition.x)
          .attr('cy', d => d.originalPosition.y);
      });

    // X-axis label
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin.left)
      .attr("y", height + margin.bottom)
      .text("Deviation in WAR")
      .style("font-family", "Graphik")
      .style("fill", "black")
      .style("font-size", "20px");

    // Y-axis label
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", 30)
      .attr("x", -height / 3)
      .text("Change in Salary")
      .style("fill", "black")
      .style("font-family", "Graphik")
      .style("font-size", "20px");


    svg.append("circle").attr("cx", xScale(7)).attr("cy", yScale(-.4)).attr("r", 4).style("fill", "#1f77b4")
    svg.append("text").attr("x", xScale(7.4)).attr("y", yScale(-.401)).text("Point Guard").style("font-size", "14px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", xScale(7)).attr("cy", yScale(-.475)).attr("r", 4).style("fill", "#ff7f0e")
    svg.append("text").attr("x", xScale(7.4)).attr("y", yScale(-.476)).text("Shooting Guard").style("font-size", "14px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", xScale(7)).attr("cy", yScale(-.55)).attr("r", 4).style("fill", "#2ca02c")
    svg.append("text").attr("x", xScale(7.4)).attr("y", yScale(-.551)).text("Small Forward").style("font-size", "14px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", xScale(7)).attr("cy", yScale(-.625)).attr("r", 4).style("fill", "#d62728")
    svg.append("text").attr("x", xScale(7.4)).attr("y", yScale(-.626)).text("Power Forward").style("font-size", "14px").attr("alignment-baseline", "middle")
    svg.append("circle").attr("cx", xScale(7)).attr("cy", yScale(-.7)).attr("r", 4).style("fill", "#9467bd")
    svg.append("text").attr("x", xScale(7.4)).attr("y", yScale(-.701)).text("Center").style("font-size", "14px").attr("alignment-baseline", "middle")
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

export default NBASalaryScatterplot;
