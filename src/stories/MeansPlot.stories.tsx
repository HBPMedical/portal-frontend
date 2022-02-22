import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import MeansPlot from '../components/UI/Visualization2/MeansPlot';

export default {
  title: 'Charts/MeansPlot',
  component: MeansPlot
} as ComponentMeta<typeof MeansPlot>;

const Template: ComponentStory<typeof MeansPlot> = args => <MeansPlot />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
