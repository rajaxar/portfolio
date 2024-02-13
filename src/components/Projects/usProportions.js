import TableauReport from 'tableau-react';
import { Table } from '@mantine/core';

// Table Headings - Age, Occupation, "Can you tell me what you think this is?", 
// "Can you describe to me what this is telling you?", "Is there anything you find surprising or confusing?",
// "Who do you think is the intended audience for this?", "Is there anything you would change or do differently?"
const critique = [
    {
        'age': '24',
        'occupation': 'Grad Student',
        'q1': 'I think this is a scatter plot diagram that visually shows the variability between the true population ratio and the estimated population ratio.',
        'q2': 'I notice that most dots are below the middle line towards the left and above the middle line towards the right, so like the title suggests, Americans underestimate majorities and overestimate minorities.',
        'q3': "The 'what percent...' textboxes confused me. At first, I thought they represent the color scheme, but when I hovered over some of the points, I noticed they only represent a singular dot. There is not an obvious connection between those prompts to me. They feel random/arbitrarily emphasized. On the same note, I'm not completely sure what the colors represent, but I suspect they show low-to-high ratios. One final point of confusion was the use of the word 'estimated'. When I initially saw 'true population' and 'estimated population', I initially thought we were comparing N vs. n (so I thought the estimated population came from samples and we were comparing that to the actual N). It took me a few seconds after reading the title to decipher that estimated population reflects the perception of what the ratio is, something probably collected through a survey.",
        'q4': "Maybe all Americans. It can be a way to show that people fall into these fallacies and should maybe check themselves on our assumptions. I'm guessing Americans is specific to the US and not the two continents. That being said, if this graph is intended for Americans of all levels of data literacy, it can definitely be harder to interpret for the gurls with less data literacy.",
        'q5': "1. I would switch the y and x axis. I think it may make the over/underestimations more obvious (I tend to look at the x-axis and compare the y-axis against it, so comparing estimations against truths might be more intuitive). 2. I would categorize the majorities and minorities visually. Either make ratios above 50% (true pop) one color and make below 50% a lighter/different color, or place a dashed line along 50% and label one section as majorities and the other section as minorities. 3. I would make the ratios be percentages. I think that always reads more intuitively to wider audiences (e.g. a ratio of 0.7 vs 70%) 4. The reference line is a bit hard to see, i would make it darker (maybe black or dark gray) 5. I would take away the 'what percent...' textboxes and switch them with what each color represents (also consider aligning them)"
    },
    {
        'age': '19',
        'occupation': 'Freshman',
        'q1': 'Scatterplot data on Americans and their estimated population ratios vs. true population ratios.',
        'q2': 'Based on different data on Americans and their experiences there is a difference in the estimated population ratio and true population ratio. Minority populations are estimated to have a higher ratio than actual, while majority populations are estimated to have a lower ratio than actual.',
        'q3': 'I just found it surprising that the most accurate estimate to true ratio comparison would be “What percent of Americans own a house” while “What percent of Americans are a military veteran” is the most off.',
        'q4': 'I think the intended audience for this is probably demographers, politicians, and statisticians because those are the people most likely interested in population dynamics.'
    },
    {
        'age': '29',
        'occupation': 'Data Scientist (International)',
        'q1': "The subtitle makes me think it's about political parties. And since it's not a common topic, it takes a moment to understand what it's about. The graph visualizes the imperfect estimates people have about things around",
        'q2': "It tells me the perception for some things are higher than reality and for some it's lower.",
        'q3': "The text on the graph made me think that red is for flight, pink for house, orange for fun and yellow for veteran. Then I started thinking why are there more than one dots for each. That's when I hovered and saw that it has other variables too",
        'q4': "I imagine this featuring in a fun article just to tickle people's fancy. So the intended audience could be any random reader.",
        'q5': "The text on the graph can have arrows to their bubble, and a legend on what color variation would help pick trend faster."
    }
]

const rows = critique.map((critique_row) => (
    <Table.Tr key={critique_row.age + critique_row.occupation}>
        <Table.Td>{critique_row.age}</Table.Td>
        <Table.Td>{critique_row.occupation}</Table.Td>
        <Table.Td>{critique_row.q1}</Table.Td>
        <Table.Td>{critique_row.q2}</Table.Td>
        <Table.Td>{critique_row.q3}</Table.Td>
        <Table.Td>{critique_row.q4}</Table.Td>
        <Table.Td>{critique_row.q5}</Table.Td>
    </Table.Tr>
));


