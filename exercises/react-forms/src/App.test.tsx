import { render, screen } from '@testing-library/react';

import App from './App';
import { RegistrationFlowProvider } from './context/RegistrationFlowContext';

describe('App', () => {
  it('renders the marketing shell and lazy-loaded form', async () => {
    render(
      <RegistrationFlowProvider>
        <App />
      </RegistrationFlowProvider>,
    );

    expect(
      screen.getByRole('heading', {
        name: /Registration that feels premium, fast, and trustworthy\./i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', {
        name: /Build a trustworthy account in under two minutes\./i,
      }),
    ).toBeInTheDocument();
  });
});
