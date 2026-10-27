import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { IconButton } from '../IconButton/IconButton';

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Add patient', side: 'top', children: <IconButton icon="plus" label="Add patient" /> },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] }, children: { control: false } },
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: false, iframeHeight: 200 },
      description: {
        component: `
Mirrors the Figma set **Tooltip** (15 Overlays): Placement Top, Bottom, Left, Right. \`bg/inverse\` with \`text/inverse\` (17.7:1 light, 19.1:1 dark), \`body/sm\`, max width \`tooltip/max-width\`.

**When to use**: one short phrase that names an IconButton or explains an abbreviation. No links or actions: use a Popover. Touch screens have no hover, so never put essential information only in a tooltip.

**Behaviour**: appears after 300 ms on hover and immediately on keyboard focus; Esc or moving away hides it. It describes its trigger with \`aria-describedby\`. Flips to the other side when there is no room.
`,
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The Figma matrix: the four placements, shown open. */
export const Placements: Story = {
  name: 'All placements (Figma matrix)',
  parameters: { controls: { disable: true }, docs: { story: { iframeHeight: 320 } } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-[160px] gap-y-[96px] p-inset-xl">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <div key={side} className="flex justify-center">
          <Tooltip content={`Placement ${side}`} side={side} open>
            <IconButton variant="secondary" icon="info" label={`Placement ${side}`} />
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const Toolbar: Story = {
  name: 'On a toolbar',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="inline-flex items-center gap-inline-xs rounded-control border border-border-default bg-bg-surface p-inset-xs">
      {([['edit', 'Edit'], ['copy', 'Duplicate'], ['download', 'Download'], ['trash', 'Delete']] as const).map(([icon, label]) => (
        <Tooltip key={icon} content={label}>
          <IconButton variant="ghost" size="sm" icon={icon} label={label} />
        </Tooltip>
      ))}
    </div>
  ),
};
