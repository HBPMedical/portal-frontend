import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Container } from 'unstated';

import { backendURL } from '../API';
import { Algorithm, AlgorithmParameter } from '../API/Core';
import { ALGORITHMS_OUTPUT } from '../API/Exareme';
import { ModelResponse } from '../API/Model';
import { MIME_TYPES, MIN_SEARCH_CHARACTER_NUMBER } from '../constants';
import { Exareme } from './Exareme';

interface IUUID {
  uuid: string;
}

export interface ExperimentPayload {
  algorithms: Algorithm[];
  model: string;
  name: string;
  label: string;
}

export type ExperimentStatus = 'error' | 'pending' | 'success';
export type ParameterName =
  | 'x'
  | 'y'
  | 'dataset'
  | 'pathology'
  | 'filter'
  | 'formula'
  | 'bins'
  | 'referencevalues'
  | 'encodingparameter'
  | 'iterations_max_number'
  | 'sstype'
  | 'outputformat'
  | 'standardize'
  | 'coding'
  | 'kfold'
  | 'alpha'
  | 'k'
  | 'e'
  | 'xlevels'
  | 'hypothesis'
  | 'effectsize'
  | 'ci'
  | 'meandiff'
  | 'testvalue'
  | 'dx'
  | 'c2_feature_selection_method'
  | 'c2_num_clusters_method'
  | 'c2_num_clusters'
  | 'c2_clustering_method'
  | 'c3_feature_selection_method'
  | 'c3_classification_method'
  | 'devel'
  | 'max_deg'
  | 'confLevels'
  | 'thres'
  | 'num_points'
  | 'max_depth'
  | 'outcome_pos'
  | 'outcome_neg'
  | 'max_age'
  | 'positive_level'
  | 'negative_level'
  | 'total_duration'
  | 'iterationNumber'
  | 'dbIdentifier'
  | 'sediff'
  | 'no_split_points'
  | 'iterationNumber';

export interface ExperimentParameter {
  name: ParameterName;
  label?: string;
  value: string | number;
}

export interface Result {
  type: MIME_TYPES;
  data: any;
}

export interface IExperimentError {
  status: ExperimentStatus;
  result?: Result[];
}

export interface IExperimentPrototype {
  algorithm: {
    name: string;
    desc?: string;
    label?: string;
    type: string;
    parameters: ExperimentParameter[];
  };
  name?: string;
}

export interface IExperiment extends IExperimentPrototype, IExperimentError {
  uuid: string;
  createdBy: string;
  created: string;
  finisehd: string;
  shared?: boolean;
  viewed: boolean;
  algorithm: {
    name: string;
    desc?: string;
    label?: string;
    type: string;
    parameters: ExperimentParameter[];
  };
}

export interface IExperimentList {
  experiments: IExperiment[];
  totalPages: number;
  currentPage: number;
  totalExperiments: number;
}

type Order = 'created';
export interface ExperimentListQueryParameters {
  algorithm?: string;
  descending?: boolean;
  includeShared?: boolean;
  name?: string;
  orderBy?: Order;
  page?: number;
  shared?: boolean;
  size?: number;
  viewed?: boolean;
}

export type HandleQueryParameters = ({
  ...params
}: ExperimentListQueryParameters) => void;
export interface State {
  experiment: IExperiment | IExperimentError;
  experimentList?: IExperimentList;
  experimentListError?: string;
  experimentListQueryParameters: ExperimentListQueryParameters;
  experimentListForParamters?: IExperimentList;
  parameterExperimentListError?: string;
  parameterExperimentListQueryParameters: ExperimentListQueryParameters;
}

class Experiment extends Container<State> {
  state: State = {
    experiment: { status: 'pending' },
    experimentListQueryParameters: { page: 0 },
    parameterExperimentListQueryParameters: { page: 0 }
  };

  private options: AxiosRequestConfig;
  private baseUrl: string;

  constructor(config: any) {
    super();
    this.options = config.options;
    this.baseUrl = `${backendURL}/experiments`;
  }

  setExperiment = (experiment?: IExperiment): void => {
    this.setState({ experiment });
  };

  // Iexperiment Type Guards
  isExperiment = (
    e?: IExperiment | IExperimentError
  ): IExperiment | undefined =>
    e === undefined || (e as IExperiment).uuid !== undefined
      ? (e as IExperiment)
      : undefined;

