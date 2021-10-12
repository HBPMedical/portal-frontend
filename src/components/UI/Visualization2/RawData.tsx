import React from 'react';
import { RawResult } from '../../API/GraphQL/types.generated';

type Props = {
  result: RawResult;
};

class RawData extends React.Component<Props> {
  render(): JSX.Element {
    const { result } = this.props;
    return <p> {result.rawdata} </p>;
  }
}

export default RawData;
