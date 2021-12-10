import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { Card } from 'react-bootstrap';
import { APICore, APIExperiment, APIModel } from '../API';
import { VariableEntity } from '../API/Core';
import { selectedExperimentVar } from '../API/GraphQL/cache';
import { ModelResponse } from '../API/Model';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';

interface Props {
  apiModel: APIModel;
  apiCore: APICore;
  apiExperiment: APIExperiment;
  model?: ModelResponse;
  datasets: VariableEntity[];
}

const ExperimentSidebar = ({
  apiModel,
  apiCore,
  model,
  datasets
}: Props): JSX.Element => {
  const selectedExperiment = useReactiveVar(selectedExperimentVar);

  return (
    <Card className="datasets">
      <Card.Body>
        <section>
          <DropdownExperimentList
            hasDetailedView={false}
            label={
              selectedExperiment
                ? `from ${selectedExperiment.name}`
                : 'Select Parameters'
            }
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
  );
};

export default ExperimentSidebar;
