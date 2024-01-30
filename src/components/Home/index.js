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
                marginBottom: "2rem",
                marginTop: "-2rem"
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
                }}
            >
                Welcome to my website!
            </h3>
        </div>

    )
}

export default Home;
