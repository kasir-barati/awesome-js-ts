import { genericRegexForPassportNumber } from './passport';

describe('Test passport number', () => {
    const passports: { number: string; cca2: string }[] = [];

    beforeEach(() => {
        passports.push(
            ...[
                { number: '1408611', cca2: 'AF' },
                { number: '0007699', cca2: 'AF' },
                { number: '02444826', cca2: 'AF' },
                { number: 'D0007699', cca2: 'AF' },
                { number: 'OA1408611', cca2: 'AF' },
                { number: 'P02444826', cca2: 'AF' },
                { number: '910239248', cca2: 'US' },
                { number: '442578947', cca2: 'US' },
                { number: '910239248', cca2: 'US' },
                { number: 'XS1234567', cca2: 'JP' },
                { number: 'TR4622130', cca2: 'JP' },
                { number: 'B7499678', cca2: 'ID' },
                { number: 'A04535897', cca2: 'ZA' },
                { number: '04535897', cca2: 'ZA' },
                { number: '04535897', cca2: 'ZA' },
                { number: '06764100', cca2: 'TR' },
                { number: 'U06764100', cca2: 'TR' },
                { number: 'HFF220608', cca2: 'AE' },
                { number: '220608', cca2: 'AE' },
            ],
        );
    });

    it('should passes all the passport numbers', () => {
        for (const passport of passports) {
            expect(
                genericRegexForPassportNumber.test(passport.number),
            ).toBe(true);
        }
    });
});
