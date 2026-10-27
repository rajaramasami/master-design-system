import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../provider/ThemeProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs/Tabs';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { Pagination, pageRange } from './Pagination/Pagination';
import { Stepper } from './Stepper/Stepper';
import { Sidebar, SidebarItem } from './Sidebar/Sidebar';
import { TopBar } from './TopBar/TopBar';
import { TabBar, TabBarItem } from './TabBar/TabBar';
import { axeViolations } from '../test/axe';

describe('Tabs', () => {
  it('is a named tablist; arrows move selection and the panel follows', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Patient record">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results" count={3} countLabel="new">Results</TabsTrigger>
          <TabsTrigger value="notes" disabled>Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="results">Results panel</TabsContent>
        <TabsContent value="notes">Notes panel</TabsContent>
      </Tabs>,
    );
    screen.getByRole('tablist', { name: 'Patient record' });
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /^Results\s*3\s*new$/ })).toBeInTheDocument();
    await user.click(overview);
    await user.keyboard('{ArrowRight}');
    const results = screen.getByRole('tab', { name: /Results/ });
    expect(results).toHaveFocus();
    expect(results).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /Results/ })).toHaveTextContent('Results panel');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Breadcrumbs', () => {
  it('is a named nav with links and the current page', async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Results', href: '/results' }, { label: 'Blood test' }]} />,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['Home', 'Results']);
    expect(within(nav).getByText('Blood test')).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('collapses the middle levels into a menu beyond four', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Breadcrumbs items={['Home', 'Patients', 'Anita Raman', 'Results', 'Blood test'].map((label, i, a) => ({ label, href: i < a.length - 1 ? `#${i}` : undefined }))} />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('link', { name: 'Patients' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Show 2 more levels' }));
    expect(await screen.findByRole('menuitem', { name: 'Patients' })).toHaveAttribute('href', '#1');
  });
});

describe('Pagination', () => {
  it('shows first, last and the pages around the current one', () => {
    expect(pageRange(2, 10)).toEqual([1, 2, 3, null, 10]);
    expect(pageRange(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    expect(pageRange(10, 10)).toEqual([1, null, 8, 9, 10]);
    expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('marks the current page, disables previous on page 1 and moves pages', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(<Pagination page={1} pageCount={10} onPageChange={onPageChange} summary={{ total: 96, pageSize: 10 }} />);
    expect(screen.getByText('Showing 1–10 of 96 results')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(onPageChange.mock.calls).toEqual([[2], [10]]);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Stepper', () => {
  it('announces each status and marks the current step', async () => {
    const { container } = render(
      <Stepper
        aria-label="Booking"
        current={1}
        steps={[{ label: 'Book test' }, { label: 'Prepare', description: 'Fast for 8 hours' }, { label: 'Take test', status: 'error', description: 'Lab closed' }, { label: 'Get results' }]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Completed: Book test');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('Current step: Prepare');
    expect(items[2]).toHaveTextContent('Needs attention: Take test');
    expect(items[3]).toHaveTextContent('Not started: Get results');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('compact shows "Step 2 of 4"', () => {
    render(<Stepper orientation="compact" current={1} steps={[{ label: 'A' }, { label: 'Prepare' }, { label: 'C' }, { label: 'D' }]} />);
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('is the main nav with the current page and a collapse toggle', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    const { container, rerender } = render(
      <ThemeProvider>
        <Sidebar productName="Care" onCollapsedChange={onCollapsedChange}>
          <SidebarItem icon="home" label="Home" href="/" selected />
          <SidebarItem icon="message" label="Messages" href="/m" count={2} countLabel="unread" />
        </Sidebar>
      </ThemeProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: /^Messages\s*2\s*unread$/ })).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(await axeViolations(container)).toEqual([]);

    rerender(
      <ThemeProvider>
        <Sidebar productName="Care" collapsed onCollapsedChange={onCollapsedChange}>
          <SidebarItem icon="home" label="Home" href="/" selected />
          <SidebarItem icon="message" label="Messages" href="/m" count={2} countLabel="unread" />
        </Sidebar>
      </ThemeProvider>,
    );
    // Collapsed: icon only, still named.
    expect(screen.getByRole('link', { name: 'Messages, 2 unread' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Top Bar and Tab Bar', () => {
  it('Top Bar has the page heading and a named Back on each platform', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const { rerender } = render(<TopBar title="Results" onBack={onBack} platform="ios" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Results' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    rerender(<TopBar title="Results" onBack={onBack} platform="android" />);
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(2);
  });

  it('Tab Bar is navigation with aria-current, not a tablist', async () => {
    const { container } = render(
      <TabBar platform="android">
        <TabBarItem icon="home" label="Home" href="/" selected />
        <TabBarItem icon="message" label="Messages" href="/m" badge={3} badgeLabel="unread" />
      </TabBar>,
    );
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /^Messages\s*,\s*3 unread$/ })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});
