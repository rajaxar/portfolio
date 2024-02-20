import NBAScroll from "./nbaScroll";

function NBAWireframe() {
    return (
        <div
            style={{
                height: '100%',
                scrollBehavior: 'smooth',
                overflow: 'scroll',
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
                    marginTop: '2rem',
                }}
            >
                <img
                    src={process.env.PUBLIC_URL + "/title_nba.png"}
                    alt="The Contract Year Phenomenon"
                    style={{
                        maxHeight: '50rem',
                        maxWidth: '40rem',
                        alignSelf: 'center',
                        marginBottom: '0rem'
                    }}
                />
                <h3
                    style={{
                        marginTop: '0rem',
                        marginBottom: '-20rem',
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
                <NBAScroll />
            </div>
        </div>
    )
}

export default NBAWireframe;
