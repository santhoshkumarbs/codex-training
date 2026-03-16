import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  saveRegistrationDraft,
} from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads persisted drafts', () => {
    saveRegistrationDraft({
      email: 'draft@example.com',
      username: 'draft_handle',
      firstName: 'Draft',
      lastName: 'User',
      phoneNumber: '+14155550123',
      dateOfBirth: '1990-01-01',
      country: 'US',
      newsletter: true,
      terms: true,
    });

    expect(loadRegistrationDraft()).toEqual(
      expect.objectContaining({
        email: 'draft@example.com',
        username: 'draft_handle',
      }),
    );
  });

  it('drops malformed draft data', () => {
    window.localStorage.setItem('registration-form:draft:v1', '{bad json');

    expect(loadRegistrationDraft()).toBeNull();
    expect(window.localStorage.getItem('registration-form:draft:v1')).toBeNull();
  });

  it('clears the persisted draft', () => {
    window.localStorage.setItem('registration-form:draft:v1', '{"email":"x"}');

    clearRegistrationDraft();

    expect(window.localStorage.getItem('registration-form:draft:v1')).toBeNull();
  });
});
