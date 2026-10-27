import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  Avatar, Badge, Breadcrumbs, Icon, IconButton, List, ListRow, Pagination, Sidebar, SidebarItem, Stepper, TabBar, TabBarItem,
  Tabs, TabsContent, TabsList, TabsTrigger, TextField, TopBar, useMds, type IconName,
} from '@rajaramasami/mds-react';

const NAV: { icon: IconName; label: string; count?: number }[] = [
  { icon: 'home', label: 'Home' },
  { icon: 'calendar', label: 'Timeline' },
  { icon: 'file', label: 'Results' },
  { icon: 'pill', label: 'Medicines' },
  { icon: 'message', label: 'Messages', count: 2 },
];

const RESULTS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: ['Lipid panel', 'HbA1c', 'Full blood count', 'Vitamin D', 'Thyroid (TSH)'][i % 5]!,
  date: `${28 - i} Oct`,
  status: i === 0 ? 'new' : i % 7 === 3 ? 'review' : 'normal',
}));

function ResultsPanel() {
  const { platform } = useMds();
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const rows = RESULTS.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="flex flex-col gap-stack-lg">
      <section aria-labelledby="pending" className="flex flex-col gap-stack-md rounded-surface border border-border-subtle bg-bg-surface p-inset-lg">
        <h2 id="pending" className="m-0 text-heading-sm text-text-primary">Pending: Vitamin B12</h2>
        <Stepper
          aria-label="Vitamin B12 test"
          orientation={platform === 'web' ? 'horizontal' : 'vertical'}
          current={2}
          steps={[
            { label: 'Ordered', description: '20 Oct' },
            { label: 'Sample taken', description: '22 Oct' },
            { label: 'In the lab', description: 'Usually 2 days' },
            { label: 'Results ready' },
          ]}
        />
      </section>
      <List dividers aria-label="Results">
        {rows.map((r) => (
          <ListRow
            key={r.id}
            href={`#result-${r.id}`}
            leading={<span className="flex size-avatar-size-md items-center justify-center rounded-pill bg-bg-muted"><Icon name="activity" size="md" className="text-icon-secondary" /></span>}
            title={r.name}
            description={r.date}
            badge={r.status === 'new' ? <Badge tone="brand" size="sm">New</Badge> : r.status === 'review' ? <Badge tone="warning" size="sm" icon>Review</Badge> : undefined}
          />
        ))}
      </List>
      <Pagination page={page} pageCount={Math.ceil(RESULTS.length / pageSize)} onPageChange={setPage} summary={{ total: RESULTS.length, pageSize }} />
    </div>
  );
}

function Body() {
  return (
    <Tabs defaultValue="results">
      <TabsList aria-label="Health record">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="results" count={1} countLabel="new">Results</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-body-sm text-text-secondary">Overview of recent visits.</TabsContent>
      <TabsContent value="results"><ResultsPanel /></TabsContent>
      <TabsContent value="documents" className="text-body-sm text-text-secondary">Letters and reports.</TabsContent>
    </Tabs>
  );
}

function AppShell() {
  const { platform } = useMds();
  const [current, setCurrent] = useState('Results');
  const [collapsed, setCollapsed] = useState(false);

  if (platform !== 'web') {
    return (
      <div className="mx-auto flex h-[760px] max-w-[390px] flex-col overflow-hidden border border-border-subtle bg-bg-canvas">
        <TopBar
          title={current}
          actions={
            platform === 'android'
              ? <><IconButton variant="ghost" icon="search" label="Search" /><IconButton variant="ghost" icon="more" label="More options" /></>
              : <IconButton variant="ghost" icon="search" label="Search" />
          }
        />
        <main className="flex-1 overflow-y-auto p-inset-md">{current === 'Results' ? <Body /> : <p className="text-body-sm text-text-secondary">{current}</p>}</main>
        <TabBar>
          {NAV.filter((n) => n.label !== 'Messages').concat({ icon: 'user', label: 'Profile' }).map((n) => (
            <TabBarItem key={n.label} icon={n.icon} label={n.label} selected={current === n.label} onClick={() => setCurrent(n.label)} />
          ))}
        </TabBar>
      </div>
    );
  }

  return (
    <div className="flex h-[760px] overflow-hidden border border-border-subtle bg-bg-canvas">
      <Sidebar
        productName="Care"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        footer={
          <>
            <SidebarItem as="div" icon="settings" label="Settings" onClick={() => setCurrent('Settings')} selected={current === 'Settings'} />
            <div className={collapsed ? 'flex justify-center py-inset-xs' : 'flex items-center gap-inline-sm p-inset-xs'}>
              <Avatar name="Raja R" size="sm" decorative={!collapsed} />
              {!collapsed && <span className="truncate text-body-sm-strong text-text-primary">Raja R</span>}
            </div>
          </>
        }
      >
        {NAV.map((n) => (
          <SidebarItem key={n.label} icon={n.icon} label={n.label} count={n.count} countLabel="unread" selected={current === n.label} onClick={() => setCurrent(n.label)} />
        ))}
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={current}
          actions={
            <>
              <TextField label="Search records" hideLabel placeholder="Search records" prefixIcon="search" size="sm" wrapperClassName="w-[240px]" />
              <IconButton variant="ghost" icon="bell" label="Notifications" />
            </>
          }
        />
        <main className="flex flex-1 flex-col gap-stack-md overflow-y-auto p-inset-lg">
          <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Health record', href: '#' }, { label: current }]} />
          {current === 'Results' ? <Body /> : <p className="text-body-sm text-text-secondary">{current}</p>}
        </main>
      </div>
    </div>
  );
}

const meta = {
  title: 'Patterns/App shell',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The navigation components together. On **Web** (toolbar Platform): Sidebar, Top Bar with search, Breadcrumbs, Tabs, a Stepper for a pending test, a List and Pagination. Switch Platform to **iOS** or **Android** to see the phone layout: Top Bar and Tab Bar, with the same content.
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AppShell />,
  play: async ({ canvasElement, globals }) => {
    if (globals.platform && globals.platform !== 'web') return;
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  },
};
