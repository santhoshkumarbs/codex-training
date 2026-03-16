import { registrationSchema } from './registrationSchema';

describe('registrationSchema', () => {
  it('accepts a valid registration payload', () => {
    const result = registrationSchema.safeParse({
      email: 'valid@example.com',
      username: 'valid_user',
      password: 'Sup3r$ecurePass',
      confirmPassword: 'Sup3r$ecurePass',
      firstName: 'Avery',
      lastName: 'Parker',
      phoneNumber: '+14155550123',
      dateOfBirth: '1995-05-20',
      country: 'US',
      newsletter: true,
      terms: true,
    });

    expect(result.success).toBe(true);
  });

  it('rejects disposable email domains and mismatched passwords', () => {
    const result = registrationSchema.safeParse({
      email: 'throwaway@mailinator.com',
      username: 'valid_user',
      password: 'Sup3r$ecurePass',
      confirmPassword: 'Different$Pass1',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      country: '',
      newsletter: false,
      terms: true,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toEqual(
        expect.arrayContaining([
          'Use a permanent email address.',
          'Passwords must match.',
        ]),
      );
    }
  });
});
