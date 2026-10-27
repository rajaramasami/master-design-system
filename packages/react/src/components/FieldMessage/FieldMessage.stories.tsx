import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldMessage } from './FieldMessage';

const meta = {
  title: 'Components/Feedback/FieldMessage',
  component: FieldMessage,
  tags: ['autodocs'],
  args: { children: 'We only use this to send appointment reminders.', tone: 'helper' },
  argTypes: { tone: { control: 'inline-radio', options: ['helper', 'success', 'warning', 'error'] } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Field Message** (13 Feedback): Tone Helper, Success, Warning, Error.

Form components render it for you through \`description\` and \`error\`. Use it directly under a custom control and point the control's \`aria-describedby\` at the message's \`id\`. Success, Warning and Error show their icon by default, so the tone never relies on colour alone.
`,
      },
    },
  },
} satisfies Meta<typeof FieldMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllTones: Story = {
  name: 'All tones (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-stack-md">
      <FieldMessage tone="helper">Helper: we only use this to send reminders.</FieldMessage>
      <FieldMessage tone="helper" showIcon>Helper with icon.</FieldMessage>
      <FieldMessage tone="success">Success: this email is verified.</FieldMessage>
      <FieldMessage tone="warning">Warning: this date is a public holiday.</FieldMessage>
      <FieldMessage tone="error">Error: enter a phone number with 10 digits.</FieldMessage>
    </div>
  ),
};
