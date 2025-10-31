import { useReactiveVar } from '@apollo/client';
import React, { useRef } from 'react';
import { Card, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import styled from 'styled-components';
import {
  draftExperimentVar,
  groupsVar,
  selectedDomainVar,
  showUnavailableVariablesVar,
  variablesVar,
  visualizationTypeVar,
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetDomainListQuery } from '../API/GraphQL/queries.generated';
import DataSelect from '../UI/DataSelect';
import Loader from '../UI/Loader';
import Modal, { ModalComponentHandle } from '../UI/Modal';
import { uppercase } from '../utils';
import Search from './SearchBox';

const DataSelectionBox = styled(Card.Header)`
  display: flex;
  padding: 0.4em;
  margin-bottom: 4px;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const SearchWrapper = styled.div`
  flex: 1;
  margin: 4px 0;
`;

const VisualizationSelect = styled.div`
  display: flex;
  align-items: center;

  .dropdown-toggle {
    height: calc(
      1.5em + 0.75rem + 2px
    ); /* matches Bootstrap's form-control height */
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    display: flex;
    align-items: center;
  }
`;

const DatasetSelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const DataSelection = ({
  handleChangeDomain,
  handleSelectedDataset,
}: {
  handleChangeDomain?: (domain: string) => void;
  handleSelectedDataset?: (id: string) => void;
}): JSX.Element => {
  const domain = useReactiveVar(selectedDomainVar);
  const modalRef = useRef<ModalComponentHandle>(null);
  const { data, loading } = useGetDomainListQuery();
  const experiment = useReactiveVar(draftExperimentVar);
  const groups = useReactiveVar(groupsVar);
  const variables = useReactiveVar(variablesVar);
  const visualizationType = useReactiveVar(visualizationTypeVar);
  const showUnavailableVariables = useReactiveVar(showUnavailableVariablesVar);

  const handleSelectDataset = (id: string): void => {
    localMutations.toggleDatasetExperiment(id);
    handleSelectedDataset?.(id);
  };

  const showDialogDomainChange = async (id: string): Promise<void> => {
    if (!modalRef.current) return;
    const reply = await modalRef.current.open(
      'Change domain ?',
      'Selecting a new domain will reset your selection'
    );

    if (reply) {
      localMutations.selectDomain(id);
      localMutations.resetSelectedExperiment();
      handleChangeDomain?.(id);
    }
  };

  const domains = data?.domains.filter((d) => !d.longitudinal);
  const longitudinalDomains = data?.domains.filter((d) => !!d.longitudinal);

  return (
    <>
      <Modal ref={modalRef} />
      <DataSelectionBox>
        {loading && <Loader />}
        {!loading && (
          <ControlsContainer>
            {(domains || longitudinalDomains) && (
              <DropdownButton
                size="sm"
                title={uppercase(domain?.label || 'Domains')}
                className="dropdown-domain"
              >
                {domains?.map((d) => (
                  <Dropdown.Item
                    onSelect={(): void => {
                      showDialogDomainChange(d.id);
                    }}
                    key={d.id}
                    value={d.id}
                  >
                    {d.label}
                  </Dropdown.Item>
                ))}
                {longitudinalDomains && longitudinalDomains?.length >= 1 && (
                  <>
                    <Dropdown.Divider />
                    <h6 style={{ paddingLeft: '1em' }}>Longitudinal Domains</h6>
                    {longitudinalDomains.map((d) => (
                      <Dropdown.Item
                        onSelect={(): void => {
                          showDialogDomainChange(d.id);
                        }}
                        key={d.id}
                        value={d.id}
                      >
                        {d.label}
                      </Dropdown.Item>
                    ))}
                  </>
                )}
              </DropdownButton>
            )}

            <DatasetSelectWrapper>
              <DataSelect
                datasets={domain?.datasets ?? []}
                handleSelectDataset={handleSelectDataset}
                selectedDatasets={experiment?.datasets}
                isDropdown
              />
            </DatasetSelectWrapper>

            <SearchWrapper>
              <Search
                handleSelectNode={(id: string): void =>
                  localMutations.setZoomToNode(id)
                }
                variables={variables}
                groups={groups}
              />
            </SearchWrapper>

            <ToggleWrapper>
              <Form.Check
                type="switch"
                id="toggle-unavailable-variables"
                label="Show unavailable variables"
                checked={showUnavailableVariables}
                onChange={(event) =>
                  showUnavailableVariablesVar(event.currentTarget.checked)
                }
              />
            </ToggleWrapper>

            <VisualizationSelect>
              <DropdownButton
                id="dropdown-autoclose-true"
                className="visualization-dropdown"
                size="sm"
                variant="outline-primary"
                title={`Visualization: ${
                  visualizationType === 'circle'
                    ? 'Circle Packing'
                    : 'Dendrogram'
                }`}
              >
                <Dropdown.Item
                  onSelect={() => visualizationTypeVar('circle')}
                  active={visualizationType === 'circle'}
                >
                  Circle Packing
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => visualizationTypeVar('dendrogram')}
                  active={visualizationType === 'dendrogram'}
                >
                  Dendrogram
                </Dropdown.Item>
              </DropdownButton>
            </VisualizationSelect>
          </ControlsContainer>
        )}
      </DataSelectionBox>
    </>
  );
};

export default DataSelection;
