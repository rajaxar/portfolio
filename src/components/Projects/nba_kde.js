// import React, { PureComponent, useState } from 'react';
// import injectSheet from 'react-jss';
// import { Scrollama, Step } from 'react-scrollama';
// import * as d3 from 'd3';
// import kde_data from './player_KDE.csv';

// const kernelDensityEstimator = (kernel, X) => {
//     return function (V) {
//         return X.map(function (x) {
//             return [x, d3.mean(V, function (v) { return kernel(x - v); })];
//         });
//     };
// }

// // Epanechnikov kernel function
// const epanechnikovKernel = (scale) => {
//     return function (u) {
//         return Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0;
//     };
// }

// const styles = {
//     graphicContainer: {
//         padding: '40vh 2vw 20vh',
//         display: 'flex',
//         justifyContent: 'space-between',
//     },
//     graphic: {
//         flexBasis: '60%',
//         position: 'sticky',
//         width: '100%',
//         height: '60vh',
//         top: '20vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         '& p': {
//             fontSize: '5rem',
//             fontWeight: 700,
//             textAlign: 'center',
//             color: '#fff',
//         },
//     },
//     scroller: {
//         flexBasis: '35%',
//     },
//     step: {
//         margin: '0 auto 3rem auto',
//         padding: '180px 0',
//         '& p': {
//             textAlign: 'center',
//             padding: '1rem',
//             fontSize: '1.8rem',
//             marginBottom: '7rem',
//         },
//         '&:last-child': {
//             marginBottom: '0rem',
//         },
//     }
// };

// class NBAKDE extends PureComponent {
//     state = {
//         data: 1,
//         maxData: 1,
//         progress: 0,
//         steps: [1, 2, 3, 4],
//         stepLines: {},
//         stepText: {
//             1: "<div style='font-size:1.7rem; text-align: left'>For example, let's look at RAPTOR WAR, a  robust measure of a player' a new contract.</div>",
//             2: "<div style='font-size:1.7rem; text-align: left'>The very next year, <span style='color: #6F263D; font-weight:500'>LeBron James</span> and <span style='color: #98002E; font-weight:500'>Dwyane Wade</span> had a fantastic year - a precursor to <span style='font-weight: 600'>The Big Three</span>. The next year, they had new contracts, and they weren't as good.</div>",
//             3: "<div style='font-size:1.7rem; text-align: left'>They aren't the only players to have seemingly had an above-average <span style='font-family: Grouch; color: #86020e'>Contract Year.</span></div>",
//             4: "<div style='font-size:1.7rem; text-align: left'>But in these discussions, we sometimes forget about other players. Players that didn't have necessarily get worse after they signed, or players that only did worse their contract year. <br/><br/> <span style='font-size: 1.8rem'>Let's talk about them.</span></div>"
//         },
//         metadata: {},
//         linesStepFour: [],
//     };
//     componentDidMount() {
//         d3.csv(kde_data, d3.autoType).then(data => {
//             console.log(data);
//             this.setState({ csvData: data }, () => {
//                 this.initDensityChart({
//                     width: window.innerWidth * 0.55,
//                     height: 400
//                 });
//                 this.onStepEnter({ data: this.state.steps[0] });
//             });
//         });
//     }
//     componentDidUpdate(prevProps, prevState) {
//         if (prevState.data !== this.state.data) {
//             this.updateLineChart();
//         }
//     }

//     initDensityChart = (config) => {
//         const values = this.state.csvData.map(d => d.contract_war);
//         const margin = { top: 10, right: 30, bottom: 30, left: 40 };
//         const width = 800 - margin.left - margin.right;
//         const height = 400 - margin.top - margin.bottom;
    
//         // Create a KDE estimator
//         const kde = kernelDensityEstimator(epanechnikovKernel(7), values);
    
//         // Create x and y scales
//         const xScale = d3.scaleLinear().domain(d3.extent(values)).range([0, width]);
//         const yScale = d3.scaleLinear().range([height, 0]);
    
//         // Compute the density data
//         const density = kde(xScale.ticks(100));
    
//         // Update the y scale domain based on the density data
//         yScale.domain([0, d3.max(density, d => d[1])]);
    
//         // Update the config object
//         config = {
//             ...config,
//             xScale: xScale,
//             yScale: yScale,
//             margin: {
//                 top: 10,
//                 right: 10,
//                 bottom: 20,
//                 left: 25,
//             }
//         };
//     }

//     initLineChart = (config) => {
//         config = {
//             ...config,
//             xScale: d3.scaleLinear().domain([-0.2, 2.1]),
//             yScale: d3.scaleLinear().domain([0, 30]),
//             margin: {
//                 top: 10,
//                 right: 10,
//                 bottom: 20,
//                 left: 25,
//             }
//         };
//         const { width, height, margin } = config;

