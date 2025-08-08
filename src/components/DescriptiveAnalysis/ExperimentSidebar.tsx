import React from 'react';
import { Card } from 'react-bootstrap';
import { Domain, Experiment } from '../API/GraphQL/types.generated';
import DropdownExperimentList from '../UI/Experiment/DropDownList/DropdownExperimentList';
import LargeDatasetSelect from '../UI/LargeDatasetSelect';
import Model from '../UI/Model';

interface Props {
  domain?: Domain;
  selectedExperiment: Experiment | undefined;
  draftExperiment: Experiment;
  handleSelectDataset: (id: string) => void;
  handleSelectExperiment?: (id?: string) => void;
}

const ExperimentSidebar = ({
  domain,
  selectedExperiment,
  draftExperiment,
  handleSelectDataset,
  handleSelectExperiment,
}: Props): JSX.Element => {
  return (
    <Card className="experiment-sidebar">
      <Card.Body>
        <h2>Parameters</h2>
        <div style={{ fontSize: '0.85rem' }}>
          <DropdownExperimentList
            hasDetailedView={false}
            handleExperimentChanged={(id) => {
              handleSelectExperiment?.(id);
            }}
            label={
              selectedExperiment
                ? `from ${selectedExperiment.name}`
                : 'Select from a previous experiment'
            }
          />
        </div>
        {domain && (
          <section>
            <h3>Domain</h3>
            <p>{domain.label ?? domain.id}</p>
          </section>
        )}
        {draftExperiment && (
          <section>
            <LargeDatasetSelect
              datasets={domain?.datasets}
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
