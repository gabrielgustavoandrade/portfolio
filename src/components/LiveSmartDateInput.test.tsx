import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LiveSmartDateInput } from './LiveSmartDateInput';

describe('LiveSmartDateInput', () => {
  it('parses natural language through the published package', async () => {
    const user = userEvent.setup();
    render(<LiveSmartDateInput />);

    const input = screen.getByRole('textbox', {
      name: /try smart-date-input/i,
    });
    expect(input).toHaveAttribute('placeholder', 'e.g. next friday 3pm');
    expect(screen.getByText('Value from onChange')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('null');

    await user.click(input);
    await user.type(input, 'tomorrow 9am');

    expect(screen.getByText(/at 9:00am/i)).toBeInTheDocument();

    await user.click(screen.getByText(/at 9:00am/i));

    expect(screen.getByRole('status')).toHaveTextContent(/9:00\s?AM/);
  });

  it('fills a sample instantly when animation is off', async () => {
    const user = userEvent.setup();
    render(<LiveSmartDateInput instant />);

    await user.click(screen.getByRole('button', { name: 'tomorrow 7am' }));

    expect(
      screen.getByRole('textbox', { name: /try smart-date-input/i }),
    ).toHaveValue('tomorrow 7am');
    expect(
      screen.getByRole('button', { name: /open calendar/i }),
    ).toBeInTheDocument();
  });
});
