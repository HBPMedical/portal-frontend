interface BubbleChartModel {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  values: Array<number>;
  categories: Array<string>;
  labels: Object;
}

export default BubbleChartModel;
