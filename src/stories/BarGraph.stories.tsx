import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BarGraph from '../components/UI/Visualization2/BarGraph';

export default {
  title: 'Charts/BarGraph',
  component: BarGraph
} as ComponentMeta<typeof BarGraph>;

const Template: ComponentStory<typeof BarGraph> = args => <BarGraph />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
