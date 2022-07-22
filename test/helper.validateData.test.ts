
import { SalesRecord } from '../model/SalesRecord';
import { InvalidCSVKeyError, TypeError, validateCsvRow } from '../helper/validateData';

describe('Test for validate data helper function', () => {

  it ('should throw error if headers is not as expected', () => {
    const mockBadColumns: any[]= [{
      NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    }, {
      USER_NAME: 'John Doe',
      HOW_OLD: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    }, {
      USER_NAME: 'John Doe',
      AGE: '29',
      HOW_TALL: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    }, {
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      SEX: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALES: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      L: '2020-11-05T13:15:30Z'
    }];

    const testResults = mockBadColumns.map(col => {
      try {
        return validateCsvRow(Object.keys(col), Object.values(col))
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidCSVKeyError)
        return false;
      }
    })

    let falseCount = 0;
    testResults.map(t => !t && falseCount++)
    expect(falseCount).toBe(mockBadColumns.length);

  })


  it ('should return true because data is as expected', () => {
    const mockGoodData: any[] = [{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    }];

    expect(validateCsvRow(Object.keys(mockGoodData[0]), Object.values(mockGoodData[0]))).toBe(true);
  })

  it ('should throw type Error if any of the data type is not as expected', () => {
    const mockBadData: any[] = [{
      USER_NAME: 123,
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: 'baba',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 123,
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: 'jiji',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: 'lalala',
      LAST_PURCHASE_DATE: '2020-11-05T13:15:30Z'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'F',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: 'mars, jupiter'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'FEMALE',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: 'december 2090'
    },{
      USER_NAME: 'John Doe',
      AGE: '29',
      HEIGHT: '177',
      GENDER: 'MALE',
      SALE_AMOUNT: '21312',
      LAST_PURCHASE_DATE: 'december 2090'
    }];

    const testResult = mockBadData.map((data, i) => {
      try {
        return validateCsvRow(Object.keys(data), Object.values(data));
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        if (i === 0 || i === 2) {
          expect(err).toHaveProperty('message', 'Expected string at col 1 and 4')
        }
        if (i === 1 || i === 3 || i === 4) {
          expect(err).toHaveProperty('message', 'Expected Number at col 2, 3, and 5')
        }
        if (i === 5) {
          expect(err).toHaveProperty('message', 'Invalid Date at col 6')
        }
        if (i === 6 || i === 7) {
          expect(err).toHaveProperty('message', 'Expected value either M or F for col 4:GENDER')
        }
        return false;
      }
    })

    let falseCount = 0;
    testResult.map(t => !t && falseCount++)
    expect(falseCount).toBe(mockBadData.length);
  })
})