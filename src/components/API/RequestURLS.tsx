import { configurationVar } from './GraphQL/cache';

export const webURL = `${window.location.protocol}//${window.location.host}`;

export const backendURL = process.env.VITE_BACKEND_URL ?? `${webURL}/services`;
export const graphQLURL = `${backendURL}/graphql`;

export const makeAssetURL = (filename: string): string =>
  `${backendURL}/assets/${filename}?ver=${configurationVar().version}`;
