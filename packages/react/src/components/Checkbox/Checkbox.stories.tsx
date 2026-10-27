import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from './Checkbox';

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Error', 'Disabled'] as const;
const CHECKED = [false, true, 'indeterminate'] as const;

const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Send me appointment reminders', description: 'By SMS, the day before.' },
  argTypes: { checked: { control: 'inline-radio', options: [false, true, 'indeterminate'] }, error: { control: 'text' } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Checkbox** (11 Inputs): Checked Unchecked, Checked, Indeterminate × State Default, Hover, Pressed, Focus, Error, Disabled.

**When to use**: independent on/off choices, and "select all" (Indeterminate when some are selected). Use a Switch for a setting that applies immediately, and Radio for one choice from a set.

**Groups**: wrap related checkboxes in \`CheckboxGroup\`. It renders a fieldset with a legend, so screen readers announce the question with each option. A group \`error\` marks every checkbox and shows one message.

**Accessibility**: the whole row is the target (the label is clickable and shares the hover and pressed styles). Space toggles. Indeterminate reads as "mixed".
`,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Group: Story = {
  name: 'In a group with select all',
  render: function Render() {
    const all = ['Fever', 'Cough', 'Headache', 'Fatigue'];
    const [picked, setPicked] = useState<string[]>(['Cough']);
    const state = picked.length === 0 ? false : picked.length === all.length ? true : 'indeterminate';
    return (
      <CheckboxGroup label="Symptoms" description="Choose all that apply." error={picked.length === 0 ? 'Choose at least one symptom.' : undefined}>
        <Checkbox label="All symptoms" checked={state} onCheckedChange={(c) => setPicked(c === true ? all : [])} />
        <div className="flex flex-col gap-stack-xs pl-inset-lg">
          {all.map((s) => (
            <Checkbox key={s} label={s} checked={picked.includes(s)} onCheckedChange={(c) => setPicked((p) => (c === true ? [...p, s] : p.filter((x) => x !== s)))} />
          ))}
        </div>
      </CheckboxGroup>
    );
  },
};

/** The Figma matrix: 3 checked values × 6 states. Hover, Pressed and Focus are forced with the pseudo-states addon. */
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
      {CHECKED.map((checked) => (
        <div key={String(checked)} className="contents">
          <span className="text-label-sm text-text-tertiary">{checked === true ? 'Checked' : checked === false ? 'Unchecked' : 'Indeterminate'}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <Checkbox label="Label" checked={checked} invalid={state === 'Error'} disabled={state === 'Disabled'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
