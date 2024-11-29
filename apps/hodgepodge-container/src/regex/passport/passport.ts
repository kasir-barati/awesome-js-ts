/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */

export const genericRegexs = [
  /(?:^[A-Z]{3}[0-9]{4,}$)|(?:^[A-Z]{2}[0-9]{5,}$)|(?:^[A-Z]{1}[0-9]{6,}$)|(?:^[0-9]{7,}$)/i,
];

export const passportRegexByCountryCode = {
  AM: /^[A-Z]{2}\d{7}$/, // ARMENIA
  AR: /^[A-Z]{3}\d{6}$/, // ARGENTINA
  AT: /^[A-Z]\d{7}$/, // AUSTRIA
  AU: /^[A-Z]\d{7}$/, // AUSTRALIA
  BE: /^[A-Z]{2}\d{6}$/, // BELGIUM
  BG: /^\d{9}$/, // BULGARIA
  BR: /^[A-Z]{2}\d{6}$/, // BRAZIL
  BY: /^[A-Z]{2}\d{7}$/, // BELARUS
  CA: /^[A-Z]{2}\d{6}$/, // CANADA
  CH: /^[A-Z]\d{7}$/, // SWITZERLAND
  CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/, // CHINA
  CY: /^[A-Z](\d{6}|\d{8})$/, // CYPRUS
  CZ: /^\d{8}$/, // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/, // GERMANY
  DK: /^\d{9}$/, // DENMARK
  DZ: /^\d{9}$/, // ALGERIA
  EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/, // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/, // SPAIN
  FI: /^[A-Z]{2}\d{7}$/, // FINLAND
  FR: /^\d{2}[A-Z]{2}\d{5}$/, // FRANCE
  GB: /^\d{9}$/, // UNITED KINGDOM
  GR: /^[A-Z]{2}\d{7}$/, // GREECE
  HR: /^\d{9}$/, // CROATIA
  HU: /^[A-Z]{2}(\d{6}|\d{7})$/, // HUNGARY
  IE: /^[A-Z0-9]{2}\d{7}$/, // IRELAND
  IN: /^[A-Z]{1}-?\d{7}$/, // INDIA
  ID: /^[A-C]\d{7}$/, // INDONESIA
  IR: /^[A-Z]\d{8}$/, // IRAN
  IS: /^(A)\d{7}$/, // ICELAND
  IT: /^[A-Z0-9]{2}\d{7}$/, // ITALY
  JP: /^[A-Z]{2}\d{7}$/, // JAPAN
  KR: /^[MS]\d{8}$/, // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  LT: /^[A-Z0-9]{8}$/, // LITHUANIA
  LU: /^[A-Z0-9]{8}$/, // Luxembourg
  LV: /^[A-Z0-9]{2}\d{7}$/, // LATVIA
  LY: /^[A-Z0-9]{8}$/, // LIBYA
  MT: /^\d{7}$/, // MALTA
  MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/, // MOZAMBIQUE
  MY: /^[AHK]\d{8}$/, // MALAYSIA
  NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/, // NETHERLANDS
  PL: /^[A-Z]{2}\d{7}$/, // POLAND
  PT: /^[A-Z]\d{6}$/, // PORTUGAL
  RO: /^\d{8,9}$/, // ROMANIA
  RU: /^\d{9}$/, // RUSSIAN FEDERATION
  SE: /^\d{8}$/, // SWEDEN
  SL: /^(P)[A-Z]\d{7}$/, // SLOVANIA
  SK: /^[0-9A-Z]\d{7}$/, // SLOVAKIA
  TR: /^[A-Z]\d{8}$/, // TURKEY
  UA: /^[A-Z]{2}\d{6}$/, // UKRAINE
  US: /^\d{9}$/, // UNITED STATES
  NG: /^([a-z]|[A-Z]\d{8})$/, // Nigeria  (One Alphabet followed by 8-digits)
  PH: /[A-Za-z][0-9]{7}[A-Za-z][^A-Za-z]/, // Philippines
  SG: /[A-Za-z][0-9]{7}[A-Za-z][^A-Za-z]/, // Singapore
  NZ: /[A-Z]{2}[0-9]{6}\D/, // New Zealand
  MX: /\d{10,11}\D/, // Mexico
  TW: /\b\d{9}\b|\b3\d{8}\b/, // Taiwan
};