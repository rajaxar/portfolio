import React, { useState } from 'react';

import {
    Card,
    Image,
    Text,
    Title,
    Button,
    Grid,
    Container
} from '@mantine/core';
import { clamp } from '@mantine/hooks';

const projectList = [
    {
        id: 'nba',
        label: 'Contract Year vs. Performance in the NBA',
        description: 'This project is an experiment in data-storytelling. I use D3.JS to visualize the relationship between contract' +
            ' years and player performance in the NBA. The project includes animated components and interactive components that allow' +
            ' the user to explore the data in a more engaging way.',
        image: process.env.PUBLIC_URL + "/title_nba.png",
        link: process.env.PUBLIC_URL + "?ref=nba_contract"
    },
    {
        id: 'idl',
        label: 'Achieving Fairness in Federated Learning',
        description: 'This group project implemented a novel approach to improve individual fairness in Federated Instances using the ' +
            'Flower framework. We trained a Neural Network model on recidivism cases from the COMPAS dataset, and were able to achieve ' +
            'increases in group and individual fairness metrics without sacrificing accuracy.',
        image: process.env.PUBLIC_URL + "/IDL.png",
        link: "https://drive.google.com/file/d/18o0HTSjobRYRX5yXMQSVGRwoyJZB7Lbb/view?usp=sharing"
    },
    {
        id: 'fund_vote',
        label: 'Reducing Voter Wait Times using Optimization',
        description: 'This project used optimization techniques to reduce voter wait times in Allegheny County. We used census data and ' +
            'historical voting data to create a model that predicts wait times at polling places. We then used this model to optimize the ' +
            'allocation of voting machines and poll workers to reduce wait times.',
        image: process.env.PUBLIC_URL + "/fund_vote.png",
        link: "https://drive.google.com/file/d/1zSonvwBOezt0recD4NiNXHyRVB9xGxiE/view?usp=sharing"

    },
    {
        id: 'gis',
        label: 'Changes in Industry in Pittsburgh using GIS',
        description: 'This ArcGIS Dashboard visualizes changes in occupational makeup across the greater Pittsburgh area. It uses ' +
            'historical census data with Multivariate Cluster Analysis to identify trends across different precincts. The dashboard allows ' +
            'users to stratify data by industry and by year.',
        image: process.env.PUBLIC_URL + "/pitt.png",
        link: "https://carnegiemellon.maps.arcgis.com/apps/dashboards/5e8c1eabf493431db79e6a2bbf66a554"
    },
    {
        id: 'fakebook',
        label: 'Full-Stack CNN for Identifying GAN Media',
        description: 'This project uses a Convolutional Neural Network to identify GAN-generated media. The project was deployed on Amazon ' +
            'Web Services and was served via a Chrome Extension with React. The project achieved an accuracy of 97.2% on our test set ' +
            'and the project was a Top Ten Finalist in Booz Allen Hamilton\'s 2019 Summer Games.',
        image: process.env.PUBLIC_URL + "/fakebook.png",
        link: "https://drive.google.com/file/d/1A7DYSkxohtBkIaL4D1_LJD2QY5pbcOx7/view?usp=sharing"
    }

]

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
