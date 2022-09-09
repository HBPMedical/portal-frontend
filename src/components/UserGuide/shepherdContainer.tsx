import { makeVar } from '@apollo/client';
import {
  ShepherdOptionsWithType,
  ShepherdTour,
  ShepherdTourContext,
  Tour,
} from 'react-shepherd';

export const tourVar = makeVar<Tour | null>(null);

type Props = {
  steps?: ShepherdOptionsWithType[];
};

const tourOptions = {
  defaultStepOptions: {
    classes: 'shadow-md bg-purple-dark',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
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
