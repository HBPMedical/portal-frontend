export default interface CalibrationBelt {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  base: Array<number>;
  lower: Array<number>;
  upper: Array<number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels?: Record<string, any>;
}
