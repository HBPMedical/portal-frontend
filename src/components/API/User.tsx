import axios, { AxiosRequestConfig } from 'axios';
import { Container } from 'unstated';
import { backendURL } from '../API';

export interface User {
  fullname?: string;
  username?: string;
  email?: string;
  agreeNDA?: boolean;
}

export interface State {
  authenticated: boolean;
  error?: string;
  user?: User;
  loading: boolean;
}

class UserContainer extends Container<State> {
  state: State = {
    authenticated: false,
    loading: true
  };

  private options: AxiosRequestConfig;
  private backendURL: string;

  constructor(config: any) {
    super();
    this.options = config.options;
    this.backendURL = backendURL;
  }

  login = async (params: any): Promise<void> => {
    const loginURL = `${this.backendURL}/sso/login${params}`;
    const response = await axios.get(loginURL, this.options);

    return response.data;
  };

  logout = async (): Promise<void> => {
    const logoutURL = `${this.backendURL}/logout`;

    return await axios.get(logoutURL, this.options);
  };

  user = async (): Promise<void> => {
    console.log('Check user authorization');
    try {
      const response = await axios.get(`${this.backendURL}/activeUser `, {
        ...this.options,
        headers: {
          // https://github.com/axios/axios/issues/980
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.status === 401) {
        return await this.setState({
          error: response.statusText,
          loading: false,
          authenticated: false
        });
      }

      // Check for json object
      if (response.data && !response.data?.username) {
        return await this.setState({
          error: "Unexpected server response",
          user: undefined,
          loading: false
        });
      }

      const user = response.data;
      if (response.status === 403) {
        return await this.setState({
          error: response.statusText,
          loading: false,
          user
        });
      }

      return await this.setState({
        error: undefined,
        loading: false,
        authenticated: true,
        user
      });
    } catch (error) {
      return await this.setState({
        error: error.response?.data,
        loading: false,
        authenticated: false
      });
    }
  };

  acceptTOS = async (): Promise<void> => {
    try {
      const response = await axios.post(
        `${this.backendURL}/activeUser/agreeNDA`,
        this.options
      );
      const user = response.data;
      if (!user) {
        return await this.setState({
          error: "The server didn't get any response from the API",
          user: undefined,
          loading: false
        });
      }

      return this.setState({ user });
    } catch (e) {
      console.log(e);
    }
  };
}

export default UserContainer;
