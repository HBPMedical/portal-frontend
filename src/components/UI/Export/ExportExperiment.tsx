import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BsDownload, BsFileCode } from 'react-icons/bs';
import { FaFilePdf } from 'react-icons/fa';
import { Experiment } from '../../API/GraphQL/types.generated';
import ExperimentPDF, { ChildrenPDFExport } from './ExperimentPDF';

type Props = {
  experiment: Experiment;
  allowJSON?: boolean;
};

const ExportExperiment = ({ experiment, allowJSON = true }: Props) => {
  const filename = `MIP-export-${new Date().toJSON().slice(0, 10)}`;
  const exportJSON = () => {
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(experiment)
    )}`;

    const link = document.createElement('a');
    link.href = data;
    link.download = `${filename}.json`;
    link.click();
    link.remove();
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="info" id="btn-experiment-export">
        <BsDownload /> Export
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <ExperimentPDF experiment={experiment} filename={`${filename}.pdf`}>
          {({ downloadPDF, isLoading }: ChildrenPDFExport) => (
            <Dropdown.Item onClick={downloadPDF}>
              <FaFilePdf /> {isLoading ? 'Generating...' : 'PDF'}
            </Dropdown.Item>
          )}
        </ExperimentPDF>
        {allowJSON && (
          <Dropdown.Item onClick={exportJSON}>
            <BsFileCode /> Raw (JSON)
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportExperiment;
