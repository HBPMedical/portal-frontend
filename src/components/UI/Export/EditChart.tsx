import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { ResultUnion } from '../../API/GraphQL/types.generated';
import ModalComponent, { ModalComponentHandle } from '../Modal';

type Props = {
  value: ResultUnion;
  onChange: (value: any) => void;
};

const EditChart = ({ value, onChange }: Props): JSX.Element => {
  const internalClonedValue = JSON.parse(JSON.stringify(value)) as ResultUnion;
  const modalRef = useRef<ModalComponentHandle>(null);
  const isRawdata = value.__typename === 'RawResult';
  const [internalVal, setInternalVal] = useState<any>(internalClonedValue);
  const editData = {
    xAxis: internalVal?.rawdata?.data?.xAxis ?? internalVal.xAxis,
    yAxis: internalVal?.rawdata?.data?.yAxis ?? internalVal.yAxis
  };
  if (editData.xAxis) {
    editData.xAxis.__typename = undefined;
  }

  if (editData.yAxis) {
    editData.yAxis.__typename = undefined;
  }

  const hasData: boolean = editData.xAxis || editData.yAxis;
  const [hasChanged, setChanged] = useState<boolean | undefined>(undefined);

  const handleModal = async (): Promise<void> => {
    if (!modalRef.current) return;

    const reply = await modalRef.current.open('Edit axis');

    if (reply) {
      setChanged(true);
    }
  };

  const handleChange = (val: any) => {
    let data: any;
    if (isRawdata) {
      data = { ...internalVal };
      data.rawdata.data = { ...data.rawdata.data, ...val };
    } else {
      data = { ...internalVal, ...val };
    }

    setInternalVal(data);
  };

  useEffect(() => {
    if (hasChanged) {
      setChanged(false);
      onChange(internalVal);
    }
  }, [hasChanged, internalVal, onChange]);

  useEffect(() => {
    setInternalVal(JSON.parse(JSON.stringify(value)));
  }, [value]);

  if (!hasData) return <></>;

  return (
    <>
      <ModalComponent ref={modalRef}>
        <Editor
          name="Axis"
          statusBar={false}
          onChange={handleChange}
          value={editData}
          history={true}
          search={false}
          mode="form"
        />
      </ModalComponent>
      <Button variant="link" size="sm" onClick={handleModal} title="Edit axis">
        <FaEdit />
      </Button>
    </>
  );
};

export default EditChart;
