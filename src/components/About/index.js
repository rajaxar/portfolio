
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
                I was a Software Engineer that worked at Amazon Web Services (AWS) on S3, using Java and Python to build out features for the
                object processing team. I moved on to startups, where I worked on developing projects and leading teams. However, my passion is
                Data Science, especially focused on applying analytics to Civic Tech. I am currently studying Public Policy Management with a
                focus on Data at Carnegie Mellon University.
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
