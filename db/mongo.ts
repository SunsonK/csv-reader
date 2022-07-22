
import { DB_NAME } from '../config';
import { MongoClient } from 'mongodb';

export const uri = `mongodb://localhost:27017/${DB_NAME}`;
export const client = new MongoClient(uri);