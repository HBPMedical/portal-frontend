import { ComponentMeta, ComponentStory } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import {
  GroupsResult,
  TableResult,
} from '../components/API/GraphQL/types.generated';
import GroupTable from '../components/UI/Visualization2/GroupResult';
export default {
  title: 'Charts/GroupTable',
  component: GroupTable,
} as ComponentMeta<typeof GroupTable>;

const Template: ComponentStory<typeof GroupTable> = (args) => (
  <GroupTable {...args} />
);

const tabs: TableResult[] = [
  {
    name: 'lefthippocampus',
    data: [
      ['lefthippocampus', ''],
      ['Datapoints', '292'],
      ['Nulls', ''],
      ['std', '0.3625820873508056'],
      ['min', '2.0491'],
      ['max', '4.4519'],
      ['lower_confidence', '2.6112668852519345'],
      ['mean', '2.97384897260274'],
      ['upper_confidence', '3.3364310599535454'],
    ],
    headers: [
      {
        name: '',
        type: 'string',
        __typename: 'Header',
      },
      {
        name: 'edsd',
        type: 'string',
        __typename: 'Header',
      },
    ],
    __typename: 'TableResult',
  },
  {
    name: 'alzheimerbroadcategory',
    data: [
      ['alzheimerbroadcategory', ''],
      ['Datapoints', '292'],
      ['Nulls', ''],
      ['AD', '141'],
      ['CN', '151'],
    ],
    headers: [
      {
        name: '',
        type: 'string',
        __typename: 'Header',
      },
      {
        name: 'edsd',
        type: 'string',
        __typename: 'Header',
      },
    ],
    __typename: 'TableResult',
  },
];

const groups: GroupsResult = { groups: [] };

groups.groups.push({
  name: 'Variables',
  description: 'Optional description of variables',
  results: tabs,
});

groups.groups.push({
  name: 'Models',
  description: 'Optional description of models',
  results: tabs,
});

export const Default = Template.bind({});
Default.args = { result: groups, loading: false, error: undefined };
