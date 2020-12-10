import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { APICore, APIExperiment, APIMining, APIModel, APIUser } from '../API';
import { VariableEntity } from '../API/Core';
import { IExperiment } from '../API/Experiment';
import { D3Model, HierarchyCircularNode, ModelResponse } from '../API/Model';
import { AppConfig } from '../App/App';
import { LONGITUDINAL_DATASET_TYPE } from '../constants';
import Modal from '../UI/Modal';
import CirclePack from './D3CirclePackLayer';
import { d3Hierarchy, VariableDatum } from './d3Hierarchy';

const diameter = 800;
const padding = 1.5;

const AlertBox = styled(Alert)`
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
`;

export enum ModelType {
  COVARIABLE,
  FILTER,
  VARIABLE
}

interface Props extends RouteComponentProps {
  apiCore: APICore;
  apiMining: APIMining;
  apiModel: APIModel;
  apiExperiment: APIExperiment;
  appConfig: AppConfig;
  apiUser: APIUser;
}

export default ({
  apiCore,
  apiMining,
  apiModel,
  apiUser,
  apiExperiment,
  ...props
}: Props): JSX.Element => {
  const [selectedNode, setSelectedNode] = useState<
    HierarchyCircularNode | undefined
  >();

  // D3Model is used to expose D3 data and interact with the D3 Layout.
  const [d3Layout, setD3Layout] = useState<HierarchyCircularNode>();
  const [, setFormulaString] = useState<string>('');
  const [showPathologySwitchWarning, setShowPathologySwitchWarning] = useState(
    false
  );
  const [nextPathologyCode, setNextPathologyCode] = useState(''); // TODO: maybe there is a better way... like promise.then() ?
  const { history } = props;

  // Utility to convert variables to D3 model
  const convertModelToD3Model = (
    model: ModelResponse,
    d3Layout: HierarchyCircularNode
  ): D3Model => {
    const query = model && model.query;

    const filterVariables: string[] = [];
    const extractVariablesFromFilter = (filter: any) =>
      filter.rules.forEach((r: any) => {
        if (r.rules) {
          extractVariablesFromFilter(r);
        }
        if (r.id) {
          filterVariables.push(r.id);
        }
      });

    if (query && query.filters) {
      extractVariablesFromFilter(JSON.parse(query.filters));
    } else {
      query.filterVariables?.forEach(v => {
        filterVariables.push(v.code);
      });
    }

    const nextModel = {
      covariables: [
        ...((query.coVariables &&
          d3Layout
            .descendants()
            .filter(l =>
              query.coVariables!.map(c => c.code).includes(l.data.code)
            )) ||
          []),
        ...((query.groupings &&
          d3Layout
            .descendants()
            .filter(l =>
              query.groupings!.map(c => c.code).includes(l.data.code)
            )) ||
          [])
      ],
      filters: [
        ...((filterVariables &&
          d3Layout
            .descendants()
            .filter(l => filterVariables.includes(l.data.code))) ||
          [])
      ],
      groupings: undefined,
      variables:
        (query.variables !== undefined &&
          query.variables.length > 0 &&
          d3Layout
            .descendants()
            .filter(l =>
              query.variables!.map(c => c.code).includes(l.data.code)
            )) ||
        []
    };

    return nextModel;
  };

  useEffect(() => {
    if (
      apiUser.state.user &&
      !apiUser.state.loading &&
      !apiUser.state.forbidden &&
      !apiUser.state.user?.agreeNDA
    ) {
      history.push('/tos');
    }
  }, [
    apiUser.state.user,
    apiUser.state.forbidden,
    apiUser.state.loading,
    history
  ]);

  // select default pathology at start
  useEffect(() => {
    const model = apiModel.state.model;
    if (!model && apiCore.state.pathologies) {
      const defaultPathology = apiCore.state.pathologies.find(
        (_, i) => i === 0
      );
      const r = new RegExp(LONGITUDINAL_DATASET_TYPE);
      const datasets =
        apiCore.state.pathologiesDatasets[defaultPathology?.code || ''];

      const trainingDatasets = datasets?.filter(
        (d: VariableEntity) => !r.test(d.code)
      );
      const newModel = {
        query: {
          pathology: defaultPathology?.code,
          trainingDatasets
        }
      };

      apiModel.setModel(newModel);
    }
  }, [apiCore, apiCore.state.pathologies, apiModel]);

  // Switch datasets, variables, models based on selected pathology
  useEffect(() => {
    const model = apiModel.state.model;
    if (model) {
      const hierarchy =
        apiCore.state.pathologiesHierarchies[model.query.pathology || ''];
      if (hierarchy) {
        const node = d3Hierarchy(hierarchy);
        const bubbleLayout = d3
          .pack<VariableDatum>()
          .size([diameter, diameter])
          .padding(padding);

        const d3layout = node && bubbleLayout(node);
        setD3Layout(d3layout);
      }
    }
  }, [apiCore, apiModel.state.model]);

  // Sync selected variables and D3 Model
  useEffect(() => {
    const model = apiModel.state.model;
    if (model && d3Layout) {
      apiModel.setD3Model(convertModelToD3Model(model, d3Layout));
    }
  }, [apiModel, d3Layout]);

  // Load Histograms for selected variable
  const trainingDatasets =
    apiModel.state.model && apiModel.state.model.query.trainingDatasets;
  useEffect(() => {
    const model = apiModel.state.model;
    const datasets =
      (model && model.query && model.query.trainingDatasets) || [];
    if (selectedNode && selectedNode.data.isVariable) {
      apiMining.multipleHistograms({
        datasets: datasets,
        y: selectedNode.data,
        pathology: (model && model.query && model.query.pathology) || ''
      });
    }
  }, [
    selectedNode,
    apiMining,
    apiModel.state.model,
    apiMining.state.refetchAlgorithms,
    trainingDatasets
  ]);

  // Update D3 data from interaction with D3 widgets (PackLayer, Model, breadcrumb, search bar)
  const handleUpdateD3Model = (
    type?: ModelType,
    node?: HierarchyCircularNode
  ): void => {
    if (node === undefined) {
      return;
    }

    const d3Model = apiModel.state.internalD3Model;

    if (type === ModelType.VARIABLE) {
      const nextModel = d3Model.variables
        ? {
            ...d3Model,
            variables: [
              ...d3Model.variables.filter(c => !node.leaves().includes(c)),
              ...node.leaves().filter(c => !d3Model.variables!.includes(c))
            ],
            covariables: d3Model.covariables
              ? [...d3Model.covariables.filter(c => !node.leaves().includes(c))]
              : []
          }
        : {
            ...d3Model,
            covariables:
              d3Model.covariables &&
              d3Model.covariables.filter(c => c !== node),
            variables: node.leaves()
          };

      apiModel.setD3Model(nextModel);
    }

    if (type === ModelType.COVARIABLE) {
      const nextModel = d3Model.covariables
        ? {
            ...d3Model,
            covariables: [
              ...d3Model.covariables.filter(c => !node.leaves().includes(c)),
              ...node.leaves().filter(c => !d3Model.covariables!.includes(c))
            ],
            variables: d3Model.variables
              ? [...d3Model.variables.filter(c => !node.leaves().includes(c))]
              : []
          }
        : {
            ...d3Model,
            covariables: node.leaves(),
            variables:
              d3Model.variables && d3Model.variables.filter(c => c !== node)
          };

      apiModel.setD3Model(nextModel);
    }

    if (type === ModelType.FILTER) {
      const nextModel = d3Model.filters
        ? {
            ...d3Model,
            filters: [
              ...d3Model.filters.filter(c => !node.leaves().includes(c)),
              ...node.leaves().filter(c => !d3Model.filters!.includes(c))
            ]
          }
        : { ...d3Model, filters: node.leaves() };

      apiModel.setD3Model(nextModel);
    }
  };

  const handleSelectModel = (nextModel?: ModelResponse): void => {
    if (nextModel && nextModel.slug) {
      apiModel.one(nextModel.slug).then(() => {
        const pathology = apiModel.state.model?.query?.pathology || '';
        apiModel.checkModelDatasets(
          apiCore.state.pathologiesDatasets[pathology]
        );
      });
    } else {
      const model = apiModel.state.model;
      if (model) {
        const newModel = {
          query: { pathology: model.query.pathology }
        };
        apiModel.setModel(newModel);
      }
    }
  };

  const handleSelectPathology = (code: string): void => {
    setNextPathologyCode(code);
    setShowPathologySwitchWarning(true);
  };

  const handleCancelSwitchPathology = (): void => {
    setShowPathologySwitchWarning(false);
  };

  const handleOKSwitchPathology = (): void => {
    setShowPathologySwitchWarning(false);
    setSelectedNode(undefined);
    if (apiCore.state.pathologies) {
      const newModel: ModelResponse = {
        query: {
          pathology: nextPathologyCode,
          trainingDatasets: apiCore.state.pathologiesDatasets[nextPathologyCode]
        }
      };
      apiModel.setModel(newModel);
    }
  };

  const handleGoToAnalysis = async (): Promise<void> => {
    history.push(`/review`);
  };

  const handleSelectExperiment = (experiment: IExperiment): void => {
    const parameters = experiment.algorithm.parameters;
    const extract = (field: string): VariableEntity[] =>
      (parameters.find(p => p.name === field)?.value as string)
        .split(',')
        .map(m => ({ code: m, label: m }));

    const newModel: ModelResponse = {
      query: {
        pathology: parameters.find(p => p.name === 'pathology')
          ?.value as string,
        trainingDatasets: extract('dataset'),
        variables: extract('y'),
        coVariables: extract('x'),
        filters: parameters.find(p => p.name === 'filters')?.value as string
      }
    };
    apiModel.setModel(newModel);
  };

  const nextProps = {
    apiCore,
    apiModel,
    apiMining,
    apiExperiment,
    handleGoToAnalysis,
    handleSelectModel,
    handleSelectNode: setSelectedNode,
    handleSelectPathology,
    handleUpdateD3Model,
    histograms: apiMining.state.histograms,
    selectedNode,
    setFormulaString,
    handleSelectExperiment
  };

  const d3Model = apiModel.state.internalD3Model;

  return (
    <>
      {apiCore.state.pathologyError && (
        <AlertBox variant="warning">
          <div
            dangerouslySetInnerHTML={{
              __html: `${apiCore.state.pathologyError}`
            }}
          />
        </AlertBox>
      )}
      <Modal
        show={showPathologySwitchWarning}
        title="Change Pathology ?"
        body="Selecting a new pathology will reset your selection"
        handleCancel={handleCancelSwitchPathology}
        handleOK={handleOKSwitchPathology}
      />

      {d3Layout && (
        <CirclePack layout={d3Layout} d3Model={d3Model} {...nextProps} />
      )}
    </>
  );
};
