import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectItem, SelectLabel, SelectGroup, SelectSeparator } from './Select';
import { iconNames } from '../../icons/registry';

const STATES = ['Default', 'Hover', 'Focus', 'Filled', 'Error', 'Disabled'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const clinics = (
  <>
    <SelectItem value="north">North clinic</SelectItem>
    <SelectItem value="south">South clinic</SelectItem>
    <SelectItem value="east">East clinic</SelectItem>
    <SelectItem value="video" disabled>Video (no slots this week)</SelectItem>
  </>
);

const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Clinic', placeholder: 'Choose a clinic', description: 'Where you’ll be seen.', size: 'md', children: clinics },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    prefixIcon: { control: 'select', options: [undefined, ...iconNames] },
    error: { control: 'text' },
    children: { control: false },
  },
  decorators: [(S) => <div className="max-w-[360px]"><S /></div>],
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, iframeHeight: 340 },
      description: {
        component: `
Mirrors the Figma set **Select** (11 Inputs): Size sm, md, lg × State Default, Hover, Focus, Open, Filled, Error, Disabled. Same anatomy and tokens as TextField with a trailing chevron; the list uses the Menu Item style and shows the selected option with \`bg/selected\` and a check.

**When to use**: one value from a short known list, under about 15 options. For 2 to 6 options that should all be visible, use RadioGroup. Beyond about 15, a searchable combobox (planned) is easier.

**Keyboard**: Space, Enter or arrows open the list on the current value; arrows move; typing jumps to a match; Enter selects; Esc closes. It is a \`combobox\` with a \`listbox\`.
`,
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  name: 'Open, with groups',
  args: {
    defaultOpen: true,
    defaultValue: 'south',
    children: (
      <>
        <SelectGroup>
          <SelectLabel>In person</SelectLabel>
          <SelectItem value="north">North clinic</SelectItem>
          <SelectItem value="south">South clinic</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Remote</SelectLabel>
          <SelectItem value="video">Video call</SelectItem>
          <SelectItem value="phone">Phone call</SelectItem>
        </SelectGroup>
      </>
    ),
  },
  parameters: { docs: { story: { iframeHeight: 380 } } },
};

/** The Figma matrix without Open (see the Open story). Hover and Focus are forced with the pseudo-states addon. */
export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  decorators: [(S) => <S />],
  parameters: {
    controls: { disable: true },
    a11y: { test: 'todo' },
    docs: { story: { iframeHeight: 900 } },
    pseudo: { hover: ['[data-state-cell="Hover"] button'], focusVisible: ['[data-state-cell="Focus"] button'] },
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
              <Select
                size={size}
                label="Label"
                placeholder="Placeholder"
                description={state === 'Error' ? undefined : 'Helper text'}
                error={state === 'Error' ? 'Error message' : undefined}
                defaultValue={['Filled', 'Error'].includes(state) ? 'north' : undefined}
                disabled={state === 'Disabled'}
              >
                {clinics}
              </Select>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
