import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import * as hmtlToImage from 'html-to-image';

type Props = {
  children: JSX.Element;
};

const ExportResult = ({ children }: Props): JSX.Element => {
  const childRef = useRef<HTMLDivElement>(null);

  const saveImage = async () => {
    if (!childRef.current) return;
    const img = await hmtlToImage.toPng(childRef.current, {
      pixelRatio: 2
    });

    //Todo console.log(img);
  };

  return (
    <div>
      <Button onClick={saveImage}>test</Button>
      <div ref={childRef}>{children}</div>;
    </div>
  );
};

export default ExportResult;
