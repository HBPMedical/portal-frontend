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
import Search from './D3Search';

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
  zoom,
  handleSelectNode,
  handleChangeDataset
}: {
  handleChangeDomain?: (domain: string) => void;
  hierarchy: HierarchyCircularNode;
  zoom: (circleNode: HierarchyCircularNode) => void;
  handleSelectNode: (node: HierarchyCircularNode) => void;
  handleChangeDataset?: (datasets: string[]) => void;
}): JSX.Element => {
  const domain = useReactiveVar(selectedDomainVar);
  const modalRef = useRef<ModalComponentHandle>(null);
  const { data, loading } = useGetDomainListQuery();
  const draftExp = useReactiveVar(draftExperimentVar);

  const handleSelectDataset = (id: string): void => {
    const index = draftExp?.datasets.indexOf(id);

    if (index === -1) {
      localMutations.updateDraftExperiment({
        datasets: [...draftExp?.datasets, id]
      });
    } else {
      localMutations.updateDraftExperiment({
        datasets: draftExp?.datasets.filter(d => d !== id)
      });
    }

    handleChangeDataset?.(draftExperimentVar().datasets);
  };

  const showDialogDomainChange = async (id: string): Promise<void> => {
    if (!modalRef.current) return;
    const reply = await modalRef.current.open(
      'Change domain ?',
      'Selecting a new domain will reset your selection'
    );

    if (reply) {
      localMutations.selectDomain(id);
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
                  title={uppercase(draftExp?.domain) || 'Domains'}
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
                selectedDatasets={draftExp?.datasets}
                isDropdown
              ></DataSelect>
            </DatasetsBox>
            <SearchBox>
              <Search
                hierarchy={hierarchy}
                zoom={zoom}
                handleSelectNode={handleSelectNode}
              />
            </SearchBox>
          </>
        )}
      </DataSelectionBox>
    </>
  );
};

export default DataSelection;
