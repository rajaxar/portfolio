import React, { useState } from 'react';

import {
    Card,
    Image,
    Button,
    Grid,
    Container
} from '@mantine/core';
import { projects as projectData } from '../../data/projects';

// One source of truth. The copy lives in src/data/projects.js so a description
// edit cannot drift between this surface and the front sheet.
const projectList = projectData.map((p) => ({
    id: p.id,
    label: p.title,
    description: p.description,
    image: process.env.PUBLIC_URL + p.image,
    link: p.external ? p.link : process.env.PUBLIC_URL + p.link,
}))

function ProjectCard({ item }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            style={{
                backgroundColor: "#FCF3D9",
                cursor: 'pointer',
                textDecoration: 'none'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Card.Section>
                <h1
                    style={{
                        color: "#000",
                        cursor: 'pointer',
                        fontFamily: "Publico",
                        fontWeight: 800,
                        marginTop: ".75rem",
                        marginBottom: ".25rem",
                        textAlign: "center",
                        lineHeight: 1.1,
                        paddingLeft: "3rem",
                        paddingRight: "3rem",
                    }}
                >
                    {item.label}
                </h1>

                <Image
                    src={item.image}
                    alt={item.label}
                    height={120}
                    fit="contain"
                    style={{
                        paddingLeft: "1.5rem",
                        paddingRight: "1.5rem",
                    }}
                    
                />
            </Card.Section>

            <div
                style={{
                    maxHeight: hovered ? '200px' : '0px',
                    opacity: hovered ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease, opacity 0.5s ease'
                }}
            >
                <h3
                    style={{
                        color: "#000",
                        cursor: 'pointer',
                        fontFamily: "Graphik",
                        fontWeight: 370,
                        fontSize: `clamp(0.6rem, 1rem, 12dvh)`,
                        lineHeight: 1.3,
                        marginBottom: "0rem",
                        paddingLeft: "1.5rem",
                        paddingRight: "1.5rem",
                    }}
                >
                    {item.description}
                </h3>
            </div>

            <Button
                onClick={(e) => e.stopPropagation()}
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                fullWidth
                mt="md"
                ff={"Graphik"}
                fw={500}
            >
                Visit Project
            </Button>
        </Card>
    );
}


function Projects() {
    return (
        <Container size="xxl" style={{ marginTop: '2rem', marginBottom: '2rem', paddingLeft: 'clamp(2rem, 5dvw, 10rem)', paddingRight: 'clamp(2rem, 5dvw, 10rem)' }}>

            <Grid
                gutter="lg"
                type="container"
                breakpoints={{ sm: '500px', md: '1200px', lg: '2400px', xl: '3200px' }}
            >
                {projectList.map((item) => (
                    <Grid.Col
                        span={{ base: 12, sm: 12, md: 6, lg: 6, xl: 4 }}
                        key={item.id}
                    >
                        <ProjectCard item={item} />
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
}

export default Projects;
