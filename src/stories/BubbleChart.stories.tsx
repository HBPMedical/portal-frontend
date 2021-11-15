import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BubbleChart from '../components/UI/Visualization2/BubbleChart';

export default {
  title: 'Charts/BubbleChart',
  component: BubbleChart
} as ComponentMeta<typeof BubbleChart>;

const Template: ComponentStory<typeof BubbleChart> = args => <BubbleChart />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
