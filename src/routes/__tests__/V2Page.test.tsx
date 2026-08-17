import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { V2Page } from '../V2Page';

vi.mock('../../v2/useV2Capabilities', () => ({
  useV2Capabilities: () => ({
    live3d: false,
    reducedMotion: true,
    ready: true,
  }),
}));

vi.mock('../../v2/V2Scene', () => ({
  V2Scene: () => <div data-testid="v2-scene" />,
}));

describe('V2Page', () => {
  it('renders the approved hero copy without cities or dashboards', () => {
    render(<V2Page />);

    expect(
      screen.getByRole('heading', { name: /gabriel andrade/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/commerce, built for speed/i)).toBeInTheDocument();

    expect(screen.queryByText(/madrid/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/goiânia|goiania/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/kpi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/checkout/i)).not.toBeInTheDocument();
  });

  it('opens the work plate as the frame and can go back', async () => {
    const user = userEvent.setup();
    render(<V2Page />);

    await user.click(screen.getByRole('button', { name: /selected work/i }));
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(
      screen.queryByRole('button', { name: /back/i }),
    ).not.toBeInTheDocument();
  });

  it('renders the unlabeled postcard', () => {
    render(<V2Page />);
    expect(
      screen.getByRole('button', { name: /postcard/i }),
    ).toBeInTheDocument();
  });
});
