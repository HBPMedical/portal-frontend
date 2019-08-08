import {
  Algorithm,
  AlgorithmConstraintParameter,
  AlgorithmParameter
} from './Core';
import { ExperimentResponse } from './Experiment';
import { ModelResponse } from './Model';
import { MIME_TYPES, ENABLED_ALGORITHMS } from '../constants';

const independents = ['X', 'column1', 'x', 'descriptive_attributes'];
const dependents = ['Y', 'column2', 'y', 'target_attributes'];
const hiddenParameters = [...dependents, ...independents, 'dataset', 'filter'];

const buildConstraints = (algo: any) => {
  const variable = algo.parameters.find((p: any) =>
    dependents.includes(p.name)
  );

  let mixed = true;

  const variableTypes =
    variable &&
    variable.columnValuesSQLType.split(',').map((c: any) => c.trim());
  const variableColumnValuesIsCategorical =
    variable &&
    (variable.columnValuesIsCategorical === 'true'
      ? true
      : variable.columnValuesIsCategorical === 'false'
      ? false
      : undefined);
  const variableColumnValuesIsBinominal =
    (variable && variable.columnValuesNumOfEnumerations === '2') || false;

  const variableConstraint: AlgorithmConstraintParameter =
    variableColumnValuesIsCategorical === undefined
      ? {
          binominal: variableColumnValuesIsBinominal || true,
          polynominal: !variableColumnValuesIsBinominal ? true : false,
          real: variableTypes && variableTypes.includes('real') ? true : false,
          integer:
            variableTypes && variableTypes.includes('integer') ? true : false
        }
      : variableColumnValuesIsCategorical
      ? {
          binominal:
            variableColumnValuesIsBinominal ||
            variableColumnValuesIsCategorical,
          polynominal: !variableColumnValuesIsBinominal ? true : false
        }
      : {
          real: variableTypes && variableTypes.includes('real') ? true : false,
          integer:
            variableTypes && variableTypes.includes('integer') ? true : false
        };

  const covariables = algo.parameters.find((p: any) =>
    independents.includes(p.name)
  );
  const covariableTypes =
    covariables &&
    covariables.columnValuesSQLType.split(',').map((c: any) => c.trim());
  const covariableColumnValuesIsCategorical =
    covariables &&
    (covariables.columnValuesIsCategorical === 'true'
      ? true
      : covariables.columnValuesIsCategorical === 'false'
      ? false
      : undefined);

  // both false and undefined
  let covariableConstraint: AlgorithmConstraintParameter = {};

  if (!covariableColumnValuesIsCategorical) {
    if (covariableTypes && covariableTypes.includes('integer')) {
      covariableConstraint.integer = true;
    }

    if (covariableTypes && covariableTypes.includes('real')) {
      covariableConstraint.real = true;
    }
  } else {
    mixed = false;
    covariableConstraint.max_count = 0;
  }

  const covariableColumnValuesIsBinominal =
    (covariables && covariables.columnValuesNumOfEnumerations === '2') || false;

  const groupingsConstraint: AlgorithmConstraintParameter =
    covariableColumnValuesIsCategorical ||
    covariableColumnValuesIsCategorical === undefined
      ? {
          binominal: covariableColumnValuesIsBinominal || true,
          polynominal: !covariableColumnValuesIsBinominal ? true : false
        }
      : { max_count: 0 };

  if (variable && variable.valueNotBlank) {
    variableConstraint.min_count = 1;
  }

  if (variable && !variable.valueMultiple) {
    variableConstraint.max_count = 1;
  }

  if (covariables && covariables.valueNotBlank) {
    if (covariableColumnValuesIsCategorical) {
      groupingsConstraint.min_count = 1;
    } else {
      covariableConstraint.min_count = 1;
    }
  }

  if (covariables && !covariables.valueMultiple) {
    if (covariableColumnValuesIsCategorical) {
      groupingsConstraint.max_count = 1;
    } else {
      covariableConstraint.max_count = 1;
    }
  }

  return {
    covariables: covariableConstraint,
    variable: variableConstraint,
    groupings: groupingsConstraint,
    mixed
  };
};

const buildParameters = (algo: any) => {
  const params =
    (algo.parameters &&
      algo.parameters.map((parameter: any) => {
        const param: AlgorithmParameter = {
          code: parameter.name,
          constraints: {},
          default_value: parameter.value,
          description: parameter.desc,
          label: parameter.name,
          type: parameter.valueType,
          value: parameter.value,
          visible: hiddenParameters.includes(parameter.name) ? false : true
        };

        if (parameter.valueNotBlank) {
          param.constraints =
            parameter.valueType === 'string' || parameter.type === 'other'
              ? {
                  required: true
                }
              : {
                  min: 1
                };
        }

        if (parameter.type === 'other' && parameter.value === 'dummycoding') {
          param.type = 'enumeration';
          param.values = ['dummycoding', 'sumscoding', 'simplecoding'];
        }

        if (
          parameter.type === 'other' &&
          parameter.name === 'referencevalues'
        ) {
          param.type = 'referencevalues';
        }

        return param;
      })) ||
    [];

  return params;
};

const buildExaremeAlgorithmList = (json: any): Algorithm[] =>
  json
    .filter((algorithm: any) => ENABLED_ALGORITHMS.includes(algorithm.name))
    .map((algorithm: any) => ({
      code: algorithm.name,
      constraints: buildConstraints(algorithm),
      description: algorithm.desc,
      enabled: true,
      label:
        algorithm.name === 'NAIVE_BAYES_TRAINING_STANDALONE'
          ? 'Naive Bayes Training'
          : algorithm.name,
      parameters: buildParameters(algorithm),
      source: 'exareme',
      type: ['exareme'],
      validation: true
    }));

