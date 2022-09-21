import { makeVar } from '@apollo/client';
import { useContext, useEffect } from 'react';
import {
  ShepherdOptionsWithType,
  ShepherdTour,
  ShepherdTourContext,
  Tour,
} from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';
import './style.scss';

export const tourVar = makeVar<Tour | null>(null);

type Props = {
  steps?: ShepherdOptionsWithType[];
};

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

const ShepherdTest = () => {
  const tour = useContext(ShepherdTourContext);

  useEffect(() => {
    tourVar(tour);
  }, [tour]);

  return <></>;
};

const ShepherdContainer = ({ steps }: Props): JSX.Element => {
  if (!steps || steps.length === 0) return <></>;

  return (
    <ShepherdTour steps={steps} tourOptions={tourOptions}>
      <ShepherdTest />
    </ShepherdTour>
  );
};

export default ShepherdContainer;
