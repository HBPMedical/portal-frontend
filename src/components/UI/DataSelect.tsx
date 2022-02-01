import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Dataset } from '../API/GraphQL/types.generated';
import { useOnClickOutside } from '../utils';

const DropDownPanel = styled.div`
  position: absolute;
  width: 320px;
  background-color: white;
  padding: 16px;
  border: 1px lightblue solid;
  margin: 2px 0;
  border-radius: 4px;

  label {
    margin-right: 8px;
    font-size: 1em;
  }

  .checkbox {
    position: absolute;
    margin-top: 4px;
    margin-left: -8px;
  }

  h6 {
    font-size: 0.9em;
    margin-bottom: 4px;
  }

  hr {
    margin: 8px 0 4px 0;
  }

  p {
    margin-bottom: 0;
  }
`;

const CaretButton = styled(Button)`
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
`;

const Card = styled.div`
  margin-top: 4px;

  label {
    margin-right: 8px;
  }

  .checkbox {
    position: absolute;
    margin-top: 4px;
    margin-left: -8px;
  }

  span {
    display: block;
  }

  h6 {
    font-size: 0.9em;
    margin-bottom: 4px;
  }

  hr {
    margin: 4px;
  }

  p {
    margin: 6px 0;
  }
`;
interface Props {
  datasets: Dataset[];
  handleSelectDataset: (id: string) => void;
  selectedDatasets: string[];
  isDropdown?: boolean;
}

export default ({
  datasets,
  handleSelectDataset,
  selectedDatasets,
  isDropdown = false
}: Props): JSX.Element => {
  const [visible, setVisible] = React.useState(!isDropdown);
  const style = visible ? undefined : { display: 'none' };
  const node = useRef<HTMLDivElement | null>(null);
  const btn = useRef<HTMLDivElement | null>();

  useOnClickOutside(node, event => {
    if (visible && event.target !== btn.current) setVisible(false);
  });

  const ndatasets = datasets.filter(d => !d.isLongitudinal) ?? [];
  const ldatasets = datasets.filter(d => !!d.isLongitudinal) ?? [];

  const grpDatasets =
    ldatasets.length > 0 ? [ndatasets, ldatasets] : [ndatasets];

  const container = grpDatasets.map((list, i) => {
    const elements = list.map(item => (
      <span key={item.id}>
        <Form.Check
          key={item.id}
          inline={true}
          type="checkbox"
          id={`default-${item.id}`}
          label={item.label}
          onChange={(): void => {
            handleSelectDataset(item.id);
          }}
          checked={selectedDatasets.includes(item.id)}
        ></Form.Check>
      </span>
    ));

    return (
      <div key={`list-${i}`}>
        {elements}
        {i !== grpDatasets.length - 1 && <hr />}
      </div>
    );
  });

  return (
    <>
      {isDropdown && (
        <>
          <CaretButton
            ref={btn}
            variant="light"
            id="dropdown-basic"
            size="sm"
            onClick={(): void => {
              setVisible(!visible);
            }}
          >
            Datasets
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
