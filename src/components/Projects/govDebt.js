import TableauReport from 'tableau-react';

function GovDebt() {
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
                        width: '30%',
                        lineHeight: 1.4,
                        marginBottom: '4rem',
                    }}
                >
                    {
                        `The goal of this assignment was to develop and analyze several visualizations 
                        related to the OECD General Government Debt dataset.`
                    }
                    <br /><br />
                    {
                        `The OECD dataset shows the total debt of a country's government as a percentage of its GDP.`
                    }
                    <br /><br />
                    {
                        `As we can see on the graph on the right, Japan has the highest debt-to-GDP ratio of any OECD country,
                        at least in 2022. We can use other visualizations to see if this has always been the case.`
                    }
                </p>
                <iframe
                    src="https://data.oecd.org/chart/7krA"
                    width="70%"
                    height={window.innerHeight * 0.5}
                    style={{ border: 1, marginLeft: '2rem' }}
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allowfullscreen="true"
                    title="OECD Chart"

                >
                    <a href="https://data.oecd.org/chart/7krB" target="_blank" rel="noopener noreferrer">
                        OECD Chart: General government debt, Total, % of GDP, Annual, 2022
                    </a>
                </iframe>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '2rem'
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
                        `The heatmap below allows us to see multiple years - spanning from 1995 to 2019. (Expand your window and refresh if you're having trouble seeing the whole thing.)`
                    }
                    <br />
                    {
                        `Using the heatmap, we can identify trends within a country with just a glance. 
                        For example, Japan has always had a high debt-to-GDP ratio compared to other nations.
                        It has just been increasing at worrying rates.`
                    }
                    <br /><br />
                    {
                        `The heatmap is sorted by country's average debt-to-GDP ratio over the years. 
                        Though this is great for seeing the heatmap gradient, it doesn't give us more insight
                        about the relationship between geography and debt.`
                    }
                </p>
                <TableauReport
                    url="https://public.tableau.com/views/JapanDebt/JapanDebt?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link"
                    options={{
                        hideTabs: true,
                        hideToolbar: true,
                        height: 'clamp(50rem, 50dvh, 100rem)',
                        width: 'clamp(1rem, 100%, 102rem)',
                    }}
                />
            </div>
            <div
                style={{
                    marginTop: '2rem',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '4rem',
                        marginBottom: '.5rem',
                        justifyContent: 'space-between',
                        paddingInline: '4rem',
                    }}
                >
                    <p
                        style={{
                            fontFamily: "Graphik",
                            fontWeight: 400,
                            fontSize: `1rem`,
                            width: '30%',
                            lineHeight: 1.4,
                        }}
                    >
                        {
                            `The graph below is a chloropleth map of Europe, where the color of each country represents
                        its debt-to-GDP ratio. Utilizing a chloropleth map allows us to see the relationship between
                        geography and debt.`
                        }
                    </p>
                    <p
                        style={{
                            fontFamily: "Graphik",
                            fontWeight: 400,
                            fontSize: `1rem`,
                            width: '30%',
                            lineHeight: 1.4,
                        }}
                    >
                        {
                            `Using the classic red green color scheme, we can easily identify Western Europe 
                            and the Nordic countries as having the lowest debt-to-GDP ratios. The Eastern European
                            countries have higher debt-to-GDP ratios.`
                        }
                    </p>
                    <p
                        style={{
                            fontFamily: "Graphik",
                            fontWeight: 400,
                            fontSize: `1rem`,
                            width: '30%',
                            lineHeight: 1.4,
                        }}
                    >
                        {
                            `The map shows the maximum debt to GDP ratio each country has had over the years.
                            A stronger visualization would allow us to see the trend of debt-to-GDP ratio over time.
                            This could be done through adding user interaction in the form of a slider.
                            `
                        }
                    </p>
                </div>

                <TableauReport
                    url="https://public.tableau.com/views/MapDebt/Sheet3?"
                    options={{
                        hideTabs: true,
                        hideToolbar: true,
                        height: 'clamp(50rem, 50dvh, 100rem)',
                        width: '100%',
                    }}
                />
            </div>
        </div>
    )
}

export default GovDebt;