function USProportions() {
    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: '1rem'
                }}
            >
                <p
                    style={{
                        fontFamily: "Graphik",
                        fontWeight: 400,
                        fontSize: `1rem`,
                        lineHeight: 1.4,
                        marginRight: '1rem',
                    }}
                >
                    {
                        `The goal of this assignment was to analyze an existing visualization, critique it, and the develop our own visualization.`
                    }
                    <br /><br />
                    {
                        `The chart I analyzed was from YouGov, from an article titled `
                    }
                    <a href="https://today.yougov.com/politics/articles/41556-americans-misestimate-small-subgroups-population?redirect_from=%2Ftopics%2Fpolitics%2Farticles-reports%2F2022%2F03%2F15%2Famericans-misestimate-small-subgroups-population" target="_blank" rel="noopener noreferrer">
                        {`​​From millionaires to Muslims, small subgroups of the population seem much larger to many Americans.`}
                    </a>
                    {
                        ` The article examined how Americans overestimate and underestimate the size of certain subgroups of the population.`
                    }
                    <br /><br />
                    {
                        `Using `
                    }
                    <a href="https://www.perceptualedge.com/articles/visual_business_intelligence/data_visualization_effectiveness_profile.pdf" target="_blank" rel="noopener noreferrer">
                        {`Stephen Few's Data Visualization Effectiveness Profile`}
                    </a>
                    {
                        ` I was able to judge the chart on several metrics. `
                    }
                    <br /><br />
                    {
                        `I gave the chart a 6 on usefulness and perceptibility, while giving it a 5 on engagement - I found it well made, but unsure what the takeaway or the action item was.`
                    }
                    <br /><br />
                    {
                        `Most of my confusion came from the title being focused on the overall pattern, but the chart being focused on the individual subgroups. The chart's focus on each statistic made it hard to see the overall pattern, and required me to put in a lot of effort to understand it.`
                    }
                </p>
                <img
                    src="https://mediauploads.data.world/e812c166422bab1e46200cc283d40a938d5886312df46f5327a949264c9582bb_CleanShot_2022_12_02_at_9.02.20_2x.png"
                    width="50%"
                    maxHeight="10rem"
                />
            </div>
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
                        `My goal in  my initial visualization was to focus less on the individual statistics, and more on the overall pattern. As such, I decided to do away with the thermometer chart, and instead focus on having a scatter plot.`
                    }
                    <br /><br />
                    {
                        `The scatterplot graphed the actual proportion of each population, versus the proportion that Americans thought each population was. I used a 45 degree line to show where the actual proportion and the perceived proportion were equal, but I made it faint to show that it was not the focus of the graph.`
                    }
                    <br /><br />
                    {
                        `I added some labels to the scatterplot to highlight some of the population and make it more clear that each point was a different population.`
                    }
                    <br /><br />
                    {
                        `I also wanted to add some color that would make it clear that there was some difference between data points on the bottom vs the top. To that end, I used a color step from yellow to red. I used a color step instead of a gradient because it felt like it highlighted different clusters - the overstimated minorities on the bottom, versus the underestimated majorities on top. I also used orange to represent the groups that were estimated more correctly.`
                    }
                </p>
                <TableauReport
                    url="https://public.tableau.com/views/American_Data_Old/Sheet1?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link"
                    options={{
                        hideTabs: true,
                        hideToolbar: true,
                        height: 'clamp(50rem, 50dvh, 100rem)',
                        width: 'clamp(1rem, 100%, 102rem)',
                    }}
                />
                <a href="https://today.yougov.com/politics/articles/41556-americans-misestimate-small-subgroups-population?redirect_from=%2Ftopics%2Fpolitics%2Farticles-reports%2F2022%2F03%2F15%2Famericans-misestimate-small-subgroups-population" target="_blank" rel="noopener noreferrer">
                    {`Data: YouGov`}
                </a>
            </div>
            <p
                style={{
                    fontFamily: "Graphik",
                    fontWeight: 400,
                    fontSize: `1rem`,
                    lineHeight: 1.4,
                    marginTop: '3rem',
                    marginBottom: '1rem',
                }}
            >
                {
                    `I asked a few people to critique my visualization, giving it to them cold.`
                }
                <br />
                {
                    `Their responses are recorded below - scroll right to see their full responses.`
                }
            </p>
            <Table.ScrollContainer minWidth={2000}>
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th miw={50}>Age</Table.Th>
                            <Table.Th miw={120}>Occupation</Table.Th>
                            <Table.Th miw={250}>Can you tell me what you think this is?</Table.Th>
                            <Table.Th miw={250}>Can you describe to me what this is telling you?</Table.Th>
                            <Table.Th miw={250}>Is there anything you find surprising or confusing?</Table.Th>
                            <Table.Th miw={250}>Who do you think is the intended audience for this?</Table.Th>
                            <Table.Th miw={250}>Is there anything you would change or do differently?</Table.Th>
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
                    marginTop: '2rem',
                    marginBottom: '1rem',
                }}
            >
                {
                    `The responses I received were generally positive, but I did receive some feedback that I found useful.`
                }
                <br /><br />
                {
                    `For starters, the callouts were seemingly confusing. Instead of giving them a clear idea of what the points represented, they seemed to add more noise to the graph. Not having lines to connect the callouts to the points made it hard to see what the callouts were referring to.`
                }
                <br /><br />
                {
                    `Another noisy element were the colors - while I thought they would help highlight the clusters, they seemed to add more noise to the graph. The colors were not intuitive, and the color step was not clear.`
                }
                <br /><br />
                {
                    `Other smaller points included the subtitle and the reference line. The subtitle was not doing enough to explain the graph, and the reference line was too faint to be useful.`
                }
                <br /><br />
                {
                    `In class, I received much of the same feedback - the trend line was weak, and the callouts were confusing.`
                }
            </p>
            <div
                style={{
                    marginTop: '1rem',
                    width: '100%',
                }}
            >
                Note: Please click the laptop icon to view the graph properly.
                <TableauReport
                    url="https://public.tableau.com/views/American_Data/Dashboard1?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link"
                    options={{
                        hideTabs: true,
                        hideToolbar: true,
                        height: '52rem',
                        width: '50rem',
                    }}
                />
                <a href="https://today.yougov.com/politics/articles/41556-americans-misestimate-small-subgroups-population?redirect_from=%2Ftopics%2Fpolitics%2Farticles-reports%2F2022%2F03%2F15%2Famericans-misestimate-small-subgroups-population" target="_blank" rel="noopener noreferrer">
                    {`Data: YouGov`}
                </a> 
                <p
                style={{
                    fontFamily: "Graphik",
                    fontWeight: 400,
                    fontSize: `1rem`,
                    lineHeight: 1.4,
                    marginTop: '1.5rem',
                    marginBottom: '1rem',
                }}
            >
                {
                    `For the final iteration, I focused on both improving my prototype, while still working through the issues I had with the original YouGov graphic.`
                }
                <br /><br />
                {
                    `This graph is different from the original graph by using a scatterplot instead of a Thermometer Chart. With the scatterplot, I was able to show an overall trend between the perceived and actual proportions. Without drawing a trend line, I was able to show that the perceived proportions were generally higher than the actual proportions for the minority groups, and lower for the majority groups.`
                }
                <br /><br />
                {
                    `To better communicate that story compared to my initial prototype, I used a reference line to show the 45 degree line. This time, I made it thicker and darker to make it more visible, while still keeping it thin enough to ensure it was not a focal point. I also used a gradient from light blue to dark blue that was more subtle than the original color step. That way, the colors can be used to naturally draw the eye to patterns, without being too distracting.`
                }
                <br /><br />
                {
                    `To make sure the scatterplot points were more easily understood, I removed some of the callouts, and made the remaining ones more wordy, with a line connecting them to the points. I also reduced their size, making sure that users understood that they were not the focus of the graph. I also added a subtitle that better explained the graph, and pointed out that hovering over the points would give more information.`
                }
                <br /><br />
                {
                    `For a final clarification, I added some copy to the tooltips to help underline that these points showed a proportionality of Americans.`
                }
                <br /><br />
                {
                    `Through usage of the Data Visualization Effectiveness Profile, I was able to better understand the strengths and weaknesses of the original YouGov graphic, and use that to inform my own graph. I knew that my main gripe was related to not being able to see the overall pattern, and I was able to use that to change the type of graph, and tell a slightly different story. Through the critiques of others, I was able to identify what parts of my graph were too noisy for others, and what parts were not clear enough.`
                }
                <br /><br />
                {
                    `While doing this write-up, I actually read through the rest of the YouGov article, and found a scatterplot underneath the thermometer chart. I found it interesting that the scatterplot had a wide ratio, slightly hiding the trend and making it look like Americans typically guessed between 20-40%. I also think the scatterplot's decision to group by population type weakened the overall story - there was not a discernable pattern between the different population groups, and weakened the relation between majority groups and minority groups.`
                }
            </p>
            </div>
        </div>
    )
}

export default USProportions;
