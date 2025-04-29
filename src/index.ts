import dotenv from "dotenv";
import express from "express";
import log4js from "log4js";
import router from "./routes/routes";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./middleware/error-handler";

dotenv.config()
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ?? log4js.levels.ERROR;

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(router)
app.use(errorHandler);

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})