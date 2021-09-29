import React from 'react';
import { Card } from 'react-bootstrap';
import { APICore, APIExperiment, APIModel } from '../API';
import DropdownParametersExperimentList from '../UI/DropdownParametersExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import { Exareme } from '../API/Exareme';
import Model from '../UI/Model';
import { IExperiment } from '../API/Experiment';
import { VariableEntity } from '../API/Core';
import { ModelResponse } from '../API/Model'

interface Props {
  apiModel: APIModel;
  apiCore: APICore;
  apiExperiment: APIExperiment;
  model?: ModelResponse;
  datasets: VariableEntity[];
}

const ExperimentSidebar = ({
  apiExperiment,
  apiModel,
  apiCore,
  model,
  datasets
}: Props) =>
  <Card className="datasets">
    <Card.Body>
      <section>
        <DropdownParametersExperimentList
          apiExperiment={apiExperiment}
          handleSelectExperiment={(experiment?: IExperiment): void => {
            apiExperiment.setExperiment(experiment);
            Exareme.handleSelectExperimentToModel(apiModel, experiment);
          }}
        />
      </section>
      {model?.query?.pathology && (
        <section>
          <h4>Pathology</h4>
          <p>{model?.query?.pathology}</p>
        </section>
      )}
      {model?.query?.trainingDatasets && (
        <section>
          <LargeDatasetSelect
            datasets={datasets}
            handleSelectDataset={apiModel.selectDataset}
            selectedDatasets={model?.query?.trainingDatasets || []}
          ></LargeDatasetSelect>
        </section>
      )}
      <section>
        <Model model={model} lookup={apiCore.lookup} />
      </section>
    </Card.Body>
  </Card>

export default ExperimentSidebar