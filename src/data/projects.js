/**
 * The projects, in one place.
 *
 * Everything here is Raj's own copy, taken verbatim from the project entries
 * that used to live inline in components/Projects/index.js — titles,
 * descriptions and destinations. Nothing was rewritten to sound like anything.
 *
 * `facets` is the one editorial call in this file: the tags are my reading of
 * each description, not something Raj stated. Two projects carry two tags
 * because their descriptions genuinely span two competencies. Correct freely.
 *
 * `field` is the ink the project's artwork is printed on. Only the lighter inks
 * may sit behind dark artwork. Blue was excluded on that basis and still is
 * (2.56:1, too dark to print dark artwork on). All four of the others are light
 * enough, so the cycle runs mustard, pink, teal and sage against the seven
 * entries.
 */

/* Labels only. An earlier version carried a per-facet ink for a colour swatch on
   each tag; nothing on the page decoded those four inks, so the swatches were
   colour that could not be read. The label is the information.

   `ai` became `ml` on Raj's correction (2026-09-30): the federated-learning
   fairness work and the GAN-media CNN are ML engineering, not AI engineering. */
export const FACETS = {
  science: 'Data science',
  ml: 'ML engineering',
  viz: 'Data viz',
  civic: 'Civic tech',
};

export const projects = [
  {
    id: 'survivor',
    title: 'Diversity Analysis of 49 Seasons of Survivor',
    description:
      'An interactive data journalism piece examining race, gender, and age representation across all 49 seasons of Survivor. ' +
      'Built with D3.js, featuring KDE ridge plots, funnel charts, stacked bars, and wage trend lines showing how the New Era changed casting.',
    image: '/survivor_title_red.png',
    link: '?ref=survivor',
    external: false,
    where: 'Read it on this site',
    facets: ['viz'],
    field: 'yellow',
  },
  {
    id: 'nba',
    title: 'Contract Year vs. Performance in the NBA',
    description:
      'This project is an experiment in data-storytelling. I use D3.JS to visualize the relationship between contract' +
      ' years and player performance in the NBA. The project includes animated components and interactive components that allow' +
      ' the user to explore the data in a more engaging way.',
    image: '/title_nba.png',
    link: '?ref=nba_contract',
    external: false,
    where: 'Read it on this site',
    facets: ['viz'],
    field: 'pink',
  },
  {
    id: 'mlb',
    title: 'What\u2019s Driving the Decline in Batting Averages?',
    description:
      'An investigation using Bayesian fixed-effects models on 240,000+ pitches to predict hit probability. ' +
      'Built using brms in R to implement Stan models and visualize pitch-level MLB data.',
    image: '/baseball.png',
    link: 'https://docs.google.com/document/d/17c2o7EFKines5UShSIxJJPq4FQIeX7wbIDnGrmPT4Ss',
    external: true,
    where: 'Opens a Google Doc',
    facets: ['science'],
    field: 'teal',
  },
  {
    id: 'idl',
    title: 'Achieving Fairness in Federated Learning',
    description:
      'This group project implemented a novel approach to improve individual fairness in Federated Instances using the ' +
      'Flower framework. We trained a Neural Network model on recidivism cases from the COMPAS dataset, and were able to achieve ' +
      'increases in group and individual fairness metrics without sacrificing accuracy.',
    image: '/IDL.png',
    link: 'https://drive.google.com/file/d/18o0HTSjobRYRX5yXMQSVGRwoyJZB7Lbb/view?usp=sharing',
    external: true,
    where: 'Opens Google Drive',
    facets: ['ml'],
    field: 'green',
  },
  {
    id: 'fund_vote',
    title: 'Reducing Voter Wait Times using Optimization',
    description:
      'This project used optimization techniques to reduce voter wait times in Allegheny County. We used census data and ' +
      'historical voting data to create a model that predicts wait times at polling places. We then used this model to optimize the ' +
      'allocation of voting machines and poll workers to reduce wait times.',
    image: '/fund_vote.png',
    link: 'https://drive.google.com/file/d/1zSonvwBOezt0recD4NiNXHyRVB9xGxiE/view?usp=sharing',
    external: true,
    where: 'Opens Google Drive',
    facets: ['civic', 'science'],
    field: 'yellow',
  },
  {
    id: 'gis',
    title: 'Changes in Industry in Pittsburgh using GIS',
    description:
      'This ArcGIS Dashboard visualizes changes in occupational makeup across the greater Pittsburgh area. It uses ' +
      'historical census data with Multivariate Cluster Analysis to identify trends across different precincts. The dashboard allows ' +
      'users to stratify data by industry and by year.',
    image: '/pitt.png',
    link: 'https://carnegiemellon.maps.arcgis.com/apps/dashboards/5e8c1eabf493431db79e6a2bbf66a554',
    external: true,
    where: 'Opens an ArcGIS dashboard',
    facets: ['civic', 'viz'],
    field: 'pink',
  },
  {
    id: 'fakebook',
    title: 'Full-Stack CNN for Identifying GAN Media',
    description:
      'This project uses a Convolutional Neural Network to identify GAN-generated media. The project was deployed on Amazon ' +
      'Web Services and was served via a Chrome Extension with React. The project achieved a precision of 88% on our test set ' +
      'and the project was a Top Ten Finalist in Booz Allen Hamilton\u2019s 2019 Summer Games.',
    image: '/fakebook.png',
    link: 'https://drive.google.com/file/d/1A7DYSkxohtBkIaL4D1_LJD2QY5pbcOx7/view?usp=sharing',
    external: true,
    where: 'Opens Google Drive',
    facets: ['ml'],
    field: 'teal',
  },
];

export default projects;
