import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns, firstStepBtns, lastStepBtns } from './utils';

const analysisTour: ShepherdOptionsWithType[] = [
  {
    id: 'analysis-intro',
    title: 'Analysis section',
    text: `
      <p>This section provides information about the selected variables before continuing analysis.
      Displayed is basic descriptive statistics about the selected variables.</p>
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
      <p>Displayed is a summary of choices you made in the previous section. 
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
      <p>Displayed is the result of the <b>descriptive statistics</b> related to the variables selected.</p>
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
      <p>By clicking on this button, you will be able to filter data and add formulas on specific algorithms.</p>
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
      <p>The following button allows exporting the results in a PDF or JSON format. All the results available on the page will be exported.</p>
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
      <p>Congrats You have finished the analysis phase!</p>
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
