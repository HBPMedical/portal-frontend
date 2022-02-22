export default interface HistogramModel {
  title: string;
  hist: Array<number>;
  edgesLeft: Array<number>;
  edgesRight: Array<number>;
  labels?: Record<string, any>;
}
