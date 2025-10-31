import { Domain, Group, Variable } from '../../../types.generated';

type DomainView = {
  domain: Domain;
  groups: Group[];
  variables: Variable[];
  allowedVariableIds: Set<string>;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

const computeCommonVariableIds = (
  domain: Domain,
  datasetIds: string[]
): Set<string> => {
  if (!datasetIds || datasetIds.length === 0) {
    return new Set(domain.variables.map((variable) => variable.id));
  }

  const datasetVariablesMap =
    (domain.datasetsVariables as Record<string, unknown>) ?? {};

  const datasetSets: Set<string>[] = datasetIds.map((datasetId) => {
    const candidates = toStringArray(datasetVariablesMap[datasetId]);

    if (candidates.length > 0) {
      return new Set(candidates);
    }

    const fallback = domain.variables
      .filter((variable) => (variable.datasets ?? []).includes(datasetId))
      .map((variable) => variable.id);

    return new Set(fallback);
  });

  if (datasetSets.length === 0) {
    return new Set(domain.variables.map((variable) => variable.id));
  }

  let common = datasetSets[0];
  for (let index = 1; index < datasetSets.length; index += 1) {
    const next = new Set<string>();
    const current = datasetSets[index];
    common.forEach((variableId) => {
      if (current.has(variableId)) {
        next.add(variableId);
      }
    });
    common = next;

    if (common.size === 0) {
      break;
    }
  }

  if (common.size === 0) {
    return new Set(domain.variables.map((variable) => variable.id));
  }

  return common;
};

export const buildDomainView = (
  baseDomain: Domain,
  datasetIds: string[]
): DomainView => {
  const allowedVariableIds = computeCommonVariableIds(baseDomain, datasetIds);

  const domainVariableIds = new Set(baseDomain.variables.map((v) => v.id));
  const filteredAllowedIds = new Set<string>();
  allowedVariableIds.forEach((id) => {
    if (domainVariableIds.has(id)) {
      filteredAllowedIds.add(id);
    }
  });

  const filteredVariables = baseDomain.variables
    .filter((variable) => filteredAllowedIds.has(variable.id))
    .map((variable) => ({ ...variable }));

  const groupsRegistry = new Map<string, Group>(
    baseDomain.groups.map((group) => [group.id, group])
  );

  const clonesRegistry = new Map<string, Group>();

  const buildGroupClone = (group: Group, isRoot = false): Group | null => {
    const childClones: Group[] = [];

    for (const childId of group.groups ?? []) {
      const childGroup = groupsRegistry.get(childId);
      if (!childGroup) continue;

      const childClone = buildGroupClone(childGroup, false);
      if (childClone) {
        childClones.push(childClone);
      }
    }

    const filteredVariablesIds = (group.variables ?? []).filter((variableId) =>
      filteredAllowedIds.has(variableId)
    );

    const datasetMatches =
      isRoot ||
      !group.datasets ||
      group.datasets.some((datasetId) => datasetIds.includes(datasetId));

    const hasContent =
      filteredVariablesIds.length > 0 || childClones.length > 0;

    if (!isRoot && (!datasetMatches || !hasContent)) {
      return null;
    }

    const clone: Group = {
      ...group,
      variables: filteredVariablesIds,
      groups: childClones.map((child) => child.id),
    };

    clonesRegistry.set(clone.id, clone);

    return clone;
  };

  const rootClone =
    buildGroupClone(baseDomain.rootGroup, true) ??
    ({
      ...baseDomain.rootGroup,
      variables: [],
      groups: [],
    } as Group);

  // Ensure root clone is registered
  clonesRegistry.set(rootClone.id, rootClone);

  const filteredGroups = Array.from(clonesRegistry.values()).filter(
    (group) => group.id !== rootClone.id
  );

  const filteredDomain: Domain = {
    ...baseDomain,
    rootGroup: rootClone,
    groups: filteredGroups,
    variables: filteredVariables,
  };

  return {
    domain: filteredDomain,
    groups: filteredGroups,
    variables: filteredVariables,
    allowedVariableIds: filteredAllowedIds,
  };
};
