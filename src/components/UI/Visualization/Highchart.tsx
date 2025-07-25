/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d';
import HCMore from 'highcharts/highcharts-more';
import Heatmap from 'highcharts/modules/heatmap.js';
import SeriesLabel from 'highcharts/modules/series-label.js';
import Annotations from 'highcharts/modules/annotations';
import styled from 'styled-components';

HCMore(Highcharts);
Heatmap(Highcharts);
highcharts3d(Highcharts);
SeriesLabel(Highcharts);
Annotations(Highcharts);

export const StyledMyChart = styled.div`
  margin: 0rem auto;
  width: 600px;
`;

const Highchart = ({
  options,
  constraint = false,
}: {
  options: Highcharts.Options | any;
  constraint?: boolean;
}): JSX.Element => {
  const copyOpts = JSON.parse(JSON.stringify(options));
  return (
    <>
      {constraint && (
        <StyledMyChart>
          <HighchartsReact
            containerProps={{ style: { height: '600px', width: '600px' } }}
            highcharts={Highcharts}
            options={copyOpts}
          />
        </StyledMyChart>
      )}
      {!constraint && (
        <HighchartsReact highcharts={Highcharts} options={copyOpts} />
      )}
    </>
  );
};

export default Highchart;