//         const w = width - margin.left - margin.right;
//         const h = height - margin.top - margin.bottom;
//         this.xScale = config.xScale.range([0, w]);
//         this.yScale = config.yScale.range([h, 0]);

//         const svg = d3
//             .select(this.refs.chart)
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .append("g")
//             .attr("transform", `translate(${margin.left}, ${margin.top})`);

//         const tickValues = d3.range(0, 31, 5);

//         // Set the tick values for the y-axis
//         svg.call(d3.axisLeft(config.yScale.range([h, 0])).tickValues(tickValues));

//         svg
//             .append("g")
//             .attr("transform", `translate(0, ${h})`)
//             .call(d3.axisBottom(config.xScale.range([0, w])));

//         return svg;
//     };

//     updateLineChart = () => {
//         const svg = d3.select(this.refs.chart).select('svg');
//         if (this.state.data in this.state.stepLines) {
//             // Iterate over the list of dictionaries for the current step
//             this.state.stepLines[this.state.data].forEach((dict, index) => {
//                 const currentStepData = Object.entries(dict).map(([x, y]) => ({ x: Number(x), y }));
//                 const tooltip = this.state.metadata[this.state.data][index]['tooltip'];
//                 // Create a line generator with a Bezier curve
//                 const line = d3.line()
//                     .curve(d3.curveBasis) // This generates a cubic Bezier curve
//                     .x(d => this.xScale(d.x * (1 + (Math.random() / 30)))) // Use the xScale to scale the x values
//                     .y(d => this.yScale(d.y * (1 + (Math.random() / 30)))); // Use the yScale to scale the y values

//                 const xScale = this.xScale;

//                 // Create a new path for the current step data
//                 const path = svg.append('path')
//                     .datum(currentStepData)
//                     .attr('fill', 'none')
//                     .attr('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
//                     .attr('stroke-width', 3.5)
//                     .attr('d', line);

//                 const totalLength = path.node().getTotalLength();

//                 // Set up the transition
//                 path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
//                     .attr('stroke-dashoffset', totalLength)
//                     .transition()
//                     .duration(500) // Duration of the transition in milliseconds
//                     .attr('stroke-dashoffset', 0);


//                 const invisiblePath = svg.append('path')
//                     .datum(currentStepData)
//                     .attr('fill', 'none')
//                     .attr('stroke', 'transparent') // The stroke is transparent
//                     .attr('stroke-width', 25) // The stroke width is larger
//                     .attr('d', line)
//                     .on('mouseover', function (event) {

//                         const mouseX = event.clientX;
//                         const closestXValue = Math.round(xScale.invert(mouseX) - 2);
//                         const closestDataPoint = currentStepData.find(d => d.x === closestXValue);
//                         // On mouseover, show the tooltip and set its content
//                         d3.select('#tooltip')
//                             .style('visibility', 'visible')
//                             .html(`<p style="font-family: Futura Condensed; font-size: 1rem; font-weight: 600; margin: 0;">${tooltip.name}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.team}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.year}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">WAR: ${closestDataPoint.y}</p>`)
//                     })
//                     .on('mousemove', function (event) {
//                         // On mousemove, update the position of the tooltip
//                         d3.select('#tooltip')
//                             .style('top', (event.pageY - 10) + 'px')
//                             .style('left', (event.pageX + 10) + 'px');
//                     })
//                     .on('mouseout', function () {
//                         // On mouseout, hide the tooltip
//                         d3.select('#tooltip')
//                             .style('visibility', 'hidden');
//                     });

//             });
//         } else if (this.state.data === 4) {
//             svg.selectAll('path')
//                 .transition()
//                 .duration(500)
//                 .style('opacity', 0.25);


//             this.state.linesStepFour.forEach((dict, index) => {
//                 const currentStepData = Object.entries(dict).map(([x, y]) => ({ x: Number(x), y }));
//                 const tooltip = this.state.metadata[4][index]['tooltip'];
//                 // Create a line generator with a Bezier curve
//                 const line = d3.line()
//                     .curve(d3.curveBasis) // This generates a cubic Bezier curve
//                     .x(d => this.xScale(d.x * (1 + (Math.random() / 30)))) // Use the xScale to scale the x values
//                     .y(d => this.yScale(d.y * (1 + (Math.random() / 30)))); // Use the yScale to scale the y values

//                 const xScale = this.xScale;
//                 const rgb = hexToRgb(tooltip.teamColor);

