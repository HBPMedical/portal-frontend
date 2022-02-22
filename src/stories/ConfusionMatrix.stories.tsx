import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ConfusionMatrix from '../components/UI/Visualization2/ConfusionMatrix';
import { HeatMapResult } from '../components/API/GraphQL/types.generated';

export default {
  title: 'Charts/ConfusionMatrix',
  component: ConfusionMatrix
} as ComponentMeta<typeof ConfusionMatrix>;

const ds: HeatMapResult = {
  matrix: [
    [80, 60],
    [3, 20]
  ],
  name: 'Heat Map',
  xAxis: {
    categories: ['Positive', 'Negative'],
    label: 'Predicted label'
  },
  yAxis: {
    categories: ['Positive', 'Negative'],
    label: 'True label'
  }
};

const Template: ComponentStory<typeof ConfusionMatrix> = args => (
  <ConfusionMatrix {...args} />
);

export const Default = Template.bind({});
Default.args = { data: ds };
