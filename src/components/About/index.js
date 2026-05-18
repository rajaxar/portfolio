
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
            <h1
                style={{
                    color: "#F7DEC4",
                    cursor: 'default',
                    fontFamily: "Graphik",
                    fontWeight: 800,
                    fontSize: `clamp(1rem, 4dvw, 2.5rem)`,
                    marginBottom: "0rem"
                }}
            >
                Hey!
            </h1>
            <h3
                style={{
                    color: "#ffffff",
                    cursor: 'default',
                    fontFamily: "Publico",
                    fontWeight: 300,
                    fontSize: `clamp(1.2rem, 1.1dvw, 16dvh)`,
                    lineHeight: 1.2,
                    marginBottom: "0rem"
                }}
            >
                My name is Raj Shah.
                <br></br>
                <br></br>
                I am a Data Scientist and AI Engineer, with experience working on backend architecture (Amazon, BlackCloak), causal inference, and AI systems. My key passion is civic tech, and the intersection of classical statistical methods with software engineering.
                <br></br>
            </h3>
            <iframe
                src= {process.env.PUBLIC_URL + '/Raj_Shah_Resume.pdf'} 
                width="100%"
                height="100%"
                style={{
                    border: "none",
                    marginTop: '1rem',
                    marginBottom: '7rem',
                    borderRadius: '1rem',
                    backgroundColor: "#FCF3D9",
                }}
            >
            </iframe>
        </div>

    )
}

export default About;
