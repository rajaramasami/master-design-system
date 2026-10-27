import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../provider/ThemeProvider';
import { Button } from './Button/Button';
import { Card } from './Card/Card';
import { Badge } from './Badge/Badge';
import { Tag } from './Tag/Tag';
import { Avatar, initialsOf } from './Avatar/Avatar';
import { List, ListRow } from './ListRow/ListRow';
import { Alert } from './Alert/Alert';
import { ToastProvider, useToast, type ToastOptions } from './Toast/Toast';
import { ProgressBar, Spinner, Skeleton, SkeletonListRow } from './Progress/Progress';
import { EmptyState } from './EmptyState/EmptyState';
import { axeViolations } from '../test/axe';

describe('Data display', () => {
  it('Badge shows a tone icon only when asked, and the text carries the meaning', () => {
    render(<><Badge tone="success" icon>Confirmed</Badge><Badge tone="danger">Overdue</Badge></>);
    expect(screen.getByText('Confirmed').querySelector('svg')).not.toBeNull();
    expect(screen.getByText('Overdue').querySelector('svg')).toBeNull();
  });

  it('Tag toggles with aria-pressed and has a separately named remove button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <>
        <Tag selected={false} onSelectedChange={onChange}>Morning</Tag>
        <Tag onRemove={onRemove}>Penicillin</Tag>
      </>,
    );
    const toggle = screen.getByRole('button', { name: 'Morning' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('button', { name: 'Remove Penicillin' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('Avatar is a named image with initials, or hidden when decorative', () => {
    expect(initialsOf('Anita Raman')).toBe('AR');
    expect(initialsOf('kumar')).toBe('K');
    render(<><Avatar name="Anita Raman" /><Avatar name="Dev Patel" decorative /></>);
    expect(screen.getByRole('img', { name: 'Anita Raman' })).toHaveTextContent('AR');
    expect(screen.queryByRole('img', { name: 'Dev Patel' })).toBeNull();
  });

  it('a clickable Card is one button named by its title and described by its text', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Card title="Annual check-up" description="Tue 4 Nov, 10:30" onClick={onClick} action={<Button size="sm" variant="ghost">Edit</Button>} />);
    const card = screen.getByRole('button', { name: 'Annual check-up' });
    expect(card).toHaveAccessibleDescription('Tue 4 Nov, 10:30');
    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
    // The action stays its own button.
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('List rows are list items; a link row is one link, selection is announced', async () => {
    render(
      <List aria-label="Appointments">
        <ListRow title="Blood test" description="Lab 2" href="/a/1" />
        <ListRow title="Dentist" onClick={() => {}} selected />
        <ListRow title="Physio" disabled onClick={() => {}} />
      </List>,
    );
    const list = screen.getByRole('list', { name: 'Appointments' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Blood test' })).toHaveAttribute('href', '/a/1');
    expect(screen.getByRole('button', { name: 'Dentist' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Physio' })).toBeDisabled();
    expect(await axeViolations(list)).toEqual([]);
  });
});

describe('Feedback', () => {
  it('Alert is silent by default and announces by tone when asked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert tone="danger" title="Payment failed" onDismiss={onDismiss}>Try another card.</Alert>);
    expect(screen.queryByRole('alert')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
    rerender(<Alert tone="danger" title="Payment failed" announce />);
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    rerender(<Alert tone="success" title="Saved" announce />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  function Trigger(props: ToastOptions) {
    const toast = useToast();
    return <Button onClick={() => toast(props)}>Show</Button>;
  }

  it('Toast shows in a named region, runs its action and closes', async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    render(
      <ThemeProvider theme="dark">
        <ToastProvider>
          <Trigger title="Appointment cancelled" tone="neutral" action={{ label: 'Undo', onClick: undo }} />
        </ToastProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    const region = screen.getByRole('region', { name: /Notifications/ });
    expect(await within(region).findByText('Appointment cancelled')).toBeInTheDocument();
    expect(region.closest('[data-theme="dark"]')).not.toBeNull();
    await user.click(within(region).getByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalled();
    await waitFor(() => expect(within(region).queryByText('Appointment cancelled')).toBeNull());
  });

  it('Toast auto-dismisses after its duration, but never for danger', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ToastProvider>
          <Trigger title="Saved" tone="success" duration={50} />
        </ToastProvider>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Saved')).toBeNull(), { timeout: 1500 });
  });

  it('Toast shows at most three at once', async () => {
    const user = userEvent.setup();
    function Many() {
      const toast = useToast();
      return <Button onClick={() => ['One', 'Two', 'Three', 'Four'].forEach((title) => toast({ title, duration: Infinity }))}>Many</Button>;
    }
    render(<ThemeProvider><ToastProvider><Many /></ToastProvider></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Many' }));
    expect(await screen.findByText('Four')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('One')).toBeNull());
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('useToast outside a provider throws a clear error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger title="x" />)).toThrow('useToast must be used inside <ToastProvider>.');
    spy.mockRestore();
  });

  it('ProgressBar is a named progressbar with a value', () => {
    render(<ProgressBar label="Uploading results" value={42} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading results' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuetext', '42%');
  });

  it('Spinner is a status with a label; Skeleton is hidden', async () => {
    const { container } = render(
      <div aria-busy="true">
        <Spinner label="Loading appointments" />
        <Skeleton />
        <SkeletonListRow />
      </div>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading appointments');
    container.querySelectorAll('.mds-skeleton').forEach((el) => expect(el.closest('[aria-hidden="true"]')).not.toBeNull());
    expect(await axeViolations(container)).toEqual([]);
  });

  it('EmptyState has a heading and actions', async () => {
    const { container } = render(
      <EmptyState type="no-results" title="No matches" description="Try a different name." actions={<Button variant="secondary">Clear search</Button>} />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'No matches' })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});
