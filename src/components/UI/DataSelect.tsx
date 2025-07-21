import React, { useRef } from 'react';
import { Badge, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Dataset } from '../API/GraphQL/types.generated';
import { useOnClickOutside } from '../utils';

const DropDownPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  padding: 8px 0;
  border: 1px solid #dee2e6;
  margin-top: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;

  .dataset {
    user-select: none;
    padding: 4px 12px;
    cursor: pointer;
    &:hover {
      background-color: #f8f9fa;
    }
    label {
      cursor: pointer;
      margin-bottom: 0;
      font-size: 0.875rem;
    }
  }

  .form-check {
    display: flex;
    align-items: center;
    margin: 0;
  }

  .form-check-input {
    margin-top: 0;
    margin-right: 8px;
  }

  hr {
    margin: 4px 0;
  }
`;

const CaretButton = styled(Button)`
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;

  ::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }

  .badge {
    margin-left: 6px;
  }
`;

const Card = styled.div`
  margin-top: 4px;
`;

interface Props {
  datasets: Dataset[];
  handleSelectDataset: (id: string) => void;
  selectedDatasets: string[];
  isDropdown?: boolean;
}

const DataSelect = ({
  datasets,
  handleSelectDataset,
  selectedDatasets,
  isDropdown = false,
}: Props): JSX.Element => {
  const [visible, setVisible] = React.useState(!isDropdown);
  const style = visible ? undefined : { display: 'none' };
  const node = useRef<HTMLDivElement | null>(null);
  const btn = useRef<HTMLDivElement | null>();

  useOnClickOutside(node, (event) => {
    if (visible && event.target !== btn.current) setVisible(false);
  });

  const container = [datasets].map((list, i) => {
    const elements = list.map((item) => (
      <div
        key={item.id}
        className="dataset"
        onClick={(e): void => {
          e.preventDefault();
          e.stopPropagation();
          handleSelectDataset(item.id);
        }}
      >
        <Form.Check
          onClick={(e): void => {
            e.stopPropagation();
            handleSelectDataset(item.id);
          }}
          readOnly={true}
          type="checkbox"
          id={`default-${item.id}`}
          label={item.label}
          checked={selectedDatasets.includes(item.id)}
        />
      </div>
    ));

    return (
      <div key={`list-${i}`}>
        {elements}
        {i !== datasets.length - 1 && <hr />}
      </div>
    );
  });

  return (
    <>
      {isDropdown && (
        <>
          <CaretButton
            ref={btn}
            variant="outline-primary"
            id="dropdown-basic"
            size="sm"
            onClick={(): void => {
              setVisible(!visible);
            }}
          >
            Datasets <Badge variant="info">{selectedDatasets.length}</Badge>
          </CaretButton>
          <DropDownPanel ref={node} style={style}>
            {datasets && container}
          </DropDownPanel>
        </>
      )}
      {!isDropdown && (
        <>
          {datasets && <h4>Datasets</h4>}
          <Card>{container}</Card>
        </>
      )}
    </>
  );
};

export default DataSelect;
