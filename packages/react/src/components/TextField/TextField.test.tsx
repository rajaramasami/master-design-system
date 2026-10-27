import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import { Textarea } from '../Textarea/Textarea';
import { FieldMessage } from '../FieldMessage/FieldMessage';
import { axeViolations } from '../../test/axe';

describe('TextField', () => {
  it('is named by its label, also when the label is visually hidden', () => {
    render(
      <>
        <TextField label="Email" />
        <TextField label="Search patients" hideLabel prefixIcon="search" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByText('Search patients')).toHaveClass('sr-only');
    expect(screen.getByRole('textbox', { name: 'Search patients' })).toBeInTheDocument();
  });

  it('links the description with aria-describedby', () => {
    render(<TextField label="Phone" description="We only call about appointments." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We only call about appointments.');
  });

  it('shows an error as border, icon and message together, never colour alone', () => {
    const { container } = render(<TextField label="Email" description="Work email" error="Enter an email like name@example.com" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter an email like name@example.com');
    expect(screen.queryByText('Work email')).not.toBeInTheDocument();
    expect(container.querySelector('[data-invalid]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="alert"]')).toBeInTheDocument();
  });

  it('types, and blocks typing when read-only or disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <TextField label="Name" />
        <TextField label="Patient ID" readOnly defaultValue="P-1042" />
        <TextField label="Clinic" disabled />
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Asha');
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Asha');
    await user.type(screen.getByRole('textbox', { name: 'Patient ID' }), 'x');
    expect(screen.getByRole('textbox', { name: 'Patient ID' })).toHaveValue('P-1042');
    expect(screen.getByRole('textbox', { name: 'Clinic' })).toBeDisabled();
  });

  it('has no accessibility violations in any state', async () => {
    const { container } = render(
      <>
        <TextField label="Default" description="Helper" />
        <TextField label="Error" error="Something went wrong" />
        <TextField label="Disabled" disabled />
        <TextField label="Read-only" readOnly defaultValue="Value" />
        <TextField label="Hidden label" hideLabel prefixIcon="search" suffixIcon="close" />
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Textarea', () => {
  it('counts characters and tells screen readers the limit', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Symptoms" description="Describe what you feel." showCounter maxLength={200} />);
    const box = screen.getByRole('textbox', { name: 'Symptoms' });
    await user.type(box, 'Headache');
    expect(screen.getByText('8/200')).toBeInTheDocument();
    expect(box).toHaveAccessibleDescription('Describe what you feel. Up to 200 characters');
    expect(box).toHaveAttribute('maxlength', '200');
  });

  it('shows the error state and has no accessibility violations', async () => {
    const { container } = render(<Textarea label="Notes" error="Add at least one note." showCounter maxLength={100} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('FieldMessage', () => {
  it('shows an icon for every tone except Helper, so meaning is not colour only', () => {
    const { container } = render(
      <>
        <FieldMessage>Helper</FieldMessage>
        <FieldMessage tone="success">Saved</FieldMessage>
        <FieldMessage tone="warning">Check this</FieldMessage>
        <FieldMessage tone="error">Required</FieldMessage>
      </>,
    );
    const icons = [...container.querySelectorAll('[data-icon]')].map((i) => i.getAttribute('data-icon'));
    expect(icons).toEqual(['success', 'warning', 'alert']);
  });
});
