import * as hmtlToImage from 'html-to-image';
import { ReactNode, useEffect, useRef, useState } from 'react';
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

type ContainerProps = {
  hasExport: boolean;
};

const ContainerResult = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: ${(p) => (p.hasExport ? '20px' : '0')};
`;

type Props = {
  result: ResultUnion;
  allowExport?: boolean;
  children: (wrapResult: ResultUnion, type: string) => ReactNode;
};

const downloadThis = (data: string, filename: string) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.click();
  link.remove();
};

const exceptList = ['groupsresult', 'alertresult'];

const ExportResult = ({
  children,
  result,
  allowExport = true,
}: Props): JSX.Element => {
  const childRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<ResultUnion>(result);
  const [type, setType] = useState<string>(
    (result.__typename ?? 'error').toLowerCase()
  );

  useEffect(() => {
    setChart(result);
    setType((result.__typename ?? 'error').toLowerCase());
  }, [result]);

  if (!allowExport || exceptList.includes(type)) {
    return <NeutralContainer>{children(chart, type)}</NeutralContainer>;
  }

  const saveImage = async () => {
    if (!childRef.current) return;

    const child = childRef.current.children[0] as HTMLElement;
    if (!child) return;

    const img = await hmtlToImage.toPng(child, {
      style: {
        display: 'inline-block',
        backgroundColor: 'white',
      },
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

  return (
    <ExportContainer>
      <ContainerResult
        ref={childRef}
        className="exp-result"
        data-export={type === 'tableresult' ? 'container' : 'inplace'}
        hasExport={allowExport}
      >
        {children(chart, type)}
      </ContainerResult>
      <ToolBox className="tool-actions">
        <EditChart
          value={result}
          onChange={(val) => {
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
