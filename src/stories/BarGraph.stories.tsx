import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BarGraph from '../components/UI/Visualization2/BarGraph';
import { BarChartResult } from '../components/API/GraphQL/types.generated';

export default {
  title: 'Charts/BarGraph',
  component: BarGraph,
} as ComponentMeta<typeof BarGraph>;

const data: BarChartResult = {
  name: 'Example BarChart graph',
  barValues: [3, 4.12, 8.23, 9, 6.7, 4, 1],
};

const Template: ComponentStory<typeof BarGraph> = (args) => (
  <BarGraph {...args} />
);

export const Default = Template.bind({});
Default.args = { data };

const dataLine: BarChartResult = { ...data, hasConnectedBars: true };
export const WithLine = Template.bind({});
WithLine.args = { data: dataLine };

export const WithCategories = Template.bind({});
const dataWithCategories: BarChartResult = {
  ...data,
  xAxis: {
    categories: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  },
};
WithCategories.args = { data: dataWithCategories };

export const WithEnums = Template.bind({});
const dataWithEnums: BarChartResult = {
  ...data,
  xAxis: {
    label: 'bins',
    categories: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  },
  hasConnectedBars: true,
  yAxis: { label: 'Counts' },
  barEnumValues: [
    {
      label: 'CN',
      values: [3, 4.12, 8.23, 9, 6.7, 4, 1],
    },
    {
      label: 'Other',
      values: [1, 3, 4.12, 8.23, 9, 6.7, 4],
    },
    {
      label: 'AD',
      values: [4, 1, 3, 4.12, 8.23, 9, 6.7],
    },
    {
      label: 'Wow',
      values: [6.7, 5, 1, 3, 4.12, 8.23, 9],
    },
  ],
};
WithEnums.args = { data: dataWithEnums };
