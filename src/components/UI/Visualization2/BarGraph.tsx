/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BarChartResult } from '../../API/GraphQL/types.generated';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

const Container = styled.div`
  align-self: center;
  display: inline-block;
`;

const barWidth = 0.8;
const barColors = ['blue', 'green', 'orange', 'yellow'];

interface Props {
  data: BarChartResult;
}

const BarGraph = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;
  const data: BarChartResult = JSON.parse(JSON.stringify(props.data)); // copy data if manipulations needed
  const slug =
    'bar-graph-' +
    data.name
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[^\w-]+/g, '');

  const categories =
    data.xAxis?.categories ?? data.barValues?.map((_, i) => i + 1).map(String);
  const barEnumValues = data.barEnumValues;

  const p = plot.figure({
    height: 450,
    x_range: categories,
    title: data.name,
    toolbar_location: null,
    tools: '',
    x_axis_label: data.xAxis?.label,
    y_axis_label: data.yAxis?.label,
  });
  p.xaxis[0].major_label_orientation = Math.PI / 6;

  if (!barEnumValues) {
    const source = new Bokeh.ColumnDataSource({
      data: {
        categories,
        counts: data.barValues,
      },
    });
    p.vbar({
      x: { field: 'categories' },
      top: { field: 'counts' },
      width: barWidth,
      line_alpha: 0.5,
      fill_alpha: 0.5,
      source: source,
    });

    if (data.hasConnectedBars) {
      p.line({
        x: { field: 'categories' },
        y: { field: 'counts' },
        source: source,
      });

      p.circle({
        x: { field: 'categories' },
        y: { field: 'counts' },
        source: source,
      });
    }
  } else {
    // Please keep in mind that this is a rough equivalent of the python version as the dodge function from bokeh.transform module is not available in BokehJS, and is used as a workaround to achieve the same effect.
    barEnumValues.forEach((bar, i) => {
      const n = barEnumValues.length;
      const w = barWidth / n;
      p.vbar({
        x: categories?.map((_, j) => j + w / 2 + i * w),
        top: bar.values,
        width: w,
        line_alpha: 0.5,
        fill_alpha: 0.5,
        fill_color: barColors[i] || 'blue',
        legend: bar.label,
      });

      // doesn't display
      p.legend.location = 'top_center';
      p.legend.orientation = 'horizontal';
    });
  }

  p.xgrid.grid_line_color = null;
  p.y_range.start = 0;

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    plot.show(p, `#${slug}`);
  }, [plot, props.data]);

  return <Container id={slug} className="result" ref={containerRef} />;
};

export default BarGraph;
