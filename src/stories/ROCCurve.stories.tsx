import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ROCCurve from '../components/UI/Visualization2/ROCCurve';

export default {
  title: 'Charts/ROCCurve',
  component: ROCCurve
} as ComponentMeta<typeof ROCCurve>;

const Template: ComponentStory<typeof ROCCurve> = args => <ROCCurve />;

export const Default = Template.bind({});
Default.args = { layout: 'default' };
