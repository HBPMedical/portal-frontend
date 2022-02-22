export default interface CalibrationBelt {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  base: Array<number>;
  lower: Array<number>;
  upper: Array<number>;
  labels?: Record<string, any>;
}
