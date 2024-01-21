import RajShah from "./RajShah";

function Home() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                marginLeft: "clamp(2rem, 5dvw, 10rem)",
                overflow: "scroll",
            }}
        >
            <RajShah />
            <h3
                style={{
                    cursor: 'default',
                    fontFamily: "Publico",
                    fontWeight: 300,
                    fontSize: `clamp(1rem, 1dvw, 16dvh)`,
                    color: "#ffffff",
                    marginBottom: "0rem"
                }}
            >
                Eventually, this will be a portfolio website.
            </h3>
            <h3
                style={{
                    cursor: 'default',
                    fontFamily: "Publico",
                    fontWeight: 400,
                    fontSize: `clamp(.6rem, .6dvw, 10dvh)`,
                    color: "#ffffff",
                    marginTop: ".2rem",
                    marginBottom: "2rem"
                }}
            >
                Eventually.
            </h3>
        </div>

    )
}

export default Home;
