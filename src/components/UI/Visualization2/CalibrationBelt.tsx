/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

const CalibrationBelt = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  //const data = {};
  const p = plot.figure({
    width: 800,
    height: 600,
    x_range: [0, 5],
    y_range: [0, 10],
  });

  const source = new Bokeh.ColumnDataSource({
    data: {
      base: [0, 1, 2, 3, 5],
      lower: [1, 2, 3, 4, 5],
      upper: [8, 7, 6, 7, 10],
    },
  });

  // there is also varea !!
  const band = new Bokeh.Band({
    base: { field: 'base' },
    lower: { field: 'lower' },
    upper: { field: 'upper' },
    source: source,
    fill_alpha: 0.5,
    fill_color: 'grey',
    line_color: 'black',
    line_width: 3,
  });

  p.add_layout(band);

  useEffect(() => {
    plot.show(p, '#chart-calibration-belt');
  }, [plot]);

  return (
    <>
      <Card>
        <div id={`chart-calibration-belt`}></div>
      </Card>
    </>
  );
};

export default CalibrationBelt;
