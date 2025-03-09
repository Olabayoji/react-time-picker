import type { Meta, StoryObj } from "@storybook/react";
import TimePicker from "../component/TimePicker/TimePicker";
import "./customStyles.css";
const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    is24Hour: { 
      control: "boolean",
      description: "Whether to use 24-hour format"
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    value: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// Basic TimePicker story
export const Default: Story = {
  args: {
    label: "Pick a time",
  },
};

// 12-hour format
export const TwelveHourFormat: Story = {
  args: {
    label: "Select Time",
    is24Hour: false,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    label: "Disabled Time Picker",
    disabled: true,
    value: { hour: "10", minute: "30" },
  },
};



// Custom styling example
export const CustomStyling: Story = {
  args: {
    label: "Custom Styled",
    classes: {
      container: "custom-container",
      timePicker: "custom-picker",
      timeInput: "custom-input",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Example with custom CSS classes applied",
      },
    },
  },
};
