import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { RadioGroup, Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';
import { axeViolations } from '../../test/axe';

describe('Checkbox', () => {
  it('toggles with a click on the box or the label, and with Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Send me reminders" description="By SMS, a day before." />);
    const box = screen.getByRole('checkbox', { name: 'Send me reminders' });
    expect(box).toHaveAccessibleDescription('By SMS, a day before.');
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(screen.getByText('Send me reminders'));
    expect(box).not.toBeChecked();
    await user.keyboard(' ');
    expect(box).toBeChecked();
  });

  it('reads as "mixed" when indeterminate, as a select-all control', () => {
    render(<Checkbox label="Select all" checked="indeterminate" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('a group error marks every checkbox and is announced with the group', () => {
    render(
      <CheckboxGroup label="Symptoms" error="Choose at least one symptom.">
        <Checkbox label="Fever" />
        <Checkbox label="Cough" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole('group', { name: 'Symptoms' })).toBeInTheDocument();
    for (const c of screen.getAllByRole('checkbox')) expect(c).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Choose at least one symptom.')).toBeInTheDocument();
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Locked" disabled />);
    await user.click(screen.getByText('Locked'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});

describe('RadioGroup', () => {
  function Visit() {
    const [value, setValue] = useState('in-person');
    return (
      <RadioGroup label="Appointment type" value={value} onValueChange={setValue}>
        <Radio value="in-person" label="In person" />
        <Radio value="video" label="Video call" description="A link arrives by email." />
        <Radio value="phone" label="Phone call" />
      </RadioGroup>
    );
  }

  it('is a named radiogroup where arrow keys move the selection', async () => {
    const user = userEvent.setup();
    render(<Visit />);
    expect(screen.getByRole('radiogroup', { name: 'Appointment type' })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('radio', { name: 'In person' })).toHaveFocus();
    // Hold the key as a person does: Radix moves focus a tick later and selects while the key is down.
    await user.keyboard('{ArrowDown>}');
    expect(screen.getByRole('radio', { name: 'Video call' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Video call' })).toBeChecked();
    await user.keyboard('{/ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Video call' })).toHaveAccessibleDescription('A link arrives by email.');
  });

  it('selects by clicking the label', async () => {
    const user = userEvent.setup();
    render(<Visit />);
    await user.click(screen.getByText('Phone call'));
    expect(screen.getByRole('radio', { name: 'Phone call' })).toBeChecked();
  });

  it('marks the group invalid and describes it with the error', () => {
    render(
      <RadioGroup label="Gender" error="Choose an option.">
        <Radio value="a" label="Woman" />
        <Radio value="b" label="Man" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Gender' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Choose an option.');
  });
});

describe('Switch', () => {
  it('is a switch named after the setting that toggles with Space', async () => {
    const user = userEvent.setup();
    render(<Switch label="Appointment reminders" description="Applies immediately." />);
    const sw = screen.getByRole('switch', { name: 'Appointment reminders' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await user.tab();
    await user.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Appointment reminders'));
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Choice controls', () => {
  it('have no accessibility violations in any state', async () => {
    const { container } = render(
      <>
        <CheckboxGroup label="Symptoms" description="Choose all that apply." error="Choose one.">
          <Checkbox label="Fever" defaultChecked />
          <Checkbox label="Cough" />
        </CheckboxGroup>
        <Checkbox label="Select all" checked="indeterminate" />
        <Checkbox label="Disabled" disabled defaultChecked />
        <RadioGroup label="Visit" defaultValue="a" orientation="horizontal">
          <Radio value="a" label="In person" />
          <Radio value="b" label="Video" disabled />
        </RadioGroup>
        <Switch label="Reminders" defaultChecked />
        <Switch label="Locked setting" disabled />
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
