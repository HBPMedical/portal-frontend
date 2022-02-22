/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

declare let window: any;

const LineGraph = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  // TODO: find appropriate number of lines and create dynamically
  const x = [1, 2, 3, 4, 5];
  const y1 = [6, 7, 2, 4, 5];
  const y2 = [2, 3, 4, 5, 6];
  const y3 = [4, 5, 5, 7, 2];

  const source = new Bokeh.ColumnDataSource({
    data: {
      x: x,
      y1: y1,
      y2: y2,
      y3: y3
    }
  });

  const p = plot.figure({
    height: 500,
    width: 800,
    x_axis_label: 'x',
    y_axis_label: 'Pr(x)',
    grid_line_color: 'white'
  });

  p.line({
    x: { field: 'x' },
    y: { field: 'y1' },
    // line_color: "ff8888",
    line_width: 4,
    // alpha: 0.7,
    // legend_label: "PDF",
    source: source
  });

  p.line({
    x: { field: 'x' },
    y: { field: 'y2' },
    line_color: 'red',
    line_width: 4,
    // alpha: 0.7,
    // legend_label: "PDF",
    source: source
  });

  p.line({
    x: { field: 'x' },
    y: { field: 'y3' },
    line_color: 'green',
    line_width: 4,
    // alpha: 0.7,
    // legend_label: "PDF",
    source: source
  });

  plot.show(p);

  return <> </>;
};

export default LineGraph;
