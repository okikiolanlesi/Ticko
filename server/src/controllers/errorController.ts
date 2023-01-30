import { NextFunction, Request, Response } from "express";
import AppError, { IAppError } from "../utils/appError";
import { Error } from "mongoose";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};
const handleDuplicateFieldsError = (err: any) => {
  const message = `${err.keyValue.name} already exists in database, please use another value`;
  return new AppError(message, 400);
};
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => val.message);
  const message = `Invalid input data: ${errors.join("; ")}`;
  return new AppError(message, 401);
};
const handleJsonWebTokenError = (err: any) => {
  const message = `${err.name}; ${err.message}`;
  return new AppError(message, 401);
};
const handleExpiredJWTError = (err: any) => {
  const message = `${err.message}! Please login again`;
  return new AppError(message, 401);
};

const sendErrorDev = (err: any, res: Response, req: Request) => {
  // api
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response, req: Request) => {
  // api
  if (err.isOperational) {
    // OPERATIONAL ERROR, trusted so send appropriate message to the client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // PROGRAMMING OR UNKNOWN ERROR, so don't leak error details to the client
  //   1) log error to the console
  // eslint-disable-next-line no-console
  console.error("ERROR", err);

  //   2) send a generic message
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res, req);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenError(error);
    if (error.name === "TokenExpiredError")
      error = handleExpiredJWTError(error);

    sendErrorProd(error, res, req);
  }
};
