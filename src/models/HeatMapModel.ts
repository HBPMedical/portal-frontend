interface HeatMapModel {
  // currently it only serves the purpose of a confusion matrix
  graphTitle: string;
  xLabels: string;
  yLabels: string;
  categories: Array<string>;
  index: Array<number>;
  value: Array<number>;
}

export default HeatMapModel;
