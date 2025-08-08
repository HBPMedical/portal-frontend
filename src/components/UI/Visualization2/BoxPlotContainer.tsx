import { Card } from 'react-bootstrap';
import { useReactiveVar } from '@apollo/client';
import { selectedDomainVar } from '../../API/GraphQL/cache';
import { TableResult } from '../../API/GraphQL/types.generated';
import { extractBoxPlotData } from '../../../utils/boxPlotUtils';
import BoxPlot from './BoxPlot';

interface BoxPlotContainerProps {
  tableResults: TableResult[];
}

const BoxPlotContainer = ({ tableResults }: BoxPlotContainerProps) => {
  const domain = useReactiveVar(selectedDomainVar);

  // Extract box plot data from Model table results
  const boxPlotData = extractBoxPlotData(tableResults, domain);

  if (boxPlotData.length === 0) {
    return (
      <Card className="result" style={{ border: 'none' }}>
        <Card.Body>
          <p>
            No box plots available. Box plots are only generated for non-nominal
            variables from the Model table.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="result" style={{ border: 'none' }}>
      <Card.Body>
        <p>
          Distribution of non-nominal variables across datasets based on Model
          table data. Each box shows the median (line), Q1-Q3 range (box), and
          min-max values (whiskers). The red dot indicates the mean.
        </p>

        {boxPlotData.map((data, index) => (
          <BoxPlot
            key={`boxplot-${data.variable}-${index}`}
            data={data}
            title={data.variableLabel}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default BoxPlotContainer;
