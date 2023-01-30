import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import config from "./config/config";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import eventRouter from "./routes/eventRoutes";
import userRouter from "./routes/userRoutes";
import { auth } from "express-openid-connect";

const express = require("express");

const app = express();
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: config.auth0.secret,
  baseURL: config.auth0.baseURL,
  clientID: config.auth0.clientID,
  issuerBaseURL: config.auth0.issuerBaseURL,
};
app.use(auth(authConfig));
console.log(config.nodeEnv);

const rateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
app.use(rateLimiter(rateLimitOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", "views");
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1/callback", userRouter);
app.use("/api/v1/events", eventRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.url} not found on this server`, 404));
});

app.use(globalErrorHandler);
export default app;
