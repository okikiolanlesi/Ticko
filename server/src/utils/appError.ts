export default class AppError extends Error {
  private status: string;
  private isOperational: boolean;
  private statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface IAppError {
  status: string;
  isOperational: boolean;
  statusCode: number;
  message: string;
}
