import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Histogram from '../components/UI/Visualization2/Histogram';

export default {
  title: 'Charts/Histogram',
  component: Histogram
} as ComponentMeta<typeof Histogram>;

const Template: ComponentStory<typeof Histogram> = args => <Histogram />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
