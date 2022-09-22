import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns } from './utils';

const analysisTour: ShepherdOptionsWithType[] = [
  // {
  //   id: 'intro',
  //   title: 'Welcome to the Explore page',
  //   text:
  //     'This is the Explore page. Here you can find all the available datasets and variables.'
  // }
  {
    id: 'analysis-intro',
    title: 'Analysis section',
    text: `
      <p>This section allows to perform descriptive statistics analysis on the selected variables.</p>
    `,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-intro',
    title: 'Analysis section',
    attachTo: {
      element: '.experiment-sidebar',
      on: 'auto',
    },
    text: `
      <p>This section allows to perform descriptive statistics analysis on the selected variables.</p>
    `,
    buttons: basicStepBtns,
  },
];

export default analysisTour;