  handleErrors = (
    response: AxiosResponse<any>
  ): IExperiment | IExperimentError => {
    if (response.status >= 500) {
      return {
        status: 'error',
        result: [{ type: MIME_TYPES.ERROR, data: response.data.message }]
      };
    }

    if (response.status >= 400) {
      return {
        status: 'error',
        result: [{ type: MIME_TYPES.WARNING, data: response.data.message }]
      };
    }

    const experiment: IExperiment = response.data;
    if (experiment.status === 'error') {
      return {
        ...experiment,
        status: 'error',
        result: [
          {
            type: MIME_TYPES.ERROR,
            data: 'An unknown error occured. Please retry in a moment'
          },
          ...(experiment?.result || [])
        ]
      };
    }

    const result = experiment.result?.filter(e =>
      ALGORITHMS_OUTPUT.find(
        a => a.name === experiment.algorithm.name
      )?.types?.includes(e.type)
    );

    return {
      ...experiment,
      result
    };
  };

  get = async ({ uuid }: IUUID): Promise<void> => {
    try {
      const response = await Axios.get(`${this.baseUrl}/${uuid}`, this.options);

      const e = this.handleErrors(response);
      const experiment = Exareme.handleExperimentResponseExceptions(e);
      return await this.setState({ experiment });
    } catch (error) {
      console.log('error');
      return await this.setState({
        experiment: {
          status: 'error',
          result: [{ type: MIME_TYPES.ERROR, data: error.message }]
        }
      });
    }
  };

  /* Must keep the parameters as we are polling this list to retrieve updated status and new experiments,
  so the list must be refreshed with the same parameters otherwise the index (page, search) get reset */
  list = async ({
    ...params
  }: ExperimentListQueryParameters): Promise<void> => {
    const currentExperimentListQueryParameters = this.state
      .experimentListQueryParameters;

    const nextPage =
      params.page === 0
        ? 0
        : params.page === undefined
        ? currentExperimentListQueryParameters.page
        : params.page;

    // reset the page if search is on
    const page =
      params?.name && params?.name?.length > MIN_SEARCH_CHARACTER_NUMBER - 1
        ? 0
        : nextPage;

    const nextQueryParameters = {
      ...currentExperimentListQueryParameters,
      ...params,
      page
    };

    // Encode params and enable SQL search with %[name]%
    const nextParams = Object.entries(nextQueryParameters)
      .map(entry =>
        entry[0] === 'name'
          ? `${entry[0]}=%25${entry[1]}%25&`
          : `${entry[0]}=${entry[1]}&`
      )
      .join('');

    try {
      const response = await Axios.get(
        `${this.baseUrl}?${nextParams}`,
        this.options
      );

      const experimentList: IExperimentList = response.data;

      return await this.setState({
        experimentList,
        experimentListQueryParameters: nextQueryParameters
      });
    } catch (error) {
      return await this.setState({
        experimentListError: error.message
      });
    }
  };

  getListForExperimentParameters = async ({
    ...params
  }: ExperimentListQueryParameters): Promise<void> => {
    const currentExperimentListQueryParameters = this.state
      .parameterExperimentListQueryParameters;

    const nextPage =
      params.page === 0
        ? 0
        : params.page === undefined
        ? currentExperimentListQueryParameters.page
        : params.page;

    // reset the page if search is on */
    const page =
      params?.name && params?.name?.length > MIN_SEARCH_CHARACTER_NUMBER - 1
        ? 0
        : nextPage;

    const nextQueryParameters = {
      ...currentExperimentListQueryParameters,
      ...params,
      page
    };

    // Encode params and enable SQL search with %[name]%
    const nextParams = Object.entries(nextQueryParameters)
      .map(entry =>
        entry[0] === 'name'
          ? `${entry[0]}=%25${entry[1]}%25&`
          : `${entry[0]}=${entry[1]}&`
      )
      .join('');

    try {
      const response = await Axios.get(
        `${this.baseUrl}?${nextParams}`,
        this.options
      );

      const experimentListForParamters: IExperimentList = response.data;

      return await this.setState(previousState => ({
        error: undefined,
        experimentListForParamters,
        parameterExperimentListQueryParameters: nextQueryParameters
      }));
    } catch (error) {
      return await this.setState({
        parameterExperimentListError: error.message
      });
    }
  };

