interface HistogramModel {
  title: string;
  hist: Array<number>;
  edgesLeft: Array<number>;
  edgesRight: Array<number>;
  labels: Object;
}

export default HistogramModel;
