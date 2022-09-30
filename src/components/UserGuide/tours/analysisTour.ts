import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns, firstStepBtns, lastStepBtns } from './utils';

const analysisTour: ShepherdOptionsWithType[] = [
  {
    id: 'analysis-intro',
    title: 'Analysis section',
    text: `
      <p>This section is made to show some information about the selected variables before going further.
      It will display some descriptive statistics data about variables.</p>
    `,
    buttons: firstStepBtns,
  },
  {
    id: 'analysis-summary',
    title: 'Summary',
    attachTo: {
      element: '.experiment-sidebar',
      on: 'auto',
    },
    text: `
      <p>This is a summary of choices you made in the previous section. 
      It contains the <b>domain</b>, <b>datasets</b> and the <b>variables</b> you selected.</p>
    `,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-results',
    title: 'Results',
    attachTo: {
      element: '.result.card',
      on: 'auto',
    },
    text: `
      <p>Here is the result of the <b>descriptive statistics</b> related to the variables selected.</p>
    `,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-filter-formula',
    title: 'Filters & Formula',
    attachTo: {
      element: '#filters-toggle',
      on: 'auto',
    },
    text: `
      <p>By clicking on this button, you will be able to filter data and add formula on specific algorithms.</p>
    `,
    canClickTarget: false,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-export',
    title: 'Export',
    attachTo: {
      element: '#btn-experiment-export',
      on: 'auto',
    },
    text: `
      <p>The following button allows exporting the result in a PDF or JSON format. It will export all the results that are in the page.</p>
      <p>You can also export result individually.</p>
    `,
    canClickTarget: false,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-next',
    title: 'Next step',
    attachTo: {
      element: '#btn-goto-experiment',
      on: 'auto',
    },
    text: `
      <p>Once the analysis step is complete, you can simply click on this button to go to the next step.</p>
    `,
    canClickTarget: false,
    buttons: basicStepBtns,
  },
  {
    id: 'analysis-done',
    title: 'Analysis tour done!',
    text: `
      <p>Congrats! You have finished the analysis tour.</p>
    `,
    buttons: lastStepBtns,
  },
];

export const getAnalysisTour = (hasFilter = false) => {
  if (!hasFilter)
    return analysisTour.filter((step) => step.id !== 'analysis-filter-formula');

  return analysisTour;
};

export default analysisTour;
