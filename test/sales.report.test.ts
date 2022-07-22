import * as express from 'express';
import moment from 'moment';

class InvalidDateRangeError extends Error {}
class InvalidSingleDateError extends Error {}

const mockReportRouterHandler = (req: express.Request): [string, { LAST_PURCHASE_DATE: { $gte: Date, $lte: Date}}] => {
  if (req.query.to || req.query.from) {

    const dateFrom = new Date(req.query.from as string);
    const dateTo = new Date(req.query.to as string);

    if (dateFrom.toString() === 'Invalid Date' || dateTo.toString() === 'Invalid Date') {
        // res.status(500).send('Invalid Date');
        throw new InvalidDateRangeError;
    }

    return ['date range', { LAST_PURCHASE_DATE: {$gte: dateFrom, $lte: dateTo} }];
}

if (req.query.date) {
    const dateInput = new Date(req.query.date as string);
    const endDate = moment(dateInput).add(1, 'd').toDate();

    if (dateInput.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
        // res.status(500).send('Invalid Date');
        throw new InvalidSingleDateError;
    }

    // res.send(result);
    return ['single date input', { LAST_PURCHASE_DATE: {$gte: dateInput, $lte: endDate} }];
}

// const cursor = collections.find().limit(50).sort({ LAST_PURCHASE_DATE: 1});
// const result = await cursor.toArray();

// res.send(result);
// @ts-ignore
return ['last 50 result', {}];
}

describe('Test sales/report API', () => {

    it('should be able to accepts date range as query parameter', () => {
        const mockRequest = {query: {
          to: '08/06/2022',
          from: '08/08/1990'
        }} as unknown as express.Request;

        const response = mockReportRouterHandler(mockRequest);

        expect(response[0]).toEqual('date range');
        expect(Object.keys(response[1].LAST_PURCHASE_DATE)).toEqual(['$gte', '$lte'])
        expect(Object.values(response[1].LAST_PURCHASE_DATE)).toEqual([new Date(mockRequest.query.from as string), new Date(mockRequest.query.to as string)])
    })

    it('should be able to accept single date as query parameter', () => {
        const mockRequest = {
          query: {
            date: '08/06/2022'
          }
        } as unknown as express.Request;

        const response = mockReportRouterHandler(mockRequest);

        expect(response[0]).toEqual('single date input');
        expect(Object.keys(response[1].LAST_PURCHASE_DATE)).toEqual(['$gte', '$lte'])
        expect(response[1].LAST_PURCHASE_DATE.$gte).toEqual(new Date(mockRequest.query.date as string))
        expect(moment(response[1].LAST_PURCHASE_DATE.$lte).diff(moment(response[1].LAST_PURCHASE_DATE.$gte), 'day')).toBe(1);
        expect(moment(response[1].LAST_PURCHASE_DATE.$lte).diff(moment(response[1].LAST_PURCHASE_DATE.$gte), 'hour')).toBe(24);
    })

    it('should throw error when invalid date is invalid', () => {
        const mockRequest = {query: {
          to: 'Invalid Date',
          from: 'Invalid Date'
        }} as unknown as express.Request;

        try {
          mockReportRouterHandler(mockRequest);
        } catch (err) {
          expect(err).toBeInstanceOf(InvalidDateRangeError)
        }

        const mockRequestSingleDate = {
          query: {
            date: 'Invalid Date'
          }
        } as unknown as express.Request;

        try {
          mockReportRouterHandler(mockRequestSingleDate)
        } catch(err) {
          expect(err).toBeInstanceOf(InvalidSingleDateError)
        }
    })
})