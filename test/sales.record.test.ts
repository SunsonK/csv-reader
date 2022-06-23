import { Db, MongoClient, ObjectId } from 'mongodb';
import { DB_NAME } from '../config';
import { uri } from '../db/mongo';

import * as csv from 'fast-csv';

import fs from 'fs';

import { SalesRecord } from '../model/SalesRecord';
import { validateCsvRow } from '../helper/validateData';

const DB_COLLECTION_NAME = 'user_collection'

describe('Test mongodb operation', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(uri);

    db = await connection.db(DB_NAME);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection(DB_COLLECTION_NAME);

    const mockUser = {name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({name: 'John'});

    expect(insertedUser?.name).toEqual(mockUser.name);
  });

  it('should insert an array of docs into collection', async () => {
    const users = db.collection(DB_COLLECTION_NAME);

    const mockUsers = [{_id: new ObjectId(1), name: 'John'}, {_id: new ObjectId(2), name: 'Alice'}];
    await users.insertMany(mockUsers);

    const insertedUsers = await users.find().limit(50).toArray();

    expect(insertedUsers.map(u =>  u.name).includes(mockUsers[0].name)).toBe(true);
    expect(insertedUsers.map(u =>  u.name).includes(mockUsers[1].name)).toBe(true);
  })
})

describe('Test file streaming operation', () => {

  it ('should parse correct csv correctly', () => {
    const dest = './tmp/csv/test.csv'
    fs.copyFileSync('./test.csv', dest)

    let rowCount = 0;
    let fileRows: SalesRecord[] = [];

    fs.createReadStream(dest)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => {
      fs.unlinkSync(dest);
      throw new Error('500');
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
      // db.collection(DB_COLLECTION_NAME).insertMany(fileRows);

      // console.log(`Parsed ${rowCount} rows`);
      expect(fileRows).toBeInstanceOf(Array);
      expect(fileRows.every(row => Object.keys(row).join(',') === ['USER_NAME', 'AGE', 'HEIGHT', 'GENDER', 'SALE_AMOUNT', 'LAST_PURCHASE_DATE'].join(','))).toBe(true);
      expect(fileRows.length).toEqual(rowCount);

      fs.unlinkSync(dest);

      expect(fs.existsSync(dest)).toBeFalsy();
    });
  })

  it ('should throw error if csv is unexpected', () => {
    const dest = './tmp/csv/test.csv'
    fs.copyFileSync('./test.bad.csv', dest)

    let rowCount = 0;
    let fileRows: SalesRecord[] = [];

    fs.createReadStream(dest)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => {
      fs.unlinkSync(dest);

      expect(error).toBeDefined();
      expect(fs.existsSync(dest)).toBeFalsy();
      return;
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
      // not expected to arrive here for this test
      // db.collection(DB_COLLECTION_NAME).insertMany(fileRows);

      fs.unlinkSync(dest);
      return;
    });
  })
})