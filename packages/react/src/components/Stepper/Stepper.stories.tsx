import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const STEPS = [
  { label: 'Book test', description: 'Done 12 Oct' },
  { label: 'Prepare', description: 'Fast for 8 hours' },
  { label: 'Take test', description: 'At City Lab' },
  { label: 'Get results', description: 'Usually 2 days' },
];

const meta = {
  title: 'Components/Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: STEPS, current: 1, orientation: 'horizontal', 'aria-label': 'Blood test' },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma **Stepper** and **Step** (Status Complete, Current, Upcoming, Error), 14 Navigation.

**When to use**: progress through a fixed sequence, such as a booking flow, onboarding or care-plan stages.

**Layouts**: horizontal on web and tablet (it needs about 160 px per step); vertical in narrow columns; compact ("Step 2 of 4" with the current label) on phones. Connectors turn brand after completed steps.

**Accessibility**: an ordered list. The current step has \`aria-current="step"\`, and screen readers hear each step's status ("Completed", "Current step", "Not started", "Needs attention") before its label. Each status also differs by shape or icon. Steps are not links.
`,
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { render: (args) => <div className="max-w-[880px]"><Stepper {...args} /></div> };
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Compact: Story = { args: { orientation: 'compact' } };
export const WithError: Story = {
  args: { current: 2, steps: STEPS.map((s, i) => (i === 2 ? { ...s, status: 'error' as const, description: 'Lab closed today. Choose another time.' } : s)) },
  render: (args) => <div className="max-w-[880px]"><Stepper {...args} /></div>,
};

export const AllStatuses: Story = {
  name: 'All statuses (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <Stepper
      aria-label="Statuses"
      className="max-w-[880px]"
      current={1}
      steps={[{ label: 'Complete', description: 'Optional detail' }, { label: 'Current', description: 'Optional detail' }, { label: 'Error', description: 'Optional detail', status: 'error' }, { label: 'Upcoming', description: 'Optional detail' }]}
    />
  ),
};
