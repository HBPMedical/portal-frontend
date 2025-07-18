/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { HeatMapResult, HeatMapStyle } from '../../API/GraphQL/types.generated';
import styled from 'styled-components';

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

interface Props {
  data: HeatMapResult;
}

const HeatMapChart = ({ ...props }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;
  const data: HeatMapResult = JSON.parse(JSON.stringify(props.data)); // copy data for manipulations
  data.matrix = data.matrix.map((row) =>
    row.map((i) => Math.round(i * 100) / 100)
  );
  const slug =
    'chart-heatmap-' +
    data.name
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[^\w-]+/g, '');
  const isBubble = data.heatMapStyle === HeatMapStyle.Bubble;
  const xValues = data.matrix
    .map((row) =>
      row.map((_, x) => (data.xAxis?.categories || [])[x] ?? `${x}`)
    )
    .flat();
  const yValues = data.matrix
    .reverse() // reverse matrix order to fit chart referential
    .map((row, y) =>
      row.map((_) => (data.yAxis?.categories || [])[y] ?? `${y}`)
    )
    .flat();
  const matrixValues = data.matrix.flat();
  const indices = matrixValues.map((item) => matrixValues.indexOf(item));
  const [min, max] = [Math.min(...matrixValues), Math.max(...matrixValues)];
  const maxAbs = Math.max(...matrixValues.map(Math.abs));
  const source = new Bokeh.ColumnDataSource({
    data: {
      index: indices,
      xAxisLabels: xValues,
      yAxisLabels: yValues,
      value: matrixValues,
      radius: matrixValues.map((val) =>
        Math.max(Math.abs(val) / (2.2 * maxAbs), 0.1)
      ) /* radius of a bubble */,
    },
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
    '#550b1d',
  ];

  const p = plot.figure({
    title: data.name,
    x_axis_label: data.xAxis?.label,
    y_axis_label: data.yAxis?.label,
    match_aspect: true,
    aspect_ratio: 1.2,
    tools: '',
    toolbar_location: null,
    x_range: data.xAxis?.categories,
    y_range: data.yAxis?.categories,
  });

  p.xaxis[0].major_label_orientation = Math.PI / 6;

  const mapper = new Bokeh.LinearColorMapper({
    palette: colors,
    low: min,
    high: max,
  });

  const color_bar = new Bokeh.ColorBar({
    color_mapper: mapper,
    ticker: new Bokeh.BasicTicker({ desired_num_ticks: colors.length }),
    formatter: new Bokeh.BasicTickFormatter({
      use_scientific: true,
    }),
  });

  p.rect({
    x: { field: 'xAxisLabels' },
    y: { field: 'yAxisLabels' },
    source: source,
    width: 1,
    height: 1,
    line_color: isBubble ? 'black' : { field: 'value', transform: mapper },
    fill_color: isBubble ? 'white' : { field: 'value', transform: mapper },
  });

  if (isBubble) {
    p.circle({
      x: { field: 'xAxisLabels' },
      y: { field: 'yAxisLabels' },
      source: source,
      radius: { field: 'radius' },
      name: 'Bubble Chart',
      line_color: { field: 'value', transform: mapper },
      fill_color: { field: 'value', transform: mapper },
    });
  }

  if (matrixValues.length < 40) {
    const labels = new Bokeh.LabelSet({
      x: { field: 'xAxisLabels' },
      y: { field: 'yAxisLabels' },
      text: { field: 'value' },
      text_color: 'white',
      text_font_size: '1em',
      text_font_style: 'bold',
      text_baseline: 'center',
      text_align: 'center',
      y_offset: -5,
      source: source,
    });

    p.add_layout(labels);
  }

  p.add_layout(color_bar, 'right');

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, `#${slug}`);
  }, [plot, props.data]);

  return <Container id={slug} className="result" ref={containerRef} />;
};

export default HeatMapChart;
