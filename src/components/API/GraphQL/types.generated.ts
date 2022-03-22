export type Maybe<T> = T | null;
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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Algorithm = {
  __typename?: 'Algorithm';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<AlgorithmParameter>>;
  type?: Maybe<Scalars['String']>;
};

export type AlgorithmInput = {
  id: Scalars['String'];
  parameters?: Maybe<Array<AlgorithmParamInput>>;
  type: Scalars['String'];
};

export type AlgorithmParamInput = {
  id: Scalars['String'];
  type?: Maybe<ParamType>;
  value: Scalars['String'];
};

export type AlgorithmParameter = {
  __typename?: 'AlgorithmParameter';
  defaultValue?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isMultiple?: Maybe<Scalars['Boolean']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['String']>;
  min?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AuthenticationInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type AuthenticationOutput = {
  __typename?: 'AuthenticationOutput';
  accessToken: Scalars['String'];
};

export type Author = {
  __typename?: 'Author';
  fullname?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
};

export type ChartAxis = {
  __typename?: 'ChartAxis';
  categories?: Maybe<Array<Scalars['String']>>;
  label?: Maybe<Scalars['String']>;
};

export type Configuration = {
  __typename?: 'Configuration';
  connectorId: Scalars['String'];
  contactLink?: Maybe<Scalars['String']>;
  hasGalaxy?: Maybe<Scalars['Boolean']>;
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
};

export type Experiment = {
  __typename?: 'Experiment';
  algorithm: Algorithm;
  author?: Maybe<Author>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  filterVariables?: Maybe<Array<Scalars['String']>>;
  finishedAt?: Maybe<Scalars['Float']>;
  formula?: Maybe<Formula>;
  id: Scalars['String'];
  name: Scalars['String'];
  results?: Maybe<Array<ResultUnion>>;
  shared: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  variables: Array<Scalars['String']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type ExperimentCreateInput = {
  algorithm: AlgorithmInput;
  coVariables?: Maybe<Array<Scalars['String']>>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  interactions?: Maybe<Array<Array<Scalars['String']>>>;
  name: Scalars['String'];
  transformations?: Maybe<Array<FormulaTransformation>>;
  variables: Array<Scalars['String']>;
};

export type ExperimentEditInput = {
  name?: Maybe<Scalars['String']>;
  shared?: Maybe<Scalars['Boolean']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type ExtraLineInfo = {
  __typename?: 'ExtraLineInfo';
  label: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type Formula = {
  __typename?: 'Formula';
  interactions?: Maybe<Array<Array<Scalars['String']>>>;
  transformations?: Maybe<Array<Transformation>>;
};

export type FormulaTransformation = {
  id: Scalars['String'];
  operation: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
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
  matrix: Array<Array<Scalars['Float']>>;
  name: Scalars['String'];
  xAxis?: Maybe<ChartAxis>;
  yAxis?: Maybe<ChartAxis>;
};

export type LineChartResult = {
  __typename?: 'LineChartResult';
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
  experiments: Array<Experiment>;
  totalExperiments?: Maybe<Scalars['Float']>;
  totalPages?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createExperiment: Experiment;
  editExperiment: Experiment;
  login: AuthenticationOutput;
  logout: Scalars['Boolean'];
  removeExperiment: PartialExperiment;
  updateUser: User;
};


export type MutationCreateExperimentArgs = {
  data: ExperimentCreateInput;
  isTransient?: Maybe<Scalars['Boolean']>;
};


export type MutationEditExperimentArgs = {
  data: ExperimentEditInput;
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  variables: AuthenticationInput;
};


export type MutationRemoveExperimentArgs = {
  id: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export enum ParamType {
  Number = 'NUMBER',
  String = 'STRING'
}

export type PartialExperiment = {
  __typename?: 'PartialExperiment';
  algorithm?: Maybe<Algorithm>;
  author?: Maybe<Author>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets?: Maybe<Array<Scalars['String']>>;
  domain?: Maybe<Scalars['String']>;
  filter?: Maybe<Scalars['String']>;
  filterVariables?: Maybe<Array<Scalars['String']>>;
  finishedAt?: Maybe<Scalars['Float']>;
  formula?: Maybe<Formula>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<ResultUnion>>;
  shared?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  variables?: Maybe<Array<Scalars['String']>>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  algorithms: Array<Algorithm>;
  configuration: Configuration;
  domains: Array<Domain>;
  experiment: Experiment;
  experimentList: ListExperiments;
  user: User;
};


export type QueryDomainsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};


export type QueryExperimentArgs = {
  id: Scalars['String'];
};


export type QueryExperimentListArgs = {
  name?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Float']>;
};

export type RawResult = {
  __typename?: 'RawResult';
  rawdata?: Maybe<Scalars['JSON']>;
};

export type ResultUnion = GroupsResult | HeatMapResult | LineChartResult | RawResult | TableResult;

export type TableResult = {
  __typename?: 'TableResult';
  data: Array<Array<Scalars['String']>>;
  headers: Array<Header>;
  name: Scalars['String'];
  theme?: Maybe<ThemeType>;
};

export enum ThemeType {
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
  description?: Maybe<Scalars['String']>;
  enumerations?: Maybe<Array<Category>>;
  groups?: Maybe<Array<Group>>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};
