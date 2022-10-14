import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns, firstStepBtns, lastStepBtns } from './utils';

const resultTour: ShepherdOptionsWithType[] = [
  {
    id: 'result-intro',
    title: 'Experiment results',
    text: `
      <p>This section provides information about the selected variables before going further.
      Descriptive statistics about selected variables are displayed.</p>
    `,
    buttons: firstStepBtns,
  },
  {
    id: 'result-summary',
    title: 'Summary',
    text: `
      <p>The left sidebar contains a summary of the experiment, it contains the <b>domain</b>, the <b>algorithm</b>, the <b>algorithm's parameters</b> and the <b>variables</b> selected.
      If you have applied some <b>filters</b> or <b>formula</b> they will appear in the sidebar as well.</p>
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
      <p>This is the main space containing a list of the results of your experiment.</p>
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
      <p>In this toolbar each result (graph) has its own action tools,
      it provides features like <b>exporting</b> and the <b>modification of graph axes</b>.</p>
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
      You can <b>delete</b> your saved experiment, or also <b>share</b> it with other members of the platform, 
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
      <p>Congrats you have finished the experiment results phase!</p>
    `,
    buttons: lastStepBtns,
  },
];

export default resultTour;
