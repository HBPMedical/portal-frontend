// Mime types
export enum MIME_TYPES {
  ERROR = 'text/plain+error',
  WARNING = 'text/plain+warning',
  USER_WARNING = 'text/plain+user_error',
  HIGHCHARTS = 'application/vnd.highcharts+json',
  JSON = 'application/json',
  JSONBTREE = 'application/binary-tree+json',
  PFA = 'application/pfa+json',
  JSONDATA = 'application/vnd.dataresource+json',
  HTML = 'text/html',
  TEXT = 'text/plain'
}

export const LONGITUDINAL_DATASET_TYPE = 'longitudinal';
export const HISTOGRAMS_STORAGE_KEY = 'mipChoosenHistogramsVars';
export const PRIVACY_ERROR = 'NOT ENOUGH DATA';
export const FORBIDDEN_ACCESS_MESSAGE =
  'Connection SUCCESSFUL! Despite of this, it appears that you currently don&lsquo;t have enough privileges to browse this platform. Please contact the  <a href="mailto:support@ebrains.eu?subject=Medical%20Informatics%20Platform%20Access%20Request">Support Team</a> (support@ebrains.eu) if you think you should have <a href="https://mip.ebrains.eu/access" target="_blank">access</a>.';

export const ERRORS_OUTPUT = [
  MIME_TYPES.ERROR,
  MIME_TYPES.WARNING,
  MIME_TYPES.USER_WARNING
];

const EXAREME_HIDDEN_PARAMETERS = [
  'X',
  'column1',
  'descriptive_attributes',
  'CM',
  'Y',
  'column2',
  'target_attributes',
  'Event variable',
  'PB'
];

export const UI_HIDDEN_PARAMETERS = [
  ...EXAREME_HIDDEN_PARAMETERS,
  'x',
  'y',
  'dataset',
  'filter',
  'pathology',
  'centers',
  'formula'
];

export const MIN_SEARCH_CHARACTER_NUMBER = 2; //
