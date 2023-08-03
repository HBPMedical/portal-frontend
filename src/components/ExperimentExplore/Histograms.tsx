import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import { draftExperimentVar } from '../API/GraphQL/cache';
import { useCreateExperimentMutation } from '../API/GraphQL/queries.generated';
import {
  AlgorithmParamInput,
  Domain,
  ResultUnion,
  Variable,
} from '../API/GraphQL/types.generated';
import { HISTOGRAMS_STORAGE_KEY } from '../constants';
import ResultDispatcher from '../ExperimentResult/ResultDispatcher';
import DropdownVariableList from '../UI/DropdownVariableList';
import Loading from '../UI/Loader';
import { HierarchyCircularNode } from '../utils';

const breadcrumb = (
  variable: HierarchyCircularNode,
  paths: HierarchyCircularNode[] = []
): HierarchyCircularNode[] =>
  variable && variable.parent
    ? breadcrumb(variable.parent, [...paths, variable])
    : [...paths, variable];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const overviewChart = (node: HierarchyCircularNode): any => {
  let children = node
    .descendants()
    .filter((d) => d.parent === node && !d.data.isVariable);

  children = children.length ? children : [node];

  return {
    name: `Groups contained in ${node.data.label}`,
    xAxis: {
      label: '',
      categories: children.map((d) => d.data.label),
      __typename: 'ChartAxis',
    },
    yAxis: {
      label: 'Count',
      __typename: 'ChartAxis',
    },
    barValues: children.map((c) => c.descendants().length - 1),
    barEnumValues: null,
    hasConnectedBars: false,
    __typename: 'BarChartResult',
  };
};

const Histogram = styled.div`
  margin-top: 8px;
  min-height: 450px;

  .card-header-tabs > a {
    font-size: 0.8rem;
    margin: 0 0.5em;
    text-decoration: none !important;
  }

  .card-header-tabs > a:hover,
  .card-header-tabs .dropdown-menu a:active {
    text-decoration: none !important;
  }

  .card-header-tabs .dropdown-toggle {
    font-size: 0.8rem;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .card-header-tabs .dropdown-toggle:active {
    color: black !important;
    background-color: white !important;
    border-color: white !important;
    box-shadow: none !important;
  }

  .nav-tabs {
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 8px;
    margin: 0 0.5em;

    & .nav-item .dropdown-menu {
      text-decoration: none;
      & .dropdown-item {
        padding: 2px 5px;
        font-size: 0.8rem;
      }
    }
  }

  .dropdown-menu {
    padding: 1em;
  }
`;

const Overview = styled.div`
  p {
    display: inline;
    margin: 0;
    font-size: 0.9em;
  }
`;

const Breadcrumb = styled.span`
  p:after {
    content: ' > ';
  }
  p:last-child {
    font-weight: bold;
  }
  p:last-child:after {
    content: '';
  }
  p {
    color: #007ad9;
    display: inline;
    cursor: pointer;
  }
  p:hover {
    text-decoration: underline;
    color: #0056b3;
  }
`;

const Title = styled.p`
  font-weight: bold;
  display: inline;
`;

export interface HistogramVariable {
  [key: number]: Variable;
}
interface Props {
  selectedNode?: HierarchyCircularNode;
  independantsVariables: Variable[] | undefined;
  zoom: (node: HierarchyCircularNode) => void;
  domain?: Domain;
}

