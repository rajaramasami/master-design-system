import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { axeViolations } from '../../test/axe';

const VARIANTS = ['primary', 'primary-tinted', 'secondary', 'danger', 'ghost'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

describe('Button', () => {
  it('renders a native button that does not submit forms by default', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('activates with click, Enter and Space (Figma doc: keyboard)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('maps every Figma variant and size to its tokens', () => {
    const { container } = render(
      <>
        {VARIANTS.map((v) => SIZES.map((s) => <Button key={v + s} variant={v} size={s}>{`${v} ${s}`}</Button>))}
      </>,
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(15);
    expect(screen.getByText('danger md')).toHaveClass('bg-action-danger-default', 'focus-visible:shadow-focus-ring-danger');
    expect(screen.getByText('secondary sm')).toHaveClass('border-border-default', 'h-control-sm', 'px-inset-md');
    expect(screen.getByText('primary-tinted lg')).toHaveClass('bg-action-primary-subtle', 'text-body-md-strong', 'px-inset-xl');
  });

  it('is skipped by clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows a spinner in place of the leading icon while loading, keeps the label and ignores clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<Button loading leadingIcon="plus" onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).not.toBeDisabled();
    expect(container.querySelector('[data-icon="spinner"]')).toBeInTheDocument();
    expect(container.querySelector('[data-icon="plus"]')).not.toBeInTheDocument();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders decorative leading and trailing icons hidden from screen readers', () => {
    const { container } = render(<Button leadingIcon="download" trailingIcon="chevron-down">Export</Button>);
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach((i) => expect(i).toHaveAttribute('aria-hidden', 'true'));
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('can render a link with button styles via asChild', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild variant="secondary" leadingIcon="external-link" disabled onClick={onClick}>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('bg-action-secondary-default');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no accessibility violations in any variant or state', async () => {
    const { container } = render(
      <>
        {VARIANTS.map((v) => (
          <div key={v}>
            <Button variant={v}>Default</Button>
            <Button variant={v} disabled>Disabled</Button>
            <Button variant={v} loading>Loading</Button>
            <Button variant={v} leadingIcon="plus" trailingIcon="chevron-down">Icons</Button>
          </div>
        ))}
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
