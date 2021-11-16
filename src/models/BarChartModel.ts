interface BarChartModel {
  graphTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisValues: Array<string>;
  yAxisValues: Array<number>;
  labels?: Object;
}

export default BarChartModel;
