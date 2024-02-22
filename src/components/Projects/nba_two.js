import { Table } from '@mantine/core';

function NBATwo() {
    const critique = [
        {
            'person': 'Person One',
            'q1': "Yeah, I do know about the phenomenon (from other sports), but I think you don't give enough context about it. Maybe you could talk about different types of contracts and how they players with team options and player options are affected differently.",
            'q2': "Yeah, I liked the connection of going from 'here's the contract year' to 'here's a reason why it might not matter' to 'here's why it is hard to explain', though you might want to switch those sections to better sell your point.",
            'q3': "Visuals were really easy to understand, though the axes could use some labels. I liked the colors being consistent with the teams - it was a nice touch.",
            'q4': "I think just giving more insight into different types of contracts and their affects on players would be really nice. Other than that, swap the sections and you're good."
        },
        {
            'person': 'Person Two',
            'q1': "I think I feel comfortable with the contract year. The graph confused me, but once you explained how it worked, I got it.",
            'q2': "Sort of - I was a little confused about the 'why it might not exist' part. I think you could explain that a little better. Though if you add the interaction you were talking about, I think that would help.",
            'q3': "The visuals were okay. Titles and axes labels would help. The scatterplot could use some color to differentiate the players, though I'm not sure how.",
            'q4': "Just making it more clear. I don't know if it's because the third section isn't in yet."
        },
        {
            'person': 'Person Three',
            'q1': "Yeah, though I had to google what RAPTOR WAR was to understand the graph. But later I realized that wasn't that important to understanding.",
            'q2': "Yeah, it's interesting. The line plot where all the people show up made it make sense for me. I think the interactivity really helps.",
            'q3': "Except for axes, the visuals were easy to understand. I think changing them is going to do a lot. Again, the interactions helped.",
            'q4': "Maybe add tooltips or something for optional things to learn."
        }
    ]
    
    const rows = critique.map((critique_row) => (
        <Table.Tr key={critique_row.person}>
            <Table.Td>{critique_row.person}</Table.Td>
            <Table.Td>{critique_row.q1}</Table.Td>
            <Table.Td>{critique_row.q2}</Table.Td>
            <Table.Td>{critique_row.q3}</Table.Td>
            <Table.Td>{critique_row.q4}</Table.Td>
        </Table.Tr>
    ))

    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '1rem'
                }}
            >
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `The goal of my project is to examine a relatively well believed trend in the sports world, and explore it.`} <br />
                    {`The trend in question: NBA Players tend to perform better in their Contract Year.`}

                </p>
                <h2
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 500,
                        fontSize: `1.6rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    User Research and Interviews
                </h2>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Target Audience
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `My Target Audience is sports fans interested in analytics. ` +
                        `I want to make a project that is accessible to an audience with a general understanding of basketball and stats, but also provide depth for those who are more interested in the topic.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Approach to Identifying Individuals
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `It was important for me to speak to Basketball Fans across the spectrum - making sure I reached out to people who were strong fans versus "soft fans", and also delineating between fans with statistical knowledge versus those who do not. ` +
                        `It was hard for me to capture the full permutation of those groups (I think I'm the only person I know who knows more about basketball stats than basketball), but I did my best to reach out to a diverse group of people.`
                    } <br />
                    {`I also made sure that my population varied in race and gender (though unlike the exercise, the ages had a smaller range).`}
                    <br/><br/>
                    {`Because I knew my questions were based on understanding the background and the points made by the story, I was happy with the individuals I seeked out: `}
                </p>
                <ul>
                    <li>
                        {`Person One: Avid Basketball Fan, with a strong understanding of basketball statistics`}
                    </li>
                    <li>
                        {`Person Two: Casual Basketball Fan, with no experience with basketball statistics`}
                    </li>
                    <li>
                        {`Person Three: Casual Basketball Fan, with no experience with statistics`}
                    </li>
                </ul>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Interview Script
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `As mentioned earlier, the point of the interviews was to see if people could easily understand the basis and the purpose of my project. Here are the questions I focused on for my interview:`
                    }
                    <ol>
                        <li>
                            {`After reading through this project, do you think you feel comfortable knowing what the contract year phenomenon is?`}
                        </li>
                        <li>
                            {`After reading through this project, do you feel like you have a good understanding of why the phenomenon might not exist?`}
                        </li>
                        <li>
                            {`Were the visuals easy to understand?`}
                        </li>
                        <li>
                            {`Any other recommendations?`}
                        </li>
                    </ol>
                    {
                        `Because my project was still in progress, I wasn't able to show them all visuals in the website. Instead, I showed them parts of the website, and then showed them my Python code for the rest, with me talking over them instead of having a story written out.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Findings
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `.8rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {`Interviews were conducted then paraphrased here. Scroll right to see the full responses.`}
                </p>
                <Table.ScrollContainer minWidth={2000}>
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th miw={100}>Person</Table.Th>
                            <Table.Th miw={250}>After reading through this project, do you think you feel comfortable knowing what the contract year phenomenon is?</Table.Th>
                            <Table.Th miw={250}>After reading through this project, do you feel like you have a good understanding of why the phenomenon might not exist?</Table.Th>
                            <Table.Th miw={250}>Were the visuals easy to understand?</Table.Th>
                            <Table.Th miw={250}>Any other recommendations?</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `I think the interviews were not too surprising. I knew my graphs were still missing some labels and were not the most clear, and that was reflected in the feedback. ` +
                        `I also knew that the interactivity was a huge help in understanding the project, and that was reflected in the feedback. ` +
                        `The most surprising feedback was linked to potentially swapping the sections. Narratively, I am torn on which one makes more sense, and will need to play around with it.`
                    }
                </p>
                <h3
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 600,
                        fontSize: `1.2rem`,
                        lineHeight: 1.4,
                        marginBottom: '0rem',
                        width: '100%',
                    }}
                >
                    Planned Changes
                </h3>
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                    }}
                >
                    {
                        `My first priority is just to finish the project - add in the third section, finish my labels on everything, and add some polish. After that, I will want to do some iterating on the order of the sections to see how it flows. ` +
                        `I think practicing saying the 60 second pitch with the permutations of the sections will help me understand which one makes more sense. ` +
                        `I don't think I'll incorporate the feedback about the different types of contracts, as I think that might be a little too much for the scope of the project. Some statistical papers make reference to it, and others don't, and frankly, I think it'd complicate the piece further. ` +
                        `Instead, I'll reference that at the end when showing my methodology. ` + 
                        `I think the feedback about the scatterplot is interesting, and I'll play around with it. I think it's a good idea to differentiate the players, maybe based on position, and I'll see if I can do that.`
                    }
                </p>
            </div>
        </div>
    )
}

export default NBATwo;
