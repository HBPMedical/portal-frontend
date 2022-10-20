import { useReactiveVar } from '@apollo/client';
import React, { useRef } from 'react';
import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
import styled from 'styled-components';
import {
  draftExperimentVar,
  groupsVar,
  selectedDomainVar,
  variablesVar,
} from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetDomainListQuery } from '../API/GraphQL/queries.generated';
import DataSelect from '../UI/DataSelect';
import Loader from '../UI/Loader';
import Modal, { ModalComponentHandle } from '../UI/Modal';
import { uppercase } from '../utils';
import Search from './SearchBox';

const DataSelectionBox = styled(Card.Title)`
  display: flex;
  padding: 0.4em;
  margin-bottom: 4px;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
`;

const DomainSelectBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const DomainsBox = styled.div`
  margin-top: 4px;
  font-size: 14px;
  flex: 0 1 1;
`;

const DatasetsBox = styled.div`
  margin-top: 4px;
  font-size: 14px;
  margin-left: 8px;
  flex: 0 1 1;
`;

const SearchBox = styled.div`
  margin-top: 4px;
  margin-left: 8px;
  flex: 2;
  /* width: 320px; */
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

  return (
    <>
      <Modal ref={modalRef} />
      <DataSelectionBox>
        {loading && <Loader />}
        {!loading && (
          <>
            <DomainSelectBox id="domain-select">
              {data?.domains && data?.domains.length > 1 && (
                <DomainsBox id="pathology-select">
                  <DropdownButton
                    size="sm"
                    variant="light"
                    title={uppercase(domain?.label || 'Domains')}
                  >
                    {data.domains.map((d) => (
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
                  </DropdownButton>
                </DomainsBox>
              )}

              <DatasetsBox id="dataset-select">
                <DataSelect
                  datasets={domain?.datasets ?? []}
                  handleSelectDataset={handleSelectDataset}
                  selectedDatasets={experiment?.datasets}
                  isDropdown
                ></DataSelect>
              </DatasetsBox>
            </DomainSelectBox>
            <SearchBox>
              <Search
                handleSelectNode={(id: string): void =>
                  localMutations.setZoomToNode(id)
                }
                variables={variables}
                groups={groups}
              />
            </SearchBox>
          </>
        )}
      </DataSelectionBox>
    </>
  );
};

export default DataSelection;
