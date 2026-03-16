import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('marks a strong password as excellent', () => {
    const result = getPasswordStrength('Sup3r_Secure!Pass');

    expect(result.score).toBe(5);
    expect(result.label).toBe('Excellent');
    expect(result.requirements.every((requirement) => requirement.met)).toBe(true);
  });

  it('surfaces missing requirements', () => {
    const result = getPasswordStrength('weak');

    expect(result.score).toBe(1);
    expect(result.label).toBe('Very weak');
    expect(
      result.requirements.filter((requirement) => requirement.met),
    ).toHaveLength(1);
  });
});
