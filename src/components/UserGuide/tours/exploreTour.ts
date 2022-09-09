import { ShepherdOptionsWithType } from 'react-shepherd';
import { basicStepBtns, lastStepBtns } from './utils';

/*

buttons: [
      basicStepBtns[0],
      basicStepBtns[1],
      {
        action() {
          const selector = document.querySelector(
            '#dataset-select button'
          ) as HTMLElement;
          if (selector) selector.click();
          return this.next();
        },
        text: 'Next',
      },
    ],
  */

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
      'This section allow to select the domain of interest and specify the dataset / cohort you want to work on',
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
    text: `<p>This section allows to select the variables of interest</p>
      <p>Each white bubble represent a variable. You can select one variable by clicking on it.</p>
    `,
    attachTo: {
      element: '#variables-select',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-histograms',
    title: "Variable's details",
    text: `<p>This section allows to visualize the details of the selected variable</p>`,
    attachTo: {
      element: '.statistics',
      on: 'auto',
    },
    when: {
      show: () => {
        const nodes = document.querySelectorAll('.node.node--leaf');
        const node = nodes[nodes.length - 1];
        const evt = new Event('click', { bubbles: true });
        node.dispatchEvent(evt);
      },
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-bag-variable',
    title: 'Variable containers',
    text: `<p>T</p> `,
    attachTo: {
      element: '#variable-containers',
      on: 'auto',
    },
    buttons: basicStepBtns,
  },
  {
    id: 'explore-done',
    scrollTo: false,
    title: 'done',
    text: ['done.'],
    buttons: lastStepBtns,
  },
];

export default exploreTour;
