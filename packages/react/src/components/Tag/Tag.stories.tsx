import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Data display/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'Morning' },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Tag** (12 Data display): Size sm, md × State Default, Hover, Pressed, Focus, Selected, Disabled, with Show Icon and Removable.

**Three behaviours**
- **Static** (no handlers): a value label.
- **Toggle** (\`selected\` + \`onSelectedChange\`): a filter chip; a check icon appears when selected.
- **Removable** (\`onRemove\`): a chosen value with its own remove button.
- **Toggle and removable** (\`selected\` + \`onRemove\`): the pill and a separate remove button side by side, as in the Figma set **Tag / Selectable + Removable** (a button can't sit inside another button).

**Accessibility**: a toggle is a \`button\` with \`aria-pressed\`. The remove button is separate and named "Remove {label}". Both reach the 24 px minimum target (44 on iOS and Android via \`size/target/min\`) without changing the visible size.
`,
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Selected', 'Disabled'] as const;

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] button'],
      active: ['[data-state-cell="Pressed"] button'],
      focusVisible: ['[data-state-cell="Focus"] button[aria-pressed]'],
    },
  },
  render: () => (
    <div className="grid grid-cols-[110px_repeat(6,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['md', 'sm'] as const).map((size) => (['plain', 'icon', 'removable'] as const).map((kind) => (
        <div key={size + kind} className="contents">
          <span className="text-label-sm text-text-tertiary">{size} {kind}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <Tag
                size={size}
                icon={kind === 'icon' ? 'calendar' : undefined}
                selected={state === 'Selected'}
                onSelectedChange={() => {}}
                onRemove={kind === 'removable' ? () => {} : undefined}
                disabled={state === 'Disabled'}
              >
                Label
              </Tag>
            </div>
          ))}
        </div>
      )))}
    </div>
  ),
};

/** Filter chips: several can be on at once. */
export const Filters: Story = {
  render: () => {
    const [on, setOn] = useState<string[]>(['Morning']);
    const slots = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
    return (
      <div role="group" aria-label="Preferred times" className="flex flex-wrap gap-inline-sm">
        {slots.map((s) => (
          <Tag key={s} selected={on.includes(s)} onSelectedChange={(v) => setOn(v ? [...on, s] : on.filter((x) => x !== s))}>{s}</Tag>
        ))}
      </div>
    );
  },
};

/** Removable values, e.g. allergies added in a form. */
export const Removable: Story = {
  render: () => {
    const [items, setItems] = useState(['Penicillin', 'Peanuts', 'Latex']);
    return (
      <div className="flex flex-wrap gap-inline-sm">
        {items.map((i) => <Tag key={i} onRemove={() => setItems(items.filter((x) => x !== i))}>{i}</Tag>)}
      </div>
    );
  },
};
