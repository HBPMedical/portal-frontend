import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LineGraph from '../components/UI/Visualization2/LineGraph';

export default {
  title: 'Charts/LineGraph',
  component: LineGraph
} as ComponentMeta<typeof LineGraph>;

const Template: ComponentStory<typeof LineGraph> = args => <LineGraph />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };
