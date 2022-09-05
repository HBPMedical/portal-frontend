import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DataTable from '../components/UI/Visualization2/DataTable';
import {
  TableResult,
  TableStyle,
} from '../components/API/GraphQL/types.generated';

export default {
  title: 'Charts/DataTable',
  component: DataTable,
} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = (args) => (
  <DataTable {...args} />
);

const data: TableResult = {
  name: 'Left inferior temporal gyrus',
  data: [
    ['Left inferior temporal gyrus', '714', '474', '1000'],
    ['datapoints', '714', '437', '920'],
    ['nulls', '0', '37', '80'],
    ['std', '1.2048783713787277', '1.3274694970555183', '1.3479276642860987'],
    ['min', '7.6335', '5.4301', '5.4301'],
    ['mean', '11.38076218487395', '10.647539816933637', '10.685619565217392'],
    ['max', '', '14.593', '14.593'],
  ],
  headers: [
    {
      name: '',
      type: 'string',
      __typename: 'Header',
    },
    {
      name: 'ppmi',
      type: 'string',
      __typename: 'Header',
    },
    {
      name: 'edsd',
      type: 'string',
      __typename: 'Header',
    },
    {
      name: 'desd-synthdata',
      type: 'string',
      __typename: 'Header',
    },
  ],
  __typename: 'TableResult',
  tableStyle: TableStyle.Default,
};

const data2: TableResult = { ...data, tableStyle: TableStyle.Normal };

export const Default = Template.bind({});
Default.args = { data };

export const Statistics = Template.bind({});
Statistics.args = { data: data2 };
