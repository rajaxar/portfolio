
function About() {
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
                My name is Raj Shah!
                <br></br>
                I'm currently studying Public Policy and Data Science at Carnegie Mellon University.
            </h3>
            <iframe
                src= {process.env.PUBLIC_URL + '/Raj_DataScience_2024.pdf'} 
                width="100%"
                height="100%"
            >
            </iframe>
        </div>

    )
}

export default About;
