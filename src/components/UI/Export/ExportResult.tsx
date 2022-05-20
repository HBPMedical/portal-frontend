import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import * as hmtlToImage from 'html-to-image';
import styled from 'styled-components';
import { BsFileCode, BsFillImageFill } from 'react-icons/bs';
import { ResultUnion } from '../../API/GraphQL/types.generated';

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
`;
type Props = {
  result: ResultUnion;
  children: (wrapResult: ResultUnion) => React.ReactNode;
};

const downloadThat = (data: string, filename: string) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.click();
  link.remove();
};

const ExportResult = ({ children, result }: Props): JSX.Element => {
  const childRef = useRef<HTMLDivElement>(null);

  const saveImage = async () => {
    if (!childRef.current) return;

    const child = childRef.current.children[0].children[0] as HTMLElement;
    if (!child) return;

    const img = await hmtlToImage.toPng(child, {
      style: {
        display: 'inline-block'
      }
    });

    downloadThat(img, 'export-result.png');
  };

  const saveRaw = () => {
    if (!result) return;

    const resultData =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(result));

    downloadThat(resultData, 'export-result.json');
  };

  return (
    <ExportContainer>
      <NeutralContainer ref={childRef}>{children(result)}</NeutralContainer>
      <ToolBox className="tool-actions">
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
