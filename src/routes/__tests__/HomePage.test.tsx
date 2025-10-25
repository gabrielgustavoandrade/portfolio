import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { HomePage } from '../HomePage';

vi.mock('../../components/earth/EarthCanvas', () => ({
  EarthCanvas: () => <div data-testid="earth-canvas" />,
}));

const renderHomePage = () =>
  render(
    <MemoryRouter
      initialEntries={['/']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <HomePage />
    </MemoryRouter>,
  );

describe('HomePage', () => {
  it('renders the hero and work section headlines', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { name: /gabriel andrade/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /selected work/i }),
    ).toBeInTheDocument();
  });

  it('scrolls to the requested section when hero CTAs are pressed', async () => {
    const workSection = document.createElement('section');
    workSection.id = 'work';
    workSection.scrollIntoView = vi.fn() as typeof workSection.scrollIntoView;

    const contactSection = document.createElement('section');
    contactSection.id = 'contact';
    contactSection.scrollIntoView =
      vi.fn() as typeof contactSection.scrollIntoView;

    document.body.appendChild(workSection);
    document.body.appendChild(contactSection);

    const user = userEvent.setup();
    renderHomePage();

    await user.click(
      screen.getByRole('button', { name: /selected work section/i }),
    );
    expect(workSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });

    await user.click(screen.getByRole('button', { name: /contact section/i }));
    expect(contactSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });

    workSection.remove();
    contactSection.remove();
  });
});
