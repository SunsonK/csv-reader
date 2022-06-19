import { Router } from "express";
import multer from 'multer';
import * as csv from 'fast-csv';

import fs from 'fs';

import { SalesRecord } from '../../model/SalesRecord';

import { DB_COLLECTION_NAME } from '../../config';
import { client } from '../../db/mongo';

import { validateCsvRow } from '../../helper/validateData';

const upload = multer({ dest: 'tmp/csv/' });

const recordRouter = Router();

recordRouter.post('/', upload.single('file'), (req, res) => {
    const fileRows: SalesRecord[] = [];
    const db = client.db('testDB');

    if (!req.file) {
      res.status(500).send('File is required');
      return;
    }

    const filePath = req.file.path;
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        res.status(500).send(`${error.message} at row ${rowCount}`);
        fs.unlinkSync(filePath);
      })
      .on('data', row => {
        rowCount++;
        validateCsvRow(Object.keys(row), Object.values(row));

        const data: SalesRecord = {
            USER_NAME: row.USER_NAME,
            AGE: parseInt(row.AGE, 10),
            HEIGHT: parseInt(row.HEIGHT, 10),
            GENDER: row.GENDER,
            SALE_AMOUNT: parseInt(row.SALE_AMOUNT, 10),
            LAST_PURCHASE_DATE: new Date(row.LAST_PURCHASE_DATE)
        }

        fileRows.push(data);
      })
      .on('end', (rowCount: number) => {
        db.collection(DB_COLLECTION_NAME).insertMany(fileRows);
        console.log(`Parsed ${rowCount} rows`);
        fs.unlinkSync(filePath);
        res.sendStatus(200);
      });
  });

export { recordRouter };