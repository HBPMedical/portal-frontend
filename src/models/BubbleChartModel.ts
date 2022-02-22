export default interface BubbleChartModel {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  values: Array<number>;
  categories: Array<string>;
  labels?: Record<string, any>;
}
