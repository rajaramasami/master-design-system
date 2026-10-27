import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextField } from './TextField';
import { IconButton } from '../IconButton/IconButton';
import { iconNames } from '../../icons/registry';

const STATES = ['Default', 'Hover', 'Focus', 'Filled', 'Error', 'Disabled', 'Read-only'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Inputs/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'name@example.com', description: 'We send appointment confirmations here.', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    prefixIcon: { control: 'select', options: [undefined, ...iconNames] },
    suffixIcon: { control: 'select', options: [undefined, ...iconNames] },
    error: { control: 'text' },
    suffix: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma set **Text Field** (11 Inputs): Size sm, md, lg × State Default, Hover, Focus, Filled, Error, Disabled, Read-only.

**When to use**: short, single-line answers: names, emails, phone numbers, search. Use Textarea for anything longer than a sentence.

**Content**: the label says what to enter ("Email"), the description says why or how ("We send confirmations here"). Don't put instructions in the placeholder: it disappears as soon as someone types.

**Validation**: show \`error\` after the person leaves the field or submits, not on every keystroke. The error replaces the description and appears as a red border, an alert icon and a message together, so it never relies on colour alone.

**Accessibility**: the label is a real \`<label>\` (use \`hideLabel\` to hide it visually, never remove it). Description and error are linked with \`aria-describedby\`; an error sets \`aria-invalid\`. Read-only fields stay focusable so their value can be read and copied; disabled fields are skipped.
`,
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { decorators: [(S) => <div className="max-w-[360px]"><S /></div>] };

export const Search: Story = {
  args: { label: 'Search patients', hideLabel: true, placeholder: 'Search by name or ID', prefixIcon: 'search', description: undefined },
  decorators: [(S) => <div className="max-w-[360px]"><S /></div>],
};

export const Password: Story = {
  name: 'With an interactive suffix',
  render: function Render() {
    const [shown, setShown] = useState(false);
    return (
      <div className="max-w-[360px]">
        <TextField
          label="Password"
          type={shown ? 'text' : 'password'}
          defaultValue="correct horse"
          description="At least 12 characters."
          suffix={<IconButton variant="ghost" size="sm" icon={shown ? 'eye-off' : 'eye'} label={shown ? 'Hide password' : 'Show password'} onClick={() => setShown((s) => !s)} className="-mr-inset-xs" />}
        />
      </div>
    );
  },
};

/** The Figma matrix: 7 states × 3 sizes. Hover and Focus are forced with the pseudo-states addon. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    a11y: { test: 'todo' },
    pseudo: { hover: ['[data-state-cell="Hover"] [data-slot="field-box"]'], focusWithin: ['[data-state-cell="Focus"] [data-slot="field-box"]'] },
  },
  render: () => (
    <div className="grid grid-cols-[96px_repeat(3,280px)] items-start gap-x-inline-lg gap-y-stack-lg">
      <span />
      {SIZES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {STATES.map((state) => (
        <div key={state} className="contents">
          <span className="pt-inset-xs text-label-sm text-text-tertiary">{state}</span>
          {SIZES.map((size) => (
            <div key={size} data-state-cell={state}>
              <TextField
                size={size}
                label="Label"
                placeholder="Placeholder"
                description={state === 'Error' ? undefined : 'Helper text'}
                error={state === 'Error' ? 'Error message' : undefined}
                defaultValue={['Filled', 'Error', 'Read-only'].includes(state) ? 'Value' : undefined}
                disabled={state === 'Disabled'}
                readOnly={state === 'Read-only'}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
