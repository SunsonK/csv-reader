import { Router } from 'express';
import { client } from '../../db/mongo';
import moment from 'moment';

import { DB_COLLECTION_NAME } from '../../config';

const reportRouter = Router();

reportRouter.get('/', async (req, res) => {

    const db = client.db('testDB');
    const collections = db.collection(DB_COLLECTION_NAME);

    if (req.query.to || req.query.from) {

        const dateFrom = new Date(req.query.from as string);
        const dateTo = new Date(req.query.to as string);

        if (dateFrom.toString() === 'Invalid Date' || dateTo.toString() === 'Invalid Date') {
            res.status(500).send('Invalid Date');
            return;
        }

        const cursor = collections.find({ LAST_PURCHASE_DATE: {$gte: dateFrom, $lte: dateTo} });
        const result = await cursor.toArray();

        res.send(result);
        return;
    }

    if (req.query.date) {
        const dateInput = new Date(req.query.date as string);
        const endDate = moment(dateInput).add(1, 'd').toDate();

        if (dateInput.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
            res.status(500).send('Invalid Date');
            return;
        }

        const cursor = collections.find({ LAST_PURCHASE_DATE: {$gte: dateInput, $lte: endDate} });
        const result = await cursor.toArray();

        res.send(result);
        return;
    }

    const cursor = collections.find().limit(50).sort({ LAST_PURCHASE_DATE: 1});
    const result = await cursor.toArray();

    res.send(result);
    return;
  })

export { reportRouter };