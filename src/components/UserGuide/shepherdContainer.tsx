import { makeVar, useReactiveVar } from '@apollo/client';
import { useContext } from 'react';
import {
  ShepherdOptionsWithType,
  ShepherdTour,
  ShepherdTourContext,
  Tour,
} from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';
import './style.scss';

export type TourConf = {
  id: string;
  steps: ShepherdOptionsWithType[];
};
export const tourConf = makeVar<TourConf | null>(null);

const tourOptions: Tour.TourOptions = {
  defaultStepOptions: {
    classes: 'shepherd-theme-mip',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
  keyboardNavigation: false,
};

const ShepherdButton = () => {
  const tour = useContext(ShepherdTourContext);

  // tour.on('complete', () => { ...  }); // if you want to do something when the tour is completed

  return (
    <a
      href="/"
      onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        e.preventDefault();
        tour?.start();
      }}
    >
      User Guide
    </a>
  );
};

const ShepherdContainer = () => {
  const tourConfig = useReactiveVar(tourConf);

  if (!tourConfig || tourConfig.steps.length === 0) return <></>;

  return (
    <ShepherdTour steps={tourConfig.steps} tourOptions={tourOptions}>
      <ShepherdButton />
    </ShepherdTour>
  );
};

export default ShepherdContainer;
