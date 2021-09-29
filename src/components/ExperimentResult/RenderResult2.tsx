import * as React from 'react';

import { ResultUnion, TableResult } from '../API/generated/graphql';
import DataTable from '../UI/Visualization2/DataTable';

export default ({ results }: { results?: ResultUnion[] }): JSX.Element => {
  return (
    <>
      {results &&
        results.map((result, i: number) => (
          <div
            style={{ maxWidth: 'calc(100vw - 280px)', overflow: 'auto' }}
            className="result"
            key={i}
          >
            {result.__typename === 'TableResult' && <DataTable data={result} />}
          </div>
        ))}
    </>
  );
};
