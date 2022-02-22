/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { HeatMapResult } from '../../API/GraphQL/types.generated';

declare let window: any;

interface Props {
  data: HeatMapResult;
}

const ConfusionMatrix = (props: Props) => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  const data: HeatMapResult = JSON.parse(JSON.stringify(props.data)); // copy data for manipulations

  const xValues = data.matrix
    .map(row => row.map((_, x) => (data.xAxis?.categories || [])[x] ?? `${x}`))
    .flat();

  const yValues = data.matrix
    .reverse() // reverse matrix order to fit chart referential
    .map((row, y) => row.map(_ => (data.yAxis?.categories || [])[y] ?? `${y}`))
    .flat();

  const matrixValues = data.matrix.flat();
  const indices = matrixValues.map(item => matrixValues.indexOf(item));

  const source = new Bokeh.ColumnDataSource({
    data: {
      index: indices,
      xAxisLabels: xValues,
      yAxisLabels: yValues,
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
    x_range: data.xAxis?.categories,
    y_range: data.yAxis?.categories
  });

  const mapper = new Bokeh.LinearColorMapper({
    palette: colors,
    low: Math.min(...matrixValues),
    high: Math.max(...matrixValues)
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

  useEffect(() => {
    plot.show(p, '#confusionMatrix');
  }, [plot]);

  return (
    <>
      <Card>
        <div id="confusionMatrix"></div>
      </Card>
    </>
  );
};

export default ConfusionMatrix;
