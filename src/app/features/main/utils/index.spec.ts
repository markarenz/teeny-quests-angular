import {
  capitalizeWords,
  getRandomInt,
  getRandomUsername,
  getInitialsFromName,
  getPositionKeysForGridSize,
  getLabelFromSlug,
} from './index';

describe('capitalizeWords', () => {
  it('should capitalize the first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });
});

describe('getRandomInt', () => {
  it('should return a random integer between min and max', () => {
    const min = 0;
    const max = 10;
    const result = getRandomInt(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });
});

describe('getRandomUsername', () => {
  it('should return a random username', () => {
    const result = getRandomUsername();
    expect(result).toBeDefined();
    expect(result).not.toBe('');
  });
});

describe('getInitialsFromName', () => {
  it('should return the initials of a name', () => {
    expect(getInitialsFromName('John Doe')).toBe('JD');
  });
});

describe('getPositionKeysForGridSize', () => {
  it('returns position keys based on grid size', () => {
    const keys = getPositionKeysForGridSize();
    expect(keys.length).toEqual(49);
  });
});

describe('getLabelFromSlug', () => {
  it('should convert a slug to a label', () => {
    expect(getLabelFromSlug('hello-world')).toBe('Hello World');
  });
});
