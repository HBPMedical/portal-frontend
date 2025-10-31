import * as d3 from 'd3';
import { Group, Variable } from '../API/GraphQL/types.generated';

export interface NodeData {
  id: string;
  description?: string;
  label: string;
  isVariable?: boolean;
  isAvailable?: boolean;
  children?: NodeData[];
  type?: string;
  uniqueId?: string;
}

export type HierarchyNode = d3.HierarchyNode<NodeData>;

let availableVars: Variable[];
let availableGroups: Group[];

//function to initialize arrays for available groups and variables
export const initializeArrays = () => {
  availableVars = [];
  availableGroups = [];
};

interface GroupsToTreeViewOptions {
  allowedVariableIds?: Set<string>;
  includeAllVariables?: boolean;
}

export const groupsToTreeView = (
  group: Group,
  groups: Group[],
  vars: Variable[],
  datasets: string[] = [],
  options: GroupsToTreeViewOptions = {},
  parentPath = ''
): NodeData => {
  // Initialize the arrays if they're empty with the given groups and variables arrays
  if (availableGroups.length === 0) {
    availableGroups = [...groups];
  }
  if (availableVars.length === 0) {
    availableVars = [...vars];
  }

  // Generate unique ID for this group
  const currentPath = parentPath ? `${parentPath}.${group.id}` : group.id;
  const groupUniqueId = `group_${group.id}_${currentPath}`;

  const allowedVariableIds = options.allowedVariableIds;
  const includeAllVariables = options.includeAllVariables ?? false;

  const childVars =
    group.variables
      ?.map((varId) => availableVars.find((v) => v.id === varId))
      .filter((v): v is Variable => !!v)
      .reduce<NodeData[]>((accumulator, variable) => {
        const matchesSelectedDatasets =
          !variable.datasets ||
          variable.datasets.some((datasetId) => datasets.includes(datasetId));

        const isAllowed = allowedVariableIds
          ? allowedVariableIds.has(variable.id)
          : matchesSelectedDatasets;

        if (!includeAllVariables && !isAllowed) {
          return accumulator;
        }

        // Ensure variables appear only once in the tree
        availableVars = availableVars.filter((item) => item.id !== variable.id);

        accumulator.push({
          id: variable.id,
          description: variable.description ?? '',
          isVariable: true,
          isAvailable: isAllowed,
          label: variable.label ?? variable.id,
          type: variable.type ?? undefined,
          uniqueId: `var_${variable.id}_${currentPath}`,
        });

        return accumulator;
      }, []) ?? [];

  const childGroups =
    group.groups
      ?.map((grpId) => availableGroups.find((grp) => grp.id === grpId))
      .filter((candidate): candidate is Group => {
        if (!candidate) return false;
        if (includeAllVariables) return true;

        if (!candidate.datasets) return true;

        return (
          candidate.datasets.filter((datasetId) => datasets.includes(datasetId))
            .length > 0
        );
      })
      .map((g) => {
        const result = groupsToTreeView(
          g,
          groups,
          vars,
          datasets,
          options,
          currentPath
        );
        const index = availableGroups.findIndex((group) => group.id === g.id);
        if (index !== -1) {
          availableGroups.splice(index, 1); // Remove only this specific instance
        }
        return result;
      }) ?? [];

  return {
    id: group.id,
    description: group.description ?? '',
    label: group.label ?? group.id,
    children: [...childGroups, ...childVars],
    uniqueId: groupUniqueId,
  };
};

export const d3Hierarchy = (root: NodeData): HierarchyNode | undefined => {
  const hierarchyNode = root
    ? d3
        .hierarchy(root)
        .sum(() => {
          return 1;
        })
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    : undefined;

  return hierarchyNode;
};
