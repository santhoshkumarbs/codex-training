import {
  checkUsernameAvailability,
  fetchCountries,
  submitRegistration,
} from './registrationApi';

describe('registrationApi', () => {
  it('returns the configured country list', async () => {
    await expect(fetchCountries()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'US', label: 'United States' }),
      ]),
    );
  });

  it('flags reserved usernames as unavailable', async () => {
    await expect(checkUsernameAvailability('stormclaw')).resolves.toEqual(
      expect.objectContaining({
        available: false,
        message: 'That username is already taken.',
      }),
    );
  });

  it('submits a valid registration', async () => {
    await expect(
      submitRegistration({
        email: 'new@example.com',
        username: 'trailblazer_01',
        password: 'Sup3r$ecurePass',
        firstName: 'Nova',
        lastName: 'Lee',
        phoneNumber: '+14155550123',
        dateOfBirth: '1994-03-03',
        country: 'US',
        newsletter: true,
        terms: true,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        email: 'new@example.com',
        username: 'trailblazer_01',
        displayName: 'Nova Lee',
      }),
    );
  });

  it('rejects existing emails during submission', async () => {
    await expect(
      submitRegistration({
        email: 'existing@example.com',
        username: 'new_handle',
        password: 'Sup3r$ecurePass',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        country: '',
        newsletter: false,
        terms: true,
      }),
    ).rejects.toThrow('That email is already in use.');
  });
});
