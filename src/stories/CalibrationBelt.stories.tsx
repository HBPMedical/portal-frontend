import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CalibrationBelt from '../components/UI/Visualization2/CalibrationBelt';

export default {
  title: 'Charts/CalibrationBelt',
  component: CalibrationBelt
} as ComponentMeta<typeof CalibrationBelt>;

const Template: ComponentStory<typeof CalibrationBelt> = args => (
  <CalibrationBelt />
);

export const Default = Template.bind({});
Default.args = { layout: 'default' };

export const Statistics = Template.bind({});
Statistics.args = { layout: 'statistics' };
