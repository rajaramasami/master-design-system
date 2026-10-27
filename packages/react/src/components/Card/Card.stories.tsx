import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Badge } from '../Badge/Badge';

const meta = {
  title: 'Components/Data display/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Annual check-up',
    description: 'Tue 4 Nov · 10:30 · Dr Meera Iyer',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Card** (12 Data display): Variant Outline, Elevated, Filled × State Default, Hover, Pressed, Focus, Selected, Disabled.

**When to use**: to group one item's content and actions (an appointment, a plan, a result). For many similar items in a column, a List is lighter.

**Interactive cards**: pass \`href\` or \`onClick\`. The title becomes the link or button and stretches over the whole card, so the card has one name and one tab stop. Put other actions in \`action\` or \`footer\`; they stay separately clickable above it.

**Accessibility**: the description is attached with \`aria-describedby\`. A selectable card uses \`aria-pressed\`, and Selected also shows a check icon so it doesn't rely on the border colour.
`,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onClick: () => {} },
};

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Selected', 'Disabled'] as const;

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] [data-card-action]'],
      active: ['[data-state-cell="Pressed"] [data-card-action]'],
      focusVisible: ['[data-state-cell="Focus"] [data-card-action]'],
    },
  },
  render: () => (
    <div className="grid grid-cols-[80px_repeat(6,220px)] items-start gap-x-inline-md gap-y-stack-lg">
      <span />
      {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['outline', 'elevated', 'filled'] as const).map((v) => (
        <div key={v} className="contents">
          <span className="text-label-sm capitalize text-text-tertiary">{v}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <Card
                variant={v}
                title="Card title"
                description="Supporting text that explains the card."
                onClick={() => {}}
                selected={state === 'Selected' ? true : undefined}
                disabled={state === 'Disabled'}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Static content with an overflow action and a footer. */
export const WithActions: Story = {
  render: () => (
    <Card
      className="max-w-[380px]"
      title="Annual check-up"
      description="Tue 4 Nov · 10:30 · Dr Meera Iyer"
      action={<IconButton variant="ghost" size="sm" icon="more" label="More for Annual check-up" />}
      footer={
        <>
          <Button variant="secondary" size="sm">Reschedule</Button>
          <Button size="sm">Check in</Button>
        </>
      }
    >
      <Badge tone="success" icon>Confirmed</Badge>
    </Card>
  ),
};

/** A link card: the whole card opens the page. */
export const LinkCard: Story = {
  render: () => <Card className="max-w-[380px]" variant="elevated" href="#results" title="Blood test results" description="Ready to view · 2 Nov" />,
};
