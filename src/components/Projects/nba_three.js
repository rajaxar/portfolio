import { Table } from '@mantine/core';

function NBAThree() {
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
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `The goal of my project is to examine a relatively well believed trend in the sports world, and explore it.`} <br />
                    {`The trend in question: NBA Players tend to perform better in their Contract Year.`}

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
                    The Journey So Far
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
                        `In Part 1, I felt very strongly about the topic, but was having trouble visualizing it, at least aesthetically and in a compelling way. I had graphs, but they seemed too chaotic to show much, and there wasn't a narrative cohesion to the story. ` +
                        `In Part 2, I was able to plot some of my graphs in a better way, using interactive elements like D3.JS. D3 really allowed me to show off more data, because the audience was able to scroll to see more, or interact with the graph to see more. In this way, I was able to remove the issue of too much data being on the screen at once, all at once. However, I still felt very iffy on the narrative, and this showed - a lot of the User Research was geared towards my narrative being incomplete, or my data being hard to follow without more background context.`

                    } <br /><br />
                    {
                        `In Part 3, I had two main focuses - finishing up the charts, and making sure the narrative was clear. For finishing up the charts, this was mostly adding in more sections to my work. I don't know why, but the question of "what chart" became easier as I added more sections in - the narrative was becoming more cohesive and clear in my head. I didn't really finish ALL of what I wanted to do, but I felt I had enough to communicate what I wanted to communicate - I learned that I wanted to surprise the audience about the phenomenon, give some evidence to why it might not exist, and show how it is a complex relationship, using interactivity to drive that home. This was a big change from Part 1, where I was just trying to show the phenomenon existed.`
                    } <br /><br />
                    {
                        `One of the things I was unable to really accomplish was talking about how performance during the contract year affects the change in salary. I found it interesting that it was not a straightforward relationship, and I feel that it has interesting ramifications for players. I did include a quick graph to show that but I think I could have given more towards it. I also think I could have done more to show the different types of contracts, and how they might affect the relationship.`
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
                    References
                </h2>
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
                    <li>
                        <a href="https://sites.duke.edu/djepapers/files/2016/10/Jean-Neal_DJE.pdf" target="_blank" rel="noopener noreferrer">
                            Performance Variation in the NBA (Jean, Neal, Duke University, 2010) 
                        </a>
                        - This paper used Points, Rebounds, Steals, Blocks, and Assists to measure player performance. They found that players performed better in their contract year, but did not find a significant difference in performance in the year after.
                    </li>
                    <li>
                        <a href="https://scholarship.claremont.edu/cgi/viewcontent.cgi?article=1780&context=cmc_theses" target="_blank" rel="noopener noreferrer">
                            An Analysis of the Contract Year Phenomenon in the NBA (Gaffaney, Tyler, Claremont McKenna College, 2013)
                        </a>
                         - This paper used percent deviation from career average, and delineated players by age, position, and skill level. They found that certain players underperformed in their contract year, while others did not.
                    </li>
                    <li>
                        <a href="https://dash.harvard.edu/bitstream/handle/1/14398539/RYAN-SENIORTHESIS-2015.pdf" target="_blank" rel="noopener noreferrer">
                            Show Me the Money (Ryan, Julian, Harvard College, 2015)
                        </a>
                         - This paper used advanced metrics such as PER and WAR to measure player performance, and also delineated between different types of contract situations. They found a 3-5% increase in performance for median players in their contract year.
                    </li>
                    <li>
                        <a href="https://escholarship.org/uc/item/08f7j314" target="_blank" rel="noopener noreferrer">
                            Gaming the System (Shields Wald, Ezekiel, UC Santa Barbara, 2016)
                        </a>
                        - This paper used a different economic theory to explain the contract year phenomenon - finding evidence that players that were "overvalued" tended to be the ones that improved in their contract year.
                    </li>
                </ul>

            </div>
        </div>
    )
}

export default NBAThree;
