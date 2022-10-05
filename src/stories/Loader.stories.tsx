import { ComponentMeta, ComponentStory } from '@storybook/react';

import Loader from '../components/UI/Loader';

export default {
  title: 'UI/Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {};
