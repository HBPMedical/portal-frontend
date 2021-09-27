import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Table, { ITable } from '../components/UI/Visualization2/Table';

export default {
  title: 'Example/Table',
  component: Table,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = args => <Table {...args} />;

const table: ITable = {
  profile: 'tabular-data-resource',
  name: 'left-anterior-cingulate-gyrus',
  data: [
    ['Left anterior cingulate gyrus', 714, 474, 1000],
    ['Datapoints', 714, 437, 920],
    ['Nulls', 0, 37, 80],
    ['std', 0.56, 0.696, 0.789],
    ['max', 6.71, 6.534, 6.534],
    ['min', 3.16, 0.001, 0.001],
    ['mean', 4.687, 4.45, 4.44]
  ],
  schema: {
    fields: [
      {
        type: 'string',
        name: ''
      },
      {
        type: 'string',
        name: 'DESD-synthdata'
      },
      {
        type: 'string',
        name: 'EDSD'
      },
      {
        type: 'string',
        name: 'PPMI'
      }
    ]
  }
};

export const Default = Template.bind({});
Default.args = { table, layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { table, layout: 'statistics' };