const buildExaremeAlgorithmRequest = (
  model: ModelResponse,
  selectedMethod: Algorithm,
  newParams: AlgorithmParameter[]
) => {
  const params = [];
  let variableString;
  let covariablesArray: string[] = [];

  if (model.query.variables) {
    variableString = model.query.variables.map(v => v.code).toString();
  }

  if (model.query.coVariables) {
    covariablesArray = model.query.coVariables.map(v => v.code);
  }

  if (model.query.groupings) {
    covariablesArray = [
      ...covariablesArray,
      ...model.query.groupings.map(v => v.code)
    ];
  }

  let yCode = 'y';
  let xCode = 'x';

  switch (selectedMethod.code) {
    case 'PIPELINE_ISOUP_REGRESSION_TREE_SERIALIZER':
    case 'PIPELINE_ISOUP_MODEL_TREE_SERIALIZER':
      yCode = 'target_attributes';
      xCode = 'descriptive_attributes';
      break;

    default:
      break;
  }

  params.push({
    code: yCode,
    value: variableString
  });

  if (covariablesArray.length > 0) {
    const x =
      selectedMethod.code === 'LINEAR_REGRESSION' ||
      selectedMethod.code === 'ANOVA'
        ? {
            code: xCode,
            value: covariablesArray.toString().replace(/,/g, '+')
          }
        : {
            code: xCode,
            value: covariablesArray.toString()
          };

    params.push(x);
  }

  const datasets = model.query.trainingDatasets;
  if (datasets) {
    const nextDatasets = datasets.map(v => v.code);
    params.push({
      code: 'dataset',
      value: nextDatasets.toString()
    });
  }

  const filters = model.query.filters;
  if (filters) {
    params.push({
      code: 'filter',
      value: filters
    });
  }

  const nextParams = params
    ? params.map((p: any) => ({
        ...p,
        value: p.value || p.default_value
      }))
    : [];

  return [
    ...nextParams,
    ...(newParams.filter((p: any) => p.visible !== false) || [])
  ];
};

const stripModelParameters = (
  experimentResponse: ExperimentResponse
): ExperimentResponse => {
  experimentResponse.algorithms = experimentResponse.algorithms.map(a => {
    const parameters: AlgorithmParameter[] = a.parameters || [];

    return {
      ...a,
      parameters: parameters.filter(p => !hiddenParameters.includes(p.code))
    };
  });

  return experimentResponse;
};

const buildResult = (key: string, result: any) => {

  if (result.error) {
    return {
      mime: MIME_TYPES.ERROR,
      error: result.error
    };
  }

  switch (key) {
    case 'HISTOGRAMS':
      return {
        mime: MIME_TYPES.HIGHCHARTS,
        data: [result]
      };

    case 'PEARSON_CORRELATION':
      return {
        mime: result.type,
        data: [result.data]
      };

    case 'ID3':
    case 'NAIVE_BAYES_TRAINING_STANDALONE':
      const data = result.resources[0].data;
      const s = JSON.stringify(data);
      const t = s.replace(/None/g, '');
      const newData = JSON.parse(t);
      return {
        mime: MIME_TYPES.JSONDATA,
        data: [newData]
      };

    case 'ANOVA':
      const data1 = result.data[0].data;
      const s1 = JSON.stringify(data1);
      const t1 = s1.replace(/None/g, '');
      const newData1 = JSON.parse(t1);
      return {
        mime: MIME_TYPES.JSONDATA,
        data: [newData1]
      };

    case 'LINEAR_REGRESSION':
      const data2 = result.data[0].data;
      const s2 = JSON.stringify(data2);
      const t2 = s2.replace(/None/g, '');
      const newData2 = JSON.parse(t2);
      return {
        mime: MIME_TYPES.JSONDATA,
        data: [newData2]
      };

    case 'LOGISTIC_REGRESSION':
      return {
        mime: MIME_TYPES.JSONDATA,
        data: [result.data[0].data]
      };

    default:
      return {
        mime: MIME_TYPES.JSONRAW,
        data: result.result || result.resources
      };
  }
};

// FIXME: Results formats are inconsistant
const buildExaremeExperimentResponse = (
  resultParsed: any,
  experimentResponse: ExperimentResponse
) => {
  const nextExperimentResponse = stripModelParameters(experimentResponse);
  const name =
    nextExperimentResponse.algorithms.length > 0
      ? nextExperimentResponse.algorithms[0].code
      : '';
  nextExperimentResponse.results = [
    {
      algorithms: resultParsed.map((result: any) => {
        if (result.result) {
          const res =  {
            name: result.name,
            ...result.result
              .filter((r: any) =>
                name === 'LOGISTIC_REGRESSION'||
                name === 'LINEAR_REGRESSION'
                  ? r.type === MIME_TYPES.JSONDATA
                  : r.type === MIME_TYPES.HIGHCHARTS
              )
              .map((r: any) => buildResult(name, r))[0]
          };

          return res;
        }

        return {
          name: result.name,
          ...buildResult(name, result)
        };
      }),
      name: 'local'
    }
  ];

  return nextExperimentResponse;
};

export {
  buildExaremeAlgorithmList,
  buildExaremeAlgorithmRequest,
  buildExaremeExperimentResponse,
  stripModelParameters,
  hiddenParameters
};
