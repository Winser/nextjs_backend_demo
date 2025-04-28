import dotenv from 'dotenv';
import express from 'express';
import log4js from 'log4js';
import router from './routes/routes';

dotenv.config()
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ?? log4js.levels.ERROR;

const app = express()
const port = process.env.PORT ?? 3000

app.use(router)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})