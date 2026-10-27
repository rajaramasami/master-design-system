import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import {
  Button, Dialog, DialogClose, DialogContent, Drawer, DrawerClose, DrawerContent, FieldMessage, Icon, IconButton,
  Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, Select, SelectItem, TextField, Tooltip,
} from '@rajaramasami/mds-react';

type Open = 'details' | 'reschedule' | 'cancel' | null;

function AppointmentCard() {
  const [open, setOpen] = useState<Open>(null);
  const [status, setStatus] = useState<'booked' | 'moved' | 'cancelled'>('booked');
  const [time, setTime] = useState('10:30');
  const close = (o: boolean) => !o && setOpen(null);

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-stack-md">
      <article className="flex items-start gap-inline-md rounded-surface border border-border-default bg-bg-surface p-inset-lg">
        <div className="flex size-control-lg shrink-0 items-center justify-center rounded-control bg-action-primary-subtle text-icon-brand">
          <Icon name="calendar" size="md" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-stack-2xs">
          <h2 className="text-body-md-strong">Follow-up with Dr. Meera Iyer</h2>
          <p className="text-body-sm text-text-secondary">Thursday 30 October, {time} · North clinic</p>
          {status === 'cancelled' && <FieldMessage tone="warning">Cancelled. The patient was notified by text.</FieldMessage>}
          {status === 'moved' && <FieldMessage tone="success">Moved to {time}. The patient was notified by text.</FieldMessage>}
        </div>
        <Menu modal={false}>
          <Tooltip content="More actions">
            <MenuTrigger>
              <IconButton variant="ghost" icon="more" label="More actions" disabled={status === 'cancelled'} />
            </MenuTrigger>
          </Tooltip>
          <MenuContent align="end">
            <MenuItem icon="file" onSelect={() => setOpen('details')}>View details</MenuItem>
            <MenuItem icon="calendar" onSelect={() => setOpen('reschedule')}>Reschedule</MenuItem>
            <MenuSeparator />
            <MenuItem icon="trash" variant="danger" onSelect={() => setOpen('cancel')}>Cancel appointment</MenuItem>
          </MenuContent>
        </Menu>
      </article>

      <Drawer open={open === 'details'} onOpenChange={close}>
        <DrawerContent title="Appointment details" footer={<DrawerClose asChild><Button variant="secondary">Close</Button></DrawerClose>}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-inline-lg gap-y-stack-sm text-body-sm">
            {[['Patient', 'Asha Kumar'], ['Doctor', 'Dr. Meera Iyer'], ['When', `Thursday 30 October, ${time}`], ['Where', 'North clinic, room 4'], ['Reason', 'Follow-up on blood pressure']].map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-text-tertiary">{k}</dt><dd className="m-0">{v}</dd></div>
            ))}
          </dl>
        </DrawerContent>
      </Drawer>

      <Dialog open={open === 'reschedule'} onOpenChange={close}>
        <DialogContent
          title="Reschedule appointment"
          description="We’ll text the patient the new time."
          footer={
            <>
              <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
              <Button onClick={() => { setStatus('moved'); setOpen(null); }}>Save new time</Button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-inline-md max-[520px]:grid-cols-1">
            <TextField label="Date" type="date" defaultValue="2026-10-30" />
            <Select label="Time" value={time} onValueChange={setTime}>
              {['09:30', '10:30', '15:00', '16:30'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'cancel'} onOpenChange={close}>
        <DialogContent
          size="sm"
          title="Cancel this appointment?"
          description="The slot goes to the next patient on the waiting list. This can’t be undone."
          footer={
            <>
              <DialogClose asChild><Button variant="secondary">Keep appointment</Button></DialogClose>
              <Button variant="danger" onClick={() => { setStatus('cancelled'); setOpen(null); }}>Cancel appointment</Button>
            </>
          }
        />
      </Dialog>
    </div>
  );
}

const meta = {
  title: 'Patterns/Manage an appointment',
  component: AppointmentCard,
  parameters: {
    layout: 'padded',
    docs: {
      story: { inline: false, iframeHeight: 560 },
      description: {
        component:
          'Every Phase 3 overlay working together: a Tooltip names the More actions IconButton, a Menu lists the actions, a Drawer shows details, a Dialog with a Select reschedules, and a Danger confirmation cancels. Try it with the keyboard only: focus always returns to where you were.',
      },
    },
  },
} satisfies Meta<typeof AppointmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Opens the menu with the keyboard, chooses Cancel, and checks focus lands on the safe action. */
export const CancelFlow: Story = {
  name: 'Cancel flow (keyboard)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'More actions' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Cancel appointment' }));
    await screen.findByRole('dialog', { name: 'Cancel this appointment?' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Keep appointment' })).toHaveFocus());
  },
};
