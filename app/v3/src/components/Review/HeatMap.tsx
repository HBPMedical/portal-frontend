import * as React from 'react';

import { MiningResponseShape } from '../API/Mining';
import { Alert } from '../UI/Alert';
import Loader from '../UI/Loader';
import { PlotlyHeatmap } from '../UI/Visualization';

interface Props {
  heatmaps: any;
}

class HeatMap extends React.Component<Props> {
  public render = () => {
    const { heatmaps } = this.props;
    const loading =
      heatmaps &&
      heatmaps.some((h: any) => h && h.data === undefined);

    return (
      <div>
        {loading && <Loader />}
        {heatmaps && heatmaps.error && (
          <Alert message={heatmaps.error} title={'Error'} />
        )}
        {heatmaps &&
          heatmaps.map((h: MiningResponseShape, i: number) => {
            return (
              <div className='heatmap' key={i}>
                <h3>{heatmaps.length > 1 && h.dataset && h.dataset.code}</h3>
                <PlotlyHeatmap
                  data={h.data}
                  layout={{
                    autosize: true,
                    height: 400,
                    margin: {
                      l: 0
                    },
                    width: 600
                  }}
                  key={`${i}`}
                />
              </div>
            );
          })}
      </div>
    );
  };
}

export default HeatMap;