  delete = async ({ uuid }: { uuid: string }): Promise<void> => {
    try {
      const response = await Axios({
        method: 'DELETE',
        headers: this.options.headers,
        url: `${this.baseUrl}/${uuid}`
      });

      await this.list({});

      return await this.setState({ experiment: this.handleErrors(response) });
    } catch (error) {
      return await this.setState({
        experiment: {
          status: 'error',
          result: [{ type: MIME_TYPES.ERROR, data: error.message }]
        }
      });
    }
  };

  update = async ({
    uuid,
    experiment
  }: {
    uuid: string;
    experiment: Partial<IExperiment>;
  }): Promise<void> => {
    try {
      const response = await Axios({
        method: 'PATCH',
        data: JSON.stringify(experiment),
        headers: {
          ...this.options.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        url: `${this.baseUrl}/${uuid}`
      });

      await this.list({});

      const e = this.handleErrors(response);
      const experimentRes = Exareme.handleExperimentResponseExceptions(e);
      return await this.setState({
        experiment: experimentRes
      });
    } catch (error) {
      return await this.setState({
        experiment: {
          status: 'error',
          result: [{ type: MIME_TYPES.ERROR, data: error.message }]
        }
      });
    }
  };

  create = async ({
    experiment,
    transient = true
  }: {
    experiment: IExperimentPrototype;
    transient?: boolean;
  }): Promise<void> => {
    try {
      const response = await Axios({
        method: 'POST',
        data: JSON.stringify(experiment),
        headers: {
          ...this.options.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        url: transient ? `${this.baseUrl}/transient` : `${this.baseUrl}`
      });

      return await this.setState({
        experiment: this.handleErrors(response)
      });
    } catch (error) {
      return await this.setState({
        experiment: {
          status: 'error',
          result: [{ type: MIME_TYPES.ERROR, data: error.message }]
        }
      });
    }
  };

  markAsViewed = async ({ uuid }: IUUID): Promise<void> =>
    this.update({ uuid, experiment: { viewed: true } });

  markAsShared = async ({ uuid }: IUUID): Promise<void> =>
    this.update({ uuid, experiment: { shared: true } });

  markAsUnshared = async ({ uuid }: IUUID): Promise<void> =>
    this.update({ uuid, experiment: { shared: false } });

  makeParametersFromModel = (
    model: ModelResponse,
    parameters: AlgorithmParameter[]
  ): ExperimentParameter[] => {
    const query = model && model.query;
    return parameters.map(p => {
      let value: string = p.value;

      if (query) {
        if (p.label === 'x') {
          let covariablesArray =
            (query.coVariables && query.coVariables.map(v => v.code)) || [];
          covariablesArray = query.groupings
            ? [...covariablesArray, ...query.groupings.map(v => v.code)]
            : covariablesArray;

          value = covariablesArray.toString();
        }

        if (p.label === 'y') {
          value =
            (query.variables && query.variables.map(v => v.code).toString()) ||
            '';
        }

        if (p.label === 'dataset') {
          value =
            (query.trainingDatasets &&
              query.trainingDatasets.map(v => v.code).toString()) ||
            '';
        }

        if (p.label === 'pathology') {
          value = (query.pathology && query.pathology.toString()) || '';
        }

        if (p.label === 'filter') {
          value = (query.filters && query.filters) || '';
        }

        const data = query?.formula;
        const formula =
          (data &&
            (data.transformations || data.interactions) && {
              single: data?.transformations?.map(t => ({
                // eslint-disable-next-line @typescript-eslint/camelcase
                var_name: t.name,
                // eslint-disable-next-line @typescript-eslint/camelcase
                unary_operation: t.operation
              })),
              interactions: data?.interactions?.map(v =>
                v.reduce((a, e, i) => ({ ...a, [`var${i + 1}`]: e }), {})
              )
            }) ||
          null;

        if (p.label === 'formula') {
          value = JSON.stringify(formula);
        }
      }

      return {
        name: p.name as ParameterName,
        label: p.label,
        value
      };
    });
  };
}

export default Experiment;
