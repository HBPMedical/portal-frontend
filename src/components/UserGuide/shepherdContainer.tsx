import { makeVar } from '@apollo/client';
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

const ShepherdContainer = ({ steps }: Props): JSX.Element => {
  if (!steps || steps.length === 0) return <></>;

  return (
    <>
      <ShepherdTour steps={steps} tourOptions={tourOptions}>
        <ShepherdTourContext.Consumer>
          {(updateTour) => {
            tourVar(updateTour);
            return <></>;
          }}
        </ShepherdTourContext.Consumer>
      </ShepherdTour>
    </>
  );
};

export default ShepherdContainer;
