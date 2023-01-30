import express from "express";
import { createEvent, getAllEvents } from "../controllers/eventController";

const router = express.Router();

router.route("/").get(getAllEvents).post(createEvent);

export default router;
