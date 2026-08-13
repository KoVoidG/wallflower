import { render } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders a smoke test container', () => {
  const { getByTestId } = render(<div data-testid="smoke">Smoke Test</div>);
  const element = getByTestId('smoke');
  expect(element).toBeInTheDocument();
  expect(element.textContent).toBe('Smoke Test');
});
