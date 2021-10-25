import React from 'react';

declare let window: any;

const ConfusionMatrix = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  const x = ['Benign', 'Malignant'];
  const y = ['Benign', 'Malignant'];

  const source = new Bokeh.ColumnDataSource({
    data: {
      index: [0, 1, 2, 3],
      Treatment: ['Benign', 'Benign', 'Malignant', 'Malignant'],
      Prediction: ['Benign', 'Malignant', 'Benign', 'Malignant'],
      value: [3, 30, 60, 80]
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
    x_range: x,
    y_range: y
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
    x: { field: 'Treatment' },
    y: { field: 'Prediction' },
    source: source,
    width: 1,
    height: 1,
    line_color: { field: 'value', transform: mapper },
    fill_color: { field: 'value', transform: mapper }
  });

  const labels = new Bokeh.LabelSet({
    x: { field: 'Treatment' },
    y: { field: 'Prediction' },
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
