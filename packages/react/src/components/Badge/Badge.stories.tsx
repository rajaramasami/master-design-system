import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone } from './Badge';

const TONES: BadgeTone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

const meta = {
  title: 'Components/Data display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Confirmed', tone: 'success', icon: true },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma set **Badge** (12 Data display): Tone Neutral, Brand, Success, Warning, Danger, Info × Size sm, md, with Show Icon.

**When to use**: a short, non-interactive status ("Confirmed", "Overdue") or count. For something people can select or remove, use a Tag.

**Content**: one or two words in sentence case. Use md for status that matters; sm (12 px text) only for counts and non-essential labels.

**Accessibility**: not focusable. Turn on \`icon\` for status tones so meaning never relies on colour alone. For a bare count, give context in \`aria-label\` ("3 overdue tasks").
`,
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: 'All variants (Figma matrix)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[80px_repeat(6,max-content)] items-center gap-x-inline-lg gap-y-stack-md">
      <span />
      {TONES.map((t) => <span key={t} className="text-label-sm capitalize text-text-tertiary">{t}</span>)}
      {(['md', 'sm'] as const).map((size) => [false, true].map((icon) => (
        <div key={`${size}${icon}`} className="contents">
          <span className="text-label-sm text-text-tertiary">{size}{icon ? ' + icon' : ''}</span>
          {TONES.map((t) => <span key={t}><Badge tone={t} size={size} icon={icon && (TONE_HAS_ICON(t) ? true : 'star')}>Label</Badge></span>)}
        </div>
      )))}
    </div>
  ),
};

function TONE_HAS_ICON(t: BadgeTone) {
  return t !== 'neutral' && t !== 'brand';
}
