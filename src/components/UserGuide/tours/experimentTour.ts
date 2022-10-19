import { ShepherdOptionsWithType } from 'react-shepherd';
import {
  backBtn,
  basicStepBtns,
  exitBtn,
  firstStepBtns,
  lastStepBtns,
} from './utils';

const experimentTour: ShepherdOptionsWithType[] = [
  {
    id: 'experiment-intro',
    title: 'Experiment section',
    text: `
      <p>In this section you are be able to choose an algorithm and the parameters associated with it.</p>
    `,
    buttons: firstStepBtns,
  },
  {
    id: 'experiment-algorithms',
    title: 'Algorithm selection',
    attachTo: {
      element: '.sidebar2 .card',
      on: 'auto',
    },
    text: `
      <p>In this section you can find the different algorithms,
      algorithms displayed in dark blue are the algorithms available for the selected variables.</p>
      <p><b>Click on an available algorithm to continue.</b></p>
    `,
    when: {
      show: function () {
        const elements = document.querySelectorAll('.algorithm.enabled');
        const goNext = () => {
          this.getTour().show('experiment-parameters');
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
    id: 'experiment-parameters',
    title: 'Parameters',
    attachTo: {
      element: '.parameters .card',
      on: 'auto',
    },
    text: `
      <p>In this section, you are able to set specific parameters for an algorithm  (if there are any).</p>
    `,
    buttons: basicStepBtns,
  },
  {
    id: 'experiment-title',
    title: 'Experiment name',
    attachTo: {
      element: '.experiment-name',
      on: 'auto',
    },
    text: `
      <p>You have to choose a name for your experiment, choose a meaningful name so it's easier to go back to your saved experiments.</p>
      <p>Avoid names like 'experiment k-means' it makes it difficult to understand the purpose of the experiment.</p>
    `,
    buttons: basicStepBtns,
  },
  {
    id: 'experiment-run',
    title: 'Run experiment',
    attachTo: {
      element: '.experiment .item .btn-info',
      on: 'auto',
    },
    text: `
      <p>Once the name of your experiment has been chosen you can run the experiment by clicking on this button.</p>
    `,
    canClickTarget: false,
    buttons: basicStepBtns,
  },
  {
    id: 'experiment-done',
    scrollTo: false,
    title: 'Experiment guide done!',
    text: `
      <p>Congrats you have finished the guide for the experiment phase!</p>
     `,
    buttons: lastStepBtns,
  },
];

export default experimentTour;
