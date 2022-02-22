interface CalibrationBelt {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  base: Array<number>;
  lower: Array<number>;
  upper: Array<number>;
  labels?: Object;
}

export default CalibrationBelt;
