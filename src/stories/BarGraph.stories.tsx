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
  barValues: [3, 4.12, 8.23, 0, 0.23, 4, 1],
};

const Template: ComponentStory<typeof BarGraph> = (args) => (
  <BarGraph {...args} />
);

export const Default = Template.bind({});
Default.args = { data };

const dataLine: BarChartResult = { ...data, hasConnectedBars: true };
export const WithLine = Template.bind({});
WithLine.args = { data: dataLine };
