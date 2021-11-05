import React from 'react';
import { RawResult } from '../../API/GraphQL/types.generated';

type Props = {
  result: RawResult;
};

class RawData extends React.Component<Props> {
  render(): JSX.Element {
    const { result } = this.props;
    console.log('rawdata:', result?.rawdata);
    return <p> {result.rawdata} </p>;
  }
}

export default RawData;
