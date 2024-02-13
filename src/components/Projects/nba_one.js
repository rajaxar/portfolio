import TableauReport from 'tableau-react';

function NBAOne() {
    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}
            >
                <h2
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 500,
                        fontSize: `1.6rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Introduction
                </h2>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `The goal of my project is to examine a relatively well believed trend in the sports world, and explore it. 
                        The audience is fans of basketball that are interested in statistics - nothing super technical, 
                        but a general understanding of the game is helpful.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    So What's the Trend? And What Do You Mean "Well Believed"?
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `Let's take a step back, and explore the Contract Year Phenomenon.`
                    },
                    <br /><br />
                    {
                        `Every player in the NBA is typically under contract for a certain number of years.
                         Economic theory posits that when a player is in the last year of their contract, they will play better, 
                         which make sense - they're not just playing to win the game this year, but to secure a better contract
                         and a higher salary for the next year. The next year, these players revert back to their average performance.`
                    }
                    <br /><br />
                    <a href="https://www.reddit.com/r/nba/comments/x2ydpt/the_greatest_contract_years_in_nba_history/" target="_blank" rel="noreferrer">
                        Fans talk about it
                    </a>{', '}
                    <a href="https://bleacherreport.com/articles/1101957-15-players-having-epic-contract-years-will-they-be-worth-it-in-the-long-term" target="_blank" rel="noreferrer">
                        Sports Writers talk about it
                    </a>{', '}
                    <a href="https://en.wikipedia.org/wiki/Contract_year_phenomenon" target="_blank" rel="noreferrer">
                        Wikipedia talks about it
                    </a>{', '}
                    <a href="https://www.espn.com/nba/story/_/id/29423982/celtics-jayson-tatum-says-nba-players-contract-years-putting-lot-line" target="_blank" rel="noreferrer">
                        and even players talk about it.
                    </a>
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    What is there to Explore?
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `Well, despite this consensus, the Contract Year Phenomenon doesn't seem to be a surefire straightforward concept.`
                    }
                    <br />
                    {
                        `There has been some prior research on this topic, showing different methodologies and identifying certain aspects:`
                    }
                    <ul>
                        <li>
                            <a href="https://sites.duke.edu/djepapers/files/2016/10/Jean-Neal_DJE.pdf" target="_blank" rel="noreferrer">
                                Performance Variation in the NBA
                            </a>
                            {` (Jean, Neal, Duke University, 2010) - This paper used Points, Rebounds, Steals, Blocks, and Assists to measure player performance.
                                They found that players performed better in their contract year, but did not find a significant difference in performance in the year after.        
                            `}
                        </li>
                        <li>
                            <a href="https://scholarship.claremont.edu/cgi/viewcontent.cgi?article=1780&context=cmc_theses" target="_blank" rel="noreferrer">
                                An Analysis of the Contract Year Phenomenon in the NBA
                            </a>
                            {` (Gaffaney, Tyler, Claremont McKenna College, 2013) - This paper used percent deviation from career average, and delineated players by age, 
                                position, and skill level. They found that certain players underperformed in their contract year, while others did not.
                            `}
                        </li>
                        <li>
                            <a href="https://dash.harvard.edu/bitstream/handle/1/14398539/RYAN-SENIORTHESIS-2015.pdf" target="_blank" rel="noreferrer">
                                Show Me the Money
                            </a>
                            {` (Ryan, Julian, Harvard College, 2015) - This paper used advanced metrics such as PER and WAR to measure player performance, and also
                                delineated between different types of contract situations. They found a 3-5% increase in performance for median players in their contract year.
                            `}
                        </li>
                        <li>
                            <a href="https://escholarship.org/uc/item/08f7j314" target="_blank" rel="noreferrer">
                                Gaming the System
                            </a>
                            {` (Shields Wald, Ezekiel, UC Santa Barbara, 2016) - This paper used a different economic theory to explain the contract year phenomenon - 
                                finding evidence that players that were "overvalued" tended to be the ones that improved in their contract year. 
                            `}
                        </li>
                    </ul>
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    What Are You Going to Do About It?
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `I'm going to graph it. I want to give readers a visual representation of the Contract Year Phenomenon, and show them the data, so they can make their own conclusions.`
                    }
                </p>
                <h2
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 500,
                        fontSize: `1.6rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Outline and Sketches
                </h2>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `My overall story follows this mood-story-template:`
                    }
                </p>
                <ul>
                    <li>
                        {'Show the audience the consensus on the Contract Year Phenomenon, and some popular athletes that exemplify the trend.'}
                    </li>
                    <li>
                        {'Bait and Switch - show the audience a larger picture that disproves their previous beliefs.'}
                    </li>
                    <li>
                        {'Build up some evidence/narrative to show the audience different ways to think about it.'}
                    </li>
                    <li>
                        {'Give the audience an interactive tool where they can explore the data themselves.'}
                    </li>
                </ul>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    The Bait: Athletes that Exemplify the Trend
                </h3>
                <img
                    src={process.env.PUBLIC_URL + "/bait.png"}
                    alt="Bait"
                    style={{
                        maxHeight: '40rem',
                        maxWidth: '70rem',
                    }}
                />
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `First, I will walk the audience through what the Contract Year Phenomenon. After that, I'll use a visualization like the one above to exemplify it.
                         Using annotations, I'll walk the audience through the story of select players, like LeBron James or Stephen Curry, visualizing the up and down arc of their careers.
                         Things I want to add to this graph are - smoothing on the graph, annotations, and aesthetic changes.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    The Switch: That's Not the Whole Picture
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `.9rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `Note: I'm still workshopping these graphs heavily, and am trying to land on how best to convey these images.
                        The main takeaway of the sketches is that I'm leaning towards a chaotic and noisy scatterplot or line graph.`
                    }
                </p>
                <img
                    src={process.env.PUBLIC_URL + "/switch_1.png"}
                    alt="Switch 1"
                    style={{
                        maxHeight: '45rem',
                        maxWidth: '45rem',
                        marginBottom: '1rem'
                    }}
                />
                <img
                    src={process.env.PUBLIC_URL + "/switch_2.png"}
                    alt="Switch 2"
                    style={{
                        maxHeight: '40rem',
                        maxWidth: '45rem',
                    }}
                />
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `I want to show the audience a larger picture that disproves their previous beliefs. To accomplish this, I want to really sell the fact that the data talked about 
                        previously is only a small subset of the larger population. To do this, my goal is that whatever graph I end with on the previous section, I want the rest of the data
                        to fade into view (and potentially zoom out), making the point be very tangible.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Building an Intuition
                </h3>
                <img
                    src={process.env.PUBLIC_URL + "/kde_1.png"}
                    alt="KDE 1"
                    style={{
                        maxHeight: '40rem',
                        maxWidth: '30rem',
                    }}
                />
                <img
                    src={process.env.PUBLIC_URL + "/kde_2.png"}
                    alt="KDE 2"
                    style={{
                        maxHeight: '40rem',
                        maxWidth: '30rem',
                    }}
                />
                <img
                    src={process.env.PUBLIC_URL + "/kde_3.png"}
                    alt="KDE 3"
                    style={{
                        maxHeight: '40rem',
                        maxWidth: '30rem',
                    }}
                />
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `I want to build up some evidence/narrative to show the audience different ways to think about it. I want to use a KDE plot to show the audience the distribution of player performance
                        in their contract year, and then show them the distribution of player performance in the year after. I want to animate between different KDE plots, and show the audience the difference
                        in distributions based on different player characteristics.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    See For Yourselves
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `I want to give the audience an interactive tool where they can explore the data themselves. I want to fully leverage D3.js and show the KDE plot, the scatterplot, and the line graph, and allow
                        the audience to filter by different player characteristics.`
                    }
                </p>
                <h2
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 500,
                        fontSize: `1.6rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Data
                </h2>
                <p>
                    I compiled data from these sources:
                </p>
                <ul>
                    <li>
                        <a href="https://github.com/erikgregorywebb/datasets/blob/master/nba-salaries.csv" target="_blank" rel="noreferrer">
                            NBA Salaries by Erik Webb
                        </a> - This dataset contains player salaries from 2000 to 2020.
                    </li>
                    <li>
                        <a href="https://github.com/fivethirtyeight/nba-player-advanced-metrics" target="_blank" rel="noreferrer">
                            WAR Metrics by FiveThirtyEight
                        </a> - This dataset contains advanced metrics for NBA players from 1977 to 2020.
                    </li>
                    <li>
                        <a href="https://www.kaggle.com/datasets/justinas/nba-players-data" target="_blank" rel="noreferrer">
                            NBA Players Kaggle Set
                        </a> - This dataset gives age data for players from 1996 to 2022.
                    </li>
                    <li>
                        <a href="https://www.spotrac.com/nba/free-agents/2020/" target="_blank" rel="noreferrer">
                            Spotrac
                        </a> - This website contains free agent data for different years.
                    </li>
                </ul>
                <p>
                    I plan on using Python Pandas and Numpy to clean and manipulate the data.
                    The data will be combined, and then edited to show several features such as deviation from the running average.
                    I will also use normalization techniques to ensure I have access to distribution data alongside raw data.
                </p>
                <h2
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 500,
                        fontSize: `1.6rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Methodology
                </h2>
                <p>
                    The final project will be done in React, and I will use D3.js to create the visualizations. My goal for this
                    course is to learn interactive data visualization, so I want to incorporate a lot of interactivity into my project.
                    My goal is to incorporate scroll-based animations, user controlled filters, and hover-based annotations.
                </p>
            </div>
        </div>
    )
}

export default NBAOne;
