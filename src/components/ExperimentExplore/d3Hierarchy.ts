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

export const groupsToTreeView = (
  group: Group,
  groups: Group[],
  vars: Variable[],
  datasets: string[] = []
): NodeData => {
  const childVars =
    group.variables
      ?.map(varId => vars.find(v => v.id === varId))
      .filter(
        v =>
          v &&
          (!v.datasets ||
            v.datasets.filter(d => datasets.includes(d)).length > 0)
      )
      .map(v => v as Variable)
      .map(v => ({
        id: v.id,
        description: v.description ?? '',
        isVariable: true,
        label: v.label ?? v.id,
        type: v.type ?? undefined
      })) ?? [];

  const childGroups =
    group.groups
      ?.map(grpId => groups.find(grp => grp.id === grpId))
      .filter(
        g =>
          g &&
          (!g?.datasets ||
            g.datasets.filter(d => datasets.includes(d)).length > 0)
      )
      .map(g => g as Group)
      .map(g => groupsToTreeView(g, groups, vars, datasets)) ?? [];

  return {
    id: group.id,
    description: group.description ?? '',
    label: group.label ?? group.id,
    children: [...childGroups, ...childVars]
  };
};

export const d3Hierarchy = (root: NodeData): HierarchyNode | undefined => {
  const hierarchyNode = root
    ? d3
        .hierarchy(root)
        .sum(d => (d.label ?? '').length)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    : undefined;

  return hierarchyNode;
};
