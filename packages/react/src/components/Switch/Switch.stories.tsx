import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'] as const;

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Appointment reminders', description: 'A text message the day before each visit.' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Switch** (11 Inputs): Checked Off, On × State Default, Hover, Pressed, Focus, Disabled. Track and thumb sizes come from the Platform collection: 36×20 on web, 51×31 on iOS, 52×32 on Android. Switch Platform in the toolbar to see them.

**When to use**: a setting that takes effect immediately, without a Save button. Inside a form that is submitted later, use a Checkbox.

**Content**: the label names the setting ("Appointment reminders"), never its state ("On").

**Accessibility**: \`role="switch"\` with \`aria-checked\`. Space toggles; the label is clickable.
`,
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The Figma matrix: Off and On × 5 states. Hover, Pressed and Focus are forced with the pseudo-states addon. */
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
    <div className="grid grid-cols-[80px_repeat(5,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['Off', 'On'] as const).map((row) => (
        <div key={row} className="contents">
          <span className="text-label-sm text-text-tertiary">{row}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <Switch label="Label" checked={row === 'On'} disabled={state === 'Disabled'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
