import React from 'react';
import { ChartAxis, HeatMapResult } from '../../API/GraphQL/types.generated';

declare let window: any;

const ConfusionMatrix = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  // const x = ['Benign', 'Malignant'];
  // const y = ['Benign', 'Malignant'];

  const chartXAxis: ChartAxis = {
    categories: ['Positive', 'Negative'],
    label: 'Predicted label'
  };

  const chartYAxis: ChartAxis = {
    categories: ['Positive', 'Negative'],
    label: 'True label'
  };

  const ds: HeatMapResult = {
    matrix: [
      [80, 60],
      [3, 20]
    ],
    name: 'Heat Map',
    xAxis: chartXAxis,
    yAxis: chartYAxis
  };

  const populateXAxis = ds.matrix
    .map(item => {
      const arr = item.map(item2 => {
        return chartXAxis.categories![item.indexOf(item2)];
      });
      return arr;
    })
    .flat();

  const populateYAxis = ds.matrix
    .map(item => {
      const arr = item.map(item2 => {
        return chartYAxis.categories![ds.matrix.indexOf(item)];
      });
      return arr;
    })
    .flat();

  const matrixValues = ds.matrix.flat();
  const indices = matrixValues.map(item => matrixValues.indexOf(item));

  const source = new Bokeh.ColumnDataSource({
    data: {
      index: indices,
      xAxisLabels: populateXAxis,
      yAxisLabels: populateYAxis,
      value: matrixValues
    }
  });

  const colors = [
    '#75968f',
    '#a5bab7',
    '#c9d9d3',
    '#e2e2e2',
    '#dfccce',
    '#ddb7b1',
    '#cc7878',
    '#933b41',
    '#550b1d'
  ];

  const p = plot.figure({
    plot_width: 800,
    plot_height: 300,
    title: 'Categorical Heatmap',
    x_axis_label: 'Predicted label',
    y_axis_label: 'True label',
    tools: '',
    // tools: "hover",
    toolbar_location: null,
    x_range: chartXAxis.categories,
    y_range: chartYAxis.categories
  });

  const mapper = new Bokeh.LinearColorMapper({
    palette: colors,
    low: 2,
    high: 88
  });

  const color_bar = new Bokeh.ColorBar({
    color_mapper: mapper,
    ticker: new Bokeh.BasicTicker({ desired_num_ticks: colors.length }),
    formatter: new Bokeh.PrintfTickFormatter({ format: '%d' })
  });

  p.rect({
    x: { field: 'xAxisLabels' },
    y: { field: 'yAxisLabels' },
    source: source,
    width: 1,
    height: 1,
    line_color: { field: 'value', transform: mapper },
    fill_color: { field: 'value', transform: mapper }
  });

  const labels = new Bokeh.LabelSet({
    x: { field: 'xAxisLabels' },
    y: { field: 'yAxisLabels' },
    text: { field: 'value' },
    text_color: 'white',
    text_font_size: '1.5em',
    text_font_style: 'bold',
    x_offset: -10,
    y_offset: 0,
    source: source,
    render_mode: 'canvas'
  });

  p.add_layout(labels);
  p.add_layout(color_bar, 'right');

  plot.show(p);

  return <> </>;
};

export default ConfusionMatrix;
