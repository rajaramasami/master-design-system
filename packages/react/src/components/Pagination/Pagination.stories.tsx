import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 2, pageCount: 10, onPageChange: () => {}, summary: { total: 96, pageSize: 10 } },
  parameters: {
    docs: {
      description: {
        component: `
Mirrors the Figma **Pagination** (with Show Summary) and **Page Item** (State Default, Hover, Pressed, Focus, Selected, Disabled), 14 Navigation.

**When to use**: long result lists on web and tablet (test history, appointments). On phones, prefer "Load more" with a visible count.

**Behaviour**: shows the first and last pages and one either side of the current page; gaps show "…". Previous is disabled on page 1, Next on the last page.

**Accessibility**: \`<nav aria-label="Pagination">\`; page buttons are named "Page 3" and the current one has \`aria-current="page"\`. The "…" is not focusable.
`,
      },
    },
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} className="max-w-[720px]" />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FewPages: Story = { args: { page: 1, pageCount: 4, summary: { total: 37, pageSize: 10 } } };
export const LastPage: Story = { args: { page: 10 } };

export const PageItemStates: Story = {
  name: 'Page item states (Figma matrix)',
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ['[data-state-cell="Hover"] [aria-label="Page 2"]'],
      active: ['[data-state-cell="Pressed"] [aria-label="Page 2"]'],
      focusVisible: ['[data-state-cell="Focus"] [aria-label="Page 2"]'],
    },
  },
  render: () => (
    <div className="flex flex-col gap-stack-md">
      {(['Default', 'Hover', 'Pressed', 'Focus', 'Selected'] as const).map((s) => (
        <div key={s} data-state-cell={s} className="flex items-center gap-inline-lg">
          <span className="w-[80px] text-label-sm text-text-tertiary">{s}</span>
          <Pagination aria-label={`Pagination ${s}`} page={s === 'Selected' ? 2 : 4} pageCount={5} onPageChange={() => {}} />
        </div>
      ))}
    </div>
  ),
};
