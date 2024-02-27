import NBAScroll from "./nbaScroll";
import NBAKDE from "./nba_kde";
import NBADIY from "./nba_diy";

function NBAWireframe() {
    return (
        <div
            style={{
                height: '100%',
                scrollBehavior: 'smooth',
                overflow: 'auto',
                backgroundColor: '#f6eee3',
                marginBottom: "0rem"
            }}
        >
            {/* Button that returns back to main page, stickied on top left. */}
            <a
                href="?ref=projects"
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 100,
                    backgroundColor: '#213052',
                    opacity: 0.8,
                    color: '#FCF3D9',
                    padding: '0.5rem .75rem',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: `.8rem`,
                    fontFamily: "Graphik",
                }}
            >
                Back
            </a>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '-20rem',
                }}
            >
                <NBAScroll />
                <img
                    src={process.env.PUBLIC_URL + "/title_nba.png"}
                    alt="The Contract Year Phenomenon"
                    style={{
                        maxHeight: '55rem',
                        maxWidth: '45rem',
                        alignSelf: 'center',
                        marginTop: '10rem',
                        marginBottom: '0rem'
                    }}
                />
                <h3
                    style={{
                        marginTop: '0rem',
                        marginBottom: '12rem',
                        fontFamily: "Grouch",
                        fontWeight: 400,
                        fontSize: `1.5rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        textAlign: 'center',
                        color: '#86020e'
                    }}
                >
                    Story by Raj Shah
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1.7rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        paddingInline: '5rem',
                        color: '#213052',
                        marginBottom: '8rem'
                    }}
                >

                    In 2020, the world was grappling with a global pandemic, and the NBA was also struggling.
                    The league somehow pulled off playoffs after a total hiatus in both games and training, leading to a spectacular Bubble Season.<br /><br />
                    <span
                        style={{
                            fontSize: `1.3rem`,
                            marginBlock: '0rem',
                        }}
                    >
                        I'm still wondering where that <span style={{ color: '#86020e', fontWeight: 500 }}>
                            2020 Heat Team </span> went. </span><br /><br />

                    Players went on the record to discuss how they felt uncertain about playing that year - Jayson Tatum famously said that free agent players were{' '}
                    <a href="https://www.espn.com/nba/story/_/id/29423982/celtics-jayson-tatum-says-nba-players-contract-years-putting-lot-line" target="_blank" rel="noreferrer">
                        "putting a lot on the line"
                    </a>
                    {' '}by deciding they had to risk their health to secure a good contract.

                    <br />< br />
                    So that makes sense - players are concerned about how much they can earn in the future. Let's see how this is reflected in their performance.
                </p>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '-20rem',
                        marginBottom: '10rem'
                    }}
                >
                    <NBAKDE />
                </div>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1.4rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        paddingInline: '10rem',
                        marginTop: '-5rem',
                        marginBottom: '2rem',
                        textAlign: 'justify'
                    }}
                >
                    Not exactly - there has been a lot of prior research on this topic, showing different methodologies, and coming to some different conclusions.
                    <ul>
                        <li>
                            <a href="https://sites.duke.edu/djepapers/files/2016/10/Jean-Neal_DJE.pdf" target="_blank" rel="noopener noreferrer">
                                Performance Variation in the NBA
                            </a>
                            (Jean, Neal, Duke University, 2010) - This paper used Points, Rebounds, Steals, Blocks, and Assists to measure player performance. They found that players performed better in their contract year, but did not find a significant difference in performance in the year after.
                        </li>
                        <br />
                        <li>
                            <a href="https://scholarship.claremont.edu/cgi/viewcontent.cgi?article=1780&context=cmc_theses" target="_blank" rel="noopener noreferrer">
                                An Analysis of the Contract Year Phenomenon in the NBA
                            </a>
                            (Gaffaney, Tyler, Claremont McKenna College, 2013) - This paper used percent deviation from career average, and delineated players by age, position, and skill level. They found that certain players underperformed in their contract year, while others did not.
                        </li>
                        <br />
                        <li>
                            <a href="https://dash.harvard.edu/bitstream/handle/1/14398539/RYAN-SENIORTHESIS-2015.pdf" target="_blank" rel="noopener noreferrer">
                                Show Me the Money
                            </a>
                            (Ryan, Julian, Harvard College, 2015) - This paper used advanced metrics such as PER and WAR to measure player performance, and also delineated between different types of contract situations. They found a 3-5% increase in performance for median players in their contract year.
                        </li>
                        <br />
                        <li>
                            <a href="https://escholarship.org/uc/item/08f7j314" target="_blank" rel="noopener noreferrer">
                                Gaming the System
                            </a>
                            (Shields Wald, Ezekiel, UC Santa Barbara, 2016) - This paper used a different economic theory to explain the contract year phenomenon - finding evidence that players that were "overvalued" tended to be the ones that improved in their contract year.
                        </li>
                    </ul>
                    So what does this all mean? <br /> There are a lot of factors that go into seeing the relationship between player performance and contract year.<br /><br />What might make it easier to understand is to see the data for ourselves.
                </p>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1.4rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        paddingInline: '10rem',
                        marginBottom: '10rem',
                        textAlign: 'justify'
                    }}
                >
                    One of the graphs below covers what we’ve already seen - the estimated percentage distributions for player performance, delineated by year related to contract. The other is a new one - this one shows how much a player's salary increases based on their change in performance during the contract year.
                    <br /><br />
                    <span style={{ fontSize: `1.2rem`, marginBlock: '0rem' }}>
                        Both of these graphs are made up of 300+ players spanning 2 decades of NBA history.
                        <br /><br />
                        Try seeing how Young Centers do in their contract year, or how younger Point Guards tend to get rewarded versus older Point Guards.
                    </span>
                </p>

                <div
                    style={{
                        marginTop: '-8rem',
                        marginBottom: '5rem',
                        paddingInline: '5rem',
                    }}
                >
                    <NBADIY />
                </div>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1.4rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        paddingInline: '15rem',
                        marginBottom: '5rem',
                        textAlign: 'justify'
                    }}
                >
                    {/* Make a Span of Centered Text */}
                    <span
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: `2rem`,
                            marginBlock: '2rem',
                            color: '#86020e',
                            fontFamily: 'Grouch',

                        }}
                    >
                        So What's the Takeaway?
                    </span>
                    <span
                        style={{
                            fontSize: `1.5rem`,
                            fontWeight: 500,
                        }}
                    >
                        Does the{' '}
                        <span
                            style={{
                                color: '#86020e',
                                fontWeight: 800,
                                fontFamily: 'Grouch',
                            }}
                        >
                            Contract Year
                        </span>
                        {' '}Phenomenon exist?
                    </span>
                    <br /><br />
                    Kind of. Different players in different situations are going to act...<span style={{ fontWeight: 500 }}>different</span>. And regardless of how they change their game, it's not a given that they'll get paid more.
                    <br /><br /><br />
                    <span
                        style={{
                            fontSize: `1.5rem`,
                            fontWeight: 500,
                        }}
                    >
                        So Why Does This Matter?
                    </span>
                    <ul>
                        <li>
                            For Managers and Coaches, it's important to understand how players are motivated. Knowing that your rising new Center is in their contract year can be a good indicator that they might be looking to improve their game.
                        </li><br /><li>
                            For Players, we saw earlier that they felt immense pressure to perform in their contract year. It's important to understand that the pressure might not be worth it - the data shows that the change in performance doesn't always lead to an increase in salary.
                        </li><br /><li>
                            And for Fans, it's just another layer of the game to understand. It's easy to remember the players that had a breakout year in their contract year, but that's not the whole story - it's good to remember the players that didn't.
                        </li>
                    </ul>
                    <br /><br />
                    <span
                        style={{
                            fontSize: `1.5rem`,
                            fontWeight: 500,
                        }}
                    >
                        How Can I Learn More?
                    </span>
                    <ul>
                        <li>
                            <a href="https://fivethirtyeight.com/features/how-our-raptor-metric-works/" target="_blank" rel="noopener noreferrer">
                                FiveThirtyEight - How Our RAPTOR Metric Works
                            </a>: FiveThirtyEight is a great resource for understanding advanced metrics in the NBA. They have a great explainer on how their RAPTOR metric works, and how it's used to measure player performance.
                        </li><br /><li>
                            <a href="https://www.baseball-reference.com/about/war_explained.shtml" target="_blank" rel="noopener noreferrer">
                                Baseball Reference - WAR Explained
                            </a>: WAR is a statistic used in multiple sports. Though this link is for baseball, it's a great resource for understanding how WAR is calculated and why it is used.
                        </li><br /><li>
                            <a href="https://cbabreakdown.com/contract-types/" target="_blank" rel="noopener noreferrer">
                                CBA Breakdown - Contract Types
                            </a>: This link is a great resource for understanding the different types of contracts - which is something this analysis did not control for. Different types of contracts might lead to different motivations for players.
                        </li>
                    </ul>
                </p>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `.8rem`,
                        lineHeight: 1.4,
                        width: '100%',
                        paddingInline: '15rem',
                        marginBottom: '10rem',
                        display: 'block',
                        textAlign: 'center',
                }}
                    >
                        Raj Shah
                    </p>
            </div>
        </div>
    )
}

export default NBAWireframe;
