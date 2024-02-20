import React, { PureComponent, useState } from 'react';
import injectSheet from 'react-jss';
import { Scrollama, Step } from 'react-scrollama';
import * as d3 from 'd3';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
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
      marginBottom: '15rem',
    },
  }
};

class NBAScroll extends PureComponent {
  state = {
    data: 0,
    steps: [0, 1, 2, 3],
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
      }],
      3: [
      {
        0: 9.575629,
        1: 14.288803,
        2: 11.426555
      },
      {
        0: 11.021666,
        1: 13.764027,
        2: 11.090932
      },
      {
        0: 3.091768,
        1: 11.575403,
        2: 7.927774
      },
      {
        0: 10.716457,
        1: 11.042433,
        2: 8.408654
      },
      {
        0: 8.352408,
        1: 10.834085,
        2: 10.567995
      },
      {
        0: 6.53109,
        1: 10.177798,
        2: 9.036877
      }]
    },
    stepText: {
      0: "<div style='padding-inline:4rem; width: 300%'>In the NBA, the \"<span style='color: #86020e; font-family: Grouch'>Contract Year Phenomenon</span>\" is the idea that players perform better in the final year of their contract. The theory goes, if you want to make more money, you have to show you earned it.</div><br/><br/><div style='padding-inline:6rem; width: 300%'>On the flip side, players apparently perform worse the first year of their new contract.</div>",
      1: "<div style='font-size:1.7rem; text-align: left'>For example, let's look at RAPTOR WAR, a player's overall contribution to their team. In the 2008-2009 season, <span style='color: #552583; font-weight:500'>Kobe Bryant</span> went from having a 14.34 WAR to a 20.76 WAR. And then he slightly dipped down the next season - right after signing a new contract.</div>",
      2: "<div style='font-size:1.7rem; text-align: left'>The very next year, <span style='color: #6F263D; font-weight:500'>LeBron James</span> and <span style='color: #98002E; font-weight:500'>Dwyane Wade</span> had a fantastic year - a precursor to <span style='font-weight: 600'>The Big Three</span>. The next year, they had new contracts, and they weren't as good.</div>",
      3: "<div style='font-size:1.7rem; text-align: left'>They aren't the only players to have seemingly had an above-average <span style='font-family: Grouch; color: #86020e'>Contract Year.</span></div>"
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
      },
      3: {
        0: {
          'tooltip': {
            'name': 'Vince Carter',
            'team': 'New Jersey Nets',
            'year': '2005-2007',
            'teamColor': '#002A60'
          }
        },
        1: {
          'tooltip': {
            'name': 'Ray Allen',
            'team': 'Boston Celtics',
            'year': '2008-2010',
            'teamColor': '#008348'
          }
        },
        2: {
          'tooltip': {
            'name': 'Elton Brand',
            'team': 'LA Clippers',
            'year': '2001-2003',
            'teamColor': '#ED174C'
          }
        },
        3: {
          'tooltip': {
            'name': 'Steve Nash',
            'team': 'Dallas Mavericks',
            'year': '2002-2004',
            'teamColor': '#00538C'
          }
        },
        4: {
          'tooltip': {
            'name': 'Andre Iguodala',
            'team': 'Philadelphia 76ers',
            'year': '2011-2013',
            'teamColor': '#006BB6'
          }
        },
        5: {
          'tooltip': {
            'name': 'Jason Terry',
            'team': 'Atlanta Hawks',
            'year': '2001-2003',
            'teamColor': '#E03A3E'
          }
        }
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

        const xScale = this.xScale;
        const rgb = hexToRgb(tooltip.teamColor);

        // Create a new path for the current step data
        const path = svg.append('path')
          .datum(currentStepData)
          .attr('fill', 'none')
          .attr('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
          .attr('stroke-width', 3)
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
          .on('mouseover', function (event) {

            const mouseX = event.clientX;
            const closestXValue = Math.round(xScale.invert(mouseX) - 2.5);
            const closestDataPoint = currentStepData.find(d => d.x === closestXValue);
            // On mouseover, show the tooltip and set its content
            d3.select('#tooltip')
              .style('visibility', 'visible')
              .html(`<p style="font-family: Futura Condensed; font-size: 1rem; font-weight: 600; margin: 0;">${tooltip.name}</p>
                     <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.team}</p>
                     <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.year}</p>
                     <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">WAR: ${closestDataPoint.y}</p>`)
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
              offset={0.4}
            >
              {steps.map(value => {
                const isVisible = value === data;
                const visibility = isVisible ? 'visible' : 'hidden';
                return (
                  <Step data={value} key={value}>
                    <div className={classes.step} >
                      <p
                        style={{
                          visibility,
                          opacity: data === value ? 1 : 0,
                          transition: 'width 0.5s ease-in-out, opacity 0.5s ease-in-out',
                          fontFamily: "Graphik",
                        }} dangerouslySetInnerHTML={{ __html: this.state.stepText[value] }}
                      ></p>
                    </div>
                  </Step>
                );
              })}
            </Scrollama>
          </div>
          <div className={classes.graphic} ref="chart" style={{ display: this.state.data === 0 ? 'none' : 'block' }}>
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
