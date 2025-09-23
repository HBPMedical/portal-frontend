import { Card, Tab, Tabs } from 'react-bootstrap';
import { useReactiveVar } from '@apollo/client';
import {
  GroupResult,
  GroupsResult,
  ResultUnion,
  TableResult,
} from '../../API/GraphQL/types.generated';
import { selectedDomainVar } from '../../API/GraphQL/cache';
import ResultDispatcher from '../../ExperimentResult/ResultDispatcher';
import Error from '../Error';
import Loader from '../Loader';
import BoxPlotContainer from './BoxPlotContainer';
import {
  isDescriptiveStatisticsTable,
  hasNonNominalVariables,
  extractTableResultsFromGroup,
} from '../../../utils/boxPlotUtils';

interface Props {
  result: GroupsResult;
  loading: boolean;
  error?: Error;
}

const DescriptiveStatistics = ({
  result,
  loading,
  error,
}: Props): JSX.Element => {
  const domain = useReactiveVar(selectedDomainVar);

  // Extract only Model table results for box plots
  const modelTableResults = extractTableResultsFromGroup(
    result.groups,
    'Model'
  );
  // Check if we have descriptive statistics tables in Model group
  const hasDescriptiveStats = modelTableResults.length > 0;

  // Check if we have non-nominal variables for box plots
  const hasNonNominalVariablesResult = hasNonNominalVariables(
    modelTableResults,
    domain
  );

  const hasBoxPlots = hasDescriptiveStats && hasNonNominalVariablesResult;

  return (
    <Card className="result">
      <Card.Body>
        {loading && <Loader />}
        {error && <Error message={error.message} />}
        <Tabs defaultActiveKey={0} id="uncontrolled-mining-tab">
          {result.groups?.map((group: GroupResult, i: number) => {
            return (
              <Tab key={i} eventKey={`${i}`} title={group.name}>
                {group.description && <p>{group.description}</p>}
                {group.results?.map((res: ResultUnion, j: number) => {
                  return <ResultDispatcher result={res} key={j} />;
                })}
              </Tab>
            );
          })}

          {/* Add Box Plots tab if we have descriptive statistics with non-nominal variables */}
          {hasBoxPlots && (
            <Tab key="boxplots" eventKey="boxplots" title="Box Plots">
              <BoxPlotContainer tableResults={modelTableResults} />
            </Tab>
          )}
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default DescriptiveStatistics;
