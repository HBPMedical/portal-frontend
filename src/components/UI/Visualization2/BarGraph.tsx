/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BarChartResult } from '../../API/GraphQL/types.generated';

declare let window: any;

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

interface Props {
  data: BarChartResult;
}

export default (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;
  const data: BarChartResult = JSON.parse(JSON.stringify(props.data)); // copy data if manipulations needed

  const categories =
    data.xAxis?.categories ?? data.barValues.map((_, i) => i + 1).map(String);

  const source = new Bokeh.ColumnDataSource({
    data: {
      categories,
      counts: data.barValues
    }
  });

  const p = plot.figure({
    x_range: categories,
    title: data.name,
    toolbar_location: null,
    tools: ''
  });

  p.vbar({
    x: { field: 'categories' },
    top: { field: 'counts' },
    width: 0.8,
    line_alpha: 0.5,
    fill_alpha: 0.5,
    source: source
  });

  if (data.hasConnectedBars) {
    p.line({
      x: { field: 'categories' },
      y: { field: 'counts' },
      source: source
    });

    p.circle({
      x: { field: 'categories' },
      y: { field: 'counts' },
      source: source
    });
  }

  p.xgrid.grid_line_color = null;
  p.y_range.start = 0;

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, '#chart-bar-graph');
  }, [p, plot, props.data]);

  return (
    <Container ref={containerRef} id={`chart-bar-graph`} className="result" />
  );
};
