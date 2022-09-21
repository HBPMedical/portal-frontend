import { ShepherdOptionsWithType } from 'react-shepherd';
import { backBtn, basicStepBtns, exitBtn, lastStepBtns } from './utils';

const exploreTour: ShepherdOptionsWithType[] = [
  {
    id: 'explore-intro',
    title: 'Welcome to the Medical Informatics Platform (MIP)',
    text: ['This guide will help you to understand the MIP and how to use it.'],
    buttons: basicStepBtns,
  },
  {
    id: 'explore-domain',
    title: 'Domain',
    text: [
      'This section allow to select the domain of interest and specify the dataset / cohort you want to work on.',
    ],
    attachTo: {
      element: '#domain-select',
      on: 'bottom',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-variables',
    title: 'Variables selection',
    text: `<p>This section allows to select the variables of interest.</p>
      <p>Each white bubble represent a variable. You can select one variable by clicking on it.</p>
      <p><b>Click on a variable (white bubble) to go to the next step.</b></p>
    `,
    attachTo: {
      element: '#variables-select',
      on: 'auto',
    },
    when: {
      show: function () {
        const elements = document.querySelectorAll('.node.node--leaf');
        const goNext = () => {
          this.getTour().show('explore-histograms');
          elements.forEach((element) => {
            element.removeEventListener('click', goNext);
          });
        };
        elements.forEach((element) => {
          element.addEventListener('click', goNext);
        });
      },
    },
    buttons: [exitBtn, backBtn],
  },
  {
    id: 'explore-histograms',
    title: 'Variable details',
    text: `<p>After clicking on a white bubble, this section will update to visualize the details of the selected variable.</p>`,
    attachTo: {
      element: '.statistics',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-bag-variable',
    title: 'Variable containers',
    text: `
      <p>Once you have selected a variable, you be able to put it inside one of the different container that you got here.</p>
      <p><b>Variable</b> represents the variable of interest or the independant variable.</p>
      <p><b>Covariate</b> represents the dependant variable.</p>

      <p><b>Click on the "As variable" button to continue.</b></p>
     `,
    attachTo: {
      element: '#variable-containers',
      on: 'auto',
    },
    when: {
      show: function () {
        const btn = document.querySelector('#variable-containers button');
        const goNext = () => {
          this.getTour().show('explore-bag-variable2');
          btn?.removeEventListener('click', goNext);
        };

        btn?.addEventListener('click', goNext);
      },
    },
    buttons: [exitBtn, backBtn],
  },
  {
    id: 'explore-bag-variable2',
    title: 'Variable container',
    text: `
      <p>Your variable has been added to the appropriate container.</p>
     `,
    attachTo: {
      element: '#variable-containers .container-variable .list-group',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-algorithms',
    title: 'Available algorithms',
    text: `
      <p>After selecting a variable, you'll see in green the algorithms that are available for the current selected variables.</p>
     `,
    attachTo: {
      element: '#algorithm-available',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-next-step',
    title: 'Next step',
    text: `
      <p>Once you've selected your variables of interest you can go to the next step by click on the "Descriptive Analysis" button.</p>
     `,
    attachTo: {
      element: '#btn-goto-analysis',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-done',
    scrollTo: false,
    title: 'Exploration guide done!',
    text: `
      <p>Congrats you have finished the guide for the exploration phase!</p>
      <p>You can either continue to play with the exploration or go to the next phase "Descriptive stats".</p>
     `,
    buttons: lastStepBtns,
  },
];

export default exploreTour;
