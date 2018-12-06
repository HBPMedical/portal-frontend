import { MIP } from "@app/types";
import * as dotenv from "dotenv";
import request from "request-promise-native";
import { Container } from "unstated";
import ParseExperiment from "./ParseExperiment";

dotenv.config();

interface IUUID {
  uuid: string;
}

class Experiment extends Container<MIP.Store.IExperimentState> {
  public state: MIP.Store.IExperimentState = {
    error: undefined,
    experiment: undefined,
    experiments: undefined
  };

  public loaded =
    this.state.experiment !== undefined &&
    this.state.experiment.results !== undefined &&
    this.state.experiment.error !== undefined;

  private options: request.Options;
  private baseUrl: string;

  constructor(config: any) {
    super();
    this.options = config.options;
    this.baseUrl = `${config.baseUrl}/experiments`;
  }

  public one = async ({ uuid }: IUUID) => {
    try {
      const data = await request.get(`${this.baseUrl}/${uuid}`, this.options);
      const json = await JSON.parse(data);
      if (json.error) {
        return await this.setState({
          error: json.error
        });
      }
      const experiment = ParseExperiment.parse(json);
      return await this.setState({
        error: undefined,
        experiment
      });
    } catch (error) {
      return await this.setState({
        error: error.message
      });
    }
  };

  public all = async () => {
    try {
      const data = await request.get(`${this.baseUrl}?mine=true`, this.options);
      const json = await JSON.parse(data);
      if (json.error) {
        return await this.setState({
          error: json.error
        });
      }

      return await this.setState({
        error: undefined,
        experiments: json.map((j: MIP.API.IExperimentResult) =>
          ParseExperiment.parse(j)
        )
      });
    } catch (error) {
      return await this.setState({
        error: error.message
      });
    }
  };

  public create = async ({
    experiment
  }: {
    experiment: MIP.API.IExperimentParameters;
  }) => {
    try {
      const data = await request({
        body: JSON.stringify(experiment),
        headers: {
          ...this.options.headers,
          "Content-Type": "application/json"
        },
        method: "POST",
        uri: `${this.baseUrl}`
      });
      const json = await JSON.parse(data);
      const result = ParseExperiment.parse(json);
      return await this.setState({
        error: undefined,
        experiment: result
      });
    } catch (error) {
      return await this.setState({
        error: error.message
      });
    }
  };

  public markAsViewed = async ({ uuid }: IUUID) =>
    this.markExperiment(uuid, "markAsViewed");

  public markAsShared = async ({ uuid }: IUUID) =>
    this.markExperiment(uuid, "markAsShared");

  public markAsUnshared = async ({ uuid }: IUUID) =>
    this.markExperiment(uuid, "markAsUnshared");

  private markExperiment = async (uuid: string, action: string) => {
    try {
      const data = await request.get(
        `${this.baseUrl}/${uuid}/${action}`,
        this.options
      );
      const json = await JSON.parse(data);
      if (json.error) {
        return await this.setState({
          error: json.error
        });
      }
      const experiment = ParseExperiment.parse(json);
      return await this.setState({
        error: undefined,
        experiment
      });
    } catch (error) {
      console.log({ error });
      return await this.setState({
        error: error.message
      });
    }
  };
}

export default Experiment;
