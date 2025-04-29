import { NextFunction, Request, Response } from "express";
import HttpException from "../models/http-exception.model";
import { getLogger } from "log4js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
      res.status(err.errorCode).json(err.message);
    } else if (err) {
      res.status(500).json(err.message);
    }
  }