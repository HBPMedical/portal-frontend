interface MeansPlotModel {
  title: string;
  means: Array<number>;
  minY: number;
  maxY: number;
  xLabel: string;
  yLabel: string;
  categories: Array<string>;
  minPerCategory: Record<string, any>;
  maxPerCategory: Record<string, any>;
  labels: Object;
}

export default MeansPlotModel;
