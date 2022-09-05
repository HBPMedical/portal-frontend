/* eslint-disable @typescript-eslint/no-explicit-any */
import Plotly from 'plotly.js/lib/core';
import heatmap from 'plotly.js/lib/heatmap';
import createPlotlyComponent from 'react-plotly.js/factory';

Plotly.register([heatmap]);
const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyHeatmap = ({
  data,
  layout,
}: {
  data: any;
  layout: any;
}): JSX.Element => <PlotlyComponent data={data} layout={layout} />;

export default PlotlyHeatmap;
