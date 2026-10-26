import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { iconNames } from '../../icons/registry';

const VARIANTS = ['primary', 'primary-tinted', 'secondary', 'danger', 'ghost'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading'] as const;

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save changes', variant: 'primary', size: 'md', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    leadingIcon: { control: 'select', options: [undefined, ...iconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...iconNames] },
    asChild: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Mirrors the Figma sets **Button / Primary, Primary Tinted, Secondary, Danger, Ghost** (10 Actions, [open in Figma](https://www.figma.com/design/1Uekteu5rjD24j283aFKIg?node-id=12-2)).

**When to use**
- **Primary**: the single most important action in a view. One per view.
- **Primary Tinted**: a softer emphasis, for a second important action next to a Primary.
- **Secondary**: most other actions. **Ghost**: low-emphasis actions in toolbars and dense layouts.
- **Danger**: destructive actions such as Delete. Pair it with a confirmation.

**Content**: start with a verb ("Save changes", "Add patient"), sentence case, two or three words.

**States**: Hover, Pressed and Focus come from the browser. \`disabled\` and \`loading\` are props. Loading swaps the leading icon for a spinner and keeps the label, so the button doesn't change width.

**Accessibility**: a native \`<button>\` (Enter and Space activate it). Focus shows the offset ring from \`focus/ring-brand\` (\`focus/ring-danger\` on Danger). Loading sets \`aria-busy\` and ignores clicks while staying focusable. Icons are decorative and hidden from screen readers; the label names the button. With \`asChild\`, a link gets button styles and \`aria-disabled\` when disabled.
`,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  name: 'With icons',
  args: { leadingIcon: 'download', trailingIcon: 'chevron-down', children: 'Export', variant: 'secondary' },
};

export const Loading: Story = { args: { loading: true, leadingIcon: 'check' } };

export const AsLink: Story = {
  name: 'As a link',
  render: (args) => (
    <Button {...args} asChild variant="secondary" trailingIcon="external-link">
      <a href="https://www.figma.com/design/1Uekteu5rjD24j283aFKIg" target="_blank" rel="noreferrer">Open in Figma</a>
    </Button>
  ),
};

/**
 * The full Figma matrix: 5 variants × 3 sizes × 6 states = 90 buttons, the same
 * grid as the Figma component sets. Hover, Pressed and Focus are forced with the
 * pseudo-states addon so they can be compared side by side.
 */
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
          <h3 className="text-heading-sm capitalize">{variant.replace('-', ' ')}</h3>
          <div className="grid grid-cols-[48px_repeat(6,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
            <span />
            {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
            {SIZES.map((size) => (
              <div key={size} className="contents">
                <span className="text-label-sm text-text-tertiary">{size}</span>
                {STATES.map((state) => (
                  <div key={state} data-state-cell={state}>
                    <Button variant={variant} size={size} leadingIcon="plus" disabled={state === 'Disabled'} loading={state === 'Loading'}>
                      Button
                    </Button>
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
