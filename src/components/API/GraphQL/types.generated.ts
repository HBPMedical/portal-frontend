export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export enum AlertLevel {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type AlertResult = {
  __typename?: 'AlertResult';
  level?: Maybe<AlertLevel>;
  message: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type Algorithm = {
  __typename?: 'Algorithm';
  coVariable?: Maybe<VariableParameter>;
  description?: Maybe<Scalars['String']>;
  hasFormula?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<BaseParameter>>;
  preprocessing?: Maybe<Array<AlgorithmPreprocessing>>;
  type?: Maybe<Scalars['String']>;
  variable: VariableParameter;
};

export type AlgorithmInput = {
  id: Scalars['String'];
  parameters?: InputMaybe<Array<AlgorithmParamInput>>;
  preprocessing?: InputMaybe<Array<AlgorithmPreprocessingInput>>;
  type?: InputMaybe<Scalars['String']>;
};

export type AlgorithmParamInput = {
  id: Scalars['String'];
  value: Scalars['String'];
};

export type AlgorithmPreprocessing = {
  __typename?: 'AlgorithmPreprocessing';
  /** Small hint (description) for the end user */
  hint?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<BaseParameter>>;
};

export type AlgorithmPreprocessingInput = {
  name: Scalars['String'];
  parameters?: InputMaybe<Array<AlgorithmParamInput>>;
};

export type AlgorithmResult = {
  __typename?: 'AlgorithmResult';
  name: Scalars['String'];
  parameters?: Maybe<Array<ParamValue>>;
  preprocessing?: Maybe<Array<Preprocessing>>;
};

/** The supported links. */
export enum AllowedLink {
  Covariable = 'COVARIABLE',
  Variable = 'VARIABLE'
}

export type AuthenticationInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type AuthenticationOutput = {
  __typename?: 'AuthenticationOutput';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Author = {
  __typename?: 'Author';
  fullname?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type BarChartResult = {
  __typename?: 'BarChartResult';
  /** List of group's value */
  barEnumValues?: Maybe<Array<BarEnumValues>>;
  /** List of bar's value */
  barValues?: Maybe<Array<Scalars['Float']>>;
  hasConnectedBars?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  xAxis?: Maybe<ChartAxis>;
  yAxis?: Maybe<ChartAxis>;
};

export type BarEnumValues = {
  __typename?: 'BarEnumValues';
  label: Scalars['String'];
  values: Array<Scalars['Float']>;
};

export type BaseParameter = {
  defaultValue?: Maybe<Scalars['String']>;
  hasMultiple?: Maybe<Scalars['Boolean']>;
  /** Small hint (description) for the end user */
  hint?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  label?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type ChartAxis = {
  __typename?: 'ChartAxis';
  /** label of each element on this Axis */
  categories?: Maybe<Array<Scalars['String']>>;
  /** label of the Axis */
  label?: Maybe<Scalars['String']>;
};

export type Configuration = {
  __typename?: 'Configuration';
  connectorId: Scalars['String'];
  enableSSO?: Maybe<Scalars['Boolean']>;
  /** Indicates if filters and formula are enabled */
  hasFilters?: Maybe<Scalars['Boolean']>;
  /** @deprecated Only used for legacy reason should be avoided */
  hasGalaxy?: Maybe<Scalars['Boolean']>;
  /** Indicates if histograms can handle grouping */
  hasGrouping?: Maybe<Scalars['Boolean']>;
  skipAuth?: Maybe<Scalars['Boolean']>;
  skipTos?: Maybe<Scalars['Boolean']>;
  version: Scalars['String'];
};

export type Dataset = {
  __typename?: 'Dataset';
  id: Scalars['String'];
  isLongitudinal?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
};

export type Domain = {
  __typename?: 'Domain';
  datasets: Array<Dataset>;
  description?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  rootGroup: Group;
  variables: Array<Variable>;
  version?: Maybe<Scalars['String']>;
};

export type Experiment = {
  __typename?: 'Experiment';
  algorithm: AlgorithmResult;
  author?: Maybe<Author>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['String']>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  filterVariables?: Maybe<Array<Scalars['String']>>;
  finishedAt?: Maybe<Scalars['String']>;
  formula?: Maybe<Formula>;
  id: Scalars['String'];
  name: Scalars['String'];
  results?: Maybe<Array<ResultUnion>>;
  shared: Scalars['Boolean'];
  status?: Maybe<ExperimentStatus>;
  updateAt?: Maybe<Scalars['String']>;
  variables: Array<Scalars['String']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type ExperimentCreateInput = {
  algorithm: AlgorithmInput;
  coVariables?: InputMaybe<Array<Scalars['String']>>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: InputMaybe<Scalars['String']>;
  interactions?: InputMaybe<Array<Array<Scalars['String']>>>;
  name: Scalars['String'];
  transformations?: InputMaybe<Array<FormulaTransformation>>;
  variables: Array<Scalars['String']>;
};

export type ExperimentEditInput = {
  name?: InputMaybe<Scalars['String']>;
  shared?: InputMaybe<Scalars['Boolean']>;
  viewed?: InputMaybe<Scalars['Boolean']>;
};

export enum ExperimentStatus {
  Error = 'ERROR',
  Init = 'INIT',
  Pending = 'PENDING',
  Success = 'SUCCESS'
}

export type ExtraLineInfo = {
  __typename?: 'ExtraLineInfo';
  label: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type FilterConfiguration = {
  __typename?: 'FilterConfiguration';
  /** List of types that can considered as number */
  numberTypes?: Maybe<Array<Scalars['String']>>;
};

export type Formula = {
  __typename?: 'Formula';
  interactions?: Maybe<Array<Array<Scalars['String']>>>;
  transformations?: Maybe<Array<Transformation>>;
};

export type FormulaOperation = {
  __typename?: 'FormulaOperation';
  /** List of operation available for this type */
  operationTypes: Array<Scalars['String']>;
  /** Type name of the variable */
  variableType: Scalars['String'];
};

export type FormulaTransformation = {
  id: Scalars['String'];
  operation: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  /** List of datasets avalaible, set null if all datasets allowed */
  datasets?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  /** List of variable's ids */
  variables?: Maybe<Array<Scalars['String']>>;
};

export type GroupResult = {
  __typename?: 'GroupResult';
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  results: Array<ResultUnion>;
};

export type GroupsResult = {
  __typename?: 'GroupsResult';
  groups: Array<GroupResult>;
};

export type Header = {
  __typename?: 'Header';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type HeatMapResult = {
  __typename?: 'HeatMapResult';
  heatMapStyle?: Maybe<HeatMapStyle>;
  matrix: Array<Array<Scalars['Float']>>;
  name: Scalars['String'];
  xAxis?: Maybe<ChartAxis>;
  yAxis?: Maybe<ChartAxis>;
};

/** Type of display. */
export enum HeatMapStyle {
  Bubble = 'BUBBLE',
  Normal = 'NORMAL'
}

export type LineChartResult = {
  __typename?: 'LineChartResult';
  hasBisector?: Maybe<Scalars['Boolean']>;
  lines: Array<LineResult>;
  name: Scalars['String'];
  xAxis?: Maybe<ChartAxis>;
  yAxis?: Maybe<ChartAxis>;
};

export type LineResult = {
  __typename?: 'LineResult';
  extraLineInfos?: Maybe<Array<ExtraLineInfo>>;
  label: Scalars['String'];
  type?: Maybe<LineType>;
  x: Array<Scalars['Float']>;
  y: Array<Scalars['Float']>;
};

export enum LineType {
  Dashed = 'DASHED',
  Normal = 'NORMAL'
}

export type ListExperiments = {
  __typename?: 'ListExperiments';
  currentPage?: Maybe<Scalars['Float']>;
  experiments?: Maybe<Array<Experiment>>;
  totalExperiments?: Maybe<Scalars['Float']>;
  totalPages?: Maybe<Scalars['Float']>;
};

export type MeanChartResult = {
  __typename?: 'MeanChartResult';
  name: Scalars['String'];
  /** List of points with confidence information: min, mean, max */
  pointCIs: Array<PointCi>;
  xAxis?: Maybe<ChartAxis>;
  yAxis?: Maybe<ChartAxis>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createExperiment: Experiment;
  editExperiment: Experiment;
  login: AuthenticationOutput;
  logout: Scalars['Boolean'];
  refresh: AuthenticationOutput;
  removeExperiment: PartialExperiment;
  updateUser: User;
};


export type MutationCreateExperimentArgs = {
  data: ExperimentCreateInput;
  isTransient?: InputMaybe<Scalars['Boolean']>;
};


export type MutationEditExperimentArgs = {
  data: ExperimentEditInput;
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  variables: AuthenticationInput;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String'];
};


export type MutationRemoveExperimentArgs = {
  id: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type NominalParameter = BaseParameter & {
  __typename?: 'NominalParameter';
  allowedValues?: Maybe<Array<OptionValue>>;
  defaultValue?: Maybe<Scalars['String']>;
  hasMultiple?: Maybe<Scalars['Boolean']>;
  /** Small hint (description) for the end user */
  hint?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  /** Id of the parameter */
  linkedTo?: Maybe<AllowedLink>;
  name: Scalars['String'];
};

export type NumberParameter = BaseParameter & {
  __typename?: 'NumberParameter';
  defaultValue?: Maybe<Scalars['String']>;
  hasMultiple?: Maybe<Scalars['Boolean']>;
  /** Small hint (description) for the end user */
  hint?: Maybe<Scalars['String']>;
  isReal?: Maybe<Scalars['Boolean']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Float']>;
  min?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type OptionValue = {
  __typename?: 'OptionValue';
  label: Scalars['String'];
  value: Scalars['String'];
};

export type ParamValue = {
  __typename?: 'ParamValue';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type PartialExperiment = {
  __typename?: 'PartialExperiment';
  algorithm?: Maybe<AlgorithmResult>;
  author?: Maybe<Author>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['String']>;
  datasets?: Maybe<Array<Scalars['String']>>;
  domain?: Maybe<Scalars['String']>;
  filter?: Maybe<Scalars['String']>;
  filterVariables?: Maybe<Array<Scalars['String']>>;
  finishedAt?: Maybe<Scalars['String']>;
  formula?: Maybe<Formula>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<ResultUnion>>;
  shared?: Maybe<Scalars['Boolean']>;
  status?: Maybe<ExperimentStatus>;
  updateAt?: Maybe<Scalars['String']>;
  variables?: Maybe<Array<Scalars['String']>>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type PointCi = {
  __typename?: 'PointCI';
  max?: Maybe<Scalars['Float']>;
  mean: Scalars['Float'];
  min?: Maybe<Scalars['Float']>;
};

export type Preprocessing = {
  __typename?: 'Preprocessing';
  name: Scalars['String'];
  parameters?: Maybe<Array<ParamValue>>;
};

export type Query = {
  __typename?: 'Query';
  algorithms: Array<Algorithm>;
  configuration: Configuration;
  domains: Array<Domain>;
  experiment: Experiment;
  experimentList: ListExperiments;
  filter: FilterConfiguration;
  formula: Array<FormulaOperation>;
  user: User;
};


export type QueryExperimentArgs = {
  id: Scalars['String'];
};


export type QueryExperimentListArgs = {
  name?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Float']>;
};

export type RawResult = {
  __typename?: 'RawResult';
  rawdata?: Maybe<Scalars['JSON']>;
};

export type ResultUnion = AlertResult | BarChartResult | GroupsResult | HeatMapResult | LineChartResult | MeanChartResult | RawResult | TableResult;

export type StringParameter = BaseParameter & {
  __typename?: 'StringParameter';
  defaultValue?: Maybe<Scalars['String']>;
  hasMultiple?: Maybe<Scalars['Boolean']>;
  /** Small hint (description) for the end user */
  hint?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type TableResult = {
  __typename?: 'TableResult';
  data: Array<Array<Scalars['String']>>;
  headers: Array<Header>;
  name: Scalars['String'];
  tableStyle?: Maybe<TableStyle>;
};

export enum TableStyle {
  Default = 'DEFAULT',
  Normal = 'NORMAL'
}

export type Transformation = {
  __typename?: 'Transformation';
  /** Variable's id on which to apply the transformation */
  id: Scalars['String'];
  /** Transformation to apply */
  operation: Scalars['String'];
};

export type UpdateUserInput = {
  agreeNDA: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  agreeNDA?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  username: Scalars['String'];
};

export type Variable = {
  __typename?: 'Variable';
  /** List of datasets avalaible, set null if all datasets allowed */
  datasets?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  enumerations?: Maybe<Array<Category>>;
  groups?: Maybe<Array<Group>>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type VariableParameter = {
  __typename?: 'VariableParameter';
  /** If undefined, all types are allowed */
  allowedTypes?: Maybe<Array<Scalars['String']>>;
  hasMultiple?: Maybe<Scalars['Boolean']>;
  hint?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
};
