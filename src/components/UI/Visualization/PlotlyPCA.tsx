/* eslint-disable @typescript-eslint/no-explicit-any */
import bar from 'plotly.js/lib/bar';
import Plotly from 'plotly.js/lib/core';
import scatter from 'plotly.js/lib/scatter';
import createPlotlyComponent from 'react-plotly.js/factory';

Plotly.register([scatter, bar]);
const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyPCA = ({ data }: { data: any; layout: any }): JSX.Element =>
  data.map((d: any, i: number) => (
    <PlotlyComponent data={d.data} layout={d.layout} key={i} />
  ));

export default PlotlyPCA;
