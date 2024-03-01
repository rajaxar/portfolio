import { Group, Text, Accordion } from '@mantine/core';
import GovDebt from './govDebt';
import USProportions from './usProportions';
import NBAOne from './nba_one';
import NBATwo from './nba_two';
import NBAThree from './nba_three';

const projectList = [
    {
        id: 'nba_part_3',
        label: 'Contract Year vs Performance in the NBA - Part 3',
        description: 'Part Three of an analysis of the relationship between contract years and player performance in the NBA.',
        content: 
            <>
                <a href={process.env.PUBLIC_URL + '?ref=nba_contract'} >
                    Click Here to see the Actual Story.
                </a> Scroll Down to See Parts 1 and 2.
                <NBAThree />
            </>
    },
    {
        id: 'nba_part_2',
        label: 'Contract Year vs Performance in the NBA - Part 2',
        description: 'Part Two of an analysis of the relationship between contract years and player performance in the NBA.',
        content: 
            <>
                <a href={process.env.PUBLIC_URL + '?ref=nba_contract'} >
                    Click Here to see the Actual Story
                </a>
                <NBATwo />
            </>
    },
    {
        id: 'nba_part_1',
        label: 'Contract Year vs Performance in the NBA - Part 1',
        description: 'Part One of an analysis of the relationship between contract years and player performance in the NBA.',
        content: <NBAOne />,
    },
    {
        id: 'us_proportions',
        label: 'Americans on Proportions',
        description: 'An exercise in critiquing existing visualizations.',
        content: <USProportions />,
    },
    {
        id: 'gov_debt',
        label: 'Visualizing Government Debt',
        description: 'A visualization of government debt from 1995 to 2019.',
        content: <GovDebt />,
    }
]

function AccordionLabel({ label, description }) {
    return (
        <Group wrap="nowrap">
            <div
            >
                <h3
                    style={{
                        marginBlock: 2,
                        marginLeft: '1rem',
                        fontFamily: "Graphik",
                        fontWeight: 800,
                        fontSize: `clamp(1rem, 4dvw, 2.5rem)`,
                    }}
                >{label}
                </h3>
                <Text size="md" c="dark" fw={400} ff={"mono"} style={{ marginLeft: '1rem' }}>
                    {description}
                </Text>
            </div>
        </Group>
    );
}


function Projects({ windowDict }) {
    const projects = projectList.map((item) => {
        return (
            <Accordion.Item
                value={item.id} key={item.label}
                style={{
                    backgroundColor: "#FCF3D9",
                    marginBlock: '1rem',
                }}
            >
                <Accordion.Control>
                    <AccordionLabel {...item} />
                </Accordion.Control>
                <Accordion.Panel style={{ paddingInline: '1.5rem', paddingBlockEnd: '1.5rem' }}>
                    {item.content}
                </Accordion.Panel>
            </Accordion.Item>

        )
    });

    let project = null;
    if (windowDict.ref && windowDict.ref === 'projects') {
        if (windowDict.project) {
            project = windowDict.project;
            delete windowDict.project;
        }
        delete windowDict.ref;
    }

    return (
        <Accordion
            variant="separated"
            radius="md"
            defaultValue={project}
            style={{
                width: '85%',
                margin: 'auto',
                marginTop: '2rem',
                marginBottom: '2rem',
            }}>
            {projects}
        </Accordion>
    )
}

export default Projects;
