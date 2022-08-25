import React from 'react';
import { Alert } from 'react-bootstrap';
import { AlertResult, AlertLevel } from '../../API/GraphQL/types.generated';

const lookupTable = {
  [AlertLevel.Info]: { variant: 'info', title: 'Info' },
  [AlertLevel.Warning]: { variant: 'warning', title: 'Warning' },
  [AlertLevel.Error]: { variant: 'danger', title: 'Error' },
  [AlertLevel.Success]: { variant: 'success', title: 'Success' }
};

type Props = { data: AlertResult };

const AlertDisplay = ({ data }: Props): JSX.Element => {
  if (!data) return <></>;

  const type = lookupTable[data.level ?? AlertLevel.Info];

  return (
    <Alert variant={type.variant}>
      {data.title && <Alert.Heading>{data.title}</Alert.Heading>}
      {!data.title && <Alert.Heading>{type.title}</Alert.Heading>}
      {data.message}
    </Alert>
  );
};

export default AlertDisplay;
