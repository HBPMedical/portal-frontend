import * as d3 from 'd3';
import { Group, Variable } from '../API/GraphQL/types.generated';

export interface NodeData {
  id: string;
  description?: string;
  label: string;
  isVariable?: boolean;
  children?: NodeData[];
  type?: string;
}

export type HierarchyNode = d3.HierarchyNode<NodeData>;

let availableVars: Variable[];
let availableGroups: Group[];

//function to initialize arrays for available groups and variables
export const initializeArrays = () => {
  availableVars = [];
  availableGroups = [];
};

export const groupsToTreeView = (
  group: Group,
  groups: Group[],
  vars: Variable[],
  datasets: string[] = []
): NodeData => {
  // Initialize the arrays if they're empty with the given groups and variables arrays
  if (availableGroups.length === 0) {
    availableGroups = [...groups];
  }
  if (availableVars.length === 0) {
    availableVars = [...vars];
  }
  const childVars =
    group.variables
      ?.map((varId) => availableVars.find((v) => v.id === varId))
      .filter(
        (v) =>
          v &&
          (!v.datasets ||
            v.datasets.filter((d) => datasets.includes(d)).length > 0)
      )
      .map((v) => v as Variable)
      //remove the variable from childVarsArray
      .map((v) => {
        availableVars = availableVars.filter(
          (variable) => variable.id !== v.id
        );
        return {
          id: v.id,
          description: v.description ?? '',
          isVariable: true,
          label: v.label ?? v.id,
          type: v.type ?? undefined,
        };
      }) ?? [];

  const childGroups =
    group.groups
      ?.map((grpId) => availableGroups.find((grp) => grp.id === grpId))
      .filter(
        (g) =>
          g &&
          (!g?.datasets ||
            g.datasets.filter((d) => datasets.includes(d)).length > 0)
      )
      .map((g) => g as Group)
      .map((g) => {
        const result = groupsToTreeView(g, groups, vars, datasets);
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
