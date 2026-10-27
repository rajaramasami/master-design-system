import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../provider/ThemeProvider';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { TextField } from '../TextField/TextField';
import { Dialog, DialogTrigger, DialogContent, DialogClose, Drawer, DrawerTrigger, DrawerContent, BottomSheet, BottomSheetTrigger, BottomSheetContent } from './Dialog';
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuRadioGroup, MenuRadioItem, MenuSeparator } from '../Menu/Menu';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover/Popover';
import { Select, SelectItem } from '../Select/Select';
import { Tooltip } from '../Tooltip/Tooltip';
import { axeViolations } from '../../test/axe';

function DeleteDialog({ onDelete = () => {} }: { onDelete?: () => void }) {
  return (
    <Dialog>
      <DialogTrigger><Button variant="danger">Delete record</Button></DialogTrigger>
      <DialogContent size="sm" title="Delete this record?" description="This can’t be undone." footer={
        <>
          <DialogClose asChild><Button variant="secondary">Keep record</Button></DialogClose>
          <Button variant="danger" onClick={onDelete}>Delete record</Button>
        </>
      } />
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens as a named modal, traps focus, closes on Esc and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider theme="dark"><DeleteDialog /></ThemeProvider>);
    const trigger = screen.getByRole('button', { name: 'Delete record' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Delete this record?' });
    expect(dialog).toHaveAccessibleDescription('This can’t be undone.');
    // Portals into the ThemeProvider, so it keeps the dark theme.
    expect(dialog.closest('[data-theme="dark"]')).not.toBeNull();
    // Destructive: focus lands on the safe action, not on Delete.
    expect(screen.getByRole('button', { name: 'Keep record' })).toHaveFocus();
    // Tab cycles inside the dialog.
    for (let i = 0; i < 4; i++) await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('focuses the first field when there is one', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger><Button>Edit name</Button></DialogTrigger>
        <DialogContent title="Edit name" footer={<Button>Save</Button>}>
          <TextField label="Full name" />
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Edit name' }));
    expect(await screen.findByRole('textbox', { name: 'Full name' })).toHaveFocus();
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    render(<DeleteDialog />);
    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    const dialog = await screen.findByRole('dialog');
    expect(await axeViolations(dialog)).toEqual([]);
  });
});

describe('Drawer and BottomSheet', () => {
  it('open as named dialogs with a close button', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Drawer>
          <DrawerTrigger><Button>Details</Button></DrawerTrigger>
          <DrawerContent title="Appointment details" footer={<Button>Reschedule</Button>}>Body</DrawerContent>
        </Drawer>
        <BottomSheet>
          <BottomSheetTrigger><Button>Log reading</Button></BottomSheetTrigger>
          <BottomSheetContent title="Log a reading" footer={<Button size="lg">Save reading</Button>}>Body</BottomSheetContent>
        </BottomSheet>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Details' }));
    const drawer = await screen.findByRole('dialog', { name: 'Appointment details' });
    expect(screen.getByRole('button', { name: 'Reschedule' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(drawer).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Log reading' }));
    expect(await screen.findByRole('dialog', { name: 'Log a reading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

describe('Menu', () => {
  it('opens from the keyboard, moves with arrows, jumps by typing and returns focus on Esc', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger><IconButton variant="ghost" icon="more" label="More actions" /></MenuTrigger>
        <MenuContent>
          <MenuItem icon="edit" shortcut="⌘E">Edit</MenuItem>
          <MenuItem icon="copy">Duplicate</MenuItem>
          <MenuSeparator />
          <MenuItem icon="trash" variant="danger" onSelect={onSelect}>Delete</MenuItem>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'More actions' });
    trigger.focus();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(screen.getByRole('menuitem', { name: /Edit/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-variant', 'danger');
    expect(await axeViolations(menu)).toEqual([]);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('marks the chosen radio item', async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <MenuTrigger><Button variant="secondary" trailingIcon="chevron-down">Sort</Button></MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value="date">
            <MenuRadioItem value="date">Date</MenuRadioItem>
            <MenuRadioItem value="name">Name</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );
    await user.click(screen.getByRole('button', { name: 'Sort' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Date' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Select', () => {
  it('is a labelled combobox that selects with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="Clinic" placeholder="Choose a clinic" description="Where you’ll be seen." onValueChange={onValueChange}>
        <SelectItem value="north">North clinic</SelectItem>
        <SelectItem value="south">South clinic</SelectItem>
      </Select>,
    );
    const box = screen.getByRole('combobox', { name: 'Clinic' });
    expect(box).toHaveTextContent('Choose a clinic');
    expect(box).toHaveAccessibleDescription('Where you’ll be seen.');
    box.focus();
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('south');
    await waitFor(() => expect(box).toHaveTextContent('South clinic'));
  });

  it('shows an error state', () => {
    render(
      <Select label="Clinic" error="Choose a clinic.">
        <SelectItem value="north">North clinic</SelectItem>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Choose a clinic.');
  });
});

describe('Popover and Tooltip', () => {
  it('popover is a named dialog that closes on Esc and returns focus', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger><Button variant="ghost" leadingIcon="info">What is this?</Button></PopoverTrigger>
        <PopoverContent title="Blood pressure">Two numbers, measured in mmHg.</PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'What is this?' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Blood pressure' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('tooltip appears on keyboard focus and describes its trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Add patient" delay={0}>
        <IconButton icon="plus" label="Add patient" />
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Add patient');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });
});
