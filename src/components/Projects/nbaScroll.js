import React, { PureComponent, useState } from 'react';
import injectSheet from 'react-jss';
import { Scrollama, Step } from 'react-scrollama';
import * as d3 from 'd3';


const styles = {
  graphicContainer: {
    padding: '40vh 2vw 20vh',
    display: 'flex',
    justifyContent: 'space-between',
  },
  graphic: {
    flexBasis: '60%',
    position: 'sticky',
    width: '100%',
    height: '60vh',
    top: '20vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& p': {
      fontSize: '5rem',
      fontWeight: 700,
      textAlign: 'center',
      color: '#fff',
    },
  },
  scroller: {
    flexBasis: '35%',
  },
  step: {
    margin: '0 auto 3rem auto',
    padding: '180px 0',
    '& p': {
      textAlign: 'center',
      padding: '1rem',
      fontSize: '1.8rem',
      marginBottom: '7rem',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  }
};

class NBAScroll extends PureComponent {
  state = {
    data: 0,
    steps: [0, 1, 2],
    progress: 0,
    stepLines: {
      1: [{
        0: 14.34,
        1: 20.76,
        2: 18.96
      }],
      2: [{
        0: 20.49,
        1: 28.53,
        2: 24.81
      },
      {
        0: 4.27,
        1: 20.64,
        2: 18.96
      }]
    },
    stepText: {
      0: 'This is the first step',
      1: 'This is the second step',
      2: 'This is the third step'
    },
    metadata: {
      1: {
        0: {
          'tooltip': {
            'name': 'Kobe Bryant',
            'team': 'Los Angeles Lakers',
            'year': '2007-2009',
            'teamColor': '#552583'
          }
        }
      },
      2: {
        0: {
          'tooltip': {
            'name': 'LeBron James',
            'team': 'Cleveland Cavaliers',
            'year': '2008-2010',
            'teamColor': '#6F263D'
          }
        },
        1: {
          'tooltip': {
            'name': 'Dwyane Wade',
            'team': 'Miami Heat',
            'year': '2008-2010',
            'teamColor': '#98002E'
          }
        },
      }
    }
  };

  componentDidMount() {
    this.initLineChart({
      width: window.innerWidth * 0.55,
      height: 400
    });
    this.onStepEnter({ data: this.state.steps[0] });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.updateLineChart();
    }
  }

  initLineChart = (config) => {
    config = {
      ...config,
      xScale: d3.scaleLinear().domain([-0.5, 2.5]),
      yScale: d3.scaleLinear().domain([0, 30]),
      margin: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 25,
      }
    };
    const { width, height, margin } = config;

    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    this.xScale = config.xScale.range([0, w]);
    this.yScale = config.yScale.range([h, 0]);

    const svg = d3
      .select(this.refs.chart)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tickValues = d3.range(0, 31, 5);

    // Set the tick values for the y-axis
    svg.call(d3.axisLeft(config.yScale.range([h, 0])).tickValues(tickValues));

    svg
      .append("g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(config.xScale.range([0, w])));

    return svg;
  };

  updateLineChart = () => {
    const svg = d3.select(this.refs.chart).select('svg');

    if (this.state.data in this.state.stepLines) {
      // Iterate over the list of dictionaries for the current step
      this.state.stepLines[this.state.data].forEach((dict, index) => {
        const currentStepData = Object.entries(dict).map(([x, y]) => ({ x: Number(x), y }));
        const tooltip = this.state.metadata[this.state.data][index]['tooltip'];
        // Create a line generator with a Bezier curve
        const line = d3.line()
          .curve(d3.curveBasis) // This generates a cubic Bezier curve
          .x(d => this.xScale(d.x)) // Use the xScale to scale the x values
          .y(d => this.yScale(d.y)); // Use the yScale to scale the y values

        // Create a new path for the current step data
        const path = svg.append('path')
          .datum(currentStepData)
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 1.5)
          .attr('d', line);

        const totalLength = path.node().getTotalLength();

        // Set up the transition
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(500) // Duration of the transition in milliseconds
          .attr('stroke-dashoffset', 0);


        const invisiblePath = svg.append('path')
          .datum(currentStepData)
          .attr('fill', 'none')
          .attr('stroke', 'transparent') // The stroke is transparent
          .attr('stroke-width', 20) // The stroke width is larger
          .attr('d', line)
          .on('mouseover', function () {
            // On mouseover, show the tooltip and set its content
            d3.select('#tooltip')
              .style('visibility', 'visible')
              .html(`<p style="font-family: Futura Condensed; font-size: 1rem; font-weight: 600; margin: 0;">${tooltip.name}</p>
                     <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.team}</p>
                     <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.year}</p>`)
          })
          .on('mousemove', function (event) {
            // On mousemove, update the position of the tooltip
            d3.select('#tooltip')
              .style('top', (event.pageY - 10) + 'px')
              .style('left', (event.pageX + 10) + 'px');
          })
          .on('mouseout', function () {
            // On mouseout, hide the tooltip
            d3.select('#tooltip')
              .style('visibility', 'hidden');
          });

      });
    }
  };

  onStepEnter = e => {
    const { data, entry, direction } = e;
    console.log(e);
    this.setState({ data });
  };

  onStepExit = ({ direction, data }) => {
    if (direction === 'up' && data === this.state.steps[0]) {
      this.setState({ data: 0 });
    }
  };

  onStepProgress = ({ progress }) => {
    this.setState({ progress });
  };

  render() {
    const { data, steps, progress } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.graphicContainer}>
          <div className={classes.scroller}>
            <Scrollama
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
              progress
              onStepProgress={this.onStepProgress}
              debug
            >
              {steps.map(value => {
                const isVisible = value === data;
                const visibility = isVisible ? 'visible' : 'hidden';
                return (
                  <Step data={value} key={value}>
                    <div className={classes.step} >
                      <p style={{ visibility }}>{this.state.stepText[value]}</p>
                    </div>
                  </Step>
                );
              })}
            </Scrollama>
          </div>
          <div className={classes.graphic} ref="chart">
          </div>
          <div
            id="tooltip"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '5px 10px',
              borderRadius: '5px',
            }}>
          </div>
        </div>
        <p>
          Test
        </p>

      </div>
    );
  }
}

export default injectSheet(styles)(NBAScroll);