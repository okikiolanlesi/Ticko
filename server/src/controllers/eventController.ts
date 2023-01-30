import Event from "../models/eventModel";
import { Request, Response, NextFunction } from "express";
import { IEvent } from "../models/eventModel";
import { HydratedDocument, Types } from "mongoose";
import catchAsync from "../utils/catchAsync";

export const getAllEvents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const events: HydratedDocument<IEvent>[] = await Event.find();
    res.status(200).json({
      status: "success",
      results: events.length,
      data: {
        events,
      },
    });
  }
);
interface newRequest extends Request {
  user: {
    id: Types.ObjectId;
    email: string;
  };
}
export const createEvent = catchAsync(
  async (req: newRequest, res: Response, next: NextFunction) => {
    const body = req.body;
    // body.organization = req.user.id;
    const newEvent: HydratedDocument<IEvent> = await Event.create(body);
    res.json({
      status: "success",
      data: {
        event: newEvent,
      },
    });
  }
);
