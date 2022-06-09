/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MeanChartResult } from '../../API/GraphQL/types.generated';

declare let window: any;

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

interface Props {
  data: MeanChartResult;
}

export default ({ ...props }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  const title = props.data.name;
  const categories = props.data.xAxis?.categories ?? [];
  const data = {
    means: props.data.pointCIs.map(ci => ci.mean),
    categories,
    mins: props.data.pointCIs.map(ci => ci.min ?? ci.mean),
    maxs: props.data.pointCIs.map(ci => ci.max ?? ci.mean)
  };
  const source = new Bokeh.ColumnDataSource({
    data
  });

  const [min, max] = [
    Math.min.apply(null, data.mins),
    Math.max.apply(null, data.maxs)
  ];

  const p = plot.figure({
    title: title,
    x_range: categories,
    y_range: [min - min * 0.05, max + max * 0.05],
    x_axis_label: props.data.xAxis?.label,
    y_axis_label: props.data.yAxis?.label
  });

  p.scatter({
    x: { field: 'categories' },
    y: { field: 'means' },
    line_color: '#6666ee',
    fill_color: 'black',
    fill_alpha: 0.5,
    size: 12,
    source: source
  });

  const whisker = new Bokeh.Whisker({
    source: source,
    base: { field: 'categories' },
    upper: { field: 'mins' },
    lower: { field: 'maxs' },
    upper_head: new Bokeh.TeeHead({ size: 100 }),
    lower_head: new Bokeh.TeeHead({ size: 100 })
  });

  p.add_layout(whisker);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, '#chart-means-plot');
  }, [plot, props.data]);

  return (
    <Container id="chart-means-plot" className="result" ref={containerRef} />
  );
};
