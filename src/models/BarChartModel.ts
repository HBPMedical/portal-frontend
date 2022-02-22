export default interface BarChartModel {
  graphTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisValues: Array<string>;
  yAxisValues: Array<number>;
  labels?: Record<string, any>;
}
