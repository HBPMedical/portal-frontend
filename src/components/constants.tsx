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

export const HISTOGRAMS_STORAGE_KEY = 'mipChoosenHistogramsVars';
export const FORBIDDEN_ACCESS_MESSAGE =
  'Connection SUCCESSFUL! Despite of this, it appears that you currently don&lsquo;t have enough privileges to browse this platform. Please contact the  <a href="mailto:support@ebrains.eu?subject=Medical%20Informatics%20Platform%20Access%20Request">Support Team</a> (support@ebrains.eu) if you think you should have <a href="https://mip.ebrains.eu/access" target="_blank">access</a>.';

export const ERRORS_OUTPUT = [
  MIME_TYPES.ERROR,
  MIME_TYPES.WARNING,
  MIME_TYPES.USER_WARNING
];

export const MIN_SEARCH_CHARACTER_NUMBER = 2; //

export const REFRESH_TOKEN_KEY_NAME = 'refreshToken';
