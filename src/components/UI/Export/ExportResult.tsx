import * as hmtlToImage from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsFileCode, BsFillImageFill } from 'react-icons/bs';
import styled from 'styled-components';
import { ResultUnion } from '../../API/GraphQL/types.generated';
import EditChart from './EditChart';

const NeutralContainer = styled.div`
  display: contents;
`;

const ExportContainer = styled.div`
  position: relative;
`;

const ToolBox = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;

  .btn-link {
    padding: 1px 5px;
  }
`;
type Props = {
  result: ResultUnion;
  children: (wrapResult: ResultUnion) => React.ReactNode;
};

const downloadThis = (data: string, filename: string) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.click();
  link.remove();
};

const ExportResult = ({ children, result }: Props): JSX.Element => {
  const childRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<ResultUnion>(result);

  const saveImage = async () => {
    if (!childRef.current) return;

    const child = childRef.current.children[0].children[0] as HTMLElement;
    if (!child) return;

    const img = await hmtlToImage.toPng(child, {
      style: {
        display: 'inline-block'
      }
    });

    downloadThis(img, 'export-result.png');
  };

  const saveRaw = () => {
    if (!result) return;

    const resultData =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(result));

    downloadThis(resultData, 'export-result.json');
  };

  useEffect(() => {
    setChart(result);
  }, [result]);

  return (
    <ExportContainer>
      <NeutralContainer ref={childRef}>{children(chart)}</NeutralContainer>
      <ToolBox className="tool-actions">
        <EditChart
          value={result}
          onChange={val => {
            setChart(val);
          }}
        />
        <Button
          variant="link"
          size="sm"
          onClick={saveImage}
          title="Export result as PNG"
        >
          <BsFillImageFill />
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={saveRaw}
          title="Export result as JSON"
        >
          <BsFileCode />
        </Button>
      </ToolBox>
    </ExportContainer>
  );
};

export default ExportResult;
