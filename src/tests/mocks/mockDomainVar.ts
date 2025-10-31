import { makeVar, ReactiveVar } from '@apollo/client';
import { Domain } from '../../components/API/GraphQL/types.generated';

export const mockDomain: Domain = {
  id: 'dom1',
  label: 'Dummy domain',
  datasets: [
    {
      id: 'ds1',
      label: 'Dataset 1',
    },
    {
      id: 'ds2',
      label: 'Dataset 2',
    },
  ],
  datasetsVariables: {
    ds1: ['var1', 'var2', 'var3', 'var4', 'var5', 'var6'],
    ds2: ['var1', 'var2', 'var3', 'var4', 'var5', 'var6'],
  },
  groups: [
    {
      id: 'group1',
      label: 'Groupe Exemple 1',
      groups: ['group3', 'group4'],
      variables: ['var2', 'var3'],
    },
    {
      id: 'group2',
      label: 'Groupe Exemple 2',
      variables: ['var1'],
    },
    {
      id: 'group3',
      label: 'Groupe Exemple 3',
      variables: ['var6'],
    },
    {
      id: 'group4',
      label: 'Groupe Exemple 4',
      variables: ['var5', 'var4'],
    },
  ],
  rootGroup: {
    id: 'root',
    label: 'Root group',
    groups: ['group1', 'group2'],
  },
  variables: [
    {
      id: 'var1',
      label: 'Variable 1',
    },
    {
      id: 'var2',
      label: 'Variable 2',
    },
    {
      id: 'var3',
      label: 'Variable 3',
    },
    {
      id: 'var4',
      label: 'Variable 4',
    },
    {
      id: 'var5',
      label: 'Variable 5',
    },
    {
      id: 'var6',
      label: 'Variable 6',
    },
  ],
};

export const initMockDomainVar = (): ReactiveVar<Domain | undefined> => {
  return makeVar<Domain | undefined>(mockDomain);
};

export const getMockDomain = (): Domain => {
  return JSON.parse(JSON.stringify(mockDomain)) as Domain;
};
