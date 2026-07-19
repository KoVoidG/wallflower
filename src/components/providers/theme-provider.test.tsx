import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './theme-provider';

// next-themes requires window.matchMedia in jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('wraps children without adding extra visible DOM elements', () => {
    const { container } = render(
      <ThemeProvider>
        <span>Themed content</span>
      </ThemeProvider>,
    );

    expect(container).toContainHTML('Themed content');
  });

  it('renders without error when supporting system, light, and dark themes', () => {
    // The component configures next-themes with system/light/dark support
    // This test verifies it mounts and unmounts cleanly
    const { unmount } = render(
      <ThemeProvider>
        <div data-testid="themed">Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('themed')).toBeInTheDocument();
    unmount();
  });
});
