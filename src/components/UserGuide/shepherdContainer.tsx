import { makeVar, useReactiveVar } from '@apollo/client';
import { useContext, useEffect } from 'react';
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
const COMPLETED_TOUR_VALUE = 'done';
const PREFIX_KEY = 'shepherd-';
const SKIP_KEY = 'skip-shepherd';

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

const ShepherdButton = ({ tourId }: { tourId: string }) => {
  const tour = useContext(ShepherdTourContext);

  ['complete', 'close', 'cancel'].forEach((event) => {
    tour?.on(event, () => {
      localStorage.setItem(`${PREFIX_KEY}${tourId}`, COMPLETED_TOUR_VALUE);
    });
  });

  useEffect(() => {
    if (localStorage.getItem(SKIP_KEY) === 'true') return;
    if (localStorage.getItem(`${PREFIX_KEY}${tourId}`) !== COMPLETED_TOUR_VALUE)
      tour?.start();
  }, [tourId, tour]);

  return (
    <a
      href="/"
      id="shepherd-start-tour"
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
      <ShepherdButton tourId={tourConfig.id} />
    </ShepherdTour>
  );
};

export default ShepherdContainer;
