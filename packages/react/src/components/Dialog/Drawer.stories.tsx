import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from './Dialog';
import { Button } from '../Button/Button';

const Details = () => (
  <dl className="grid grid-cols-[auto_1fr] gap-x-inline-lg gap-y-stack-sm text-body-sm">
    {[
      ['Patient', 'Asha Kumar'],
      ['Doctor', 'Dr. Meera Iyer'],
      ['When', 'Thursday 30 October, 10:30'],
      ['Where', 'North clinic, room 4'],
      ['Reason', 'Follow-up on blood pressure'],
      ['Notes', 'Bring the readings from the last two weeks and the current prescription.'],
    ].map(([k, v]) => (
      <div key={k} className="contents">
        <dt className="text-text-tertiary">{k}</dt>
        <dd className="m-0 text-text-primary">{v}</dd>
      </div>
    ))}
  </dl>
);

const meta = {
  title: 'Components/Overlays/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  args: { title: 'Appointment details', side: 'right' },
  argTypes: { side: { control: 'inline-radio', options: ['right', 'left'] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 600 },
      description: {
        component: `
Mirrors the Figma set **Drawer** (15 Overlays): Side Right or Left. Width \`drawer/width\` (400 on web), full height, header with \`heading/sm\`, a scrolling body and a footer with a top border.

**When to use**: details or a longer task without leaving the page: appointment details, filters, an edit form. Left is for navigation on small screens.

**Behaviour**: modal by default, like Dialog (Scrim, focus trap, Esc, focus back to the trigger). With \`<Drawer modal={false}>\` it doesn't block the page or trap focus.
`,
      },
    },
  },
  render: (args) => (
    <Drawer defaultOpen>
      <DrawerTrigger><Button variant="secondary">View details</Button></DrawerTrigger>
      <DrawerContent
        {...args}
        footer={
          <>
            <DrawerClose asChild><Button variant="secondary">Close</Button></DrawerClose>
            <Button leadingIcon="calendar">Reschedule</Button>
          </>
        }
      >
        <Details />
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: 'left', title: 'Navigation' } };
