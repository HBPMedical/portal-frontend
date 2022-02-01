import { useReactiveVar } from '@apollo/client';
import React, { useRef } from 'react';
import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
import styled from 'styled-components';
import { draftExperimentVar, selectedDomainVar } from '../API/GraphQL/cache';
import { localMutations } from '../API/GraphQL/operations/mutations';
import { useGetDomainListQuery } from '../API/GraphQL/queries.generated';
import DataSelect from '../UI/DataSelect';
import Loader from '../UI/Loader';
import Modal, { ModalComponentHandle } from '../UI/Modal';
import { HierarchyCircularNode, uppercase } from '../utils';
import Search from './SearchBox';

const DataSelectionBox = styled(Card.Title)`
  display: flex;
  padding: 0.4em;
  margin-bottom: 4px;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
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
  hierarchy,
  handleSelectNode,
  handleSelectedDataset
}: {
  handleChangeDomain?: (domain: string) => void;
  hierarchy: HierarchyCircularNode;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  handleSelectedDataset?: (id: string) => void;
}): JSX.Element => {
  const domain = useReactiveVar(selectedDomainVar);
  const modalRef = useRef<ModalComponentHandle>(null);
  const { data, loading } = useGetDomainListQuery();
  const experiment = useReactiveVar(draftExperimentVar);

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
            <DomainsBox>
              {data?.domains && data?.domains.length > 1 && (
                <DropdownButton
                  size="sm"
                  id="dropdown-pathology"
                  variant="light"
                  title={uppercase(domain?.label || 'Domains')}
                >
                  {data.domains.map(d => (
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
              )}
            </DomainsBox>

            <DatasetsBox>
              <DataSelect
                datasets={domain?.datasets ?? []}
                handleSelectDataset={handleSelectDataset}
                selectedDatasets={experiment?.datasets}
                isDropdown
              ></DataSelect>
            </DatasetsBox>
            <SearchBox>
              <Search
                handleSelectNode={(id: string): void =>
                  localMutations.setZoomToNode(id)
                }
                variables={domain?.variables ?? []}
                groups={domain?.groups ?? []}
              />
            </SearchBox>
          </>
        )}
      </DataSelectionBox>
    </>
  );
};

export default DataSelection;
