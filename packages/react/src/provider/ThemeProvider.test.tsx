import { render, screen } from '@testing-library/react';
import { ThemeProvider, useMds } from './ThemeProvider';

function Probe() {
  const s = useMds();
  return <span data-testid="probe">{`${s.theme}|${s.platform}|${s.density}|${s.iconFamily}|${s.brand ?? ''}`}</span>;
}

describe('ThemeProvider', () => {
  it('sets the Figma mode attributes on its element', () => {
    const { container } = render(
      <ThemeProvider theme="dark" platform="ios" density="comfortable" brand="carepath">
        hi
      </ThemeProvider>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('mds-root');
    expect(root).toHaveAttribute('data-theme', 'dark');
    expect(root).toHaveAttribute('data-platform', 'ios');
    expect(root).toHaveAttribute('data-density', 'comfortable');
    expect(root).toHaveAttribute('data-brand', 'carepath');
  });

  it('leaves data-theme off for "system", so the OS setting decides', () => {
    const { container } = render(<ThemeProvider>hi</ThemeProvider>);
    expect(container.firstElementChild).not.toHaveAttribute('data-theme');
    expect(container.firstElementChild).toHaveAttribute('data-density', 'compact');
  });

  it('picks Lucide on web and Phosphor on mobile, following the Figma icon rule', () => {
    const { rerender } = render(<ThemeProvider platform="web"><Probe /></ThemeProvider>);
    expect(screen.getByTestId('probe')).toHaveTextContent('system|web|compact|lucide|');
    rerender(<ThemeProvider platform="android"><Probe /></ThemeProvider>);
    expect(screen.getByTestId('probe')).toHaveTextContent('system|android|compact|phosphor|');
    rerender(<ThemeProvider platform="ios" iconFamily="lucide"><Probe /></ThemeProvider>);
    expect(screen.getByTestId('probe')).toHaveTextContent('lucide');
  });

  it('lets an inner provider override only its region', () => {
    render(
      <ThemeProvider theme="light" data-testid="outer">
        <ThemeProvider theme="dark" data-testid="inner">
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('outer')).toHaveAttribute('data-theme', 'light');
    expect(screen.getByTestId('inner')).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('probe')).toHaveTextContent('dark');
  });
});
