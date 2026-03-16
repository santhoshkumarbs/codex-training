import { axe } from 'jest-axe';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RegistrationFlowProvider } from '../context/RegistrationFlowContext';
import RegistrationForm from './RegistrationForm';

function renderRegistrationForm() {
  return render(
    <RegistrationFlowProvider>
      <RegistrationForm />
    </RegistrationFlowProvider>,
  );
}

describe('RegistrationForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('renders without accessibility violations on the first step', async () => {
    const { container } = renderRegistrationForm();

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('blocks progression when required account fields are missing', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.click(
      screen.getByRole('button', { name: /continue/i }),
    );

    expect(
      await screen.findByText(/Email is required\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Username must be at least 3 characters\./i),
    ).toBeInTheDocument();
  });

  it('persists non-sensitive draft values across refreshes', async () => {
    const user = userEvent.setup();
    const view = renderRegistrationForm();

    await user.type(
      screen.getByLabelText(/Email address/i),
      'persisted@example.com',
    );
    await user.type(
      screen.getByLabelText(/Username/i),
      'persisted_user',
    );
    await user.type(
      screen.getByPlaceholderText(/Create a strong password/i),
      'Sup3r$ecurePass',
    );

    await waitFor(() => {
      expect(window.localStorage.getItem('registration-form:draft:v1')).toContain(
        'persisted@example.com',
      );
    });

    view.unmount();
    renderRegistrationForm();

    expect(screen.getByLabelText(/Email address/i)).toHaveValue(
      'persisted@example.com',
    );
    expect(screen.getByLabelText(/Username/i)).toHaveValue('persisted_user');
    expect(
      screen.getByPlaceholderText(/Create a strong password/i),
    ).toHaveValue('');
  });

  it('completes the full multi-step registration flow', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(
      screen.getByLabelText(/Email address/i),
      'avery@example.com',
    );
    await user.type(screen.getByLabelText(/Username/i), 'steady_river');
    await user.type(
      screen.getByPlaceholderText(/Create a strong password/i),
      'Sup3r$ecurePass',
    );
    await user.type(
      screen.getByLabelText(/Confirm password/i),
      'Sup3r$ecurePass',
    );

    expect(
      await screen.findByText(/Username is available\./i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue/i }),
    );

    await user.type(await screen.findByLabelText(/First name/i), 'Avery');
    await user.type(screen.getByLabelText(/Last name/i), 'Parker');
    await user.type(screen.getByLabelText(/Phone number/i), '+14155550123');
    await user.selectOptions(screen.getByLabelText(/Country/i), 'US');
    await user.click(
      screen.getByRole('checkbox', {
        name: /Keep me updated with product insights/i,
      }),
    );

    await user.click(
      screen.getByRole('button', { name: /continue/i }),
    );

    expect(
      await screen.findByText(/Confirm the details before account creation\./i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', {
        name: /I accept the terms and understand how my data is handled/i,
      }),
    );
    await user.click(
      screen.getByRole('button', { name: /Create account/i }),
    );

    expect(
      await screen.findByRole('heading', {
        name: /Welcome aboard, Avery Parker/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Register another account/i }),
    );

    expect(
      await screen.findByLabelText(/Email address/i),
    ).toBeInTheDocument();
  });

  it('surfaces unavailable usernames and prevents progression', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(
      screen.getByLabelText(/Email address/i),
      'taken@example.com',
    );
    await user.type(screen.getByLabelText(/Username/i), 'stormclaw');
    await user.type(
      screen.getByPlaceholderText(/Create a strong password/i),
      'Sup3r$ecurePass',
    );
    await user.type(
      screen.getByLabelText(/Confirm password/i),
      'Sup3r$ecurePass',
    );

    expect(
      await screen.findAllByText(/That username is already taken\./i),
    ).not.toHaveLength(0);

    await user.click(
      screen.getByRole('button', { name: /continue/i }),
    );

    expect(screen.queryByLabelText(/First name/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toHaveFocus();
  });

  it('returns to the account step when submission fails on the server', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    await user.type(
      screen.getByLabelText(/Email address/i),
      'existing@example.com',
    );
    await user.type(screen.getByLabelText(/Username/i), 'sunlit_path');
    await user.type(
      screen.getByPlaceholderText(/Create a strong password/i),
      'Sup3r$ecurePass',
    );
    await user.type(
      screen.getByLabelText(/Confirm password/i),
      'Sup3r$ecurePass',
    );

    expect(
      await screen.findByText(/Username is available\./i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /continue/i }),
    );
    await user.click(
      await screen.findByRole('button', { name: /continue/i }),
    );
    expect(
      await screen.findByText(/Confirm the details before account creation\./i),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('checkbox', {
        name: /I accept the terms and understand how my data is handled/i,
      }),
    );
    await user.click(
      screen.getByRole('button', { name: /Create account/i }),
    );

    expect(
      await screen.findByText(/That email is already in use\./i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    });
  });
});
