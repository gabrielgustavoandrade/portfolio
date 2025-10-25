import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { WorkDetailPage } from '../WorkDetailPage';

const renderWithRouter = (initialEntry: string) =>
  render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/work/:slug" element={<WorkDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('WorkDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders project details when the slug exists', () => {
    renderWithRouter('/work/mms-customize');

    expect(
      screen.getByRole('heading', { name: /m&ms – design your own/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Personalized e-commerce product configurator/i),
    ).toBeInTheDocument();
  });

  it('navigates back home when the project slug is unknown', () => {
    renderWithRouter('/work/not-a-real-project');

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
