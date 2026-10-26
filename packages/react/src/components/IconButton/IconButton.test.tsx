import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './IconButton';
import { axeViolations } from '../../test/axe';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;

describe('IconButton', () => {
  it('uses the label as its accessible name and hides the icon', () => {
    const { container } = render(<IconButton icon="plus" label="Add patient" />);
    expect(screen.getByRole('button', { name: 'Add patient' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('is square at every size, as in Figma', () => {
    render(
      <>
        <IconButton icon="plus" label="sm" size="sm" />
        <IconButton icon="plus" label="md" />
        <IconButton icon="plus" label="lg" size="lg" />
      </>,
    );
    expect(screen.getByRole('button', { name: 'sm' })).toHaveClass('size-control-sm');
    expect(screen.getByRole('button', { name: 'md' })).toHaveClass('size-control-md');
    expect(screen.getByRole('button', { name: 'lg' })).toHaveClass('size-control-lg');
  });

  it('swaps the icon for a spinner while loading and ignores clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<IconButton icon="trash" label="Delete" variant="danger" loading onClick={onClick} />);
    expect(container.querySelector('[data-icon="spinner"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true');
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no accessibility violations in any variant or state', async () => {
    const { container } = render(
      <>
        {VARIANTS.map((v) => (
          <div key={v}>
            <IconButton variant={v} icon="more" label="More" />
            <IconButton variant={v} icon="more" label="More" disabled />
            <IconButton variant={v} icon="more" label="More" loading />
          </div>
        ))}
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
