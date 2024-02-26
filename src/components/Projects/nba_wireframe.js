import NBAScroll from "./nbaScroll";
import NBASalaryScatterplot from "./nba_scatterplot";
import NBAKDE from "./nba_kde";

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
                href="portfolio?ref=projects"
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
                    marginTop: '0rem',
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '-2rem',
                        marginBottom: '-12rem'
                    }}
                >
                    {/* <NBASalaryScatterplot /> */}
                </div>
                <NBAKDE />
            </div>
        </div>
    )
}

export default NBAWireframe;