//                 // Create a new path for the current step data
//                 const path = svg.append('path')
//                     .datum(currentStepData)
//                     .attr('fill', 'none')
//                     .attr('stroke', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`)
//                     .attr('stroke-width', 3)
//                     .attr('d', line);

//                 const totalLength = path.node().getTotalLength();

//                 // Set up the transition
//                 path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
//                     .attr('stroke-dashoffset', totalLength)
//                     .transition()
//                     .duration(750) // Duration of the transition in milliseconds
//                     .attr('stroke-dashoffset', 0);


//                 const invisiblePath = svg.append('path')
//                     .datum(currentStepData)
//                     .attr('fill', 'none')
//                     .attr('stroke', 'transparent') // The stroke is transparent
//                     .attr('stroke-width', 25) // The stroke width is larger
//                     .attr('d', line)
//                     .on('mouseover', function (event) {

//                         const mouseX = event.clientX;
//                         const closestXValue = Math.round(xScale.invert(mouseX) - 2);
//                         const closestDataPoint = currentStepData.find(d => d.x === closestXValue);
//                         // On mouseover, show the tooltip and set its content
//                         d3.select('#tooltip')
//                             .style('visibility', 'visible')
//                             .html(`<p style="font-family: Futura Condensed; font-size: 1rem; font-weight: 600; margin: 0;">${tooltip.name}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.team}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">${tooltip.year}</p>
//                      <p style="font-family: Futura; font-size: .8rem; font-weight: 400; margin: 0; color: ${tooltip.teamColor}">WAR: ${closestDataPoint.y}</p>`)
//                     })
//                     .on('mousemove', function (event) {
//                         // On mousemove, update the position of the tooltip
//                         d3.select('#tooltip')
//                             .style('top', (event.pageY - 10) + 'px')
//                             .style('left', (event.pageX + 10) + 'px');
//                     })
//                     .on('mouseout', function () {
//                         // On mouseout, hide the tooltip
//                         d3.select('#tooltip')
//                             .style('visibility', 'hidden');
//                     });

//             });
//         }
//     };

//     onStepEnter = e => {
//         const { data, entry, direction } = e;
//         this.setState({ data });
//     };

//     onStepExit = ({ direction, data }) => {
//         if (direction === 'up' && data === this.state.steps[0]) {
//             this.setState({ data: 0 });
//         }
//     };

//     onStepProgress = ({ progress }) => {
//         this.setState({ progress });
//     };

//     render() {
//         const { data, steps, progress } = this.state;
//         const { classes } = this.props;

//         return (
//             <div
//                 style={{
//                     marginBottom: '-10rem',
//                 }}
//             >
//                 <div className={classes.graphicContainer}
//                     style={{
//                         flexDirection: 'row-reverse',
//                     }}
//                 >
//                     <div className={classes.scroller}>
//                         <Scrollama
//                             onStepEnter={this.onStepEnter}
//                             onStepExit={this.onStepExit}
//                             progress
//                             onStepProgress={this.onStepProgress}
//                             // debug
//                             offset={0.4}
//                         >
//                             {steps.map(value => {
//                                 const isVisible = value === data;
//                                 const visibility = isVisible ? 'visible' : 'hidden';
//                                 return (
//                                     <Step data={value} key={value}>
//                                         <div className={classes.step} >
//                                             <p
//                                                 style={{
//                                                     visibility,
//                                                     opacity: data === value ? 1 : 0,
//                                                     transition: 'width 0.5s ease-in-out, opacity 0.5s ease-in-out',
//                                                     fontFamily: "Graphik",
//                                                 }} dangerouslySetInnerHTML={{ __html: this.state.stepText[value] }}
//                                             ></p>
//                                         </div>
//                                     </Step>
//                                 );
//                             })}
//                         </Scrollama>
//                     </div>
//                     <div className={classes.graphic} ref="chart" style={{ display: this.state.data === 0 ? 'none' : 'block' }}>
//                         <p
//                             style={{
//                                 visibility: this.state.data === 0 ? 'hidden' : 'visible',
//                                 opacity: this.state.data === 0 ? 0 : 1,
//                                 fontFamily: "Graphik",
//                                 fontWeight: 400,
//                                 fontSize: '.5rem',
//                                 alignSelf: 'left',
//                                 color: 'black',
//                             }}
//                         >
//                             todo: add axes info, fix scrollup behavior
//                         </p>
//                     </div>
//                     <div
//                         id="tooltip"
//                         style={{
//                             position: 'absolute',
//                             visibility: 'hidden',
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             padding: '5px 10px',
//                             borderRadius: '5px',
//                         }}>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default injectSheet(styles)(NBAKDE);
