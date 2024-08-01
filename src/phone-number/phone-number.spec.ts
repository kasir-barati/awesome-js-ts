import { globalizePhoneNumber } from './globalize-phone-number';
import { globalPhoneNumberRegex } from './phone-number';

describe('phone number regex', () => {
  const invalidPhones = [
    { US: '12228883333' },
    { US: '1 222 888 3333' },
    { US: '1 (222) 888 3333' },
    { US: '+1 222 888 3333' },
    { US: '2228883333' },
    { US: '(222) 888 3333' },
  ];
  const phones = [
    { US: '+12099216581' },
    { IR: '09109679196' },
    { IR: '+989109679196' },
    { IR: '00989109679196' },
    { JP: '75 736 4082' },
    { JP: '751539490' },
    { JP: '+81 75 007 6000' },
    { JP: '+81759652385' },
    { SG: '+65-955-546-52' },
    { SG: '0-855-585-21' },
    { SG: '+6585554444' },
    { SG: '0065-855-566-30' },
  ];

  it('should accept all the phone numbers', () => {
    for (const phone of phones) {
      const globalizedPhoneNumber = globalizePhoneNumber(
        Object.values(phone)[0],
        Object.keys(phone)[0],
      );

      console.log(globalizedPhoneNumber);

      expect(globalPhoneNumberRegex.test(globalizedPhoneNumber)).toBe(
        true,
      );
    }
  });

  it('should fail the passed phone numbers', () => {});
});
