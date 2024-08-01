import {
  PhoneNumberFormat,
  PhoneNumberUtil,
} from 'google-libphonenumber';

const phoneNumberUtil = new PhoneNumberUtil();

export function globalizePhoneNumber(
  phoneNumber: string,
  cca2: string,
) {
  return phoneNumberUtil.format(
    phoneNumberUtil.parse(phoneNumber, cca2),
    PhoneNumberFormat.E164,
  );
}
