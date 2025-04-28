import dotenv from 'dotenv';
import express from 'express';
import log4js from 'log4js';
import router from './routes/routes';
import HttpException from './models/http-exception.model';

dotenv.config()
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ?? log4js.levels.ERROR;

const app = express()
app.use(router)

app.use((
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (err instanceof HttpException) {
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})