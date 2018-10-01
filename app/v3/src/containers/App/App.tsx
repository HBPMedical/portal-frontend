// import "./Bootstrap-custom.css"
// tslint:disable:no-console

import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, Subscribe } from "unstated";
import UNSTATED from "unstated-debug";
import {
  ExperimentContainer,
  ExperimentListContainer,
  Explore,
  ModelContainer
} from "../";
import { Experiment, Experiments, Navigation } from "../../components";
import config from "../../config";

import "./App.css";

UNSTATED.logStateChanges = process.env.NODE_ENV === "development";

class App extends React.Component {
  private experimentContainer = new ExperimentContainer(config);
  private experimentListContainer = new ExperimentListContainer(config);
  private modelContainer = new ModelContainer(config);

  // private intervalId: NodeJS.Timer;

  // public componentWillMount() {
  //   this.intervalId = setInterval(
  //     () => this.experimentListContainer.load(),
  //     10 * 1000
  //   );
  // }

  // public componentWillUnmount() {
  //   clearInterval(this.intervalId);
  // }

  public render() {
    return (
      <Router>
        <Provider
          inject={[
            this.experimentContainer,
            this.experimentListContainer,
            this.modelContainer
          ]}
        >
          <Subscribe
            to={[ExperimentContainer, ExperimentListContainer, ModelContainer]}
          >
            {(
              experimentContainer: ExperimentContainer,
              experimentListContainer: ExperimentListContainer,
              modelContainer: ModelContainer
            ) => (
              <div className="App">
                <header>
                  <Navigation
                    experimentContainer={experimentContainer}
                    experimentListContainer={experimentListContainer}
                    modelContainer={modelContainer}
                  />
                </header>
                <section>
                  <Route
                    path="/v3/experiments"
                    // tslint:disable-next-line jsx-no-lambda
                    render={() => (
                      <Experiments
                        experimentListContainer={experimentListContainer}
                      />
                    )}
                  />

                  <Route
                    path="/v3/experiment/:slug/:uuid"
                    // tslint:disable-next-line jsx-no-lambda
                    render={() => (
                      <Experiment
                        experimentContainer={experimentContainer}
                        experimentListContainer={experimentListContainer}
                        modelContainer={modelContainer}
                      />
                    )}
                  />
                </section>
              </div>
            )}
          </Subscribe>
        </Provider>
      </Router>
    );
  }
}

export default App;
