import { ShepherdOptionsWithType } from 'react-shepherd';

const analysisTour: ShepherdOptionsWithType[] = [
  // {
  //   id: 'intro',
  //   title: 'Welcome to the Explore page',
  //   text:
  //     'This is the Explore page. Here you can find all the available datasets and variables.'
  // }
  {
    id: 'intro',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: 'Welcome to React-Shepherd!',
    text: ['React-Shepherd is a Java aNAA'],
    when: {
      show: () => {
        console.log('show step');
      },
      hide: () => {
        console.log('hide step');
      },
    },
  },
];

export default analysisTour;
