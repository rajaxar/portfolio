
function Projects() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '75%',
                height: '100%',
                marginLeft: "clamp(2rem, 5dvw, 10rem)",
            }}
        >
            <h3
                style={{
                    color: "#ffffff",
                    cursor: 'default',
                    fontFamily: "Publico",
                    fontWeight: 300,
                    fontSize: `clamp(1rem, 1dvw, 16dvh)`,
                    lineHeight: 1.2,
                    marginBottom: "0rem"
                }}
            >
                Coming Soon!
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
                TODO: add more
            </h3>
        </div>

    )
}

export default Projects;
