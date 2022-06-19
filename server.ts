import express from 'express';

import { recordRouter } from './routes/sales/record';
import { reportRouter } from './routes/sales/report';

const app = express();
const port = 9000;

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.use('/sales/record', recordRouter);

app.use('/sales/report', reportRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})