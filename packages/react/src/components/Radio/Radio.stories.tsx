import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, Radio } from './Radio';

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Error', 'Disabled'] as const;

const meta = {
  title: 'Components/Inputs/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ['autodocs'],
  args: { label: 'Appointment type', description: 'You can change this later.', defaultValue: 'in-person', orientation: 'vertical' },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] }, error: { control: 'text' } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="in-person" label="In person" description="At the main clinic." />
      <Radio value="video" label="Video call" description="A link arrives by email." />
      <Radio value="phone" label="Phone call" />
    </RadioGroup>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Radio** (11 Inputs): Checked Unchecked, Checked × State Default, Hover, Pressed, Focus, Error, Disabled.

**When to use**: one choice from a small visible set (2 to 6 options). Use Select for longer lists and Checkbox when several can be chosen.

**Accessibility**: \`RadioGroup\` has a visible label that names the group. Tab moves into the group, arrow keys move the selection, Tab leaves. A group \`error\` marks every option and describes the group.

**Note**: in Figma the dot is the space left by the circle's padding, which is bound to \`spacing/inset/xs\`, so it shrinks from 12 px to 4 px in Comfortable density. In code the dot is a fixed 60% of the circle in every density.
`,
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal', description: undefined } };

/** The Figma matrix: Unchecked and Checked × 6 states. Hover, Pressed and Focus are forced with the pseudo-states addon. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    a11y: { test: 'todo' },
    pseudo: {
      hover: ['[data-state-cell="Hover"] [data-slot="choice"]'],
      active: ['[data-state-cell="Pressed"] [data-slot="choice"]'],
      focusVisible: ['[data-state-cell="Focus"] button'],
    },
  },
  render: () => (
    <div className="grid grid-cols-[120px_repeat(6,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['Unchecked', 'Checked'] as const).map((row) => (
        <div key={row} className="contents">
          <span className="text-label-sm text-text-tertiary">{row}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <RadioGroup label={`${row} ${state}`} hideLabel value={row === 'Checked' ? 'a' : ''} invalid={state === 'Error'} disabled={state === 'Disabled'}>
                <Radio value="a" label="Label" />
              </RadioGroup>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
