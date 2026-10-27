import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { variant: 'underline', defaultValue: 'overview' },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma sets **Tabs** (Style Underline, Pill) and **Tab** (Style × Selected × State Default, Hover, Pressed, Focus, Disabled, with Show Icon and Show Count), 14 Navigation.

**When to use**: switching between views of the same content. Underline for page sections; Pill for compact view switches inside a card or toolbar. Use 2–6 tabs. To go to another page, use the Sidebar or Tab Bar.

**Behaviour**: the list scrolls sideways on small screens instead of wrapping.

**Accessibility**: \`role="tablist"\` named with \`aria-label\`; each tab has \`aria-selected\` and controls its panel. Arrow keys move between tabs, Home and End jump to the ends, Tab moves into the panel. Selection shows as a 2 px indicator or a bordered pill, not colour alone.
`,
      },
    },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Patient record">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="results" count={3} countLabel="new">Results</TabsTrigger>
        <TabsTrigger value="medicines">Medicines</TabsTrigger>
      </TabsList>
      {['overview', 'timeline', 'results', 'medicines'].map((v) => (
        <TabsContent key={v} value={v} className="text-body-sm text-text-secondary">The {v} panel.</TabsContent>
      ))}
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {};
export const Pill: Story = { args: { variant: 'pill' } };

const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'] as const;

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] [role="tab"]'],
      active: ['[data-state-cell="Pressed"] [role="tab"]'],
      focusVisible: ['[data-state-cell="Focus"] [role="tab"]'],
    },
  },
  render: () => (
    <div className="grid grid-cols-[150px_repeat(5,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {STATES.map((s) => <span key={s} className="text-label-sm text-text-tertiary">{s}</span>)}
      {(['underline', 'pill'] as const).map((variant) => [false, true].map((selected) => (
        <div key={variant + selected} className="contents">
          <span className="text-label-sm text-text-tertiary">{variant}{selected ? ', selected' : ''}</span>
          {STATES.map((state) => (
            <div key={state} data-state-cell={state}>
              <Tabs variant={variant} value={selected ? 'a' : 'x'}>
                <TabsList aria-label={`${variant} ${state}`} className={variant === 'pill' ? 'bg-transparent p-0' : 'border-transparent'}>
                  <TabsTrigger value="a" disabled={state === 'Disabled'}>Tab</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          ))}
        </div>
      )))}
    </div>
  ),
};

export const WithIconsAndCounts: Story = {
  render: () => (
    <Tabs defaultValue="inbox">
      <TabsList aria-label="Messages">
        <TabsTrigger value="inbox" icon="mail" count={4} countLabel="unread">Inbox</TabsTrigger>
        <TabsTrigger value="sent" icon="message">Sent</TabsTrigger>
        <TabsTrigger value="saved" icon="bookmark">Saved</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
};
