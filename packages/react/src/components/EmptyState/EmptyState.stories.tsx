import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, type EmptyStateType } from './EmptyState';
import { Button } from '../Button/Button';

const COPY: Record<EmptyStateType, { title: string; description: string; actions: [string, string] }> = {
  empty: { title: 'No appointments yet', description: 'Book a visit and it will show here.', actions: ['Learn more', 'Book appointment'] },
  'no-results': { title: 'No matches', description: 'Try a different name or clear the filters.', actions: ['Clear filters', 'New search'] },
  error: { title: 'Couldn’t load your records', description: 'Something went wrong on our side. Try again in a moment.', actions: ['Contact support', 'Try again'] },
  offline: { title: 'You’re offline', description: 'Connect to the internet to see your latest results.', actions: ['Settings', 'Retry'] },
};

const meta = {
  title: 'Components/Feedback/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  args: { type: 'empty', title: COPY.empty.title, description: COPY.empty.description },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Empty State** (13 Feedback): Type Empty, No results, Error, Offline, with Show Actions.

**When to use**: whenever a list, table or panel has nothing to show. Never leave the area blank.

**Content**: the title says what happened; the description gives the next step; up to two actions, secondary first and primary last.

**Accessibility**: the title is a heading (\`h3\` by default; set \`titleAs\` to fit the page outline). The icon is decorative.
`,
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { actions: <><Button variant="secondary">Learn more</Button><Button>Book appointment</Button></> },
};

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-2 gap-inline-lg">
      {(Object.keys(COPY) as EmptyStateType[]).map((t) => (
        <div key={t} className="rounded-surface border border-border-subtle">
          <EmptyState
            type={t}
            title={COPY[t].title}
            description={COPY[t].description}
            actions={<><Button variant="secondary">{COPY[t].actions[0]}</Button><Button>{COPY[t].actions[1]}</Button></>}
          />
        </div>
      ))}
    </div>
  ),
};
