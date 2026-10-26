import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { iconNames, filledIcons } from './registry';
import { ThemeProvider } from '../provider/ThemeProvider';

describe('Icon', () => {
  it('has all 51 icons from the Figma library, 12 with a filled version', () => {
    expect(iconNames).toHaveLength(51);
    expect(filledIcons).toHaveLength(12);
  });

  it('renders every icon in both families', () => {
    for (const family of ['lucide', 'phosphor'] as const) {
      const { container, unmount } = render(<>{iconNames.map((n) => <Icon key={n} name={n} family={family} />)}</>);
      expect(container.querySelectorAll('svg')).toHaveLength(51);
      unmount();
    }
  });

  it('is hidden from screen readers unless it has a label', () => {
    const { container } = render(<Icon name="search" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    render(<Icon name="alert" label="Error" />);
    expect(screen.getByRole('img', { name: 'Error' })).toBeInTheDocument();
  });

  it('sizes from the platform icon tokens', () => {
    const { container } = render(<Icon name="plus" size="lg" />);
    expect(container.querySelector('svg')).toHaveStyle({ width: 'var(--mds-size-icon-lg)' });
  });

  it('follows the provider family and uses Phosphor Fill when filled', () => {
    const { container } = render(
      <ThemeProvider platform="ios">
        <Icon name="home" />
        <Icon name="home" filled />
      </ThemeProvider>,
    );
    const [regular, filled] = container.querySelectorAll('svg');
    expect(regular).not.toHaveClass('lucide');
    expect(filled!.innerHTML).not.toEqual(regular!.innerHTML);
  });
});
