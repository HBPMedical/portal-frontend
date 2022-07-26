import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Tab, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import { draftExperimentVar } from '../API/GraphQL/cache';
import { useCreateExperimentMutation } from '../API/GraphQL/queries.generated';
import {
  AlgorithmParamInput,
  Domain,
  ResultUnion,
  Variable
} from '../API/GraphQL/types.generated';
import { HISTOGRAMS_STORAGE_KEY } from '../constants';
import ResultDispatcher from '../ExperimentResult/ResultDispatcher';
import Loading from '../UI/Loader';
import Highchart from '../UI/Visualization/Highchart';
import { HierarchyCircularNode } from '../utils';

const breadcrumb = (
  variable: HierarchyCircularNode,
  paths: HierarchyCircularNode[] = []
): HierarchyCircularNode[] =>
  variable && variable.parent
    ? breadcrumb(variable.parent, [...paths, variable])
    : [...paths, variable];

const overviewChart = (node: HierarchyCircularNode): any => {
  let children = node
    .descendants()
    .filter(d => d.parent === node && !d.data.isVariable);

  children = children.length ? children : [node];
  return {
    chart: {
      type: 'column'
    },
    legend: {
      enabled: false
    },
    series: [
      {
        data: children.map(c => c.descendants().length - 1),
        dataLabels: {
          enabled: true
        }
      }
    ],
    title: {
      text: `Variables contained in ${node.data.label}`
    },
    tooltip: {
      enabled: false
    },
    xAxis: {
      categories: children.map(d => d.data.label)
    },
    yAxis: {
      allowDecimals: false
    }
  };
};

const Histogram = styled.div`
  min-height: 440px;
  margin-top: 8px;

  .card-header-tabs a {
    font-size: 0.8rem;
    margin: 0 0.5em;
    text-decoration: none !important;
  }

  .card-header-tabs a:hover,
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

const DropDown = styled(DropdownButton)`
  margin: 0;
  padding: 0;
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
  zoom: Function;
  domain?: Domain;
}

export default ({
  independantsVariables,
  selectedNode,
  zoom,
  domain
}: Props): JSX.Element => {
  const keyStorage = domain
    ? `${HISTOGRAMS_STORAGE_KEY}_${domain?.id}`
    : undefined;
  const [choosenVariables, setChoosenVariables] = useState<
    HistogramVariable | undefined
  >(() => {
    const saved = keyStorage ? localStorage.getItem(keyStorage) : undefined;
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const draftExperiment = useReactiveVar(draftExperimentVar);
  const nodes = selectedNode ? breadcrumb(selectedNode).reverse() : [];

  const [getHistrograms, { data, loading }] = useCreateExperimentMutation();

  useEffect(() => {
    if (selectedNode && !selectedNode.children && domain) {
      const params: AlgorithmParamInput[] = [];

      const variable = domain.variables.find(
        v => v.id === selectedNode.data.id
      );
      const groupBy = Object.values(choosenVariables ?? {})
        .filter(v => !variable || v.id !== variable.id)
        .map(v => v.id);

      if (groupBy && groupBy.length > 0) {
        params.push({
          id: 'x',
          value: groupBy.join(',')
        });
      }

      if (variable && variable.type !== 'nominal') {
        params.push({
          id: 'bins',
          value: JSON.stringify({ [variable.id]: 20 })
        });
      }

      getHistrograms({
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
              parameters: params
            }
          }
        }
      });
    }
  }, [
    choosenVariables,
    domain,
    draftExperiment.datasets,
    draftExperiment.domain,
    getHistrograms,
    selectedNode
  ]);

  const handleChooseVariable = (index: number, variable: Variable): void => {
    if (!variable) return;

    const nextChoosenVariables = choosenVariables
      ? { ...choosenVariables, [index]: variable }
      : { [index]: variable };
    setChoosenVariables(nextChoosenVariables);
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
                nodes.map(n => (
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
          <Highchart options={overviewChart(selectedNode)} />
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
              {data &&
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
              [1, 2, 3].map(i => (
                <Tab
                  eventKey={`${i}`}
                  title={
                    i === selectedTab ||
                    !(choosenVariables && choosenVariables[i]) ? (
                      <DropDown
                        variant="link"
                        id={`independant-dropdown-${i}`}
                        title={
                          (choosenVariables &&
                            choosenVariables[i] &&
                            choosenVariables[i].label) ||
                          'Choose'
                        }
                      >
                        {independantsVariables &&
                          independantsVariables.map(v => (
                            <Dropdown.Item
                              as={Button}
                              key={v.id}
                              onSelect={(): void => handleChooseVariable(i, v)}
                            >
                              {v.label}
                            </Dropdown.Item>
                          ))}
                      </DropDown>
                    ) : (
                      (choosenVariables &&
                        choosenVariables[i] &&
                        choosenVariables[i].label) ||
                      'Choose'
                    )
                  }
                  key={i}
                >
                  {data &&
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
