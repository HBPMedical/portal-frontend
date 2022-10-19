import { ShepherdOptionsWithType } from 'react-shepherd';
import {
  backBtn,
  basicStepBtns,
  exitBtn,
  firstStepBtns,
  lastStepBtns,
} from './utils';

export const getExploreTour = (hasGrouping = false, hasFilter = false) => {
  const exploreTour: ShepherdOptionsWithType[] = [
    {
      id: 'explore-intro',
      title: 'Welcome to the Medical Informatics Platform (MIP)',
      text: 'This guide will help you to understand how to use the MIP.',
      buttons: firstStepBtns,
    },
    {
      id: 'explore-guide',
      title: 'Interactive User Guide',
      canClickTarget: false,
      text: `
      <p>The first time, the user guide will start automatically. If you want to start it manually, you can click on this button.</p>
      <p>The content of the user guide changes depending on the page you are on.</p>
    `,
      attachTo: {
        element: '#shepherd-start-tour',
        on: 'auto',
      },
      buttons: basicStepBtns,
    },
    {
      id: 'analysis-navigation',
      title: 'Navigation',
      canClickTarget: false,
      text: `
      <p>The navigation bar allows navigation between the different sections of the platform.</p>
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
      text: 'This button allows you to select the domain of interest you want to work on.',
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
      text: 'This button allows you to specify the dataset/cohort you want to work on. You can select and unselect specific datasets.',
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
      id: 'explore-search',
      title: 'Search variables',
      text: `<p>This search bar allows you to search for a specific variable or group.</p>
      <p>It is possible to search for variables by name or by their type.</p>`,
      canClickTarget: false,
      attachTo: {
        element: '.search-input',
        on: 'auto',
      },
      buttons: basicStepBtns,
    },
    {
      id: 'explore-variables',
      title: 'Variables selection',
      text: `<p>This section allows you to select the variables of interest.</p>
      <p>Each white bubble represents a variable. You can select a variable by clicking on a bubble.</p>
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
      text: `<p>After clicking on a white bubble, this section will show the distribution of the variable across the selected datasets.</p>`,
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
      <p>To perform an experiment, these variables are used in two ways, either as variables or as covariates.</p>
      <p><b>Variable</b> represents a variable of interest or the independant variable.</p>
      <p><b>Covariate</b> represents a dependant variable.</p>
      ${
        hasFilter
          ? '<p><b>Filters</b> allows to apply filters based in these variables.</p>'
          : ''
      }
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
      <p>You can see that the variable has been added to the "variable" container.
      You can remove a variable by clicking on the "x" next to the variable.</p>
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
      <p>After selecting a variable, you will see in green the algorithms that are available for the current selection of variables.</p>
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
      <p>Once you selected your variables of interest you can go to the next step by clicking on the "Descriptive Analysis" button.</p>
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
      <p>You can either continue to work in the exploration section or go to the next section "Descriptive stats".</p>
     `,
      buttons: lastStepBtns,
    },
  ];

  if (hasGrouping) return exploreTour;

  return exploreTour.filter((step) => step.id !== 'explore-grouping');
};

export default getExploreTour;
