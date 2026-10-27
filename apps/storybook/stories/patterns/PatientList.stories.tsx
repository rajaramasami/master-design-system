import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import {
  Alert, Avatar, Badge, Button, EmptyState, IconButton, List, ListRow, ProgressBar, SkeletonListRow, Tag,
  TextField, ToastProvider, useToast,
} from '@rajaramasami/mds-react';

type Status = 'checked-in' | 'waiting' | 'forms';
interface Patient { id: number; name: string; reason: string; time: string; status: Status; online?: boolean }

const PATIENTS: Patient[] = [
  { id: 1, name: 'Anita Raman', reason: 'Follow-up · Room 3', time: '10:30', status: 'checked-in' },
  { id: 2, name: 'Dev Patel', reason: 'Video consult', time: '11:00', status: 'waiting', online: true },
  { id: 3, name: 'Lena Fischer', reason: 'New patient', time: '11:45', status: 'forms' },
  { id: 4, name: 'Omar Haddad', reason: 'Blood test review', time: '12:15', status: 'waiting' },
];

const BADGE: Record<Status, { tone: 'success' | 'info' | 'warning'; label: string }> = {
  'checked-in': { tone: 'success', label: 'Checked in' },
  waiting: { tone: 'info', label: 'Waiting' },
  forms: { tone: 'warning', label: 'Forms due' },
};

function TodayList({ initial = 'loading' as 'loading' | 'ready' | 'error' }) {
  const toast = useToast();
  const [state, setState] = useState(initial);
  const [patients, setPatients] = useState(PATIENTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status | null>(null);

  useEffect(() => {
    if (state !== 'loading') return;
    const t = setTimeout(() => setState('ready'), 900);
    return () => clearTimeout(t);
  }, [state]);

  const shown = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (!filter || p.status === filter));
  const checkedIn = patients.filter((p) => p.status === 'checked-in').length;

  const checkIn = (p: Patient) => {
    const before = patients;
    setPatients(patients.map((x) => (x.id === p.id ? { ...x, status: 'checked-in' } : x)));
    toast({ tone: 'success', title: `${p.name} checked in`, action: { label: 'Undo', onClick: () => setPatients(before) } });
  };

  return (
    <section aria-labelledby="today" className="mx-auto flex max-w-[560px] flex-col gap-stack-md">
      <header className="flex items-end justify-between gap-inline-md">
        <div className="flex flex-col gap-stack-2xs">
          <h2 id="today" className="m-0 text-heading-md text-text-primary">Today</h2>
          <p className="m-0 text-body-sm text-text-secondary">North clinic · {patients.length} appointments</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setState('loading')}>Refresh</Button>
      </header>

      {state === 'error' ? (
        <div className="rounded-surface border border-border-subtle">
          <EmptyState type="error" title="Couldn’t load today’s list" description="Something went wrong on our side. Try again in a moment." actions={<Button onClick={() => setState('loading')}>Try again</Button>} />
        </div>
      ) : (
        <>
          {patients.some((p) => p.status === 'forms') && (
            <Alert tone="warning" title="1 patient has forms due">Send a reminder before their visit to save time at check-in.</Alert>
          )}
          <ProgressBar label="Checked in" value={(checkedIn / patients.length) * 100} size="sm" />
          <TextField label="Search patients" hideLabel placeholder="Search patients" prefixIcon="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-inline-sm">
            {(Object.keys(BADGE) as Status[]).map((s) => (
              <Tag key={s} size="sm" selected={filter === s} onSelectedChange={(on) => setFilter(on ? s : null)}>{BADGE[s].label}</Tag>
            ))}
          </div>

          <div aria-busy={state === 'loading'} aria-live="polite">
            {state === 'loading' ? (
              <div className="flex flex-col"><SkeletonListRow /><SkeletonListRow /><SkeletonListRow /></div>
            ) : shown.length === 0 ? (
              <EmptyState type="no-results" title="No matches" description="Try a different name or clear the filter." actions={<Button variant="secondary" onClick={() => { setQuery(''); setFilter(null); }}>Clear search</Button>} />
            ) : (
              <List dividers aria-label="Today’s appointments">
                {shown.map((p) => (
                  <ListRow
                    key={p.id}
                    href={`#patient-${p.id}`}
                    leading={<Avatar name={p.name} online={p.online} decorative />}
                    title={p.name}
                    description={p.reason}
                    badge={<Badge tone={BADGE[p.status].tone} size="sm" icon>{BADGE[p.status].label}</Badge>}
                    meta={p.time}
                    chevron={false}
                  />
                ))}
              </List>
            )}
          </div>

          {state === 'ready' && shown.some((p) => p.status !== 'checked-in') && (
            <div className="flex flex-wrap items-center gap-inline-sm">
              <span className="text-body-sm text-text-secondary">Next:</span>
              {shown.filter((p) => p.status !== 'checked-in').slice(0, 1).map((p) => (
                <Button key={p.id} size="sm" onClick={() => checkIn(p)}>Check in {p.name}</Button>
              ))}
              <IconButton variant="ghost" size="sm" icon="more" label="More actions" />
            </div>
          )}
        </>
      )}
    </section>
  );
}

const meta = {
  title: 'Patterns/Patient list',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A clinic's list of today's appointments, built only from Phase 4 components plus inputs from Phase 2: **Skeleton / List Row** while loading, **List Row** with **Avatar** and **Badge**, **Tag** filters, a **Progress Bar**, a warning **Alert**, an **Empty State** for no matches and errors, and a **Toast** with Undo after checking someone in.
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ToastProvider><TodayList /></ToastProvider>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole('list', { name: 'Today’s appointments' }, { timeout: 3000 });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    // Filter, then clear it.
    await userEvent.click(canvas.getByRole('button', { name: 'Forms due' }));
    await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(1));
    await userEvent.click(canvas.getByRole('button', { name: 'Forms due' }));
  },
};

export const NoMatches: Story = {
  render: () => <ToastProvider><TodayList initial="ready" /></ToastProvider>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Search patients' }), 'zz');
    await expect(await canvas.findByRole('heading', { name: 'No matches' })).toBeInTheDocument();
  },
};

export const LoadError: Story = {
  render: () => <ToastProvider><TodayList initial="error" /></ToastProvider>,
};
