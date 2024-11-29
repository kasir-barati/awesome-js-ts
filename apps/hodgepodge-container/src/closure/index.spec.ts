import {
  addFactory,
  curlyBracesDoNotCreateScope,
  lexicalScoping,
  lexicalScopingFactory,
} from '.';

describe('lexicalScoping', () => {
  it('should log "Mozilla"', () => {
    const logSpy = jest.spyOn(console, 'log');

    lexicalScoping();

    expect(logSpy).toHaveBeenCalledWith('Mozilla');
  });
});

describe('curlyBracesDoNotCreateScope', () => {
  let mathRandomSpy: jest.SpyInstance<number, [], unknown>;

  beforeEach(() => {
    mathRandomSpy = jest.spyOn(Math, 'random');
  });

  it('should log 1', () => {
    mathRandomSpy.mockReturnValue(0.9);
    const logSpy = jest.spyOn(console, 'log');

    curlyBracesDoNotCreateScope();

    expect(logSpy).toHaveBeenCalledWith(1);
  });

  it('should log 2', () => {
    mathRandomSpy.mockReturnValue(0.2);
    const logSpy = jest.spyOn(console, 'log');

    curlyBracesDoNotCreateScope();

    expect(logSpy).toHaveBeenCalledWith(2);
  });
});

describe('lexicalScopingFactory', () => {
  it('should return "Mozilla"', () => {
    const logSpy = jest.spyOn(console, 'log');
    const displayName = lexicalScopingFactory();

    displayName();

    expect(logSpy).toHaveBeenCalledWith('Mozilla');
  });
});

describe('addFactory', () => {
  it('should create a factory function for adding 3 to any number', () => {
    const addThreeTo = addFactory(3);

    const result1 = addThreeTo(3);
    const result2 = addThreeTo(13);

    expect(result1).toBe(6);
    expect(result2).toBe(16);
  });
});
