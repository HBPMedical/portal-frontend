import React from 'react';
import { Card } from 'react-bootstrap';
import { Domain, Experiment } from '../API/GraphQL/types.generated';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';

interface Props {
  domain: Domain;
  selectedExperiment: Experiment | undefined;
  draftExperiment: Experiment;
  handleSelectDataset: (id: string) => void;
}

const ExperimentSidebar = ({
  domain,
  selectedExperiment,
  draftExperiment,
  handleSelectDataset
}: Props): JSX.Element => {
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
        {domain && (
          <section>
            <h4>{domain.label ?? domain.id}</h4>
          </section>
        )}
        {draftExperiment && (
          <section>
            <LargeDatasetSelect
              datasets={domain.datasets}
              selectedDatasets={draftExperiment.datasets}
              handleSelectDataset={handleSelectDataset}
            />
          </section>
        )}
        <section>
          {domain && <Model experiment={draftExperiment} domain={domain} />}
        </section>
      </Card.Body>
    </Card>
  );
};

export default ExperimentSidebar;
