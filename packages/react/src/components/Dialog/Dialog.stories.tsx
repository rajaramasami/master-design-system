import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from './Dialog';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Select, SelectItem } from '../Select/Select';
import { Textarea } from '../Textarea/Textarea';

const meta = {
  title: 'Components/Overlays/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  args: { title: 'Dialog title', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 520 },
      description: {
        component: `
Mirrors the Figma set **Dialog** (15 Overlays): Size sm (\`dialog/width/sm\`, confirmations with no body), md (forms), lg (rich content). \`bg/surface\`, \`radius/sheet\`, \`elevation/xl\`, padding \`spacing/inset/xl\`, always over a Scrim.

**When to use**: to confirm a decision or complete a short task that needs full attention. On phones prefer BottomSheet or a full page.

**Content**: label actions with the outcome ("Cancel appointment", "Save changes"), never "OK" or "Yes". The secondary action comes first, the primary last.

**Focus**: moves to the first field; with no field, to the primary action. When the primary action is Danger, focus goes to the first action instead, so an accidental Enter can't confirm a destructive action (WAI-ARIA dialog guidance; Figma says primary). Add \`data-autofocus\` to an element to choose. Focus stays inside; Esc, Close or a scrim click close it, and focus returns to the trigger.

\`\`\`tsx
<Dialog>
  <DialogTrigger><Button>Edit details</Button></DialogTrigger>
  <DialogContent title="Edit details" footer={<><DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose><Button>Save changes</Button></>}>
    <TextField label="Full name" />
  </DialogContent>
</Dialog>
\`\`\`
`,
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Size=sm: a destructive confirmation with no body. */
export const Confirmation: Story = {
  name: 'sm: destructive confirmation',
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger><Button variant="danger" leadingIcon="trash">Cancel appointment</Button></DialogTrigger>
      <DialogContent
        size="sm"
        title="Cancel this appointment?"
        description="Dr. Meera Iyer, Thursday 30 October at 10:30. The slot goes to the next patient on the waiting list."
        footer={
          <>
            <DialogClose asChild><Button variant="secondary">Keep appointment</Button></DialogClose>
            <DialogClose asChild><Button variant="danger">Cancel appointment</Button></DialogClose>
          </>
        }
      />
    </Dialog>
  ),
};

/** Figma Size=md: a short form. Focus starts in the first field. */
export const Form: Story = {
  name: 'md: form',
  parameters: { docs: { story: { iframeHeight: 640 } } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger><Button leadingIcon="calendar">Reschedule</Button></DialogTrigger>
      <DialogContent
        title="Reschedule appointment"
        description="Choose a new time. We’ll text the patient the change."
        footer={
          <>
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <DialogClose asChild><Button>Save new time</Button></DialogClose>
          </>
        }
      >
        <div className="flex flex-col gap-stack-md">
          <div className="grid grid-cols-2 gap-inline-md max-[520px]:grid-cols-1">
            <TextField label="Date" type="date" defaultValue="2026-10-30" />
            <Select label="Time" defaultValue="1030">
              <SelectItem value="0930">09:30</SelectItem>
              <SelectItem value="1030">10:30</SelectItem>
              <SelectItem value="1500">15:00</SelectItem>
            </Select>
          </div>
          <Textarea label="Reason" placeholder="Optional" />
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/** Figma Size=lg: rich content that scrolls inside the dialog when it is taller than the screen. */
export const Rich: Story = {
  name: 'lg: rich content',
  parameters: { docs: { story: { iframeHeight: 640 } } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger><Button variant="secondary">Read consent form</Button></DialogTrigger>
      <DialogContent
        size="lg"
        title="Consent to share health records"
        footer={
          <>
            <DialogClose asChild><Button variant="secondary">Not now</Button></DialogClose>
            <DialogClose asChild><Button>I agree</Button></DialogClose>
          </>
        }
      >
        <div className="flex flex-col gap-stack-md text-text-secondary">
          {Array.from({ length: 6 }, (_, i) => (
            <p key={i}>
              Section {i + 1}. Your doctor can read the visit notes, prescriptions and test results you share here. You can stop sharing at any time from Settings, and we keep a record of who opened your file and when.
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};
