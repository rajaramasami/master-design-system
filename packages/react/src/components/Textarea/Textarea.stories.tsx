import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const STATES = ['Default', 'Hover', 'Focus', 'Filled', 'Error', 'Disabled', 'Read-only'] as const;

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Symptoms',
    placeholder: 'For example: headache since Monday, worse in the morning',
    description: 'Describe what you feel and since when.',
    showCounter: true,
    maxLength: 500,
  },
  argTypes: { error: { control: 'text' } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Textarea** (11 Inputs). Same states and tokens as TextField.

**When to use**: free text longer than a sentence: symptoms, notes, feedback.

**Behaviour**: starts at \`textarea/min-height\` (96 px) and grows with its content in browsers that support \`field-sizing\`; elsewhere it can be resized vertically. With \`showCounter\` and \`maxLength\` it shows "12/500"; screen readers hear the limit once ("Up to 500 characters") instead of every count change.
`,
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { decorators: [(S) => <div className="max-w-[400px]"><S /></div>] };

/** The Figma states. Hover and Focus are forced with the pseudo-states addon. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    a11y: { test: 'todo' },
    pseudo: { hover: ['[data-state-cell="Hover"] textarea'], focus: ['[data-state-cell="Focus"] textarea'], focusVisible: ['[data-state-cell="Focus"] textarea'] },
  },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-inline-lg gap-y-stack-xl">
      {STATES.map((state) => (
        <div key={state} data-state-cell={state} className="flex flex-col gap-stack-xs">
          <span className="text-label-sm text-text-tertiary">{state}</span>
          <Textarea
            label="Label"
            placeholder="Placeholder"
            description={state === 'Error' ? undefined : 'Helper text'}
            error={state === 'Error' ? 'Error message' : undefined}
            defaultValue={['Filled', 'Error', 'Read-only'].includes(state) ? 'Value' : undefined}
            disabled={state === 'Disabled'}
            readOnly={state === 'Read-only'}
            showCounter
            maxLength={200}
          />
        </div>
      ))}
    </div>
  ),
};
