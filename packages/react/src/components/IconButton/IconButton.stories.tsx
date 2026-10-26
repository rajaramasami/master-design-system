import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { iconNames } from '../../icons/registry';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading'] as const;

const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: 'plus', label: 'Add patient', variant: 'primary', size: 'md', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    icon: { control: 'select', options: iconNames },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma sets **Icon Button / Primary, Secondary, Ghost, Danger** (10 Actions).

**When to use**: compact actions whose icon is universally understood: add, close, more, edit, delete. Use a text Button when the action needs words.

**Accessibility**: \`label\` is required and becomes the accessible name, so the button can't ship without one. Show the same text in a Tooltip for sighted users (Tooltip arrives in Phase 3). Square at every size: 32/40/48 px on web, 36/44/50 pt on iOS and 40/48/56 dp on Android, all above the minimum touch target.
`,
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Toolbar: Story = {
  name: 'In a toolbar',
  render: () => (
    <div className="inline-flex items-center gap-inline-xs rounded-control border border-border-default bg-bg-surface p-inset-xs">
      <IconButton variant="ghost" size="sm" icon="edit" label="Edit" />
      <IconButton variant="ghost" size="sm" icon="copy" label="Duplicate" />
      <IconButton variant="ghost" size="sm" icon="download" label="Download" />
      <IconButton variant="ghost" size="sm" icon="more" label="More actions" />
    </div>
  ),
};

/** The full Figma matrix: 4 variants × 3 sizes × 6 states = 72 icon buttons. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    pseudo: {
      hover: ['[data-state-cell="Hover"] button'],
      active: ['[data-state-cell="Pressed"] button'],
      focusVisible: ['[data-state-cell="Focus"] button'],
    },
    controls: { disable: true },
    a11y: { test: 'todo' },
  },
  render: () => (
    <div className="flex flex-col gap-section-md">
      {VARIANTS.map((variant) => (
        <section key={variant} className="flex flex-col gap-stack-sm">
          <h3 className="text-heading-sm capitalize">{variant}</h3>
          <div className="grid grid-cols-[48px_repeat(6,72px)] items-center gap-y-stack-md">
            <span />
            {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
            {SIZES.map((size) => (
              <div key={size} className="contents">
                <span className="text-label-sm text-text-tertiary">{size}</span>
                {STATES.map((state) => (
                  <div key={state} data-state-cell={state}>
                    <IconButton variant={variant} size={size} icon="plus" label="Add" disabled={state === 'Disabled'} loading={state === 'Loading'} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
