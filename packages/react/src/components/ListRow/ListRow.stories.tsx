import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListRow } from './ListRow';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Icon } from '../../icons/Icon';

const meta = {
  title: 'Components/Data display/List Row',
  component: ListRow,
  tags: ['autodocs'],
  args: { title: 'Anita Raman', description: 'Follow-up · Room 3', meta: '10:30', onClick: () => {} },
  decorators: [(Story) => <List className="max-w-[420px]"><Story /></List>],
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **List Row** (12 Data display): Size sm, md, lg (\`row/min-height/*\`) × State Default, Hover, Pressed, Focus, Selected, Disabled, with Leading (avatar or icon), Badge, Meta and Chevron.

**Use** inside \`List\` (a \`ul\`); \`dividers\` adds lines between rows.

**Interactive rows**: pass \`href\` or \`onClick\`. The title becomes the link or button and covers the whole row (one tab stop); a chevron shows by default.

**Accessibility**: set Avatars to \`decorative\` when the row title already names the person. Selected rows use \`aria-pressed\` and show a check icon.
`,
      },
    },
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { leading: <Avatar name="Anita Raman" decorative /> },
};

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Selected', 'Disabled'] as const;

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  decorators: [(Story) => <Story />],
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] [data-row-action]'],
      active: ['[data-state-cell="Pressed"] [data-row-action]'],
      focusVisible: ['[data-state-cell="Focus"] [data-row-action]'],
    },
  },
  render: () => (
    <div className="grid grid-cols-[repeat(3,320px)] gap-x-inline-lg gap-y-stack-md">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-stack-sm">
          <span className="text-label-sm text-text-tertiary">Size {size}</span>
          <List>
            {STATES.map((state) => (
                <ListRow
                  key={state}
                  data-state-cell={state}
                  size={size}
                  title={state}
                  description={size === 'sm' ? undefined : 'Supporting text'}
                  leading={size === 'sm' ? <Icon name="calendar" size="md" className="text-icon-secondary" /> : <Avatar size={size === 'lg' ? 'md' : 'sm'} name="Anita Raman" decorative />}
                  meta="10:30"
                  onClick={() => {}}
                  selected={state === 'Selected' ? true : undefined}
                  disabled={state === 'Disabled'}
                />
            ))}
          </List>
        </div>
      ))}
    </div>
  ),
};

/** A typical appointment list with dividers, badges and links. */
export const AppointmentList: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <List dividers aria-label="Today’s appointments" className="max-w-[420px]">
      <ListRow href="#1" leading={<Avatar name="Anita Raman" decorative />} title="Anita Raman" description="Follow-up · Room 3" badge={<Badge tone="success" size="sm" icon>Checked in</Badge>} meta="10:30" />
      <ListRow href="#2" leading={<Avatar name="Dev Patel" decorative online />} title="Dev Patel" description="Video consult" meta="11:00" />
      <ListRow href="#3" leading={<Avatar decorative />} title="New patient" description="Intake form pending" badge={<Badge tone="warning" size="sm" icon>Forms due</Badge>} meta="11:45" />
    </List>
  ),
};
