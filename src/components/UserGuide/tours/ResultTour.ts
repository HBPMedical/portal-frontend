import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns, firstStepBtns, lastStepBtns } from './utils';

const resultTour: ShepherdOptionsWithType[] = [
  {
    id: 'result-intro',
    title: 'Experiment results',
    text: `
      <p>This section is made to show some information about the variable selected before going further.
      It will display some descriptive statistics data about variables.</p>
    `,
    buttons: firstStepBtns,
  },
  {
    id: 'result-summary',
    title: 'Summary',
    text: `
      <p>The left sidebar contains a summary of the experiment, it contains the <b>domain</b>, the <b>algorithm</b>, the <b>algorithm's parameters</b> and the <b>variables</b> selected.
      If you have applied some <b>filters</b> or <b>formula</b> they will appear in this space as well.</p>
    `,
    attachTo: {
      element: '.sidebar .card',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'result-list',
    title: 'Results',
    text: `
      <p>This is the main space, it contains a list of your experiment's results.</p>
    `,
    attachTo: {
      element: '.results .card',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'result-tools',
    title: 'Result actions',
    text: `
      <p>This is the action toolbar each result (graph) has its own action tools,
      it provides some features as <b>exporting</b> and the <b>graph's axes modification</b>.</p>
    `,
    attachTo: {
      element: '.results .tool-actions',
      on: 'auto',
    },
    showOn: function () {
      return !!document.querySelector('.results .tool-actions');
    },
    buttons: basicStepBtns,
  },
  {
    id: 'result-experiment-actions',
    title: 'Experiment actions',
    text: `
      <p>This is the experiment's action toolbar.
      You can either <b>delete</b> the experiment, <b>share</b> it with other members of the platform, 
      create a <b>new experiment based on the same variables</b> or <b>export</b> the results of this experiment.</p>
    `,
    attachTo: {
      element: '#experiment-actions',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'result-done',
    title: 'Experiment guide done!',
    text: `
      <p>Congrats! You have finished the analysis tour.</p>
    `,
    buttons: lastStepBtns,
  },
];

export default resultTour;
