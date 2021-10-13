import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ConfusionMatrix from '../../components/UI/Visualization2/ConfusionMatrix';

export default {
  title: 'Charts/ConfusionMatrix',
  component: ConfusionMatrix
} as ComponentMeta<typeof ConfusionMatrix>;

const Template: ComponentStory<typeof ConfusionMatrix> = args => (
  <ConfusionMatrix />
);

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
