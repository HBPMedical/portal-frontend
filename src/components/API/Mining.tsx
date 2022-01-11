import Axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { Container } from 'unstated';

import { backendURL } from '../API';
import { ERRORS_OUTPUT, HISTOGRAMS_STORAGE_KEY } from '../constants';
import { NodeData } from '../ExperimentExplore/d3Hierarchy';
import { Algorithm, AlgorithmParameterRequest, VariableEntity } from './Core';
import { IExperiment } from './Experiment';

export interface NumericalData {
  [key: string]: number;
}

export interface CategoricalData {
  [key: string]: {
    count: number;
    percentage: number;
  };
}
export interface MiningResponse {
  data: {
    single: {
      [variable: string]: {
        [dataset: string]: {
          data: NumericalData | CategoricalData;
          num_datapoints: number;
          num_total: number;
          num_nulls: number;
        };
      };
    };
    model: {
      [dataset: string]: {
        data: {
          [variable: string]: {
            [key: string]: number;
          };
        };
        num_datapoints: number;
        num_total: number;
        num_nulls: number;
      };
    };
  };
  type?: string;
  error?: string;
  loading?: boolean;
  warning?: string;
}

export interface MiningPayload {
  algorithm?: Algorithm;
  variables: VariableEntity[];
  grouping: VariableEntity[];
  covariables: VariableEntity[];
  datasets: VariableEntity[];
  filters: string;
  pathology?: string;
}

export interface HistogramVariable {
  [key: string]: VariableEntity;
}

export interface MiningState {
  error?: string;
  summaryStatistics?: MiningResponse[];
  histograms?: any;
  refetchAlgorithms?: number;
}

//
class Mining extends Container<MiningState> {
  state: MiningState;

  private options: AxiosRequestConfig;
  private backendURL: string;
  private requests: AxiosPromise<any>[] = [];

  constructor(config: any) {
    super();
    this.state = {
      histograms: undefined,
      summaryStatistics: undefined
    };
    this.options = config.options;
    this.backendURL = backendURL;
  }

  clear = () => {
    return this.setState((prevState: any) => ({
      error: undefined,
      histograms: undefined,
      summaryStatistics: undefined
    }));
  };

  abortMiningRequests = (): void => {
    try {
      // this.requests.forEach(r => r.abort && r.abort());
      this.requests = [];
    } finally {
      //
    }
  };

  setGroupingForPathology = (
    pathology: string,
    choosenVariables: HistogramVariable
  ): void => {
    const existing = this.choosenHistogramVariables();

    localStorage.setItem(
      HISTOGRAMS_STORAGE_KEY,
      JSON.stringify({
        ...existing,
        [pathology]: choosenVariables
      })
    );
  };

  groupingForPathology = (pathology: string): HistogramVariable => {
    const existing = this.choosenHistogramVariables()[pathology] || {};

    return existing;
  };

  // TODO use context
  // used to trigger a fetch when local
  refetchAlgorithms = (): void => {
    this.setState({ refetchAlgorithms: Math.random() });
  };
  multipleHistograms = async ({
    y,
    datasets,
    pathology
  }: {
    y: NodeData;
    datasets: VariableEntity[];
    pathology: string;
  }): Promise<void> => {
    if (datasets.length === 0) {
      return await this.setState({
        histograms: {
          data: undefined,
          loading: false,
          warning: 'Please select a dataset'
        }
      });
    }

    await this.setState({
      histograms: {
        data: undefined,
        error: undefined,
        loading: true
      }
    });

    const parameters: AlgorithmParameterRequest[] = [
      {
        name: 'dataset',
        label: 'dataset',
        value: datasets.map(d => d.code).toString()
      },
      {
        name: 'y',
        label: 'y',
        value: y.id
      },
      {
        name: 'pathology',
        label: 'pathology',
        value: pathology
      }
    ];

    const choosenHistogramVariablesByPathology = this.groupingForPathology(
      pathology
    );

    const xVariables = Object.values(choosenHistogramVariablesByPathology)
      .map((v: VariableEntity) => v.code)
      .filter(v => y.id !== v);

    const type = y.type || 'real';
    if (type !== 'nominal') {
      parameters.push({
        name: 'bins',
        label: 'bins',
        value: JSON.stringify({ [y.id]: 20 })
      });
    }

    if (xVariables.length > 0) {
      parameters.push({
        name: 'x',
        label: 'x',
        value: xVariables.toString()
      });
    }

    this.abortMiningRequests();

    const experiment = {
      algorithm: {
        parameters,
        type: 'string',
        name: 'MULTIPLE_HISTOGRAMS'
      },
      name: 'An histogram'
    };

    try {
      const request = Axios({
        data: JSON.stringify(experiment),
        headers: {
          ...this.options.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'POST',
        url: `${this.backendURL}/experiments/transient`
      });

      this.requests.push(request);
      const response = await request;

      const mining: IExperiment = response.data;

      if (mining.status === 'error') {
        return this.setState({
          histograms: {
            data: undefined,
            error:
              response.data.message ??
              (mining.result ? mining.result[0].data : 'unknown error occured'),
            loading: false
          }
        });
      }

      const json = response.data;

      const error = json.result.find((d: any) =>
        ERRORS_OUTPUT.includes(d.type)
      );

      if (error) {
        return this.setState({
          histograms: {
            data: undefined,
            error: error.data,
            loading: false
          }
        });
      }

      this.setState({
        histograms: {
          data: json.result.map((p: any) => ({
            highchart: p
            // label: i === 0 ? x.label : dependentsVariables[i]
          })),
          error: undefined,
          loading: false
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  descriptiveStatistics = async ({
    payload
  }: {
    payload: MiningPayload;
  }): Promise<any> => {
    const y = [
      ...payload.variables,
      ...payload.covariables,
      ...payload.grouping
    ].map(v => v.code);

    if (y?.length === 0) {
      return;
    }

    const parameters: AlgorithmParameterRequest[] = [
      {
        name: 'dataset',
        label: 'dataset',
        value: payload.datasets.map(v => v.code).toString()
      },
      {
        name: 'y',
        label: 'y',
        value: y.toString()
      },
      {
        name: 'filter',
        label: 'filter',
        value: payload.filters
      },
      {
        name: 'pathology',
        label: 'pathology',
        value: payload.pathology || ''
      }
    ];

    const experiment = {
      algorithm: {
        parameters,
        type: 'string',
        name: 'DESCRIPTIVE_STATS'
      },
      name: 'Descriptive statistics'
    };

    this.abortMiningRequests();

    try {
      const r = Axios({
        data: JSON.stringify(experiment),
        headers: {
          ...this.options.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'POST',
        url: `${this.backendURL}/experiments/transient`
      });
      this.requests.push(r);
      const response = await r;
      const json = response.data;

      if (json && json.error) {
        this.setState({ error: json.error, summaryStatistics: undefined });
      }

      const summaryStatistics =
        json.result; /*.filter((r: any) =>
        [MIME_TYPES.JSON, ...ERRORS_OUTPUT].includes(r.type)
      );*/

      this.setState({ error: undefined, summaryStatistics });
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message, summaryStatistics: undefined });
    }
  };

  private choosenHistogramVariables = (): {
    [key: string]: HistogramVariable;
  } => {
    const choosenHistogramVariablesByPathologyString = localStorage.getItem(
      HISTOGRAMS_STORAGE_KEY
    );

    const existing = choosenHistogramVariablesByPathologyString
      ? JSON.parse(choosenHistogramVariablesByPathologyString)
      : {};

    return existing;
  };
}

export default Mining;
