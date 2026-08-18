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
    await user.click(input);
    await user.type(input, 'tomorrow 9am');

    expect(screen.getByText(/at 9:00am/i)).toBeInTheDocument();

    await user.click(screen.getByText(/at 9:00am/i));

    expect(document.querySelector('.live-sdi__readout')).toBeTruthy();
  });
});
