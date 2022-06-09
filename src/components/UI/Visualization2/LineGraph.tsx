/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LineChartResult } from '../../API/GraphQL/types.generated';

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

const colors = [
  'blue',
  'red',
  'green',
  'yellow',
  'cyan',
  'darkgrey',
  'black',
  'brown',
  'orange'
];

declare let window: any;

type Props = {
  data: LineChartResult;
};

const LineGraph = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  // Create your toolbox
  const p_tools = ['hover', 'pan', 'zoom_in', 'zoom_out', 'reset', 'box_zoom'];

  const p = plot.figure({
    title: data.name,
    height: 500,
    width: 600,
    x_axis_label: data.xAxis?.label ?? '',
    y_axis_label: data.yAxis?.label ?? '',
    grid_line_color: 'white',
    tools: p_tools
  });

  const hover = p.toolbar.select_one(Bokeh.HoverTool);
  hover.tooltips = (_source: any, info: any) => {
    const div = document.createElement('div');
    div.innerHTML = `x: ${info.data_x}</br> y: ${info.data_y}`;
    return div;
  };

  for (const [i, line] of data.lines.entries()) {
    const color = colors[i % colors.length];

    p.line({
      x: line.x,
      y: line.y,
      line_color: color,
      line_width: 2,
      legend: line.label,
      line_dash: line.type?.toLocaleLowerCase()
    });

    p.circle({
      x: line.x,
      y: line.y,
      size: 6,
      color: color,
      line_color: 'white',
      legend: line.label,
      name: 'ROC'
    });
  }

  if (data.hasBisector) {
    const values = data.lines.flatMap(line => line.x);
    const max = Math.max(...values);
    const min = Math.min(...values);

    p.line({
      x: [min, max],
      y: [min, max],
      line_color: 'grey',
      line_width: 2,
      line_dash: 'dashed',
      alpha: 0.5
    });
  }

  p.legend.location = 'bottom_right';

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, '#chart-line-graph');
  }, [plot, data]);

  return (
    <Container id="chart-line-graph" className="result" ref={containerRef} />
  );
};

export default LineGraph;
