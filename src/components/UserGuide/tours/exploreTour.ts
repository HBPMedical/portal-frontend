import { ShepherdOptionsWithType } from 'react-shepherd';
import {
  backBtn,
  basicStepBtns,
  exitBtn,
  firstStepBtns,
  lastStepBtns,
} from './utils';

const exploreTour: ShepherdOptionsWithType[] = [
  {
    id: 'explore-intro',
    title: 'Welcome to the Medical Informatics Platform (MIP)',
    text: 'This guide will help you to understand the MIP and how to use it.',
    buttons: firstStepBtns,
  },
  {
    id: 'analysis-navigation',
    title: 'Navigation',
    canClickTarget: false,
    text: `
      <p>This is the navigation bar, it allows navigation between the different sections of the platform.</p>
      <p>The platform is divided into 3 main sections : <b>Variables (Explore)</b>, <b>Analysis</b> and <b>Experiment</b>.</p>
    `,
    attachTo: {
      element: '.experiment-sections',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-domain',
    title: 'Domain',
    text: 'This button allows to select the domain of interest you want to work on.',
    canClickTarget: false,
    showOn: function () {
      return !!document.querySelector('#pathology-select');
    },
    attachTo: {
      element: '#pathology-select',
      on: 'bottom',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-datasets',
    title: 'Datasets',
    canClickTarget: false,
    text: 'This button allows to specify the dataset/cohort you want to work on.',
    attachTo: {
      element: '#dataset-select',
      on: 'bottom',
    },
    showOn: function () {
      return !!document.querySelector('#dataset-select');
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
    text: `<p>After clicking on a white bubble, this section will show the variable's distribution among the selected datasets.</p>`,
    attachTo: {
      element: '.statistics',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-grouping',
    title: 'Grouping',
    text: `<p>The tabs allow to group the variable's distribution into specific categories.</p>`,
    attachTo: {
      element: '#uncontrolled-histogram-tabs-tab-1',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-bag-variable',
    title: 'Variable containers',
    text: `
      <p>To perform an experiment, these variables are used in two ways either as variables or covariates.</p>
      <p><b>Variable</b> represents a variable of interest or the independant variable.</p>
      <p><b>Covariate</b> represents a dependant variable.</p>
      <p><b>Filters</b> allows to apply filters based in these variables.</p>
      <p><b>Click on the "As variable" button to continue.</b></p>
     `,
    attachTo: {
      element: '#variable-containers',
      on: 'auto',
    },
    advanceOn: {
      selector: '#variable-containers button',
      event: 'click',
    },
    buttons: [exitBtn, backBtn],
  },
  {
    id: 'explore-bag-variable2',
    title: 'Variable container',
    text: `
      <p>You can then see that the variable has been added inside the "variable" container.
      You can remove it by clicking on the "x" next to the variable.</p>
     `,
    attachTo: {
      element: '#variable-containers .container-variable .list-group',
      on: 'auto',
    },
    canClickTarget: false,
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
    canClickTarget: false,
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

export const getExploreTour = (hasGrouping = false) => {
  if (hasGrouping) return exploreTour;

  return exploreTour.filter((step) => step.id !== 'explore-grouping');
};

export default exploreTour;