const Histograms = ({
  independantsVariables,
  selectedNode,
  zoom,
  domain,
}: Props): JSX.Element => {
  const keyStorage = domain
    ? `${HISTOGRAMS_STORAGE_KEY}_${domain?.id}`
    : undefined;

  const [groupByVariables, setGroupByVariables] = useState<
    HistogramVariable | undefined
  >();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isShowingTab, setIsShowingTab] = useState(false);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const nodes = selectedNode ? breadcrumb(selectedNode).reverse() : [];

  const [getHistograms, { data, loading }] = useCreateExperimentMutation();

  useEffect(() => {
    if (selectedNode && !selectedNode.children && domain) {
      const params: AlgorithmParamInput[] = [];

      const variable = domain.variables.find(
        (v) => v.id === selectedNode.data.id
      );
      const groupBy = Object.values(groupByVariables ?? {})
        .filter((v) => !variable || v.id !== variable.id)
        .map((v) => v.id);

      if (groupBy && groupBy.length > 0) {
        params.push({
          id: 'x',
          value: groupBy.join(','),
        });
      }

      if (variable && variable.type !== 'nominal') {
        params.push({
          id: 'bins',
          value: '20',
        });
      }

      getHistograms({
        variables: {
          isTransient: true,
          data: {
            name: 'Histograms',
            variables: [selectedNode?.data.id ?? ''],
            domain: draftExperiment.domain,
            datasets: draftExperiment.datasets,
            algorithm: {
              type: 'string',
              id: 'MULTIPLE_HISTOGRAMS',
              parameters: params,
            },
          },
        },
      });
    }
  }, [
    groupByVariables,
    domain,
    draftExperiment.datasets,
    draftExperiment.domain,
    getHistograms,
    selectedNode,
  ]);

  useEffect(() => {
    const saved = keyStorage ? localStorage.getItem(keyStorage) : undefined;
    const groupBy = saved ? JSON.parse(saved) : {};
    setGroupByVariables(groupBy);
  }, [keyStorage, setGroupByVariables]);

  const handleChooseVariable = (index: number, variable?: Variable): void => {
    const nextChoosenVariables = groupByVariables
      ? { ...groupByVariables, [index]: variable }
      : { [index]: variable };

    if (!variable) delete nextChoosenVariables[index];
    setGroupByVariables(nextChoosenVariables as HistogramVariable);

    if (keyStorage)
      localStorage.setItem(keyStorage, JSON.stringify(nextChoosenVariables));
  };

  return (
    <>
      {selectedNode && (
        <Overview>
          <div>
            <Title>Path</Title>:{' '}
            <Breadcrumb>
              {' '}
              {nodes &&
                nodes.length > 0 &&
                nodes.map((n) => (
                  <p onClick={(): void => zoom(n)} key={n.data.id}>
                    {n.data.label ?? n.data.id}
                  </p>
                ))}{' '}
            </Breadcrumb>
          </div>
          <div>
            <Title>Description</Title>:{' '}
            <p>{selectedNode.data.description || '-'}</p>
          </div>
        </Overview>
      )}

      <Histogram>
        {selectedNode && selectedNode.children && (
          <ResultDispatcher
            result={overviewChart(selectedNode) as ResultUnion}
            constraint={false}
          />
        )}

        {selectedNode && !selectedNode.children && (
          <Tabs
            defaultActiveKey={0}
            onSelect={(index): void => {
              if (index) {
                setSelectedTab(Number.parseInt(index));
              }
            }}
            id="uncontrolled-histogram-tabs"
          >
            <Tab
              eventKey="0"
              title={
                (loading && <Loading />) ||
                `${selectedNode && selectedNode.data.label}`
              }
              key="0"
            >
              {!isShowingTab &&
                data &&
                data.createExperiment &&
                data.createExperiment.results &&
                data.createExperiment.results.length > 0 && (
                  <ResultDispatcher
                    result={data.createExperiment.results[0] as ResultUnion}
                    constraint={false}
                  />
                )}
            </Tab>
            {independantsVariables &&
              independantsVariables.length > 0 &&
              [1, 2, 3].map((i) => (
                <Tab
                  eventKey={`${i}`}
                  title={
                    i === selectedTab ||
                    !(groupByVariables && groupByVariables[i]) ? (
                      <DropdownVariableList
                        id={`independant-dropdown-${i}`}
                        title={
                          (groupByVariables &&
                            groupByVariables[i] &&
                            groupByVariables[i]?.label) ||
                          'Choose'
                        }
                        isTabOpen={isShowingTab}
                        variables={independantsVariables}
                        handleChooseVariable={(v) => handleChooseVariable(i, v)}
                        onToggle={(isOpen): void => {
                          setIsShowingTab(isOpen);
                          console.log(isOpen);
                        }}
                      />
                    ) : (
                      (groupByVariables &&
                        groupByVariables[i] &&
                        groupByVariables[i]?.label) ||
                      'Choose'
                    )
                  }
                  key={i}
                >
                  {!isShowingTab &&
                    data &&
                    data.createExperiment &&
                    data.createExperiment.results &&
                    data.createExperiment.results?.length > i && (
                      <ResultDispatcher
                        key={i}
                        result={data.createExperiment.results[i] as ResultUnion}
                        constraint={false}
                      />
                    )}
                </Tab>
              ))}
          </Tabs>
        )}
      </Histogram>
    </>
  );
};

export default Histograms;
