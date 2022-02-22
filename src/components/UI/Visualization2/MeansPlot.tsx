import React from 'react';
import MeansPlotModel from '../../../models/MeansPlotModel';

declare let window: any;

const MeansPlot = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  const data: MeansPlotModel = {
    title: 'Means Plot: Left Hipocampus ~ PPMI Category',
    means: [3.25, 3.2, 3.13, 3.09],
    minY: 2.7,
    maxY: 3.6,
    xLabel: 'PPMI Category',
    yLabel: '95% CI: Left Hippocampus',
    categories: ['PD', 'HC', 'PRODROMA', 'GENPD'],
    minPerCategory: { PD: 3.54, HC: 2.92, PRODROMA: 2.87, GENPD: 2.85 },
    maxPerCategory: { PD: 2.96, HC: 3.49, PRODROMA: 3.39, GENPD: 3.33 }
  };

  const title = data.title;
  const source = new Bokeh.ColumnDataSource({
    data: {
      means: data.means,
      categories: data.categories,
      min: Object.values(data.minPerCategory),
      max: Object.values(data.maxPerCategory)
    }
  });

  const p = plot.figure({
    hight: 600,
    width: 800,
    title: title,
    x_range: data.categories,
    y_range: [data.minY, data.maxY],
    x_axis_label: data.xLabel,
    y_axis_label: data.yLabel
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
    upper: { field: 'min' },
    lower: { field: 'max' },
    upper_head: new Bokeh.TeeHead({ size: 100 }),
    lower_head: new Bokeh.TeeHead({ size: 100 })
  });

  p.add_layout(whisker);

  plot.show(p);

  return <> </>;
};

export default MeansPlot;
