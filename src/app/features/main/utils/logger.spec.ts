import { logger } from './logger';

describe('logger', () => {
  it('should log an error message', () => {
    spyOn(console, 'error');

    logger({ message: 'error message', type: 'error' });
    expect(console.error).toHaveBeenCalled();
  });

  it('should log an warning message', () => {
    spyOn(console, 'warn');

    logger({ message: 'warning message', type: 'warn' });
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log an info message', () => {
    spyOn(console, 'info');

    logger({ message: 'info message', type: 'info' });
    expect(console.info).toHaveBeenCalled();
  });
});
