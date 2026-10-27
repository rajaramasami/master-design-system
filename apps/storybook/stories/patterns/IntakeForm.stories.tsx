import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FieldMessage,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Textarea,
} from '@rajaramasami/mds-react';

const SYMPTOMS = ['Fever', 'Cough', 'Headache', 'Fatigue', 'Shortness of breath'];

type Errors = Partial<Record<'name' | 'phone' | 'visit' | 'symptoms' | 'details' | 'consent', string>>;

function validate(data: FormData, symptoms: string[]): Errors {
  const e: Errors = {};
  if (!String(data.get('name') ?? '').trim()) e.name = 'Enter the patient’s full name.';
  const phone = String(data.get('phone') ?? '').replace(/\D/g, '');
  if (phone.length !== 10) e.phone = 'Enter a 10-digit mobile number, for example 98765 43210.';
  if (!data.get('visit')) e.visit = 'Choose how you’d like to see the doctor.';
  if (symptoms.length === 0) e.symptoms = 'Choose at least one symptom, or describe it below.';
  if (String(data.get('details') ?? '').trim().length < 10) e.details = 'Add a few words about when it started.';
  if (!data.get('consent')) e.consent = 'You need to agree before we can book the visit.';
  return e;
}

function IntakeForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(new FormData(form), symptoms);
    setErrors(found);
    setSent(false);
    const first = Object.keys(found)[0];
    if (first) {
      // Move focus to the first field with an error, as the error summary pattern recommends.
      form.querySelector<HTMLElement>(`[name="${first}"], [data-field="${first}"] button, [data-field="${first}"] [role="radio"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  };

  const count = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} className="mx-auto flex max-w-[560px] flex-col gap-section-md rounded-surface border border-border-default bg-bg-surface p-inset-xl shadow-elevation-sm">
      <header className="flex flex-col gap-stack-xs">
        <p className="text-overline text-text-brand">CarePath · New visit</p>
        <h1 className="text-heading-lg">Tell us about your visit</h1>
        <p className="text-body-md text-text-secondary">It takes about two minutes. Your doctor reads this before you arrive.</p>
      </header>

      {count > 0 && (
        <div role="alert" className="rounded-control border border-status-danger-border bg-status-danger-bg p-inset-md">
          <FieldMessage tone="error" className="text-body-md">
            {count === 1 ? 'There is 1 thing to fix before you continue.' : `There are ${count} things to fix before you continue.`}
          </FieldMessage>
        </div>
      )}
      {sent && (
        <div role="status" className="rounded-control border border-status-success-border bg-status-success-bg p-inset-md">
          <FieldMessage tone="success" className="text-body-md">Thanks. Your visit request was sent; we’ll text you a time shortly.</FieldMessage>
        </div>
      )}

      <section className="flex flex-col gap-stack-lg">
        <h2 className="text-heading-sm">Patient</h2>
        <TextField name="name" label="Full name" autoComplete="name" error={errors.name} />
        <TextField
          name="phone"
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          prefixIcon="phone"
          description="We text you the appointment time. No marketing."
          error={errors.phone}
        />
      </section>

      <section className="flex flex-col gap-stack-lg">
        <h2 className="text-heading-sm">Visit</h2>
        <div data-field="visit">
          <RadioGroup name="visit" label="How would you like to see the doctor?" error={errors.visit}>
            <Radio value="clinic" label="At the clinic" description="Main clinic. Parking available." />
            <Radio value="video" label="Video call" description="We send a link by text 10 minutes before." />
            <Radio value="home" label="Home visit" description="Extra fee of ₹300." />
          </RadioGroup>
        </div>
        <div data-field="symptoms">
          <CheckboxGroup label="Symptoms" description="Choose all that apply." error={errors.symptoms}>
            {SYMPTOMS.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={symptoms.includes(s)}
                onCheckedChange={(c) => setSymptoms((p) => (c === true ? [...p, s] : p.filter((x) => x !== s)))}
              />
            ))}
          </CheckboxGroup>
        </div>
        <Textarea
          name="details"
          label="What’s going on?"
          placeholder="For example: headache since Monday, worse in the morning"
          description="When it started and anything that makes it better or worse."
          showCounter
          maxLength={500}
          error={errors.details}
        />
      </section>

      <section className="flex flex-col gap-stack-md">
        <h2 className="text-heading-sm">Preferences</h2>
        <Switch name="reminders" label="Appointment reminders" description="A text the day before your visit." defaultChecked />
        <div data-field="consent">
          <Checkbox name="consent" value="yes" label="I agree that my doctor can read this information." error={errors.consent} />
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-inline-sm">
        <Button type="reset" variant="ghost" onClick={() => { setErrors({}); setSymptoms([]); setSent(false); }}>Clear form</Button>
        <Button type="submit" loading={submitting} trailingIcon="arrow-right">Request visit</Button>
      </div>
    </form>
  );
}

const meta = {
  title: 'Patterns/Patient intake form',
  component: IntakeForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Every Phase 2 control in one realistic form. Errors appear on submit, not while typing; a summary announces how many fields need attention, and focus moves to the first one. Try it with the keyboard only, and switch Theme, Brand, Platform and Density in the toolbar.',
      },
    },
  },
} satisfies Meta<typeof IntakeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

/** Submits the empty form and checks that every error is announced and focus moves to the first one. */
export const WithErrors: Story = {
  name: 'Submitted with errors',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Request visit' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('There are 6 things to fix');
    await expect(canvas.getByRole('textbox', { name: 'Full name' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Mobile number' })).toHaveAttribute('aria-invalid', 'true');
  },
};
