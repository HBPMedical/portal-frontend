import { useEffect } from 'react';
import { TourConf, tourConf } from './shepherdContainer';

const ShepherdSelectTour = (props: TourConf): JSX.Element => {
  useEffect(() => {
    tourConf(props);

    return () => {
      // cannot just set to null, otherwise the tour will not be re-rendered
      tourConf({
        id: '',
        steps: [],
      });
    };
  }, [props]);
  return <></>;
};

export default ShepherdSelectTour;
