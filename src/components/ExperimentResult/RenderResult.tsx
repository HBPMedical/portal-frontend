import { MIME_TYPES } from '../constants';
import Error from '../UI/Error';
import { JSONData } from '../UI/Visualization';
import BinaryTree from '../UI/Visualization/BinaryTree';
import Warning from '../UI/Visualization/Warning';
import { Result } from '../utils';
import Highchart from '../UI/Visualization/Highchart';

const RenderResult = ({
  results,
  constraint,
}: {
  results: Result[] | undefined;
  constraint: boolean;
}): JSX.Element => {
  return (
    <>
      {results &&
        results
          .filter((r) => r && r.type)
          .map((result, i) => (
            <div
              style={{ maxWidth: 'calc(100vw - 280px)', overflow: 'auto' }}
              className="result"
              key={i}
            >
              {result.type === MIME_TYPES.ERROR && (
                <Error message={result.data} />
              )}
              {result.type === MIME_TYPES.WARNING && (
                <Warning message={result.data} />
              )}
              {result.type === MIME_TYPES.USER_WARNING && (
                <Warning message={result.data} />
              )}
              {result.type === MIME_TYPES.JSONDATA && (
                <JSONData data={result.data} />
              )}
              {result.type === MIME_TYPES.HIGHCHARTS && (
                <Highchart options={result.data} constraint={constraint} />
              )}
              {result.type === MIME_TYPES.JSONBTREE && (
                <BinaryTree data={result.data} />
              )}
              {result.type === MIME_TYPES.JSON && (
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              )}
            </div>
          ))}
    </>
  );
};

export default RenderResult;
