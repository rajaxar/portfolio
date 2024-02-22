import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './salary_change.csv';

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
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    d3.csv(data).then(data => {
      let jiggeredData = data.map(d => {
        d.new_salary = d.new_salary * (Math.random() * 0.08 + .96);
        return d;
      });

      const svg = d3.select(this.ref.current);
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const xValue = d => d.deviation_from_prev;
      const yValue = d => d.new_salary;

      const xScale = d3.scaleLinear()
        .domain([-10, 10])
        .range([margin.left, width - margin.right])
        .nice();

      const yScale = d3.scaleLinear()
        .domain(d3.extent(jiggeredData, yValue))
        .range([height - margin.bottom, margin.top])
        .nice();

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      g.append('g').call(d3.axisLeft(yScale));
      g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${height})`);
        g.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));
        
      const tooltip = d3.select(this.tooltipRef.current);
      const nodes = jiggeredData.map(d => ({ ...d, x: xScale(xValue(d)), y: yScale(yValue(d))}));

      const simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX(d => xScale(xValue(d))).strength(0.2))
        .force('y', d3.forceY(d => yScale(yValue(d))).strength(0.2))
        .force('collide', d3.forceCollide(5))
        .on('tick', ticked);

      function ticked() {
        g.selectAll('circle')
          .attr('cx', d => d.x) // Use d.x here instead of xScale(xValue(d))
          .attr('cy', d => d.y) // Use d.y here instead of yScale(yValue(d))
      }
      g.selectAll('circle').data(nodes)
        .enter().append('circle')
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', 7)
        .style('opacity', 0.75)
        .on('mouseover', function (event, d) {
          tooltip.style('visibility', 'visible')
            .text(`${d.player_name} in ${d.year}`);
        })
        .on('mousemove', function (event) {
          tooltip.style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function () {
          tooltip.style('visibility', 'hidden');
        })
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

    });
  }

  render() {
    return (
      <div>
        <div ref={this.tooltipRef} style={{ position: 'absolute', visibility: 'hidden' }}></div>
        <svg ref={this.ref} width="600" height="600"></svg>
        <p>todo: add axes info, colors, annotations, and text</p>
      </div>
    );
  }
}

export default NBASalaryScatterplot;