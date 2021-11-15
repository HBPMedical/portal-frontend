interface ROCCurveModel {
  graphTitle: string;
  xLabel: string;
  yLabel: string;
  xFpr: Array<number>;
  yTpr: Array<number>;
  threshold: Array<number>;
  xFprHalf: Array<number>;
  yTprHalf: Array<number>;
  thresholdHalf: Array<number>;
}

export default ROCCurveModel;
