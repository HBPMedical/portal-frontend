const XSRFToken = (cookie: string) => {
  const tokenArray =
    cookie &&
    cookie.match(/XSRF-TOKEN=([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)/);
  return (tokenArray && tokenArray[1]) || '';
};

type Headers = {
  credentials?: string;
  headers?: Record<string, string>;
};

const opts = (token?: string, mode?: string): Headers => {
  if (token)
    return {
      headers: {
        Authorization: process.env.VITE_AUTHORIZATION ?? '',
        Cookie: `JSESSIONID=${process.env.VITE_JSESSIONID}; XSRF-TOKEN=${process.env.VITE_TOKEN}`,
        'X-XSRF-TOKEN': process.env.VITE_TOKEN ?? '',
      },
    };

  if (mode === 'production')
    return {
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': XSRFToken(document.cookie),
      },
    };

  return {};
};

const RequestHeaders = {
  options: opts(process.env.VITE_TOKEN, process.env.NODE_ENV),
};

export default RequestHeaders;
