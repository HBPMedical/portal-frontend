import * as dotenv from 'dotenv';

dotenv.config();
export const webURL = `${window.location.protocol}//${window.location.host}`;

export const backendURL =
  process.env.NODE_ENV !== 'production'
    ? `${process.env.REACT_APP_BACKEND_URL}/services`
    : `${webURL}/services`;
