import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Cluster from '../components/UI/Visualization2/Cluster';

export default {
  title: 'Charts/Cluster',
  component: Cluster,
} as ComponentMeta<typeof Cluster>;

const Template: ComponentStory<typeof Cluster> = (args) => (
  <Cluster {...args} />
);

export const Normal = Template.bind({});
Normal.args = {
  data: {
    name: 'Centers',
    nmatrix: [
      [0.2, 0.7],
      [0.3, 0.1],
    ],
  },
};
