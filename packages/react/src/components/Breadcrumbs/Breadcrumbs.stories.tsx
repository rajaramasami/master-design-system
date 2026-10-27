import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { items: [{ label: 'Home', href: '#' }, { label: 'Results', href: '#' }, { label: 'Blood tests', href: '#' }, { label: 'Lipid panel' }] },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma **Breadcrumbs** and **Breadcrumb Item** (State Default, Hover, Focus, Current), 14 Navigation.

**When to use**: web and tablet pages more than one level deep. Not on phones; use a Top Bar with Back.

**Behaviour**: ancestors are links; the last item is the current page and is not a link. Beyond \`maxItems\` (4), the middle levels collapse into "…", which opens a menu of the hidden links.

**Accessibility**: \`<nav aria-label="Breadcrumb">\` with an ordered list; the current page has \`aria-current="page"\`. Separators are hidden from screen readers.
`,
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  args: { items: ['Home', 'Patients', 'Anita Raman', 'Results', 'Blood tests', 'Lipid panel'].map((label, i, a) => ({ label, href: i < a.length - 1 ? '#' : undefined })) },
};

export const ItemStates: Story = {
  name: 'Item states (Figma matrix)',
  parameters: {
    controls: { disable: true },
    pseudo: { hover: ['[data-state-cell="Hover"] a'], focusVisible: ['[data-state-cell="Focus"] a'] },
  },
  /** Default, Hover and Focus apply to the link ("Results"); Current is the last item. */
  render: () => (
    <div className="flex gap-inline-xl">
      {(['Default', 'Hover', 'Focus', 'Current'] as const).map((s) => (
        <div key={s} data-state-cell={s} className="flex flex-col gap-stack-xs">
          <span className="text-label-sm text-text-tertiary">{s}</span>
          <Breadcrumbs aria-label={`Breadcrumb ${s}`} items={s === 'Current' ? [{ label: 'Results' }] : [{ label: 'Results', href: '#' }, { label: 'Lipid panel' }]} />
        </div>
      ))}
    </div>
  ),
};
