import moment from 'moment';

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
    throw new Error('Presence of invalid keys detected');
  };

  if (!(typeof values[0] === 'string') || !(typeof values[3] === 'string')) {
    throw new Error('Expected string at col 1 and 3');
  }

  if (!(values[3].toLowerCase() === 'm' || values[3].toLowerCase() === 'f')) {
    throw new Error('Expected value either M or F for col 4:GENDER');
  }

  if (!Number.isInteger(Number(values[1])) || !Number.isInteger(Number(values[2])) || !Number.isInteger(Number(values[4]))) {
    throw new Error ('Expected Number at col 2, 3, and 5');
  }

  if (!moment(values[5], "YYYY-MM-DD").isValid()) {
    throw new Error ('Invalid Date at col 6');
  }
  return;
}