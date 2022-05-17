import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BsDownload, BsFileCode } from 'react-icons/bs';
import { FaFilePdf } from 'react-icons/fa';
import { Experiment } from '../../API/GraphQL/types.generated';
import ExperimentPDF, { ChildrenPDFExport } from './ExperimentPDF';

type Props = {
  experiment: Experiment;
};

const ExportExperiment = ({ experiment }: Props) => {
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
      <Dropdown.Toggle variant="info" id="dropdown-basic">
        <BsDownload /> Export
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <ExperimentPDF experiment={experiment} filename={`${filename}.pdf`}>
          {({ downloadPDF, isLoading }: ChildrenPDFExport) => (
            <Dropdown.Item href="#/action-2" onClick={downloadPDF}>
              <FaFilePdf /> {isLoading ? 'Generating...' : 'PDF'}
            </Dropdown.Item>
          )}
        </ExperimentPDF>
        <Dropdown.Item href="#/action-2" onClick={exportJSON}>
          <BsFileCode /> Raw (JSON)
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportExperiment;
