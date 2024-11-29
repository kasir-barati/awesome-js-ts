import { genericRegexs } from './passport';

describe('Test passport number', () => {
  it('should return true for all passport numbers', () => {
    const correctPassportsNumber = [
      { number: '1408611', cca2: 'AF' },
      { number: '0007699', cca2: 'AF' },
      { number: '02444826', cca2: 'AF' },
      { number: 'D0007699', cca2: 'AF' },
      { number: 'OA1408611', cca2: 'AF' },
      { number: 'P02444826', cca2: 'AF' },
      { number: '910239248', cca2: 'US' },
      { number: '442578947', cca2: 'US' },
      { number: 'XS1234567', cca2: 'JP' },
      { number: 'TR4622130', cca2: 'JP' },
      { number: 'B7499678', cca2: 'ID' },
      { number: 'A04535897', cca2: 'ZA' },
      { number: '04535897', cca2: 'ZA' },
      { number: '04535897', cca2: 'ZA' },
      { number: '06764100', cca2: 'TR' },
      { number: 'U03504840', cca2: 'TR' },
      { number: 'U06764100', cca2: 'TR' },
      { number: 'HFF220608', cca2: 'AE' },
      { number: 'ZA9144910', cca2: 'AE' },
      { number: 'AC1062346', cca2: 'TH' },
      { number: 'B100990', cca2: 'TH' },
      { number: 'R655420', cca2: 'TH' },
    ];
    for (const genericRegex of genericRegexs) {
      for (const passport of correctPassportsNumber) {
        expect(genericRegex.test(passport.number)).toBe(true);
      }
    }
  });
  it('should return false for all passport numbers', () => {
    const badPassportsNumber = [
      { number: '220608', cca2: 'AE' },
      { number: 'O654A1408611', cca2: 'AF' },
      { number: 'asdasdadas', cca2: 'US' },
      { number: '04535897asd', cca2: 'ZA' },
      { number: '06764100asd', cca2: 'TR' },
    ];
    for (const genericRegex of genericRegexs) {
      for (const passport of badPassportsNumber) {
        if (genericRegex.test(passport.number)) {
          console.log(passport.number, genericRegex);
        }
        expect(genericRegex.test(passport.number)).toBe(false);
      }
    }
  });
});
