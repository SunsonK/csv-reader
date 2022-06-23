import moment from 'moment';

export class InvalidCSVKeyError extends Error {};
export class TypeError extends Error {};

export const validateCsvRow = (keys: string[], values: string[]) => {
  if (keys.length != 6) {
    throw new Error('Invalid object structure');
  }

  if(!(keys.every((key) => [
    'USER_NAME',
    'AGE',
    'HEIGHT',
    'GENDER',
    'SALE_AMOUNT',
    'LAST_PURCHASE_DATE'
  ].includes(key)))) {
    throw new InvalidCSVKeyError;
  };

  if (!(typeof values[0] === 'string') || !(typeof values[3] === 'string')) {
    throw new TypeError('Expected string at col 1 and 4');
  }

  if (!(values[3].toLowerCase() === 'm' || values[3].toLowerCase() === 'f')) {
    throw new TypeError('Expected value either M or F for col 4:GENDER');
  }

  if (!Number.isInteger(Number(values[1])) || !Number.isInteger(Number(values[2])) || !Number.isInteger(Number(values[4]))) {
    throw new TypeError ('Expected Number at col 2, 3, and 5');
  }

  if (!moment(values[5], "YYYY-MM-DD").isValid()) {
    throw new TypeError ('Invalid Date at col 6');
  }
  return true;
}