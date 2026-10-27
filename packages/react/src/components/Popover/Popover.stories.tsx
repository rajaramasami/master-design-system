import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';

const meta = {
  title: 'Components/Overlays/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  args: { title: 'Blood pressure', showClose: true },
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, iframeHeight: 320 },
      description: {
        component: `
Mirrors the Figma component **Popover** (15 Overlays): surface-raised, border/subtle, elevation/md, radius/surface, 320 wide.

**When to use**: rich, interactive content anchored to a trigger: an explanation, a quick edit, a filter panel. For one short phrase use Tooltip; for a task that needs full attention use Dialog.

**Behaviour**: opens on click, not hover. Focus moves inside; Esc and an outside click close it and return focus to the trigger. It is a non-modal \`role="dialog"\` named by its title.

\`\`\`tsx
<Popover>
  <PopoverTrigger><Button variant="ghost" leadingIcon="info">What is this?</Button></PopoverTrigger>
  <PopoverContent title="Blood pressure">Two numbers, in mmHg.</PopoverContent>
</Popover>
\`\`\`
`,
      },
    },
  },
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger><Button variant="ghost" leadingIcon="info">What is blood pressure?</Button></PopoverTrigger>
      <PopoverContent {...args}>
        Two numbers, measured in mmHg: the pressure when your heart beats, over the pressure between beats. Below 120/80 is in the normal range.
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explanation: Story = {};

/** With a footer (Figma "Show Footer"): a filter panel with ghost and primary sm Buttons. */
export const FilterPanel: Story = {
  name: 'Filter panel with footer',
  parameters: { docs: { story: { iframeHeight: 360 } } },
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger><Button variant="secondary" leadingIcon="filter">Filter</Button></PopoverTrigger>
      <PopoverContent
        title="Filter appointments"
        footer={
          <>
            <PopoverClose asChild><Button variant="ghost" size="sm">Clear</Button></PopoverClose>
            <PopoverClose asChild><Button size="sm">Apply</Button></PopoverClose>
          </>
        }
      >
        <div className="flex flex-col gap-stack-xs text-text-primary">
          <Checkbox label="Upcoming" defaultChecked />
          <Checkbox label="Completed" />
          <Checkbox label="Cancelled" />
        </div>
      </PopoverContent>
    </Popover>
  ),
};
