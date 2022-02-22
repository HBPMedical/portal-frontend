/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ROCCurveModel from '../../../models/ROCCurveModel';

declare let window: any;

const ROCCurve = () => {
  const Bokeh = window.Bokeh;
  const plot = Bokeh.Plotting;

  // TODO: discuss the following
  // will I need to handle NAs?
  // will I need to calculate the threshold?
  const source_ROC_raw = {
    data: {
      x_fpr: [
        0,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.00900901,
        0.01801802,
        0.02702703,
        0.04504505,
        0.04504505,
        0.05405405,
        0.05405405,
        0.0990991,
        0.0990991,
        0.10810811,
        0.11711712,
        0.14414414,
        0.16216216,
        0.18918919,
        0.20720721,
        0.26126126,
        0.27927928,
        0.30630631,
        0.33333333,
        0.34234234,
        0.36036036,
        0.36936937,
        0.40540541,
        0.45045045,
        0.47747748,
        0.52252252,
        0.58558559,
        1
      ],
      y_tpr: [
        0,
        0.43103448,
        0.64367816,
        0.68390805,
        0.70114943,
        0.74712644,
        0.81609195,
        0.83908046,
        0.84482759,
        0.86781609,
        0.88505747,
        0.89655172,
        0.93103448,
        0.94252874,
        0.94252874,
        0.94827586,
        0.94827586,
        0.96551724,
        0.97126437,
        0.98850575,
        0.98850575,
        0.99425287,
        0.99425287,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      // TODO: first value nan, filter it
      thresh: [
        1,
        0.99,
        0.98,
        0.97,
        0.96,
        0.93,
        0.91,
        0.9,
        0.86,
        0.82,
        0.78,
        0.7,
        0.69,
        0.66,
        0.63,
        0.61,
        0.57,
        0.55,
        0.49,
        0.44,
        0.43,
        0.42,
        0.37,
        0.33,
        0.32,
        0.25,
        0.23,
        0.17,
        0.15,
        0.12,
        0.09,
        0.08,
        0.07,
        0.06,
        0.05,
        0.04,
        0.03,
        0.02,
        0.01,
        0
      ],
      auc_legend: [
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990',
        'AUC: 0.990'
      ],
      clf_legend: [
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990',
        'RandomForestClassifier, AUC: 0.990'
      ]
    }
  };

  const df_half = {
    TPR: [0.962162, 0.962162],
    FPR: [0.09, 0.11],
    Thresholds: [0.51, 0.48]
  };

  const res: ROCCurveModel = {
    graphTitle: '',
    xLabel: '',
    yLabel: '',
    xFpr: source_ROC_raw.data.x_fpr,
    yTpr: source_ROC_raw.data.y_tpr,
    threshold: source_ROC_raw.data.thresh,
    xFprHalf: df_half.FPR,
    yTprHalf: df_half.TPR,
    thresholdHalf: df_half.Thresholds
  };

  const sourceROC = new Bokeh.ColumnDataSource({
    data: {
      x_fpr: res.xFpr,
      y_tpr: res.yTpr,
      thresh: res.threshold,
      legend_: source_ROC_raw.data.auc_legend
    }
  });

  const sourceHalf = new Bokeh.ColumnDataSource({
    data: {
      x_fpr: res.xFprHalf,
      y_tpr: res.yTprHalf,
      thresh: res.thresholdHalf
    }
  });

  // Create your toolbox
  const p_tools = [
    'hover',
    'crosshair',
    'zoom_in',
    'zoom_out',
    'save',
    'reset',
    'tap',
    'box_zoom'
  ];

  // Create figure and labels
  const clf_name = 'RandomForestClassifier';
  const p = plot.figure({ title: `${clf_name} ROC curve`, tools: p_tools });
  p.xaxis.axis_label = 'False Positive Rate';
  p.yaxis.axis_label = 'True Positive Rate';

  // Tooltip
  const hover = p.toolbar.select_one(Bokeh.HoverTool);
  hover!.tooltips = (source: any, info: any) => {
    const ds = sourceROC;
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '60px';
    div.innerHTML = ` FPR: ${info.data_x},</br> TPR: ${
      info.data_y
    }, </br> Threshold: ${ds.data.thresh[info.index]}`;
    return div;
  };

  //""" PLOT ROC """
  p.line({
    x: { field: 'x_fpr' },
    y: { field: 'y_tpr' },
    line_width: 1,
    color: 'blue',
    source: sourceROC
  });
  p.circle({
    x: { field: 'x_fpr' },
    y: { field: 'y_tpr' },
    size: 3,
    color: 'orange',
    legend: 'auc_legend',
    source: sourceROC,
    name: 'ROC',
    tools: p_tools
  });

  //""" Plot Threshold==0.5 """
  // get value closest to threshold == 0.5
  // df_half = df_ROC.dropna().iloc[(df_ROC['Thresholds'].dropna()-0.5).abs().argsort()[:2]]
  // df_half['Legend'] = 'Thresh~0.5'
  p.circle({
    x: { field: 'x_fpr' },
    y: { field: 'y_tpr' },
    size: 5,
    color: 'blue',
    source: sourceHalf,
    legend: 'legend_',
    name: 'ROC'
  });

  // """ PLOT chance line """
  // Plot chance (tpr = fpr)
  p.line({
    x: [0, 1],
    y: [0, 1],
    line_dash: 'dashed',
    line_width: 0.5,
    color: 'black',
    name: 'Chance'
  });

  // Finishing touches
  p.legend.location = 'bottom_right';

  plot.show(p);

  return <></>;
};

export default ROCCurve;
