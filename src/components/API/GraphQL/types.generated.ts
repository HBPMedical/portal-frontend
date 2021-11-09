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
  value: Array<Scalars['String']>;
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
  value?: Maybe<Array<Scalars['String']>>;
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

export type Domain = {
  __typename?: 'Domain';
  datasets: Array<Category>;
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
  author?: Maybe<Scalars['String']>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  finishedAt?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  results?: Maybe<Array<ResultUnion>>;
  shared: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  uuid?: Maybe<Scalars['String']>;
  variables: Array<Scalars['String']>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type ExperimentCreateInput = {
  algorithm: AlgorithmInput;
  coVariables?: Maybe<Array<Scalars['String']>>;
  datasets: Array<Scalars['String']>;
  domain: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  name: Scalars['String'];
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
  removeExperiment: PartialExperiment;
};


export type MutationCreateExperimentArgs = {
  data: ExperimentCreateInput;
  isTransient?: Maybe<Scalars['Boolean']>;
};


export type MutationEditExperimentArgs = {
  data: ExperimentEditInput;
  uuid: Scalars['String'];
};


export type MutationRemoveExperimentArgs = {
  uuid: Scalars['String'];
};

export type PartialExperiment = {
  __typename?: 'PartialExperiment';
  algorithm?: Maybe<Algorithm>;
  author?: Maybe<Scalars['String']>;
  coVariables?: Maybe<Array<Scalars['String']>>;
  createdAt?: Maybe<Scalars['Float']>;
  datasets?: Maybe<Array<Scalars['String']>>;
  domain?: Maybe<Scalars['String']>;
  filter?: Maybe<Scalars['String']>;
  finishedAt?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  results?: Maybe<Array<ResultUnion>>;
  shared?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  updateAt?: Maybe<Scalars['Float']>;
  uuid?: Maybe<Scalars['String']>;
  variables?: Maybe<Array<Scalars['String']>>;
  viewed?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  algorithms: Array<Algorithm>;
  domains: Array<Domain>;
  experiment: Experiment;
  experiments: ListExperiments;
};


export type QueryDomainsArgs = {
  ids?: Maybe<Array<Scalars['String']>>;
};


export type QueryExperimentArgs = {
  uuid: Scalars['String'];
};


export type QueryExperimentsArgs = {
  name?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Float']>;
};

export type RawResult = {
  __typename?: 'RawResult';
  rawdata: Scalars['JSON'];
};

export type ResultUnion = GroupsResult | HeatMapResult | LineChartResult | RawResult | TableResult;

export type TableResult = {
  __typename?: 'TableResult';
  data: Array<Array<Scalars['String']>>;
  headers: Array<Header>;
  name: Scalars['String'];
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
