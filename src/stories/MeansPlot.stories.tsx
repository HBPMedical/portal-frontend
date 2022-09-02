import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import MeanPlot from '../components/UI/Visualization2/MeanPlot';
import { MeanChartResult } from '../components/API/GraphQL/types.generated';

export default {
  title: 'Charts/MeansPlot',
  component: MeanPlot,
} as ComponentMeta<typeof MeanPlot>;

const data: MeanChartResult = {
  name: 'Means Plot: Left Hipocampus ~ PPMI Category',
  xAxis: {
    label: 'PPMI Category',
    categories: ['PD', 'HC', 'PRODROMA', 'GENPD'],
  },
  yAxis: {
    label: '95% CI: Left Hippocampus',
  },
  pointCIs: [
    {
      min: 3.54,
      mean: 3.25,
      max: 2.96,
    },
    {
      min: 2.92,
      mean: 3.2,
      max: 3.49,
    },
    {
      min: 2.87,
      mean: 3.13,
      max: 3.39,
    },
    {
      min: 2.85,
      mean: 3.09,
      max: 3.33,
    },
  ],
};

const Template: ComponentStory<typeof MeanPlot> = (args) => (
  <MeanPlot {...args} />
);

export const Default = Template.bind({});
Default.args = { data };
