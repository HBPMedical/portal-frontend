import * as dotenv from 'dotenv';

dotenv.config();

export const webURL = `${window.location.protocol}//${window.location.host}`;

export const backendURL =
  process.env.REACT_APP_BACKEND_URL ?? `${webURL}/services`;
export const graphQLURL = `${backendURL}/graphql`;
