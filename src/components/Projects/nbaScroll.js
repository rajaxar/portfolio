import React, { PureComponent } from 'react';
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
      marginBottom: '10rem',
    },
    '&:last-child': {
      marginBottom: '18rem',
    },
  }
};

class NBAScroll extends PureComponent {
  state = {
    data: 0,
    steps: [0, 1, 2, 3, 4],
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
    linesStepFour:
      [
        {
          0: 18.821185,
          1: 15.749734,
          2: 15.781945
        },
        {
          0: 9.812819,
          1: 12.779258,
          2: 12.854682
        },
        {
          0: 17.460716,
          1: 11.269003,
          2: 13.866494
        },
        {
          0: 15.171001,
          1: 10.4098,
          2: 15.474282
        },
        {
          0: 6.82265,
          1: 9.961005,
          2: 10.207918
        },
        {
          0: 12.812293,
          1: 9.609615,
          2: 15.49317
        },
        {
          0: 6.936771,
          1: 8.663923,
          2: 10.440578
        },
        {
          0: 12.613104,
          1: 8.439489,
          2: 9.559727
        },
        {
          0: 11.82031,
          1: 8.168875,
          2: 13.388273
        },
        {
          0: 11.38429,
          1: 8.036814,
          2: 8.145941
        },
        {
          0: 2.610856,
          1: 7.640206,
          2: 8.027998
        },
        {
          0: 8.712799,
          1: 7.489068,
          2: 11.102544
        },
        {
          0: 5.728777,
          1: 6.808769,
          2: 13.463203
        },
        {
          0: 5.52653,
          1: 5.800908,
          2: 6.144882
        },
        {
          0: 13.635096,
          1: 5.448406,
          2: 11.181605
        },
        {
          0: 6.072382,
          1: 5.027453,
          2: 8.591823
        },
        {
          0: 1.871838,
          1: 4.723256,
          2: 6.196109
        },
        {
          0: 14.083028,
          1: 4.642853,
          2: 6.899655
        },
        {
          0: 5.308685,
          1: 4.633684,
          2: 5.253617
        },
        {
          0: 3.437307,
          1: 4.389676,
          2: 5.227056
        },
        {
          0: 1.307767,
          1: 4.352462,
          2: 4.699337
        },
        {
          0: 4.987899,
          1: 4.11851,
          2: 10.105761
        },
        {
          0: 6.305778,
          1: 3.902766,
          2: 10.233139
        }
      ],
    stepText: {
      0: "<div style='padding-inline:4rem; width: 300%'>In the NBA, the \"<span style='color: #86020e; font-family: Grouch'>Contract Year Phenomenon</span>\" is the idea that players perform better in the final year of their contract. The theory goes, if you want to make more money, you have to show you earned it.</div><br/><br/><div style='padding-inline:6rem; width: 300%'>On the flip side, players apparently perform worse the first year of their new contract. <br/><br/> <span style='color:black; font-weight:300; font-size:1.2rem'>Scroll Down ↓</span></div>",
      1: "<div style='font-size:1.7rem; text-align: left'>For example, let's look at RAPTOR WAR, a player's overall contribution to their team. In short, a statistically robust measure of a player's performance.<br/><br/>In the 2008-2009 season, <span style='color: #552583; font-weight:500'>Kobe Bryant</span> went from having a 14.34 WAR to a 20.76 WAR. And then he slightly dipped down the next season - right after signing a new contract.</div>",
      2: "<div style='font-size:1.7rem; text-align: left'>The very next year, <span style='color: #6F263D; font-weight:500'>LeBron James</span> and <span style='color: #98002E; font-weight:500'>Dwyane Wade</span> had a fantastic year - a precursor to <span style='font-weight: 600'>The Big Three</span>. The next year, they had new contracts, and they weren't as good.</div>",
      3: "<div style='font-size:1.7rem; text-align: left'>They aren't the only players to have seemingly had an above-average <span style='font-family: Grouch; color: #86020e'>Contract Year.</span></div>",
      4: "<div style='font-size:1.7rem; text-align: left'>But in these discussions, we sometimes forget about other players. Players that didn't have necessarily get worse after they signed, or players that only did worse their contract year. <br/><br/> <span style='font-size: 1.8rem'>Let's talk about them.</span></div>"
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
      },
      4: {
        0: {
          'tooltip': {
            'name': 'Chris Paul',
            'team': 'LA Clippers',
            'year': '2012',
            'teamColor': '#ED174C'
          }
        },
        1: {
          'tooltip': {
            'name': 'Kawhi Leonard',
            'team': 'San Antonio Spurs',
            'year': '2014',
            'teamColor': '#008348'
          }
        },
        2: {
          'tooltip': {
            'name': 'Ben Wallace',
            'team': 'Detroit Pistons',
            'year': '2005',
            'teamColor': '#00538C'
          }
        },
        3: {
          'tooltip': {
            'name': 'Jason Kidd',
            'team': 'New Jersey Nets',
            'year': '2008',
            'teamColor': '#006BB6'
          }
        },
        4: {
          'tooltip': {
            'name': 'Kevin Garnett',
            'team': 'Boston Celtics',
            'year': '2011',
            'teamColor': '#E03A3E'
          }
        },
        5: {
          'tooltip': {
            'name': 'Anthony Davis',
            'team': 'New Orleans Pelicans',
            'year': '2019',
            'teamColor': '#86020e'
          }
        },
        6: {
          'tooltip': {
            'name': 'Jimmy Butler',
            'team': 'Chicago Bulls',
            'year': '2014',
            'teamColor': '#552583'
          }
        },
        7: {
          'tooltip': {
            'name': 'Dirk Nowitzki',
            'team': 'Dallas Mavericks',
            'year': '2009',
            'teamColor': '#6F263D'
          }
        },
        8: {
          'tooltip': {
            'name': 'Ray Allen',
            'team': 'Seattle SuperSonics',
            'year': '2004',
            'teamColor': '#98002E'
          }
        },
        9: {
          'tooltip': {
            'name': 'Tim Duncan',
            'team': 'San Antonio Spurs',
            'year': '2011',
            'teamColor': '#002A60'
          }
        },
        10: {
          'tooltip': {
            'name': 'Khris Middleton',
            'team': 'Milwaukee Bucks',
            'year': '2018',
            'teamColor': '#008348'
          }
        },
        11: {
          'tooltip': {
            'name': 'Kyrie Irving',
            'team': 'Boston Celtics',
            'year': '2018',
            'teamColor': '#00538C'
          }
        },
        12: {
          'tooltip': {
            'name': 'Kyle Lowry',
            'team': 'Toronto Raptors',
            'year': '2013',
            'teamColor': '#006BB6'
          }
        },
        13: {
          'tooltip': {
            'name': 'Chris Bosh',
            'team': 'Miami Heat',
            'year': '2013',
            'teamColor': '#E03A3E'
          }
        },
        14: {
          'tooltip': {
            'name': 'Marc Gasol',
            'team': 'Memphis Grizzlies',
            'year': '2014',
            'teamColor': '#86020e'
          }
        },
        15: {
          'tooltip': {
            'name': 'Andre Miller',
            'team': 'Philadelphia 76ers',
            'year': '2008',
            'teamColor': '#552583'
          }
        },
        16: {
          'tooltip': {
            'name': 'Jeremy Lamb',
            'team': 'Charlotte Hornets',
            'year': '2018',
            'teamColor': '#6F263D'
          }
        },
        17: {
          'tooltip': {
            'name': 'Manu Ginobili',
            'team': 'San Antonio Spurs',
            'year': '2012',
            'teamColor': '#98002E'
          }
        },
        18: {
          'tooltip': {
            'name': 'Scottie Pippen',
            'team': 'Portland Trail Blazers',
            'year': '2002',
            'teamColor': '#002A60'
          }
        },
        19: {
          'tooltip': {
            'name': 'Tim Hardaway Jr.',
            'team': 'Dallas Mavericks',
            'year': '2020',
            'teamColor': '#008348'
          }
        },
        20: {
          'tooltip': {
            'name': 'Eric Bledsoe',
            'team': 'LA Clippers',
            'year': '2013',
            'teamColor': '#00538C'
          }
        },
        21: {
          'tooltip': {
            'name': 'Danny Green',
            'team': 'San Antonio Spurs',
            'year': '2018',
            'teamColor': '#006BB6'
          }
        },
        22: {
          'tooltip': {
            'name': 'Dirk Nowitzki',
            'team': 'Dallas Mavericks',
            'year': '2013',
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
      xScale: d3.scaleLinear().domain([-0.3, 2.3]),
      yScale: d3.scaleLinear().domain([0, 30]),
      margin: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 70,
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
      .attr("width", width + margin.left + margin.right + margin.right)  // Increase the width of the SVG
      .attr("height", height + margin.top + margin.bottom)  // Increase the height of the SVG
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tickValues = d3.range(10, 31, 10);

    // Set the tick values for the y-axis
    svg
      .call(d3.axisLeft(this.yScale).tickValues(tickValues))
      .attr("class", "y axis")
      .style("font-size", "16px")
      .style("font-family", "Graphik");

    const xLabels = ["Year Before Contract Expires", "End of Contract", "Year After Contract"];

    svg
      .append("g")
      .attr("transform", `translate(0, ${h})`)
      .attr("class", "x axis")
      .style("font-size", "16px")
      .style("font-family", "Graphik")
      .call(
        d3.axisBottom(this.xScale)
          .tickValues([0.05, 1, 1.95])  // Set the tick values
          .tickFormat((d, i) => xLabels[i])  // Set the tick labels
      );

    [.05, 1, 1.95].forEach((x) => {
      svg
        .append("line")
        .attr("x1", config.xScale(x))
        .attr("x2", config.xScale(x))
        .attr("y1", 0)
        .attr("y2", h)
        .style("stroke", "lightgray")
        .style("stroke-dasharray", "3,3");
    });
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", w / 2 + 2 * margin.left) // Center the text in the drawable area
      .attr("y", h + margin.top + 40) // Adjust this value to position below the x-axis
      .text("Year in Relation to Contract")
      .style("font-family", "Graphik")
      .style("fill", "black")
      .style("font-size", "20px");

    // Add Y-axis title
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")  // Rotate the text for y-axis
      .attr("y", -45) // Adjust positioning to the left of the y-axis
      .attr("x", margin.bottom - h/4) // Center the text along the y-axis height
      .text("Performance (WAR)")
      .style("fill", "black")
      .style("font-family", "Graphik")
      .style("font-size", "20px");
    return svg;
  };

  updateLineChart = () => {
    const svg = d3.select(this.refs.chart).select('svg');
    const step = this.state.data;
    if (step === 0) return;

    let rawData = [];
    if (step === 4) {
      rawData = this.state.linesStepFour;
      svg.selectAll('path.line')
        .transition()
        .duration(500)
        .style('opacity', 0.1);
    } else if (this.state.stepLines[step]) {
      rawData = this.state.stepLines[step];
    } else {
      return;
    }

    const line = d3.line()
      .curve(d3.curveBasis)
      .x(d => this.xScale(d.x) + 70)
      .y(d => this.yScale(d.y + Math.random() - 0.5) - 20);

    const data = rawData.map((dict, index) => {
      const points = Object.entries(dict).map(([x, y]) => ({ x: Number(x), y }));
      const tooltip = this.state.metadata[step]?.[index]?.tooltip;
      return { points, tooltip };
    });

    svg.selectAll(`g.step-${step}`)
      .data(data, (_, i) => i)
      .join(
        enter => {
          const g = enter.append('g').attr('class', `step-${step}`);
          const path = g.append('path')
            .attr('class', `line step-${step}`)
            .attr('fill', 'none')
            .attr('stroke', d => {
              const rgb = hexToRgb(d.tooltip.teamColor);
              const opacity = step === 4 ? 0.5 : 0.75;
              return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            })
            .attr('stroke-width', step === 4 ? 3 : 5)
            .attr('d', d => line(d.points));

          path.each(function () {
            const totalLength = this.getTotalLength();
            d3.select(this)
              .attr('stroke-dasharray', totalLength + ' ' + totalLength)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(step === 4 ? 750 : 500)
              .attr('stroke-dashoffset', 0);
          });

          g.append('path')
            .attr('class', `hover step-${step}`)
            .attr('fill', 'none')
            .attr('stroke', 'transparent')
            .attr('stroke-width', 25)
            .attr('d', d => line(d.points))
            .on('mouseover', (event, d) => {
              const mouseX = event.clientX;
              const closestXValue = Math.round(this.xScale.invert(mouseX) - 2);
              const closestDataPoint = d.points.find(p => p.x === closestXValue);
              d3.select('#tooltip')
                .style('visibility', 'visible')
                .html(`<p style="font-family: Futura Condensed; font-size: 1rem; font-weight: 600; margin: 0;">${d.tooltip.name}</p>` +
                      `<p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${d.tooltip.teamColor}">${d.tooltip.team}</p>` +
                      `<p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${d.tooltip.teamColor}">${d.tooltip.year}</p>` +
                      `<p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${d.tooltip.teamColor}">WAR: ${closestDataPoint.y}</p>`);
            })
            .on('mousemove', (event) => {
              d3.select('#tooltip')
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', () => {
              d3.select('#tooltip').style('visibility', 'hidden');
            });

          return g;
        },
        update => update,
        exit => exit.remove()
      );
  };

  onStepEnter = e => {
    const { data } = e;
    this.setState({ data });
  };

  onStepExit = ({ direction, data }) => {
    if (direction === 'up') {
      const svg = d3.select(this.refs.chart).select('svg');
      svg.selectAll(`.step-${data}`).remove();
      if (data === 4) {
        svg.selectAll('path.line')
          .transition()
          .duration(500)
          .style('opacity', 0.75);
      }
      if (data === this.state.steps[0]) {
        this.setState({ data: 0 });
      }
    }
  };

  onStepProgress = ({ progress }) => {
    this.setState({ progress });
  };

  render() {
    const { data, steps, progress } = this.state;
    const { classes } = this.props;
    return (
      <div
        style={{
          marginBottom: '-10rem',
        }}
      >
        <div className={classes.graphicContainer}>
          <div className={classes.scroller}>
            <Scrollama
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
              progress
              onStepProgress={this.onStepProgress}
              // debug
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
            <p
              style={{
                visibility: this.state.data === 0 ? 'hidden' : 'visible',
                opacity: this.state.data === 0 ? 0 : 1,
                fontFamily: "Graphik",
                fontWeight: 400,
                fontSize: '1.5rem',
                alignSelf: 'left',
                color: 'black',
              }}
            >
              Player Performance Before, During, and After Contract Years
            </p>
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
      </div>
    );
  }
}

export default injectSheet(styles)(NBAScroll);
