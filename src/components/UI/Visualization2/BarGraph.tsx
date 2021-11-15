import React from 'react';
import { LineChartResult } from '../../API/GraphQL/types.generated';

declare let window: any;

const BarGraph = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  const fruits = [
    'Apples',
    'Pears',
    'Nectarines',
    'Plums',
    'Grapes',
    'Strawberries'
  ];
  const counts = [5, 3, 4, 2, 4, 6];

  const source = new Bokeh.ColumnDataSource({
    data: {
      fruits: [
        'Apples',
        'Pears',
        'Nectarines',
        'Plums',
        'Grapes',
        'Strawberries'
      ],
      counts: counts
    }
  });
  
  let data: LineChartResult = {
    xAxis: fruits,
    yAxis: counts
  }

  const p = plot.figure({
    width: 900,
    height: 500,
    x_range: fruits,
    title: `${data.name} Fruit counts`,
    toolbar_location: null,
    tools: ''
  });

  // TODO: get random colors based on categorical values
  p.vbar({
    x: { field: 'fruits' },
    top: { field: 'counts' },
    width: 0.9,
    line_alpha: 0.5,
    fill_alpha: 0.5,
    fill_color: ['red', 'green', 'blue', 'yellow', 'purple', 'pink'],
    source: source
  });

  p.xgrid.grid_line_color = null;
  p.y_range.start = 0;
  plot.show(p);

  return <> </>;
};

export default BarGraph;
