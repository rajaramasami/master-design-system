import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, type AlertTone } from './Alert';
import { Button } from '../Button/Button';

const TONES: AlertTone[] = ['info', 'success', 'warning', 'danger'];
const COPY: Record<AlertTone, [string, string]> = {
  info: ['Clinic hours change next week', 'We open at 9:00 from Monday 10 Nov.'],
  success: ['Insurance verified', 'Your plan covers this visit.'],
  warning: ['Forms due before your visit', 'Complete the intake form to save time at check-in.'],
  danger: ['We couldn’t process your payment', 'Check the card details or use another card.'],
};

const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { tone: 'warning', title: COPY.warning[0], children: COPY.warning[1] },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Alert** (13 Feedback): Tone Info, Success, Warning, Danger × Layout Inline, Banner, with Show Actions and Show Close.

**When to use**: a message that stays until the situation changes or the person dismisses it. For a brief confirmation after an action, use a Toast. For a field error, use the field's error message.

**Content**: the title says what happened; the description says what to do next. Actions are Secondary and Ghost sm buttons.

**Accessibility**: the tone icon and text carry the meaning, not colour. By default the alert is part of the page and is not announced. Set \`announce\` when it appears after an action: Danger and Warning use \`role="alert"\`, Info and Success use \`role="status"\`.
`,
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onDismiss: () => {}, actions: <><Button size="sm" variant="secondary">Complete form</Button><Button size="sm" variant="ghost">Later</Button></> },
};

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-col gap-stack-xl p-inset-lg">
      <div className="grid max-w-[880px] grid-cols-2 gap-inline-lg gap-y-stack-md">
        {TONES.map((t) => (
          <Alert key={t} tone={t} title={COPY[t][0]} onDismiss={() => {}} actions={<><Button size="sm" variant="secondary">Action</Button><Button size="sm" variant="ghost">Dismiss</Button></>}>
            {COPY[t][1]}
          </Alert>
        ))}
      </div>
      <div className="flex flex-col">
        {TONES.map((t) => (
          <Alert key={t} tone={t} layout="banner" title={COPY[t][0]} onDismiss={() => {}}>{COPY[t][1]}</Alert>
        ))}
      </div>
    </div>
  ),
};
