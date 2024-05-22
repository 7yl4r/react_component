import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CfParameterField from './CfParameterField';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
   title: 'ReactComponentLibrary/CfParameterField',
   component: CfParameterField,
} as ComponentMeta<typeof CfParameterField>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CfParameterField> = (args) => <CfParameterField {...args} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
   label: 'CF Standard Name Input',
};