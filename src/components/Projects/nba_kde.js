import React, { Component } from 'react';
import * as d3 from 'd3';
import injectSheet from 'react-jss';
import { Scrollama, Step } from 'react-scrollama';
import "../../styles/nba.css";

function epanechnikov(bandwidth) {
    return x => Math.abs(x /= bandwidth) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0;
}
function kde(kernel, thresholds, data) {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
}

let maxData = 0;

const styles = {
    graphicContainer: {
        padding: '40vh 2vw 20vh',
        display: 'flex',
        flexDirection: 'row-reverse', // Reverse the order of flex items
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
        marginLeft: '4rem',
        marginRight: '4rem',
    },
    scroller: {
        flexBasis: '35%',
    },
    step: {
        padding: '180px 0',
        '& p': {
            textAlign: 'left',
            paddingBlock: '1rem',
            paddingRight: '4rem',
            marginLeft: '-8rem',
            fontSize: '1.8rem',
            marginBottom: '7rem',
        },
        '&:last-child': {
            marginBottom: '15rem',
        },
    }
};

class NBAKDE extends Component {
    chartRef = React.createRef();
    state = {
        data: 0,
        kde_data: [],
        kdeMax: 0,
        kdeMaxX: 0,
        steps: [0, 1, 2, 3],
        stepText: {
            0: "<div style='font-size:1.7rem;'> <span style='font-size:1.2rem'>Let's look at some stats. </br></span>On the left, we have an Estimate of the Distribution of Player Performance during their <span style='color: #69b3a2; font-weight:500'>Contract Year.</span> <br/><br/><span style='font-size:1.2rem; line-height: 1px;'>The data is from a subset of players that had contracts expire between 2003 and 2020. <br/><br/>This is technically a Kernel Density Estimator, which estimates the probability of a player having a certain Wins Above Replacement (WAR) during their Contract Year.</span>",
            1: "<div style='font-size:1.7rem;'>Essentially, most players had between 0 to 3 Wins Above Replacement during their <span style='color: #69b3a2; font-weight:500'>Contract Year.</span><br/><br/><span style='font-size:1.2rem; line-height: 1px;'>This means that the majority of contract year players netted their teams a few additional wins compared to a replacement-level player.</span></div>",
            2: "<div style='font-size:1.7rem;'>Now let's look at these same players, but the<span style='color: #B299D4; font-weight:500'> year before</span>. As you can see, the distribution looks really similar.<br/><br/><span style='font-size:1.2rem; line-height: 1px;'>Note: Any differences are not statistically signficant, even with a pairwise T-Test.</span></div>",
            3: "<div style='font-size:1.7rem;'>And now performance <span style='color: #FDB36D; font-weight:500'>during the next year</span>. <br/><br/>This distribution is a little different. But it shows that there's <span style='font-weight:500;'>more</span> players performing better in their new contract.<br/><br/>So - does that mean the <span style='color: #86020e; font-family: Grouch'>Contract Year</span> doesn't exist?</div>"
        },
        svg: null,
        x: null,
        y: null
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.loadData().then(() => {
            this.updateChart();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    updateChart = () => {
        d3.select(this.chartRef.current).selectAll('*').remove();
        this.setupVisualization([this.state.kde_data]);
    }

    handleResize = () => {
        this.updateChart();
    }

    setupVisualization = (kde_data_set) => {
        const totalWidth = this.chartRef.current.getBoundingClientRect().width;
        const totalHeight = 400;
        const margin = { top: 20, right: 10, bottom: 80, left: 80 };
        const width = totalWidth - margin.left - margin.right;
        const height = totalHeight - margin.top - margin.bottom;
    
        // Create the SVG container
        const svg = d3.select(this.chartRef.current)
            .append("svg")
            .attr("width", totalWidth)
            .attr("height", totalHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // X scale and axis
        const x = d3.scaleLinear()
            .domain([-10, 30])
            .range([0, width]);
    
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .style("font-size", "16px")
            .style("font-family", "Graphik")
            .call(d3.axisBottom(x));
    
        // Y scale and axis
        const y = d3.scaleLinear()
            .domain([0, 0.15])
            .range([height, 0]);
    
        svg.append("g")
            .style("font-size", "16px")
            .style("font-family", "Graphik")
            .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));
    
        // X-axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.bottom - 20)
            .text("Performance (WAR) Values")
            .style("font-family", "Graphik")
            .style("fill", "black")
            .style("font-size", "20px");
    
        // Y-axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 25)
            .attr("x", -height / 5)
            .text("Percentage of Players")
            .style("fill", "black")
            .style("font-family", "Graphik")
            .style("font-size", "20px");
          
        kde_data_set.forEach((kde_data, i) => {
            let n = kde_data.length;
            let sigma = d3.deviation(kde_data, d => d.contract_war);
            let bandwidth = Math.pow(n, -1 / 8) * sigma;
            let thresholds = d3.range(-10, 30, 0.1);
            const kde_graph = kde(epanechnikov(bandwidth), thresholds, kde_data.map(d => d.contract_war));

            // Plot the area
            svg.append("path")
                .attr("fill", "#69b3a2")
                .attr("fill-opacity", 0.5)
                .datum(kde_graph)
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round")
                .attr("d", d3.line()
                    .curve(d3.curveBasis)
                    .x(d => x(d[0]))
                    .y(d => y(d[1]))
                );
            svg.append("circle").attr("cx", x(15)).attr("cy", y(.12)).attr("r", 6).style("fill", "#69b3a2")
            svg.append("text").attr("x", x(16)).attr("y", y(.1195)).text("Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")

        });
        this.setState({ svg, x, y });
    };


    loadData = () => {
        return new Promise(resolve => {
            d3.csv(process.env.PUBLIC_URL + '/final_KDE.csv').then(datum => {
                const parsedData = datum.map(d => ({
                    ...d,
                    contract_war: +d.contract_war,
                    year: +d.year,
                    ageDuringContractYear: +d.ageDuringContractYear,
                    post_contract_war: +d.post_contract_war,
                    previous_war: +d.previous_war
                }));
                this.setState({
                    kde_data: parsedData
                }, resolve);
            });
        });
    };

    handleStepOne = () => {
        const { svg, kde_data, x, y } = this.state;

        try {
            let n = kde_data.length;
            let sigma = d3.deviation(kde_data, d => d.contract_war);
            let bandwidth = Math.pow(n, -1 / 8) * sigma;
            let thresholds = d3.range(-10, 30, 0.1);
            const kde_graph = kde(epanechnikov(bandwidth), thresholds, kde_data.map(d => d.contract_war));
            const kdeMaxX = kde_graph[d3.maxIndex(kde_graph, d => d[1])][0];

            svg.append('line')
                .attr("class", "peak-line") // Add this line
                .attr("x1", x(kdeMaxX))
                .attr("x2", x(kdeMaxX))
                .attr("y1", y.range()[0])
                .attr("y2", y.range()[0])  // Start at the bottom
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("stroke-dasharray", "5,5")
                .transition()
                .duration(1000)  // Duration of the animation in milliseconds
                .attr("y2", y.range()[1]);  // Animate to the top    
        } catch (e) {
            console.log(e);
        }
        maxData = 1;
    };

    handleStepTwo = () => {
        const { svg, kde_data, x, y } = this.state;
        try {
            svg.selectAll(".peak-line")
                .transition()
                .duration(500)  // Duration of the fade out in milliseconds
                .style("opacity", 0)  // Fade out by reducing the opacity to 0
                .remove();  // Remove the line after the transition
            let n = kde_data.length;
            let sigma = d3.deviation(kde_data, d => d.previous_war);
            let bandwidth = Math.pow(n, -1 / 8) * sigma;
            let thresholds = d3.range(-10, 30, 0.1);
            const kde_graph = kde(epanechnikov(bandwidth), thresholds, kde_data.map(d => d.previous_war));

            // Define the line
            let line = d3.line()
                .curve(d3.curveBasis)
                .x(d => x(d[0]))
                .y(d => y(d[1]));

            // Append the path
            let path = svg.append("path")
                .datum(kde_graph)
                .attr("fill", "#beaed4")
                .attr("fill-opacity", 0.5)
                .attr("stroke-width", 2)
                .attr("stroke", "#beaed4")
                .attr("stroke-linejoin", "round")
                .attr("d", line.y(() => y(0)));  // Set the initial y attribute to the bottom of the chart

            // Add the transition
            path.transition()
                .duration(750)  // Duration of the animation in milliseconds
                .attr("d", line.y(d => y(d[1])));  // Animate the y attribute to its final value       

            svg.append("circle").attr("cx", x(15)).attr("cy", y(.105)).attr("r", 6).style("fill", "#beaed4")
            svg.append("text").attr("x", x(16)).attr("y", y(.1045)).text("Pre-Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")
        }
        catch (e) {
            console.log(e);
        }
        maxData = 2;
    }

    handleStepThree = () => {
        const { svg, kde_data, x, y } = this.state;
        try {
            let n = kde_data.length;
            let sigma = d3.deviation(kde_data, d => d.post_contract_war);
            let bandwidth = Math.pow(n, -1 / 8) * sigma;
            let thresholds = d3.range(-10, 30, 0.1);
            const kde_graph = kde(epanechnikov(bandwidth), thresholds, kde_data.map(d => d.post_contract_war));
    
            // Define the line
            let line = d3.line()
                .curve(d3.curveBasis)
                .x(d => x(d[0]))
                .y(d => y(d[1]));
    
            // Append the path
            let path = svg.append("path")
                .datum(kde_graph)
                .attr("fill", "#FDC086")
                .attr("fill-opacity", 0.5)
                .attr("stroke-width", 2)
                .attr("stroke", "#FDC086")
                .attr("stroke-linejoin", "round")
                .attr("d", line.y(() => y(0)));  // Set the initial y attribute to the bottom of the chart
    
            // Add the transition
            path.transition()
                .duration(750)  // Duration of the animation in milliseconds
                .attr("d", line.y(d => y(d[1])));  // Animate the y attribute to its final value       
    
            svg.append("circle").attr("cx", x(15)).attr("cy", y(.09)).attr("r", 6).style("fill", "#FDC086")
            svg.append("text").attr("x", x(16)).attr("y", y(.0895)).text("Post-Contract Year").style("font-size", "15px").attr("alignment-baseline", "middle")
        } catch (e) {
            console.log(e);
        }
        maxData = 3;
    }


    onStepEnter = e => {
        const { data, entry, direction } = e;
        this.setState({ data: data });
        if (data === 1 && maxData < 1) {
            this.handleStepOne();
        }
        else if (data === 2 && maxData < 2) {
            this.handleStepTwo();
        } else if (data === 3 && maxData < 3) {
            this.handleStepThree();
        }
    };

    render() {
        const { steps, data } = this.state;
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
                            progress
                            offset={0.4}
                        >
                            {steps.map(value => {
                                return (
                                    <Step data={value} key={value}>
                                        <div className={classes.step} >
                                            <p
                                                style={{
                                                    visibility: value === data ? 'visible' : 'hidden',
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

                    <div className={classes.graphic} ref={this.chartRef} style={{ display: 'block' }}>
                        <p
                            className="chart-title"
                            style={{
                                marginLeft: '-16rem',
                                marginBottom: '0rem',
                            }}
                        >
                            Density Estimation of Player Performance
                        </p>
                    </div>

                </div>
            </div>
        );
    }
}

export default injectSheet(styles)(NBAKDE);
