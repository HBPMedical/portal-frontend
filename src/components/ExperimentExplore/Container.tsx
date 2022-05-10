import React from 'react';
import { useHistory } from 'react-router-dom';
import Explore from './Explore';

export default (): JSX.Element => {
  const history = useHistory();

  const handleGoToAnalysis = async (): Promise<void> => {
    history.push(`/analysis`);
  };

  const nextProps = {
    handleGoToAnalysis
  };

  return (
    <>
      <Explore {...nextProps} />
    </>
  );
};
